export interface CatalogDiagnostic {
  readonly file: string;
  readonly code: string;
  readonly message: string;
}

export interface PublicCatalogEntry {
  readonly schemaVersion: 1;
  readonly id: string;
  readonly name: string;
  readonly description: { readonly en: string; readonly evidencePath: string };
  readonly unofficial: true;
  readonly kind: string;
  readonly primaryCategory: string;
  readonly tags: readonly string[];
  readonly source: {
    readonly repository: string;
    readonly repositoryNodeId: string;
    readonly subpath: string | null;
    readonly commit: string;
  };
  readonly creator: { readonly github: string };
  readonly package:
    | {
        readonly ecosystem: "npm";
        readonly name: string;
        readonly version: string;
        readonly integrity?: string;
      }
    | { readonly ecosystem: "source" };
  readonly dsh: { readonly profiles: readonly string[]; readonly evidencePath: string };
  readonly repositoryScope: "dedicated" | "monorepo";
  readonly popularity: {
    readonly starsPolicy: "exact-repository" | "undefined-parent-repository";
    readonly stars: number | null;
  };
  readonly license: { readonly spdx: string };
  readonly verification: {
    readonly status: "eligible" | "verified" | "stale" | "unavailable" | "archived" | "quarantined";
    readonly checkedAt: string;
    readonly repositoryIdentity: "resolved";
    readonly smokeTest: null | {
      readonly installTarget: "canonical-install-descriptor";
      readonly check: { readonly name: string; readonly version: string };
      readonly result: "passed";
    };
  };
  readonly provenance: { readonly discussion: string | null; readonly comment: string | null };
  readonly canonicalKey: string;
}

export interface CatalogSnapshot {
  readonly source:
    | { readonly kind: "directory" }
    | {
        readonly kind: "snapshot";
        readonly declaredRevision: string;
        readonly pinStatus: "declared-local";
      };
  readonly entries: readonly PublicCatalogEntry[];
  readonly diagnostics: readonly CatalogDiagnostic[];
}

export interface CatalogSelection {
  readonly root?: string;
  readonly revision?: string;
}
