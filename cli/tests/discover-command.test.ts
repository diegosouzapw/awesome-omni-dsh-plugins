// `discover` is the two-tier plugin finder: the curated tier answers from OUR reviewed
// catalog, the community tier from a live GitHub topic search that is clearly labeled
// third-party. Design inspired by awesome-dsh-plugin/dsh-find-plugin (MIT) — the code and the
// output contract here are our own. The community tier must degrade to silence (with a
// notice), never to an error, and must never send a credential.
import { describe, expect, it } from "vitest";

import {
  createCommunitySearch,
  discoverCommand,
  type CommunityResult,
} from "../src/commands/discover.js";
import type { CatalogSnapshot, PublicCatalogEntry } from "../src/model.js";

function curatedEntry(overrides: Partial<PublicCatalogEntry> & { id: string }): PublicCatalogEntry {
  return {
    schemaVersion: 1,
    name: overrides.id,
    kind: "plugin",
    primaryCategory: "user-interface-dashboards",
    tags: ["tui"],
    description: { en: "A curated terminal client for DeepSeek Harness sessions.", evidencePath: "README.md" },
    unofficial: true,
    source: {
      repository: `https://github.com/creator/${overrides.id}`,
      repositoryNodeId: `R_${overrides.id}`,
      subpath: null,
      commit: "a".repeat(40),
    },
    creator: { github: "creator", profile: "https://github.com/creator" },
    package: { ecosystem: "source", name: null },
    dsh: { profiles: ["web"], evidencePath: "cordis.patch.yml" },
    repositoryScope: "dedicated",
    license: { spdx: "MIT" },
    popularity: { starsPolicy: "exact-repository", stars: 5 },
    verification: {
      status: "eligible",
      checkedAt: "2026-08-19T00:00:00.000Z",
      repositoryIdentity: "resolved",
      smokeTest: null,
    },
    provenance: { discussion: null, comment: null },
    ...overrides,
  } as PublicCatalogEntry;
}

function fixtureSnapshot(entries: readonly PublicCatalogEntry[]): CatalogSnapshot {
  return {
    source: { kind: "snapshot", declaredRevision: "b".repeat(40), pinStatus: "declared-local" },
    entries,
    diagnostics: [],
  } as unknown as CatalogSnapshot;
}

function fixtureContext(entries: readonly PublicCatalogEntry[]) {
  const out: string[] = [];
  const err: string[] = [];
  return {
    context: {
      loadCatalog: async () => fixtureSnapshot(entries),
      stdout: (text: string) => out.push(text),
      stderr: (text: string) => err.push(text),
    },
    out,
    err,
  };
}

const COMMUNITY_FIXTURE: readonly CommunityResult[] = [
  {
    name: "dsh-hot",
    fullName: "hot/dsh-hot",
    url: "https://github.com/hot/dsh-hot",
    description: "hot community plugin",
    stars: 90,
    install: "dsh plugin --profile web add github:hot/dsh-hot",
  },
  {
    name: "dsh-cold",
    fullName: "cold/dsh-cold",
    url: "https://github.com/cold/dsh-cold",
    description: "cold community plugin",
    stars: 2,
    install: "dsh plugin --profile web add github:cold/dsh-cold",
  },
];

describe("community search client", () => {
  it("queries the dsh-plugin topic unauthenticated, ranks by stars and caches per query", async () => {
    const calls: Array<{ url: string; headers: Record<string, string> }> = [];
    let now = 1_000_000;
    const search = createCommunitySearch({
      fetchImplementation: (async (url: string, init: { headers: Record<string, string> }) => {
        calls.push({ url, headers: init.headers });
        return {
          ok: true,
          status: 200,
          json: async () => ({
            items: [
              { name: "dsh-cold", full_name: "cold/dsh-cold", html_url: "https://github.com/cold/dsh-cold", description: "cold", stargazers_count: 2 },
              { name: "dsh-hot", full_name: "hot/dsh-hot", html_url: "https://github.com/hot/dsh-hot", description: "hot", stargazers_count: 90 },
            ],
          }),
        };
      }) as unknown as typeof fetch,
      clock: () => now,
    });

    const first = await search("tui client", 5);
    expect(first.map((item) => item.fullName)).toEqual(["hot/dsh-hot", "cold/dsh-cold"]);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toContain("topic%3Adsh-plugin");
    expect(calls[0]?.url).toContain("tui%20client");
    // Unauthenticated by design: no credential header may ever be attached.
    expect(Object.keys(calls[0]?.headers ?? {}).map((key) => key.toLowerCase()))
      .not.toContain("authorization");

    // Within the TTL the same query never re-fetches; after it, it does.
    await search("tui client", 5);
    expect(calls).toHaveLength(1);
    now += 6 * 60 * 1000;
    await search("tui client", 5);
    expect(calls).toHaveLength(2);
  });
});

describe("discover command", () => {
  it("answers with the curated tier first and the labeled community tier after", async () => {
    const { context, out } = fixtureContext([curatedEntry({ id: "dsh-tui-ours" })]);

    const exitCode = await discoverCommand(context, "tui", {
      community: async () => [...COMMUNITY_FIXTURE],
      json: false,
      limit: 8,
    });

    const text = out.join("");
    expect(exitCode).toBe(0);
    expect(text.indexOf("dsh-tui-ours")).toBeLessThan(text.indexOf("hot/dsh-hot"));
    expect(text).toContain("[curated]");
    expect(text).toContain("[community]");
    expect(text).toContain("third-party");
    expect(text).toContain("dsh plugin --profile web add github:hot/dsh-hot");
  });

  it("emits a stable JSON shape separating the tiers", async () => {
    const { context, out } = fixtureContext([curatedEntry({ id: "dsh-tui-ours" })]);

    await discoverCommand(context, "tui", {
      community: async () => [...COMMUNITY_FIXTURE],
      json: true,
      limit: 1,
    });

    const document = JSON.parse(out.join(""));
    expect(document.curated.map((entry: { id: string }) => entry.id)).toEqual(["dsh-tui-ours"]);
    // The limit bounds each tier independently.
    expect(document.community).toHaveLength(1);
    expect(document.community[0].fullName).toBe("hot/dsh-hot");
    expect(typeof document.notice).toBe("string");
  });

  it("degrades to curated-only with a notice when the community tier fails", async () => {
    const { context, out, err } = fixtureContext([curatedEntry({ id: "dsh-tui-ours" })]);

    const exitCode = await discoverCommand(context, "tui", {
      community: async () => {
        throw new Error("network unavailable");
      },
      json: false,
      limit: 8,
    });

    expect(exitCode).toBe(0);
    expect(out.join("")).toContain("dsh-tui-ours");
    expect(`${out.join("")}${err.join("")}`).toContain("community tier unavailable");
  });

  it("skips the network entirely with --offline", async () => {
    const { context, out } = fixtureContext([curatedEntry({ id: "dsh-tui-ours" })]);
    let networkCalls = 0;

    await discoverCommand(context, "tui", {
      community: async () => {
        networkCalls += 1;
        return [];
      },
      json: false,
      limit: 8,
      offline: true,
    });

    expect(networkCalls).toBe(0);
    expect(out.join("")).toContain("dsh-tui-ours");
  });
});
