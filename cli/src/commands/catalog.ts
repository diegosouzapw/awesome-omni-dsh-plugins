import { readdir, readFile, realpath } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

import { parse as parseYaml } from "yaml";

import type { CatalogDiagnostic, CatalogSelection, CatalogSnapshot } from "../model.js";

export interface CommandIo {
  stdout(value: string): void;
  stderr(value: string): void;
}

export interface CatalogCommandContext extends CommandIo {
  loadCatalog(selection?: CatalogSelection): Promise<CatalogSnapshot>;
}

function sortedDiagnostics(diagnostics: readonly CatalogDiagnostic[]): CatalogDiagnostic[] {
  return [...diagnostics].sort((left, right) =>
    left.file.localeCompare(right.file) ||
    left.code.localeCompare(right.code) ||
    left.message.localeCompare(right.message),
  );
}

export function writeDiagnostics(io: CommandIo, diagnostics: readonly CatalogDiagnostic[]): void {
  for (const diagnostic of sortedDiagnostics(diagnostics)) {
    io.stderr(`${diagnostic.file} [${diagnostic.code}]: ${diagnostic.message}\n`);
  }
}

export async function validateCatalogCommand(
  context: CatalogCommandContext,
  selection: CatalogSelection | undefined,
  json: boolean,
): Promise<number> {
  const snapshot = await context.loadCatalog(selection);
  const diagnostics = sortedDiagnostics(snapshot.diagnostics);
  const valid = diagnostics.length === 0;
  if (json) {
    context.stdout(`${JSON.stringify({
      valid,
      count: snapshot.entries.length,
      empty: snapshot.entries.length === 0,
      diagnostics,
    })}\n`);
  } else if (!valid) {
    writeDiagnostics(context, diagnostics);
  } else if (snapshot.entries.length === 0) {
    context.stdout("0 entries valid; catalog is empty\n");
  } else {
    context.stdout(`${snapshot.entries.length} entries valid\n`);
  }
  return valid ? 0 : 1;
}

const UNOFFICIAL_NOTICE =
  "Unofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.";

async function canonicalRoot(root: string): Promise<string> {
  return realpath(resolve(root));
}

function isWithin(root: string, candidate: string): boolean {
  const child = relative(root, candidate);
  return child === "" || (!child.startsWith(`..${sep}`) && child !== ".." && !isAbsolute(child));
}

async function readContained(root: string, file: string): Promise<string> {
  const candidate = await realpath(resolve(root, file));
  if (!isWithin(root, candidate)) {
    throw new Error("unsafe-path");
  }
  return readFile(candidate, "utf8");
}

const REQUIRED_DOCS = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "docs/CATEGORIES.md",
  "docs/CREDIT.md",
  "docs/RANKING.md",
  "docs/UNOFFICIAL.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
] as const;

const POLICY_MARKERS = new Map<string, readonly string[]>([
  ["CONTRIBUTING.md", [
    "<!-- catalog-policy:one-plugin-per-branch-and-pr -->",
    "<!-- creator-first:direct-pr-supersedes-curation-and-automation -->",
    "<!-- creator-first:source-bound-git-identity -->",
    "<!-- catalog-validation:local-structure-and-semantics-only -->",
    "<!-- maintainer-gate:repository-origin-and-pinned-evidence -->",
  ]],
  ["docs/CATEGORIES.md", ["<!-- catalog-policy:aggregators-never-entries -->"]],
  ["docs/CREDIT.md", [
    "<!-- creator-first:direct-pr-supersedes-curation-and-automation -->",
    "<!-- creator-first:source-bound-git-identity -->",
  ]],
  [".github/PULL_REQUEST_TEMPLATE.md", [
    "<!-- catalog-policy:one-plugin-per-branch-and-pr -->",
    "<!-- creator-first:direct-pr-supersedes-curation-and-automation -->",
    "<!-- creator-first:source-bound-git-identity -->",
  ]],
]);

function hasBalancedMarkdownFences(content: string): boolean {
  let open: { marker: string; length: number } | null = null;
  for (const line of content.split(/\r?\n/u)) {
    const match = /^ {0,3}(`{3,}|~{3,})/u.exec(line);
    if (match === null) {
      continue;
    }
    const fence = match[1]!;
    if (open === null) {
      open = { marker: fence[0]!, length: fence.length };
    } else if (fence[0] === open.marker && fence.length >= open.length) {
      open = null;
    }
  }
  return open === null;
}

/**
 * The documents that carry translations under `docs/i18n/<locale>/`.
 *
 * A translation is written by hand (or by a script) against the English of the day, and nothing
 * about it is machine-checkable except its SHAPE. That turns out to be enough: a translation that
 * lost a section, or repeated one, no longer has the same number of headings and table rows as
 * its source — which is exactly how a duplicated block slipped into six locales at once and still
 * read as "current" to the freshness stamp, because the stamp only hashes the ENGLISH.
 */
const TRANSLATED_DOCUMENTS = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "docs/SCHEMA.md",
  "docs/CLI.md",
  "docs/GOVERNANCE.md",
  "docs/CATEGORIES.md",
  "docs/CREDIT.md",
  "docs/RANKING.md",
  "docs/UNOFFICIAL.md",
] as const;

const LOCALE_NAME = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})?$/u;

interface DocumentShape {
  readonly sections: number;
  readonly subsections: number;
  readonly rows: number;
}

function documentShape(content: string): DocumentShape {
  const lines = content.split(/\r?\n/u);
  return {
    sections: lines.filter((line) => line.startsWith("## ")).length,
    subsections: lines.filter((line) => line.startsWith("### ")).length,
    rows: lines.filter((line) => line.startsWith("| ")).length,
  };
}

async function translationShapeDiagnostics(root: string): Promise<CatalogDiagnostic[]> {
  let locales: string[];
  try {
    locales = (await readdir(join(root, "docs", "i18n"), { withFileTypes: true }))
      .filter((entry) => entry.isDirectory() && LOCALE_NAME.test(entry.name))
      .map((entry) => entry.name)
      .sort();
  } catch {
    return []; // No translations in this checkout; nothing to keep in shape.
  }

  const diagnostics: CatalogDiagnostic[] = [];
  for (const document of TRANSLATED_DOCUMENTS) {
    let english: DocumentShape;
    try {
      english = documentShape(await readContained(root, document));
    } catch {
      continue; // The English document does not exist; other checks report a missing required doc.
    }
    for (const locale of locales) {
      const file = `docs/i18n/${locale}/${document.split("/").at(-1)!}`;
      let translated: DocumentShape;
      try {
        translated = documentShape(await readContained(root, file));
      } catch {
        continue; // A locale may legitimately not carry every document yet.
      }
      const drift = (["sections", "subsections", "rows"] as const).filter(
        (part) => translated[part] !== english[part],
      );
      if (drift.length > 0) {
        diagnostics.push({
          file,
          code: "docs",
          message:
            `translation does not match the shape of ${document}: ` +
            drift
              .map((part) => `${part} ${translated[part]} != ${english[part]}`)
              .join(", "),
        });
      }
    }
  }
  return diagnostics;
}

function tableValues(content: string, heading: string): string[] | null {
  const start = content.indexOf(`## ${heading}`);
  if (start < 0) {
    return null;
  }
  const next = content.indexOf("\n## ", start + heading.length + 3);
  const section = content.slice(start, next < 0 ? undefined : next);
  return [...section.matchAll(/^\|\s*`([^`]+)`\s*\|/gmu)].map((match) => match[1]!);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function schemaEnum(document: unknown, property: string): string[] | null {
  if (!isRecord(document) || !isRecord(document.properties)) {
    return null;
  }
  const definition = document.properties[property];
  if (!isRecord(definition) || !Array.isArray(definition.enum)) {
    return null;
  }
  return definition.enum.every((value) => typeof value === "string")
    ? [...definition.enum] as string[]
    : null;
}

function sameValues(left: readonly string[], right: readonly string[]): boolean {
  return [...left].sort().join("\0") === [...right].sort().join("\0");
}

export async function docsCheckCommand(
  context: CatalogCommandContext,
  rootInput: string,
  options: { skipCount?: boolean } = {},
): Promise<number> {
  let root: string;
  try {
    root = await canonicalRoot(rootInput);
  } catch {
    context.stderr("catalog root: directory is unavailable\n");
    return 1;
  }
  const diagnostics: CatalogDiagnostic[] = [];
  const contents = new Map<string, string>();
  for (const file of REQUIRED_DOCS) {
    try {
      contents.set(file, await readContained(root, file));
    } catch {
      diagnostics.push({ file, code: "docs", message: "required document is missing or unsafe" });
    }
  }
  for (const file of ["README.md", "CONTRIBUTING.md", "docs/UNOFFICIAL.md"] as const) {
    const content = contents.get(file);
    if (content !== undefined && !content.includes(UNOFFICIAL_NOTICE)) {
      diagnostics.push({ file, code: "docs", message: "missing unofficial-project notice" });
    }
  }
  for (const [file, markers] of POLICY_MARKERS) {
    const content = contents.get(file);
    if (content === undefined) {
      continue;
    }
    for (const marker of markers) {
      if (!content.includes(marker)) {
        diagnostics.push({ file, code: "docs", message: `missing policy marker ${marker}` });
      }
    }
  }
  for (const [file, content] of contents) {
    if (file.endsWith(".md") && !hasBalancedMarkdownFences(content)) {
      diagnostics.push({ file, code: "docs", message: "unbalanced Markdown fence" });
    }
  }
  diagnostics.push(...(await translationShapeDiagnostics(root)));
  try {
    const categories = contents.get("docs/CATEGORIES.md");
    const schema = parseYaml(await readContained(root, "schemas/plugin.schema.yaml"), {
      maxAliasCount: 0,
    });
    const documentedKinds = categories === undefined ? null : tableValues(categories, "Artifact kinds");
    const documentedCategories = categories === undefined
      ? null
      : tableValues(categories, "Primary capability categories");
    const allowedKinds = schemaEnum(schema, "kind");
    const allowedCategories = schemaEnum(schema, "primaryCategory");
    const forbiddenKinds = new Set([
      "aggregator",
      "catalog",
      "list",
      "marketplace",
      "marketplace-catalog",
      "plugin-list",
    ]);
    if (
      documentedKinds === null ||
      documentedCategories === null ||
      allowedKinds === null ||
      allowedCategories === null ||
      !sameValues(documentedKinds, allowedKinds) ||
      !sameValues(documentedCategories, allowedCategories) ||
      [...documentedKinds, ...allowedKinds].some((kind) => forbiddenKinds.has(kind))
    ) {
      diagnostics.push({
        file: "schemas/plugin.schema.yaml",
        code: "docs",
        message: "schema/category parity is invalid",
      });
    }
  } catch {
    diagnostics.push({
      file: "schemas/plugin.schema.yaml",
      code: "docs",
      message: "schema/category parity is invalid",
    });
  }
  const snapshot = await context.loadCatalog({ root: rootInput });
  diagnostics.push(...snapshot.diagnostics);
  // Exact-count enforcement is a main-branch concern: a one-plugin-per-PR batch can never
  // carry the next count in its merge commit, so the pull-request gate passes --skip-count
  // and replaces this with a no-regression comparison against the base branch instead.
  const readme = contents.get("README.md");
  if (
    options.skipCount !== true &&
    readme !== undefined &&
    !readme.includes(`**${snapshot.entries.length} plugins merged.**`)
  ) {
    diagnostics.push({
      file: "README.md",
      code: "docs",
      message: `catalog count must report ${snapshot.entries.length} plugins merged`,
    });
  }
  if (diagnostics.length > 0) {
    for (const diagnostic of sortedDiagnostics(diagnostics)) {
      context.stderr(`${diagnostic.file}: ${diagnostic.message}\n`);
    }
    return 1;
  }
  context.stdout(`Catalog documentation checks passed for ${snapshot.entries.length} entries.\n`);
  return 0;
}

interface FormField {
  type?: unknown;
  id?: unknown;
  attributes?: {
    value?: unknown;
    options?: unknown;
  };
  validations?: { required?: unknown };
}

interface IssueForm {
  name?: unknown;
  description?: unknown;
  body?: unknown;
}

const ISSUE_FORMS = ["claim", "correction", "removal"] as const;

const MATERIAL_FORM_FIELD = {
  claim: null,
  correction: { id: "correction", type: "textarea" },
  removal: { id: "action", type: "dropdown" },
} as const;

function hasRequiredField(
  fields: readonly FormField[],
  id: string,
  type: string,
): boolean {
  return fields.some(
    (field) => field.id === id && field.type === type && field.validations?.required === true,
  );
}

function hasRequiredConfirmations(fields: readonly FormField[]): boolean {
  const confirmations = fields.find(
    (field) => field.id === "confirmations" && field.type === "checkboxes",
  );
  const options = confirmations?.attributes?.options;
  return Array.isArray(options) && options.length > 0 && options.every(
    (option) => isRecord(option) && typeof option.label === "string" && option.required === true,
  );
}

export async function githubFormsCheckCommand(io: CommandIo, rootInput: string): Promise<number> {
  let root: string;
  try {
    root = await canonicalRoot(rootInput);
  } catch {
    io.stderr("catalog root: directory is unavailable\n");
    return 1;
  }
  const diagnostics: CatalogDiagnostic[] = [];
  for (const name of ISSUE_FORMS) {
    const file = `.github/ISSUE_TEMPLATE/${name}.yml`;
    try {
      const parsed = parseYaml(await readContained(root, file), { maxAliasCount: 0 }) as IssueForm;
      const body = Array.isArray(parsed.body) ? (parsed.body as FormField[]) : [];
      const ids = body.flatMap((field) => typeof field.id === "string" ? [field.id] : []);
      const unique = new Set(ids);
      const material = MATERIAL_FORM_FIELD[name];
      const hasUnofficialNotice = body.some((field) => {
        const value = field.attributes?.value;
        return field.type === "markdown" &&
          typeof value === "string" &&
          value.toLowerCase().includes("unofficial community project") &&
          value.toLowerCase().includes("not affiliated");
      });
      if (
        typeof parsed.name !== "string" || parsed.name.trim() === "" ||
        typeof parsed.description !== "string" || parsed.description.trim() === "" ||
        unique.size !== ids.length ||
        !hasUnofficialNotice ||
        !hasRequiredField(body, "plugin_id", "input") ||
        !hasRequiredField(body, "repository", "input") ||
        !hasRequiredField(body, "evidence", "textarea") ||
        (material !== null && !hasRequiredField(body, material.id, material.type)) ||
        !hasRequiredConfirmations(body)
      ) {
        throw new Error("invalid-form");
      }
    } catch {
      diagnostics.push({ file, code: "github-form", message: "invalid structured issue form" });
    }
  }
  if (diagnostics.length > 0) {
    writeDiagnostics(io, diagnostics);
    return 1;
  }
  io.stdout("3 GitHub issue forms valid.\n");
  return 0;
}
