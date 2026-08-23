import { readFileSync } from "node:fs";

import { Command, CommanderError } from "commander";

import { loadDefaultCatalog } from "./catalogSource.js";
import { sanitizedErrorMessage } from "./errors.js";
import {
  docsCheckCommand,
  githubFormsCheckCommand,
  validateCatalogCommand,
} from "./commands/catalog.js";
import { addCommand } from "./commands/add.js";
import { doctorCommand, type DoctorRuntimeDependencies } from "./commands/doctor.js";
import { infoCommand } from "./commands/info.js";
import { listCommand, type ListCommandDependencies } from "./commands/list.js";
import { removeCommand } from "./commands/remove.js";
import { searchCommand } from "./commands/search.js";
import { createCommunitySearch, discoverCommand } from "./commands/discover.js";
import { updateCommand } from "./commands/update.js";
import {
  recoverPluginMutation,
  type MutationDependencies,
} from "./commands/mutate.js";
import type { CatalogSelection, CatalogSnapshot } from "./model.js";

export interface CliDependencies {
  loadCatalog(selection?: CatalogSelection): Promise<CatalogSnapshot>;
  stdout(value: string): void;
  stderr(value: string): void;
  readonly mutationDependencies?: Partial<MutationDependencies>;
  readonly listDependencies?: Partial<ListCommandDependencies>;
  readonly doctorRuntime?: Partial<DoctorRuntimeDependencies>;
}

const defaultDependencies: CliDependencies = {
  loadCatalog: loadDefaultCatalog,
  stdout: (value) => process.stdout.write(value),
  stderr: (value) => process.stderr.write(value),
};

interface CatalogOptions {
  catalog?: string;
  revision?: string;
  json?: boolean;
}

interface MutationOptions extends CatalogOptions {
  profile: string;
  dryRun?: boolean;
  allowCodeExecution?: boolean;
}

function selection(options: CatalogOptions): CatalogSelection | undefined {
  if (options.catalog === undefined && options.revision === undefined) {
    return undefined;
  }
  return {
    ...(options.catalog === undefined ? {} : { root: options.catalog }),
    ...(options.revision === undefined ? {} : { revision: options.revision }),
  };
}

function addCatalogOptions(command: Command): Command {
  return command
    .option(
      "--catalog <path-or-url>",
      "local catalog directory, snapshot file, or pinned public snapshot URL",
    )
    .option("--revision <sha>", "exact 40-character snapshot revision")
    .option("--json", "emit stable JSON output");
}

function addMutationOptions(command: Command): Command {
  return addCatalogOptions(command)
    .requiredOption("--profile <name>", "DSH profile to mutate")
    .option("--dry-run", "show the verified plan without files or subprocesses")
    .option(
      "--allow-code-execution",
      "consent to DSH/pnpm lifecycle code (native Windows disabled; use WSL)",
    );
}

// The package manifest is the only place the released version exists. Restating it in source
// let 1.0.0 ship a binary that still announced itself as 0.1.0, and npm versions are immutable:
// such a release can never be corrected, only superseded. Both the bundled entrypoint
// (dist/bin.js) and this module sit exactly one directory below the package root, so the same
// relative path resolves in the published artifact and under the test runner.
function publishedVersion(): string {
  const manifest = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  ) as { version: string };
  return manifest.version;
}

export async function runCli(
  argv: readonly string[],
  dependencies: CliDependencies = defaultDependencies,
): Promise<number> {
  let result = 0;
  const program = new Command()
    .name("dsh-plugins")
    .version(publishedVersion())
    .description("Unofficial catalog and safe installer for DeepSeek Harness plugins.")
    .addHelpText(
      "after",
      "\nUnofficial community project. Not affiliated with, endorsed by, or sponsored by DeepSeek.\n" +
        "Native Windows add/update/remove with code execution are disabled; use WSL.\n" +
        "Dry-run and read-only catalog/search/info/list/doctor commands remain available.\n" +
        "Native Windows recovery markers require documented manual recovery.\n",
    )
    .configureOutput({
      writeOut: dependencies.stdout,
      writeErr: dependencies.stderr,
      outputError: (value, write) => write(value),
    })
    .exitOverride();

  const catalog = program.command("catalog").description("validate the public catalog surfaces");
  addCatalogOptions(catalog.command("validate").description("validate catalog YAML and semantics"))
    .action(async (options: CatalogOptions) => {
      result = await validateCatalogCommand(dependencies, selection(options), options.json === true);
    });
  catalog.command("docs-check")
    .description("check required public catalog documentation")
    .argument("[root]", "public repository root", ".")
    .option("--skip-count", "skip the exact README entry-count assertion (pull-request mode)")
    .action(async (root: string, options: { skipCount?: boolean }) => {
      result = await docsCheckCommand(dependencies, root, options);
    });
  catalog.command("github-forms-check")
    .description("check structured public GitHub issue forms")
    .argument("[root]", "public repository root", ".")
    .action(async (root: string) => {
      result = await githubFormsCheckCommand(dependencies, root);
    });

  addCatalogOptions(program.command("search").description("search public catalog fields locally")
    .argument("<query...>", "search terms"))
    .action(async (query: string[], options: CatalogOptions) => {
      result = await searchCommand(dependencies, query.join(" "), selection(options), options.json === true);
    });

  addCatalogOptions(program.command("discover")
    .description("find plugins: curated catalog first, then a live dsh-plugin topic search")
    .argument("<query...>", "capability keywords")
    .option("--limit <n>", "max results per tier", "8")
    .option("--offline", "skip the live community tier"))
    .action(async (query: string[], options: CatalogOptions & { limit?: string; offline?: boolean }) => {
      const limit = Math.max(1, Math.min(Number(options.limit ?? 8) || 8, 20));
      const selected = selection(options);
      result = await discoverCommand(dependencies, query.join(" "), {
        community: createCommunitySearch(),
        json: options.json === true,
        limit,
        offline: options.offline === true,
        ...(selected === undefined ? {} : { selection: selected }),
      });
    });

  addCatalogOptions(program.command("info").description("show one public catalog entry")
    .argument("<id>", "canonical plugin ID"))
    .action(async (id: string, options: CatalogOptions) => {
      result = await infoCommand(dependencies, id, selection(options), options.json === true);
    });

  for (const operation of ["add", "update"] as const) {
    addMutationOptions(program.command(operation)
      .description(`${operation} one catalog plugin through official DSH delegation`)
      .argument("<id>", "canonical plugin ID"))
      .action(async (id: string, options: MutationOptions) => {
        const snapshot = await dependencies.loadCatalog(selection(options));
        const entry = snapshot.entries.find((candidate) => candidate.id === id);
        if (entry === undefined) {
          dependencies.stderr(`Plugin not found: ${id}\n`);
          result = 1;
          return;
        }
        const command = operation === "add" ? addCommand : updateCommand;
        result = await command(
          entry,
          options.profile,
          options.dryRun === true,
          options.allowCodeExecution === true,
          {
            stdout: dependencies.stdout,
            stderr: dependencies.stderr,
            ...dependencies.mutationDependencies,
          },
        );
      });
  }

  addMutationOptions(program.command("remove")
    .description("remove one catalog-managed plugin through official DSH delegation")
    .argument("<id>", "canonical plugin ID"))
    .action(async (id: string, options: MutationOptions) => {
      const snapshot = await dependencies.loadCatalog(selection(options));
      const entry = snapshot.entries.find((candidate) => candidate.id === id);
      result = await removeCommand(
        id,
        entry,
        options.profile,
        options.dryRun === true,
        options.allowCodeExecution === true,
        {
          stdout: dependencies.stdout,
          stderr: dependencies.stderr,
          ...dependencies.mutationDependencies,
        },
      );
    });

  program.command("recover")
    .description("recover a retained POSIX mutation; native Windows recovery remains manual")
    .action(async () => {
      result = await recoverPluginMutation({
        stdout: dependencies.stdout,
        stderr: dependencies.stderr,
        ...dependencies.mutationDependencies,
      });
    });

  program.command("list")
    .description("list catalog-managed installs without modifying profiles")
    .option("--profile <name>", "filter by DSH profile")
    .option("--json", "emit stable JSON output")
    .action(async (options: { profile?: string; json?: boolean }) => {
      result = await listCommand(
        options.profile,
        options.json === true,
        {
          stdout: dependencies.stdout,
          stderr: dependencies.stderr,
          ...dependencies.listDependencies,
        },
      );
    });

  addCatalogOptions(program.command("doctor")
    .description("run read-only Node, DSH, native Windows policy and catalog diagnostics"))
    .action(async (options: CatalogOptions) => {
      result = await doctorCommand(
        dependencies,
        selection(options),
        options.json === true,
        dependencies.doctorRuntime,
      );
    });

  try {
    await program.parseAsync(["node", "dsh-plugins", ...argv]);
  } catch (error) {
    if (error instanceof CommanderError) {
      return error.exitCode;
    }
    dependencies.stderr(`${sanitizedErrorMessage(error)}\n`);
    dependencies.stderr("Command failed safely; no changes were made.\n");
    return 1;
  }
  return result;
}
