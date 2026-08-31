import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ValidateFunction } from "ajv";
import Ajv2020Module from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import { describe, expect, it } from "vitest";

import { parseSafeYamlData } from "../src/catalog/publicSchema.js";

/**
 * `schemas/skill.schema.yaml` is the public mirror of the catalog-core `kind: skill` contract
 * (SKL-01 phase 0). The CLI does not load skill entries yet — that is phase 1 — but the mirror
 * must already compile under the exact Ajv configuration the catalog loader uses, and must
 * accept/reject the contract's canonical shapes, so the published schema never drifts into
 * something the loader will later refuse.
 */

const publicRoot = fileURLToPath(new URL("../../", import.meta.url));

function compileSkillSchema(): ValidateFunction {
  const schema = parseSafeYamlData(
    readFileSync(join(publicRoot, "schemas/skill.schema.yaml"), "utf8"),
  ) as Record<string, unknown>;
  // Same options as createPublicEntryValidator in src/catalog/publicSchema.ts.
  const ajv = new Ajv2020Module.default({ allErrors: true, strict: true, validateFormats: true });
  addFormatsModule.default(ajv);
  return ajv.compile(schema);
}

function subdirectorySkillEntry(): Record<string, unknown> {
  return {
    schemaVersion: 1,
    id: "alice-dsh-commit-lint-skill",
    name: "DSH Commit Lint Skill",
    description: {
      en:
        "Loads a commit-message linting skill that checks Conventional Commit shape before " +
        "the harness commits.",
      evidencePath: "skills/commit-lint/SKILL.md",
    },
    unofficial: true,
    kind: "skill",
    skillScope: "subdirectory",
    primaryCategory: "coding-developer-tools",
    tags: ["git", "linting"],
    triggers: ["When the user asks to commit staged work"],
    source: {
      repository: "https://github.com/alice/dsh-skills",
      repositoryNodeId: "R_kgDOexample1",
      subpath: "skills/commit-lint",
      commit: "0123456789abcdef0123456789abcdef01234567",
    },
    creator: { github: "alice" },
    usage: {
      load: "dsh skill load skills/commit-lint",
      evidencePath: "skills/commit-lint/SKILL.md",
    },
    compat: { harnessMin: "1.4.0" },
    repositoryScope: "monorepo",
    popularity: { starsPolicy: "undefined-parent-repository", stars: null },
    license: { spdx: "MIT" },
    verification: {
      status: "eligible",
      checkedAt: "2026-08-30T12:00:00Z",
      repositoryIdentity: "resolved",
      smokeTest: null,
    },
    provenance: { discussion: null, comment: null },
  };
}

function repositorySkillEntry(): Record<string, unknown> {
  const entry = subdirectorySkillEntry();
  entry.skillScope = "repository";
  entry.source = {
    ...(entry.source as Record<string, unknown>),
    subpath: null,
  };
  entry.repositoryScope = "dedicated";
  entry.popularity = { starsPolicy: "exact-repository", stars: 12 };
  return entry;
}

function messages(validate: ValidateFunction): string[] {
  return (validate.errors ?? []).map((error) => `${error.instancePath} ${error.message ?? ""}`);
}

describe("public skill schema (kind: skill mirror)", () => {
  it("accepts a subdirectory-scoped skill entry", () => {
    const validate = compileSkillSchema();
    expect(validate(subdirectorySkillEntry())).toBe(true);
  });

  it("accepts a whole-repository skill entry with a null subpath", () => {
    const validate = compileSkillSchema();
    expect(validate(repositorySkillEntry())).toBe(true);
  });

  it("rejects the plugin-only install and gallery fields", () => {
    const validate = compileSkillSchema();
    const entry = subdirectorySkillEntry();
    entry.package = { ecosystem: "source" };
    entry.dsh = { profiles: ["default"], evidencePath: "SKILL.md" };
    entry.media = [];
    expect(validate(entry)).toBe(false);
    expect(messages(validate)).toContain(" must NOT have additional properties");
  });

  it("rejects a whole-repository skill that declares a subpath", () => {
    const validate = compileSkillSchema();
    const entry = repositorySkillEntry();
    entry.source = {
      ...(entry.source as Record<string, unknown>),
      subpath: "skills/commit-lint",
    };
    expect(validate(entry)).toBe(false);
    expect(messages(validate)).toContain("/source/subpath must be null");
  });

  it("rejects a subdirectory-scoped skill without a subpath", () => {
    const validate = compileSkillSchema();
    const entry = subdirectorySkillEntry();
    entry.source = {
      ...(entry.source as Record<string, unknown>),
      subpath: null,
    };
    expect(validate(entry)).toBe(false);
    expect(messages(validate)).toContain("/source/subpath must be string");
  });

  it("rejects an empty triggers list — absence is written by omitting the field", () => {
    const validate = compileSkillSchema();
    const entry = subdirectorySkillEntry();
    entry.triggers = [];
    expect(validate(entry)).toBe(false);
  });

  it("accepts an entry without triggers, the one optional field", () => {
    const validate = compileSkillSchema();
    const entry = subdirectorySkillEntry();
    delete entry.triggers;
    expect(validate(entry)).toBe(true);
  });

  it("rejects a SemVer range in compat.harnessMin", () => {
    const validate = compileSkillSchema();
    const entry = subdirectorySkillEntry();
    entry.compat = { harnessMin: "^1.4.0" };
    expect(validate(entry)).toBe(false);
  });

  it("rejects a non-null smoke test — content review is the admission gate", () => {
    const validate = compileSkillSchema();
    const entry = subdirectorySkillEntry();
    entry.verification = {
      status: "verified",
      checkedAt: "2026-08-30T12:00:00Z",
      repositoryIdentity: "resolved",
      smokeTest: {
        installTarget: "canonical-install-descriptor",
        check: { name: "x", version: "1.0.0" },
        result: "passed",
      },
    };
    expect(validate(entry)).toBe(false);
    expect(messages(validate)).toContain("/verification/smokeTest must be null");
  });
});
