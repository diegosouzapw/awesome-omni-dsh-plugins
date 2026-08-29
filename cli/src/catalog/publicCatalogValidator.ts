import { readFileSync } from "node:fs";

import type { ErrorObject } from "ajv";
import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import semver from "semver";
import parseSpdxExpression from "spdx-expression-parse";
import ssri from "ssri";
import { parse as parseYaml } from "yaml";

/**
 * One screenshot or short video for a catalog entry. Additive in public schema v1: the field is
 * optional, so a consumer that never heard of it keeps reading every entry unchanged.
 */
export interface PublicCatalogMedia {
  readonly kind: "screenshot" | "video";
  readonly url: string;
  readonly alt: string;
}

/** A gallery is a summary, not an album: six items is the whole budget. */
export const MAX_MEDIA_ITEMS = 6;

/** Longest accepted alternative text — long enough to describe a panel, short enough to read. */
export const MAX_MEDIA_ALT_LENGTH = 120;

const REPOSITORY_URL = /^https:\/\/github\.com\/([^/]+)\/([^/]+)$/u;

/**
 * A `raw.githubusercontent.com` URL: owner, repository, ref, then the path inside the tree.
 * The path is captured raw and validated separately — GitHub serves a URL whose path climbs out
 * of the ref with `..`, so a correctly pinned prefix proves nothing on its own.
 */
const RAW_URL = /^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)(\/.*)$/u;
const ASSET_URL = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/assets(\/.*)$/u;

/**
 * The only path shape a media URL may carry, and the reason this is stricter than "no spaces":
 * `https://raw.githubusercontent.com/alice/x/<commit>/../../mallory/evil/main/shot.png` starts
 * with a correctly pinned prefix and resolves, after normalization, to another repository at a
 * branch. So every segment is checked: no empty segment (`//`), no `.` or `..`, no query or
 * fragment (`?`, `#`), no whitespace or backslash, and no percent-encoding — which is what a
 * `%2e%2e` traversal would hide behind. The character class is the one the public schema already
 * uses for evidence paths: a path that can be an evidencePath can be a media path.
 */
const MEDIA_PATH = /^(?:\/(?!\.{1,2}(?:\/|$))[A-Za-z0-9._@+-]+)+$/u;

function repositorySlug(repository: unknown): { owner: string; repo: string } | null {
  const match = REPOSITORY_URL.exec(String(repository ?? ""));
  return match === null ? null : { owner: match[1]!, repo: match[2]! };
}

type MediaUrlVerdict = "ok" | "not-pinned" | "wrong-repository" | "unusable";

function classifyMediaUrl(
  url: string,
  kind: unknown,
  slug: { owner: string; repo: string } | null,
  commit: string,
): MediaUrlVerdict {
  const raw = RAW_URL.exec(url);
  if (raw !== null) {
    if (!MEDIA_PATH.test(raw[4]!)) return "unusable";
    if (commit === "" || raw[3] !== commit) return "not-pinned";
    return slug !== null && raw[1] === slug.owner && raw[2] === slug.repo
      ? "ok"
      : "wrong-repository";
  }
  // GitHub's upload URL is content-addressed, so it carries no commit — but it hosts uploads,
  // not a repository tree, so only a video may use it. A screenshot there is unreviewable.
  const asset = kind === "video" ? ASSET_URL.exec(url) : null;
  if (asset !== null) {
    if (!MEDIA_PATH.test(asset[3]!)) return "unusable";
    return slug !== null && asset[1] === slug.owner && asset[2] === slug.repo
      ? "ok"
      : "wrong-repository";
  }
  return "unusable";
}

/**
 * Media URLs must be as immutable as the commit the entry pins. A `raw.githubusercontent.com`
 * URL carrying a branch name (`.../main/docs/shot.png`) renders a DIFFERENT image the day the
 * branch moves — the catalog would be publishing an unreviewed picture under a reviewed entry.
 * So the only accepted shapes are the pinned-commit raw path and GitHub's content-addressed
 * `/assets/` upload URL, both of which can never change under a published entry.
 */
export function validateMediaField(
  media: unknown,
  source: { readonly repository?: unknown; readonly commit?: unknown },
): string[] {
  if (media === undefined) {
    return [];
  }
  if (!Array.isArray(media)) {
    return ["media must be an array"];
  }
  if (media.length === 0) {
    // An empty gallery is not "no gallery": it promises pictures the entry does not have.
    // Absence is written by omitting the field, which is why the schema requires minItems: 1.
    return ["media must not be an empty list"];
  }
  const errors: string[] = [];
  if (media.length > MAX_MEDIA_ITEMS) {
    errors.push(`media has more than ${MAX_MEDIA_ITEMS} items`);
  }
  const slug = repositorySlug(source.repository);
  const commit = String(source.commit ?? "");
  media.forEach((item: unknown, index: number) => {
    const value = (typeof item === "object" && item !== null ? item : {}) as {
      kind?: unknown;
      url?: unknown;
      alt?: unknown;
    };
    if (value.kind !== "screenshot" && value.kind !== "video") {
      errors.push(`media[${index}].kind must be "screenshot" or "video"`);
    }
    if (
      typeof value.alt !== "string" ||
      value.alt.trim() === "" ||
      value.alt.length > MAX_MEDIA_ALT_LENGTH
    ) {
      errors.push(`media[${index}].alt must be 1-${MAX_MEDIA_ALT_LENGTH} characters`);
    }
    const url = typeof value.url === "string" ? value.url : "";
    switch (classifyMediaUrl(url, value.kind, slug, commit)) {
      case "ok":
        return;
      case "not-pinned":
        errors.push(`media[${index}].url must pin the entry commit, not a branch`);
        return;
      case "wrong-repository":
        errors.push(`media[${index}].url must reference the entry's own repository`);
        return;
      default:
        errors.push(`media[${index}].url must be a GitHub URL pinned to the entry commit`);
    }
  });
  return errors;
}

export interface RepositoryIdentityResolver {
  resolveNodeId(repositoryUrl: string): string | null;
}

export interface CatalogValidationResult {
  valid: boolean;
  errors: string[];
}

interface PublicEntryShape {
  source?: { repository?: unknown; repositoryNodeId?: unknown; commit?: unknown };
  media?: unknown;
  package?: { ecosystem?: unknown; version?: unknown; integrity?: unknown };
  license?: { spdx?: unknown };
  verification?: {
    status?: unknown;
    smokeTest?: { check?: { version?: unknown } } | null;
  };
}

export function parseSpdx(value: string): ReturnType<typeof parseSpdxExpression> {
  try {
    return parseSpdxExpression(value);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`invalid SPDX expression: ${detail}`);
  }
}

export function parseExactSemver(value: string): string {
  const normalized = semver.valid(value, { loose: false });
  if (normalized === null || normalized !== value) {
    throw new Error("invalid exact SemVer");
  }
  return normalized;
}

export function parseSha512Integrity(value: string): Uint8Array {
  let parsed: ssri.Hash;
  try {
    parsed = ssri.parse(value, { single: true }) as ssri.Hash;
  } catch {
    throw new Error("invalid SHA-512 SRI");
  }
  if (parsed.algorithm !== "sha512") {
    throw new Error("integrity must contain exactly one SHA-512 SRI");
  }
  const digest = parsed.digest;
  if (digest === undefined) {
    throw new Error("invalid SHA-512 SRI");
  }
  const bytes = Buffer.from(digest, "base64");
  if (bytes.length !== 64 || bytes.toString("base64") !== digest) {
    throw new Error("invalid SHA-512 digest length or encoding");
  }
  return bytes;
}

export function createPublicCatalogValidator(
  schemaPath: string,
  repositoryIdentity: RepositoryIdentityResolver,
): (entry: unknown) => CatalogValidationResult {
  const schema = parseYaml(readFileSync(schemaPath, "utf8")) as object;
  const ajv = new Ajv2020Module.default({ strict: true, allErrors: true, validateFormats: true });
  addFormatsModule.default(ajv);
  const validateShape = ajv.compile(schema);

  return (entry: unknown): CatalogValidationResult => {
    if (!validateShape(entry)) {
      return {
        valid: false,
        errors: (validateShape.errors ?? []).map(
          (error: ErrorObject) => `${error.instancePath || "/"} ${error.message ?? "is invalid"}`,
        ),
      };
    }

    const value = entry as PublicEntryShape;
    const errors: string[] = [];
    try {
      parseSpdx(String(value.license?.spdx));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "invalid SPDX expression");
    }

    if (value.package?.ecosystem === "npm") {
      try {
        parseExactSemver(String(value.package.version));
      } catch {
        errors.push("invalid exact SemVer");
      }
      if (typeof value.package.integrity === "string") {
        try {
          parseSha512Integrity(value.package.integrity);
        } catch {
          errors.push("invalid SHA-512 SRI");
        }
      }
    }

    if (value.verification?.status === "verified" && value.verification.smokeTest !== null) {
      try {
        parseExactSemver(String(value.verification.smokeTest?.check?.version));
      } catch {
        errors.push("invalid smoke-test SemVer");
      }
    }

    errors.push(...validateMediaField((value as { media?: unknown }).media, value.source ?? {}));

    const repository = String(value.source?.repository);
    const declaredNodeId = String(value.source?.repositoryNodeId);
    const resolvedNodeId = repositoryIdentity.resolveNodeId(repository);
    if (resolvedNodeId === null || resolvedNodeId !== declaredNodeId) {
      errors.push("repository URL does not resolve to the declared repositoryNodeId");
    }

    return { valid: errors.length === 0, errors };
  };
}
