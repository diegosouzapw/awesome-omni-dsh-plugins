import type { PublicCatalogEntry } from "../model.js";
import { executePluginMutation, type MutationDependencies } from "./mutate.js";

export function updateCommand(
  entry: PublicCatalogEntry,
  profile: string,
  dryRun: boolean,
  allowCodeExecution: boolean,
  dependencies?: Partial<MutationDependencies>,
): Promise<number> {
  return executePluginMutation(
    { operation: "update", entry, profile, dryRun, allowCodeExecution },
    dependencies,
  );
}
