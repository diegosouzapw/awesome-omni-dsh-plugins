import { readFileSync } from "node:fs";

import type { ErrorObject } from "ajv";
import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import semver from "semver";
import parseSpdxExpression from "spdx-expression-parse";
import ssri from "ssri";
import { parse as parseYaml } from "yaml";

export interface RepositoryIdentityResolver {
  resolveNodeId(repositoryUrl: string): string | null;
}

export interface CatalogValidationResult {
  valid: boolean;
  errors: string[];
}

interface PublicEntryShape {
  source?: { repository?: unknown; repositoryNodeId?: unknown };
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

    const repository = String(value.source?.repository);
    const declaredNodeId = String(value.source?.repositoryNodeId);
    const resolvedNodeId = repositoryIdentity.resolveNodeId(repository);
    if (resolvedNodeId === null || resolvedNodeId !== declaredNodeId) {
      errors.push("repository URL does not resolve to the declared repositoryNodeId");
    }

    return { valid: errors.length === 0, errors };
  };
}
