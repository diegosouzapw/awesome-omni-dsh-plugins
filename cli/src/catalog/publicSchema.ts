import { readFile, realpath } from "node:fs/promises";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

import type { ErrorObject, ValidateFunction } from "ajv";
import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import { parseDocument } from "yaml";

import { parseExactSemver, parseSha512Integrity, parseSpdx } from "./publicCatalogValidator.js";
import type {
  ArtifactKind,
  CanonicalPluginKey,
  RepositoryScope,
  StarsPolicy,
  VerificationStatus,
} from "./types.js";

export interface PublicCatalogEntry {
  readonly schemaVersion: 1;
  readonly id: string;
  readonly name: string;
  readonly description: {
    readonly en: string;
    readonly evidencePath: string;
  };
  readonly unofficial: true;
  readonly kind: ArtifactKind;
  readonly primaryCategory: string;
  readonly tags: readonly string[];
  readonly source: {
    readonly repository: string;
    readonly repositoryNodeId: string;
    readonly subpath: string | null;
    readonly commit: string;
  };
  readonly creator: {
    readonly github: string;
  };
  readonly package:
    | {
        readonly ecosystem: "npm";
        readonly name: string;
        readonly version: string;
        readonly integrity?: string;
      }
    | {
        readonly ecosystem: "source";
      };
  readonly dsh: {
    readonly profiles: readonly string[];
    readonly evidencePath: string;
  };
  readonly repositoryScope: RepositoryScope;
  readonly popularity: {
    readonly starsPolicy: StarsPolicy;
    readonly stars: number | null;
  };
  readonly license: {
    readonly spdx: string;
  };
  readonly verification: {
    readonly status: VerificationStatus;
    readonly checkedAt: string;
    readonly repositoryIdentity: "resolved";
    readonly smokeTest: null | {
      readonly installTarget: "canonical-install-descriptor";
      readonly check: {
        readonly name: string;
        readonly version: string;
      };
      readonly result: "passed";
    };
  };
  readonly provenance: {
    readonly discussion: string | null;
    readonly comment: string | null;
  };
}

export type PublicEntryValidationCode =
  | "schema-validation"
  | "invalid-spdx"
  | "invalid-semver"
  | "invalid-sri";

export interface PublicEntryValidationIssue {
  readonly code: PublicEntryValidationCode;
  readonly message: string;
}

export interface ValidatedPublicCatalogEntry {
  readonly canonicalKey: CanonicalPluginKey;
  readonly entry: PublicCatalogEntry;
}

export type PublicSchemaErrorCode =
  | "invalid-public-schema"
  | "unsafe-schema-path"
  | "unsafe-schema-ref";

export class PublicSchemaError extends Error {
  readonly code: PublicSchemaErrorCode;

  constructor(code: PublicSchemaErrorCode) {
    super(code);
    this.name = "PublicSchemaError";
    this.code = code;
  }
}

type SchemaObject = Record<string, unknown>;

interface LoadedSchemaDocument {
  readonly schema: SchemaObject;
  readonly uri: string;
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isContained(root: string, candidate: string): boolean {
  const pathFromRoot = relative(root, candidate);
  return (
    pathFromRoot === "" ||
    (!isAbsolute(pathFromRoot) && pathFromRoot !== ".." && !pathFromRoot.startsWith(`..${sep}`))
  );
}

export function parseSafeYamlData(source: string): unknown {
  const document = parseDocument(source, {
    prettyErrors: false,
    schema: "core",
    uniqueKeys: true,
  });
  if (document.errors.length > 0 || document.warnings.length > 0) {
    throw new Error("invalid-safe-yaml");
  }
  return document.toJS({ maxAliasCount: 100 });
}

function collectSchemaRefs(schema: SchemaObject): string[] {
  const references: string[] = [];
  const visited = new WeakSet<object>();

  const visit = (value: unknown): void => {
    if (typeof value !== "object" || value === null || visited.has(value)) {
      return;
    }
    visited.add(value);
    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item);
      }
      return;
    }

    for (const [key, nestedValue] of Object.entries(value)) {
      if (key === "$id") {
        throw new PublicSchemaError("invalid-public-schema");
      }
      if (key === "$ref" || key === "$dynamicRef") {
        if (typeof nestedValue !== "string") {
          throw new PublicSchemaError("invalid-public-schema");
        }
        references.push(nestedValue);
      }
      visit(nestedValue);
    }
  };

  visit(schema);
  return references.sort(compareText);
}

function localRefPath(reference: string): string | null {
  if (reference.startsWith("#")) {
    return null;
  }
  const hashIndex = reference.indexOf("#");
  const pathPart = hashIndex === -1 ? reference : reference.slice(0, hashIndex);
  if (
    pathPart === "" ||
    pathPart.includes("\0") ||
    pathPart.includes("\\") ||
    pathPart.includes("%") ||
    pathPart.includes("?") ||
    isAbsolute(pathPart) ||
    /^[A-Za-z][A-Za-z0-9+.-]*:/u.test(pathPart) ||
    pathPart.split("/").some((segment) => segment === "..")
  ) {
    throw new PublicSchemaError("unsafe-schema-ref");
  }
  const extension = extname(pathPart).toLowerCase();
  if (extension !== ".json" && extension !== ".yaml" && extension !== ".yml") {
    throw new PublicSchemaError("unsafe-schema-ref");
  }
  return pathPart;
}

async function loadSchemaDocument(
  catalogRoot: string,
  requestedPath: string,
  documents: Map<string, LoadedSchemaDocument>,
): Promise<void> {
  const uri = pathToFileURL(requestedPath).href;
  if (documents.has(uri)) {
    return;
  }

  let resolvedRealPath: string;
  try {
    resolvedRealPath = await realpath(requestedPath);
  } catch {
    throw new PublicSchemaError("invalid-public-schema");
  }
  if (!isContained(catalogRoot, resolvedRealPath)) {
    throw new PublicSchemaError("unsafe-schema-ref");
  }

  let parsed: unknown;
  try {
    parsed = parseSafeYamlData(await readFile(resolvedRealPath, "utf8"));
  } catch (error) {
    if (error instanceof PublicSchemaError) {
      throw error;
    }
    throw new PublicSchemaError("invalid-public-schema");
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new PublicSchemaError("invalid-public-schema");
  }

  const schemaWithoutId = parsed as SchemaObject;
  const references = collectSchemaRefs(schemaWithoutId);
  const schema: SchemaObject = { ...schemaWithoutId, $id: uri };
  documents.set(uri, { schema, uri });

  for (const reference of references) {
    const pathPart = localRefPath(reference);
    if (pathPart === null) {
      continue;
    }
    const referencedPath = resolve(dirname(requestedPath), pathPart);
    await loadSchemaDocument(catalogRoot, referencedPath, documents);
  }
}

function ajvIssue(error: ErrorObject): PublicEntryValidationIssue {
  const location = error.instancePath === "" ? "/" : error.instancePath;
  return {
    code: "schema-validation",
    message: `${location} ${error.message ?? "is invalid"}`,
  };
}

function semanticIssues(entry: PublicCatalogEntry): PublicEntryValidationIssue[] {
  const issues: PublicEntryValidationIssue[] = [];
  try {
    parseSpdx(entry.license.spdx);
  } catch {
    issues.push({ code: "invalid-spdx", message: "license.spdx must be a valid SPDX expression" });
  }

  if (entry.package.ecosystem === "npm") {
    try {
      parseExactSemver(entry.package.version);
    } catch {
      issues.push({
        code: "invalid-semver",
        message: "package.version must be an exact SemVer",
      });
    }
    if (entry.package.integrity !== undefined) {
      try {
        parseSha512Integrity(entry.package.integrity);
      } catch {
        issues.push({
          code: "invalid-sri",
          message: "package.integrity must be a valid SHA-512 SRI",
        });
      }
    }
  }

  if (entry.verification.smokeTest !== null) {
    try {
      parseExactSemver(entry.verification.smokeTest.check.version);
    } catch {
      issues.push({
        code: "invalid-semver",
        message: "verification.smokeTest.check.version must be an exact SemVer",
      });
    }
  }

  return issues;
}

export async function createPublicEntryValidator(
  catalogRoot: string,
  schemaPath: string,
): Promise<(entry: unknown) => readonly PublicEntryValidationIssue[]> {
  let schemaRealPath: string;
  try {
    schemaRealPath = await realpath(schemaPath);
  } catch {
    throw new PublicSchemaError("invalid-public-schema");
  }
  if (!isContained(catalogRoot, schemaRealPath)) {
    throw new PublicSchemaError("unsafe-schema-path");
  }

  const documents = new Map<string, LoadedSchemaDocument>();
  await loadSchemaDocument(catalogRoot, schemaRealPath, documents);
  const rootUri = pathToFileURL(schemaRealPath).href;
  const rootDocument = documents.get(rootUri);
  if (rootDocument === undefined) {
    throw new PublicSchemaError("invalid-public-schema");
  }

  let validate: ValidateFunction<PublicCatalogEntry>;
  try {
    const ajv = new Ajv2020Module.default({
      allErrors: true,
      strict: true,
      validateFormats: true,
    });
    addFormatsModule.default(ajv);
    for (const document of documents.values()) {
      if (document.uri !== rootUri) {
        ajv.addSchema(document.schema, document.uri);
      }
    }
    validate = ajv.compile<PublicCatalogEntry>(rootDocument.schema);
  } catch {
    throw new PublicSchemaError("invalid-public-schema");
  }

  return (entry: unknown): readonly PublicEntryValidationIssue[] => {
    if (!validate(entry)) {
      return (validate.errors ?? [])
        .map(ajvIssue)
        .sort((left, right) =>
          compareText(`${left.code}\0${left.message}`, `${right.code}\0${right.message}`),
        );
    }
    return semanticIssues(entry).sort((left, right) =>
      compareText(`${left.code}\0${left.message}`, `${right.code}\0${right.message}`),
    );
  };
}
