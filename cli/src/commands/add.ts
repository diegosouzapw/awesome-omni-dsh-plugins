import type { PublicCatalogEntry } from "../model.js";
import { executePluginMutation, type MutationDependencies } from "./mutate.js";

export function addCommand(
  entry: PublicCatalogEntry,
  profile: string,
  dryRun: boolean,
  allowCodeExecution: boolean,
  dependencies?: Partial<MutationDependencies>,
): Promise<number> {
  return executePluginMutation(
    { operation: "add", entry, profile, dryRun, allowCodeExecution },
    dependencies,
  );
}
