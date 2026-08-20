import type { CatalogSelection, PublicCatalogEntry } from "../model.js";
import type { CatalogCommandContext } from "./catalog.js";
import { writeDiagnostics } from "./catalog.js";

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
    entry.license.spdx,
    entry.verification.status,
  ].join(" ").normalize("NFKC").toLocaleLowerCase("en-US");
}

export async function searchCommand(
  context: CatalogCommandContext,
  query: string,
  selection: CatalogSelection | undefined,
  json: boolean,
): Promise<number> {
  const snapshot = await context.loadCatalog(selection);
  if (snapshot.diagnostics.length > 0) {
    writeDiagnostics(context, snapshot.diagnostics);
    return 1;
  }
  const queryTokens = tokens(query);
  const matches = snapshot.entries
    .filter((entry) => queryTokens.every((token) => searchable(entry).includes(token)))
    .sort((left, right) => left.id.localeCompare(right.id));
  if (json) {
    context.stdout(`${JSON.stringify(matches)}\n`);
  } else if (matches.length === 0) {
    context.stdout("No plugins found.\n");
  } else {
    for (const entry of matches) {
      context.stdout(`${entry.id}\t${entry.name}\t@${entry.creator.github}\t${entry.verification.status}\n`);
    }
  }
  return 0;
}
