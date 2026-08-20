import type { Dirent } from "node:fs";
import { readdir, readFile, realpath, stat } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

import {
  createPublicEntryValidator,
  parseSafeYamlData,
  PublicSchemaError,
} from "./publicSchema.js";
import type {
  PublicCatalogEntry,
  PublicEntryValidationCode,
} from "./publicSchema.js";
import { canonicalPluginKey } from "./types.js";
import type { CanonicalPluginKey } from "./types.js";

const SCHEMA_FILE = "schemas/plugin.schema.yaml";
const ENTRY_DIRECTORY = "catalog/plugins";
const EXACT_COMMIT = /^[0-9a-f]{40}$/iu;

export interface CatalogDirectoryInput {
  readonly kind: "directory";
  readonly root: string;
}

export interface PinnedCatalogInput {
  readonly kind: "snapshot";
  readonly root: string;
  readonly revision: string;
}

export type CatalogLoadInput = string | CatalogDirectoryInput | PinnedCatalogInput;

export type CatalogDiagnosticCode =
  | PublicEntryValidationCode
  | "duplicate-canonical-key"
  | "duplicate-id"
  | "invalid-canonical-key"
  | "invalid-catalog-root"
  | "invalid-entry-directory"
  | "invalid-snapshot-revision"
  | "invalid-yaml"
  | "invalid-public-schema"
  | "unsafe-entry-path"
  | "unsafe-schema-path"
  | "unsafe-schema-ref"
  | "unreadable-entry";

export interface CatalogDiagnostic {
  readonly file: string;
  readonly code: CatalogDiagnosticCode;
  readonly message: string;
}

export type CatalogSnapshotSource =
  | { readonly kind: "directory" }
  | {
      readonly kind: "snapshot";
      readonly declaredRevision: string;
      readonly pinStatus: "declared-local";
    };

export interface CatalogSnapshot {
  readonly source: CatalogSnapshotSource;
  readonly entries: readonly PublicCatalogEntry[];
  readonly diagnostics: readonly CatalogDiagnostic[];
}

interface NormalizedInput {
  readonly root: string;
  readonly source: CatalogSnapshotSource;
}

interface CandidateEntry {
  readonly canonicalKey: CanonicalPluginKey;
  readonly entry: PublicCatalogEntry;
  readonly file: string;
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareDiagnostics(left: CatalogDiagnostic, right: CatalogDiagnostic): number {
  return compareText(
    `${left.file}\0${left.code}\0${left.message}`,
    `${right.file}\0${right.code}\0${right.message}`,
  );
}

function sortDiagnostics(diagnostics: CatalogDiagnostic[]): readonly CatalogDiagnostic[] {
  return diagnostics.sort(compareDiagnostics);
}

function isContained(root: string, candidate: string): boolean {
  const pathFromRoot = relative(root, candidate);
  return (
    pathFromRoot === "" ||
    (!isAbsolute(pathFromRoot) && pathFromRoot !== ".." && !pathFromRoot.startsWith(`..${sep}`))
  );
}

function hasErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === code
  );
}

function safeEntryLabel(fileName: string): string {
  const safeName = fileName.replaceAll(/[^A-Za-z0-9._-]/gu, "_");
  return `${ENTRY_DIRECTORY}/${safeName || "invalid-entry"}`;
}

function normalizeInput(input: CatalogLoadInput): NormalizedInput {
  if (typeof input === "string") {
    return { root: input, source: { kind: "directory" } };
  }
  if (input.kind === "directory") {
    return { root: input.root, source: { kind: "directory" } };
  }
  return {
    root: input.root,
    source: {
      kind: "snapshot",
      declaredRevision: input.revision,
      pinStatus: "declared-local",
    },
  };
}

function snapshotResult(
  source: CatalogSnapshotSource,
  entries: readonly PublicCatalogEntry[],
  diagnostics: CatalogDiagnostic[],
): CatalogSnapshot {
  return { source, entries, diagnostics: sortDiagnostics(diagnostics) };
}

function duplicateDiagnostics(
  candidates: readonly CandidateEntry[],
  property: "id" | "canonicalKey",
  code: "duplicate-id" | "duplicate-canonical-key",
  message: string,
): { readonly diagnostics: CatalogDiagnostic[]; readonly rejectedFiles: Set<string> } {
  const groups = new Map<string, CandidateEntry[]>();
  for (const candidate of candidates) {
    const value = property === "id" ? candidate.entry.id : candidate.canonicalKey;
    const group = groups.get(value) ?? [];
    group.push(candidate);
    groups.set(value, group);
  }

  const diagnostics: CatalogDiagnostic[] = [];
  const rejectedFiles = new Set<string>();
  for (const group of groups.values()) {
    if (group.length < 2) {
      continue;
    }
    for (const candidate of group) {
      rejectedFiles.add(candidate.file);
      diagnostics.push({ file: candidate.file, code, message });
    }
  }
  return { diagnostics, rejectedFiles };
}

async function containedRealPath(root: string, requestedPath: string): Promise<string | null> {
  const candidate = await realpath(requestedPath);
  return isContained(root, candidate) ? candidate : null;
}

export async function loadCatalog(input: CatalogLoadInput): Promise<CatalogSnapshot> {
  const normalized = normalizeInput(input);
  const diagnostics: CatalogDiagnostic[] = [];

  if (
    normalized.source.kind === "snapshot" &&
    !EXACT_COMMIT.test(normalized.source.declaredRevision)
  ) {
    diagnostics.push({
      file: ".",
      code: "invalid-snapshot-revision",
      message: "snapshot revision must be an exact 40-character hexadecimal commit",
    });
    return snapshotResult(normalized.source, [], diagnostics);
  }
  if (
    typeof normalized.root !== "string" ||
    normalized.root.trim() === "" ||
    normalized.root.includes("\0")
  ) {
    diagnostics.push({
      file: ".",
      code: "invalid-catalog-root",
      message: "catalog root must be a readable local directory",
    });
    return snapshotResult(normalized.source, [], diagnostics);
  }

  let root: string;
  try {
    root = await realpath(resolve(normalized.root));
    if (!(await stat(root)).isDirectory()) {
      throw new Error("not-directory");
    }
  } catch {
    diagnostics.push({
      file: ".",
      code: "invalid-catalog-root",
      message: "catalog root must be a readable local directory",
    });
    return snapshotResult(normalized.source, [], diagnostics);
  }

  let validateEntry: Awaited<ReturnType<typeof createPublicEntryValidator>>;
  try {
    validateEntry = await createPublicEntryValidator(root, resolve(root, SCHEMA_FILE));
  } catch (error) {
    const code =
      error instanceof PublicSchemaError
        ? error.code
        : ("invalid-public-schema" as const);
    const message =
      code === "unsafe-schema-ref"
        ? "public schema contains an unsafe local reference"
        : code === "unsafe-schema-path"
          ? "public schema resolves outside the local catalog root"
          : "public catalog schema is missing or invalid";
    diagnostics.push({ file: SCHEMA_FILE, code, message });
    return snapshotResult(normalized.source, [], diagnostics);
  }

  const requestedEntryDirectory = resolve(root, ENTRY_DIRECTORY);
  let entryDirectory: string;
  try {
    entryDirectory = await containedRealPath(root, requestedEntryDirectory) ?? "";
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) {
      return snapshotResult(normalized.source, [], diagnostics);
    }
    diagnostics.push({
      file: ENTRY_DIRECTORY,
      code: "invalid-entry-directory",
      message: "catalog entry directory is not readable",
    });
    return snapshotResult(normalized.source, [], diagnostics);
  }
  if (entryDirectory === "") {
    diagnostics.push({
      file: ENTRY_DIRECTORY,
      code: "invalid-entry-directory",
      message: "catalog entry directory resolves outside the local catalog root",
    });
    return snapshotResult(normalized.source, [], diagnostics);
  }
  try {
    if (!(await stat(entryDirectory)).isDirectory()) {
      throw new Error("not-directory");
    }
  } catch {
    diagnostics.push({
      file: ENTRY_DIRECTORY,
      code: "invalid-entry-directory",
      message: "catalog entry directory is not readable",
    });
    return snapshotResult(normalized.source, [], diagnostics);
  }

  let directoryEntries: Dirent<string>[];
  try {
    directoryEntries = await readdir(entryDirectory, { withFileTypes: true });
  } catch {
    diagnostics.push({
      file: ENTRY_DIRECTORY,
      code: "invalid-entry-directory",
      message: "catalog entry directory is not readable",
    });
    return snapshotResult(normalized.source, [], diagnostics);
  }

  const candidates: CandidateEntry[] = [];
  const yamlFiles = directoryEntries
    .filter((entry) => entry.name.toLowerCase().endsWith(".yaml"))
    .sort((left, right) => compareText(left.name, right.name));

  for (const directoryEntry of yamlFiles) {
    const file = safeEntryLabel(directoryEntry.name);
    const requestedPath = resolve(entryDirectory, directoryEntry.name);
    let entryPath: string;
    try {
      entryPath = await containedRealPath(root, requestedPath) ?? "";
      if (entryPath === "" || !(await stat(entryPath)).isFile()) {
        diagnostics.push({
          file,
          code: "unsafe-entry-path",
          message:
            entryPath === ""
              ? "catalog entry resolves outside the local catalog root"
              : "catalog entry path is not a regular file",
        });
        continue;
      }
    } catch {
      diagnostics.push({
        file,
        code: "unreadable-entry",
        message: "catalog entry is not readable",
      });
      continue;
    }

    let parsed: unknown;
    try {
      parsed = parseSafeYamlData(await readFile(entryPath, "utf8"));
    } catch {
      diagnostics.push({
        file,
        code: "invalid-yaml",
        message: "catalog entry is not valid safe YAML",
      });
      continue;
    }

    const validationIssues = validateEntry(parsed);
    if (validationIssues.length > 0) {
      for (const issue of validationIssues) {
        diagnostics.push({ file, code: issue.code, message: issue.message });
      }
      continue;
    }

    const entry = parsed as PublicCatalogEntry;
    try {
      candidates.push({
        canonicalKey: canonicalPluginKey(entry.source.repositoryNodeId, entry.source.subpath),
        entry,
        file,
      });
    } catch {
      diagnostics.push({
        file,
        code: "invalid-canonical-key",
        message: "catalog entry does not produce a safe canonical key",
      });
    }
  }

  const duplicateIds = duplicateDiagnostics(
    candidates,
    "id",
    "duplicate-id",
    "public ID is declared by multiple catalog files",
  );
  const duplicateKeys = duplicateDiagnostics(
    candidates,
    "canonicalKey",
    "duplicate-canonical-key",
    "canonical plugin key is declared by multiple catalog files",
  );
  diagnostics.push(...duplicateIds.diagnostics, ...duplicateKeys.diagnostics);

  const rejectedFiles = new Set([
    ...duplicateIds.rejectedFiles,
    ...duplicateKeys.rejectedFiles,
  ]);
  const entries = candidates
    .filter((candidate) => !rejectedFiles.has(candidate.file))
    .map((candidate) => candidate.entry)
    .sort((left, right) => compareText(left.id, right.id));

  return snapshotResult(normalized.source, entries, diagnostics);
}
