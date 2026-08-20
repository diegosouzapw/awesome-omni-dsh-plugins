import type { PublicCatalogEntry } from "../model.js";
import { executePluginMutation, type MutationDependencies } from "./mutate.js";

export function removeCommand(
  id: string,
  entry: PublicCatalogEntry | undefined,
  profile: string,
  dryRun: boolean,
  allowCodeExecution: boolean,
  dependencies?: Partial<MutationDependencies>,
): Promise<number> {
  return executePluginMutation(
    { operation: "remove", id, ...(entry === undefined ? {} : { entry }), profile, dryRun, allowCodeExecution },
    dependencies,
  );
}
