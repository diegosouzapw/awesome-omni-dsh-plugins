import type { CatalogSelection, PublicCatalogEntry } from "../model.js";
import type { CatalogCommandContext } from "./catalog.js";
import { writeDiagnostics } from "./catalog.js";

function packageDisplay(entry: PublicCatalogEntry): string {
  if (entry.package.ecosystem === "npm") {
    return `${entry.package.name}@${entry.package.version}`;
  }
  const subpath = entry.source.subpath === null ? "" : `#${entry.source.subpath}`;
  return `${entry.source.repository}@${entry.source.commit}${subpath}`;
}

function verificationDisplay(entry: PublicCatalogEntry): string {
  if (entry.verification.status === "verified") {
    return "verified (installation-tested)";
  }
  if (entry.verification.status === "eligible") {
    return "eligible (not installation-tested)";
  }
  return entry.verification.status;
}

function starsDisplay(entry: PublicCatalogEntry): string {
  if (entry.popularity.starsPolicy === "undefined-parent-repository") {
    return "undefined (parent repository)";
  }
  return String(entry.popularity.stars);
}

export async function infoCommand(
  context: CatalogCommandContext,
  id: string,
  selection: CatalogSelection | undefined,
  json: boolean,
): Promise<number> {
  const snapshot = await context.loadCatalog(selection);
  if (snapshot.diagnostics.length > 0) {
    writeDiagnostics(context, snapshot.diagnostics);
    return 1;
  }
  const entry = snapshot.entries.find((candidate) => candidate.id === id);
  if (entry === undefined) {
    context.stderr(`Plugin not found: ${id}\n`);
    return 1;
  }
  if (json) {
    context.stdout(`${JSON.stringify(entry)}\n`);
    return 0;
  }
  context.stdout(
    [
      `Name: ${entry.name}`,
      `ID: ${entry.id}`,
      `Creator: @${entry.creator.github}`,
      `Category: ${entry.primaryCategory}`,
      `Package: ${packageDisplay(entry)}`,
      `License: ${entry.license.spdx}`,
      `Verification: ${verificationDisplay(entry)}`,
      `Stars: ${starsDisplay(entry)}`,
      `Repository: ${entry.source.repository}`,
      `Commit: ${entry.source.commit}`,
      "",
    ].join("\n"),
  );
  return 0;
}
