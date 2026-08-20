export type DiscoveryKind =
  | "discussion"
  | "comment"
  | "reply"
  | "external-open-pr"
  | "external-merged-pr"
  | "external-closed-pr"
  | "external-issue"
  | "external-commit"
  | "github-topic"
  | "npm-search"
  | "direct-pr";

export interface DiscoveryOrigin {
  kind: DiscoveryKind;
  url: string;
  nodeId: string;
  authorLogin: string | null;
  privateOnly: true;
}

export type CandidateState =
  | "discovered"
  | "normalized"
  | "needs_review"
  | "rejected"
  | "qualified"
  | "collision_check"
  | "creator_pr_exists"
  | "community_pr_exists"
  | "bot_pr_ready"
  | "pr_open"
  | "superseded"
  | "changes_requested"
  | "merged"
  | "closed"
  | "monitored";

export type CanonicalPluginKey = `${string}:${string}`;

export type ArtifactKind =
  | "plugin"
  | "plugin-family"
  | "skin-theme"
  | "skill"
  | "preset-profile"
  | "client-interface"
  | "bridge-adapter"
  | "ecosystem-project";

export type RepositoryScope = "dedicated" | "monorepo";
export type StarsPolicy = "exact-repository" | "undefined-parent-repository";
export type VerificationStatus =
  | "eligible"
  | "verified"
  | "stale"
  | "unavailable"
  | "archived"
  | "quarantined";

export interface Candidate {
  key: CanonicalPluginKey;
  repositoryNodeId: string;
  repositoryUrl: string;
  subpath: string | null;
  packageName: string | null;
  state: CandidateState;
  origins: readonly DiscoveryOrigin[];
}

export interface QualifiedCandidate extends Candidate {
  id: string;
  name: string;
  kind: ArtifactKind;
  primaryCategory: string;
  tags: readonly string[];
  description: {
    en: string;
    evidencePath: string;
  };
  commit: string;
  creator: {
    github: string;
    profile: string;
  };
  package:
    | {
        ecosystem: "npm";
        name: string;
        version: string;
        integrity?: string;
      }
    | {
        ecosystem: "source";
        name: null;
      };
  dsh: {
    integration: "native-bundle" | "adapter";
    profiles: readonly string[];
    installSource: string;
    evidencePath: string;
  };
  repositoryScope: RepositoryScope;
  license: {
    spdx: string;
    status: "detected" | "missing" | "unknown";
  };
  verification: {
    status: VerificationStatus;
    checkedCommit: string;
    checkedAt: string;
    repositoryIdentity: "resolved";
    smokeTest: null | {
      installTarget: "canonical-install-descriptor";
      check: { name: string; version: string };
      result: "passed";
    };
  };
  popularity: {
    starsPolicy: StarsPolicy;
    stars: number | null;
  };
  fieldEvidence: Readonly<Record<string, readonly string[]>>;
}

function normalizePluginSubpath(subpath: string | null): string {
  if (subpath === null || subpath.trim() === "") {
    return ".";
  }

  const slashNormalized = subpath.trim().replaceAll("\\", "/");
  if (slashNormalized.includes("\0")) {
    throw new Error("plugin subpath must be a safe relative path");
  }

  const segments = slashNormalized.split("/").filter((segment) => segment !== "" && segment !== ".");
  if (segments.some((segment) => segment === "..")) {
    throw new Error("plugin subpath must be a safe relative path");
  }

  return segments.join("/") || ".";
}

export function canonicalPluginKey(
  repositoryNodeId: string,
  subpath: string | null,
): CanonicalPluginKey {
  const nodeId = repositoryNodeId.trim();
  if (nodeId === "" || nodeId.includes(":")) {
    throw new Error("repository node ID must be non-empty and must not contain ':'");
  }

  return `${nodeId}:${normalizePluginSubpath(subpath)}`;
}

const PUBLIC_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

export function canonicalPublicId(id: string): string {
  if (!PUBLIC_ID.test(id)) {
    throw new Error("canonical public plugin ID must be lowercase kebab-case and path-safe");
  }
  return id;
}

export function publicEntryPath(id: string): `catalog/plugins/${string}.yaml` {
  return `catalog/plugins/${canonicalPublicId(id)}.yaml`;
}

export interface PublicNamespaceOccupancy {
  readonly canonicalKeys: Set<CanonicalPluginKey>;
  readonly ids: Set<string>;
  readonly paths: Set<string>;
  readonly packages: Set<string>;
}

export interface PublicNamespaceRequest {
  readonly canonicalKey: CanonicalPluginKey;
  readonly id: string;
  readonly packageName: string | null;
}

export interface PublicNamespaceReservation extends PublicNamespaceRequest {
  readonly path: `catalog/plugins/${string}.yaml`;
}

export function reservePublicNamespace(
  occupied: PublicNamespaceOccupancy,
  request: PublicNamespaceRequest,
): PublicNamespaceReservation {
  const id = canonicalPublicId(request.id);
  const path = publicEntryPath(id);
  const packageName = request.packageName?.trim().toLowerCase() ?? null;
  if (request.packageName !== null && packageName !== request.packageName) {
    throw new Error("public package name must already be canonical");
  }
  if (occupied.canonicalKeys.has(request.canonicalKey)) {
    throw new Error("public canonical key collision");
  }
  if (occupied.ids.has(id)) {
    throw new Error("public ID collision");
  }
  if (occupied.paths.has(path)) {
    throw new Error("public output path collision");
  }
  if (packageName !== null && occupied.packages.has(packageName)) {
    throw new Error("public package collision");
  }

  occupied.canonicalKeys.add(request.canonicalKey);
  occupied.ids.add(id);
  occupied.paths.add(path);
  if (packageName !== null) {
    occupied.packages.add(packageName);
  }
  return { ...request, id, packageName, path };
}
