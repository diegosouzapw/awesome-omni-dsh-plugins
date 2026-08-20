/**
 * `discover` — two-tier plugin finder.
 *
 * Tier 1 (curated) answers from OUR reviewed catalog with the same local matching the
 * `search` command uses. Tier 2 (community) is a live, UNAUTHENTICATED GitHub search over the
 * public `dsh-plugin` topic, ranked by stars, clearly labeled third-party and bounded by a
 * short timeout and an in-memory per-query cache. The community tier degrades to a notice —
 * never to a command failure — and no credential is ever attached.
 *
 * Design inspired by awesome-dsh-plugin/dsh-find-plugin (MIT © awesome-dsh-plugin); the
 * implementation and output contract here are our own.
 */

import type { CatalogSelection, PublicCatalogEntry } from "../model.js";
import type { CatalogCommandContext } from "./catalog.js";
import { writeDiagnostics } from "./catalog.js";

export interface CommunityResult {
  readonly name: string;
  readonly fullName: string;
  readonly url: string;
  readonly description: string;
  readonly stars: number;
  readonly install: string;
}

export type CommunitySearch = (query: string, limit: number) => Promise<CommunityResult[]>;

const COMMUNITY_TTL_MS = 5 * 60 * 1000;
const COMMUNITY_TIMEOUT_MS = 4_000;
const COMMUNITY_MAX_PAGE = 20;

interface CommunitySearchOptions {
  readonly fetchImplementation?: typeof fetch;
  readonly clock?: () => number;
}

interface RawSearchItem {
  readonly name?: unknown;
  readonly full_name?: unknown;
  readonly html_url?: unknown;
  readonly description?: unknown;
  readonly stargazers_count?: unknown;
}

export function createCommunitySearch(options: CommunitySearchOptions = {}): CommunitySearch {
  const fetchImplementation = options.fetchImplementation ?? fetch;
  const clock = options.clock ?? Date.now;
  const cache = new Map<string, { at: number; results: CommunityResult[] }>();
  return async (query, limit) => {
    const key = query.normalize("NFKC").toLocaleLowerCase("en-US").trim();
    const cached = cache.get(key);
    if (cached !== undefined && clock() - cached.at < COMMUNITY_TTL_MS) {
      return cached.results.slice(0, limit);
    }
    const q = encodeURIComponent(`${query} topic:dsh-plugin`);
    const perPage = Math.min(Math.max(limit * 2, 1), COMMUNITY_MAX_PAGE);
    const url = `https://api.github.com/search/repositories?q=${q}&per_page=${perPage}`;
    const response = await fetchImplementation(url, {
      // Unauthenticated on purpose: discovery must work for anyone and can never leak a token.
      headers: {
        accept: "application/vnd.github+json",
        "user-agent": "omni-dsh-plugins-discover",
      },
      signal: AbortSignal.timeout(COMMUNITY_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(`GitHub search failed with HTTP ${response.status}`);
    }
    const body = (await response.json()) as { items?: readonly RawSearchItem[] };
    const results = (body.items ?? [])
      .map((item): CommunityResult | null => {
        const fullName = typeof item.full_name === "string" ? item.full_name : null;
        const url_ = typeof item.html_url === "string" ? item.html_url : null;
        if (fullName === null || url_ === null || !url_.startsWith("https://github.com/")) {
          return null;
        }
        return {
          name: typeof item.name === "string" ? item.name : fullName,
          fullName,
          url: url_,
          description: typeof item.description === "string" ? item.description : "",
          stars: Number.isSafeInteger(item.stargazers_count) ? Number(item.stargazers_count) : 0,
          install: `dsh plugin --profile web add github:${fullName}`,
        };
      })
      .filter((item): item is CommunityResult => item !== null)
      .sort((left, right) => right.stars - left.stars);
    cache.set(key, { at: clock(), results });
    return results.slice(0, limit);
  };
}

function tokens(value: string): string[] {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .split(/[^\p{L}\p{N}@._+-]+/u)
    .filter(Boolean);
}

function searchable(entry: PublicCatalogEntry): string {
  const packageName = entry.package.ecosystem === "npm" ? entry.package.name : "source";
  return [
    entry.id,
    entry.name,
    entry.description.en,
    entry.creator.github,
    entry.kind,
    entry.primaryCategory,
    ...entry.tags,
    packageName,
  ].join(" ").normalize("NFKC").toLocaleLowerCase("en-US");
}

const THIRD_PARTY_NOTICE =
  "Community results are third-party code straight from a GitHub topic search — review the " +
  "source and pin a commit before installing. Curated results come from the reviewed catalog.";

export interface DiscoverOptions {
  readonly community: CommunitySearch;
  readonly json: boolean;
  readonly limit: number;
  readonly offline?: boolean;
  readonly selection?: CatalogSelection;
}

export async function discoverCommand(
  context: CatalogCommandContext,
  query: string,
  options: DiscoverOptions,
): Promise<number> {
  const snapshot = await context.loadCatalog(options.selection);
  if (snapshot.diagnostics.length > 0) {
    writeDiagnostics(context, snapshot.diagnostics);
    return 1;
  }
  const queryTokens = tokens(query);
  const curated = snapshot.entries
    .filter((entry) => queryTokens.every((token) => searchable(entry).includes(token)))
    .sort((left, right) =>
      (right.popularity.stars ?? 0) - (left.popularity.stars ?? 0) ||
      left.id.localeCompare(right.id))
    .slice(0, options.limit);

  let community: CommunityResult[] = [];
  let communityNotice: string | null = null;
  if (options.offline !== true) {
    try {
      community = (await options.community(query, options.limit))
        // Anything already curated shows once, in the curated tier.
        .filter((item) =>
          !curated.some((entry) => entry.source.repository.toLowerCase() ===
            item.url.toLowerCase()))
        // The limit bounds each tier regardless of what the search implementation returned.
        .slice(0, options.limit);
    } catch (error) {
      communityNotice =
        `community tier unavailable: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  if (options.json) {
    context.stdout(`${JSON.stringify({
      curated,
      community,
      notice: THIRD_PARTY_NOTICE,
      ...(communityNotice === null ? {} : { communityNotice }),
    })}\n`);
    return 0;
  }

  if (curated.length === 0 && community.length === 0) {
    context.stdout("No plugins found in either tier. Try broader keywords.\n");
  }
  for (const entry of curated) {
    const stars = entry.popularity.stars === null ? "—" : `★${entry.popularity.stars}`;
    context.stdout(
      `[curated] ${entry.id} ${stars} — ${entry.description.en}\n` +
      `  ${entry.source.repository}\n`,
    );
  }
  for (const item of community) {
    context.stdout(
      `[community] ${item.fullName} ★${item.stars} — ${item.description}\n` +
      `  ${item.url}\n  install: ${item.install}\n`,
    );
  }
  if (community.length > 0) {
    context.stdout(`\n${THIRD_PARTY_NOTICE}\n`);
  }
  if (communityNotice !== null) {
    context.stderr(`${communityNotice}\n`);
  }
  return 0;
}
