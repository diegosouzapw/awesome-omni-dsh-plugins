import type { CommandIo } from "./catalog.js";
import {
  readInstallState,
  resolveDshHome,
  type InstalledPlugin,
  type InstallState,
} from "../dsh/installState.js";
import { assertSafeProfileName } from "../dsh/paths.js";

export interface ListCommandDependencies extends CommandIo {
  readonly resolveHome: () => string;
  readonly readState: (home: string) => Promise<InstallState>;
}

export interface ListedCatalogInstall {
  readonly profile: string;
  readonly id: string;
  readonly packageName: string;
  readonly fingerprint: string;
  readonly installedAt: string;
  readonly status: "catalog-managed";
}

const defaultDependencies: ListCommandDependencies = {
  resolveHome: resolveDshHome,
  readState: readInstallState,
  stdout: (value) => process.stdout.write(value),
  stderr: (value) => process.stderr.write(value),
};

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareInstalls(left: InstalledPlugin, right: InstalledPlugin): number {
  return compareText(left.profile, right.profile) || compareText(left.id, right.id);
}

function listedInstall(install: InstalledPlugin): ListedCatalogInstall {
  return {
    profile: install.profile,
    id: install.id,
    packageName: install.packageName,
    fingerprint: install.fingerprint,
    installedAt: install.installedAt,
    status: "catalog-managed",
  };
}

export async function listCommand(
  profile: string | undefined,
  json: boolean,
  overrides: Partial<ListCommandDependencies> = {},
): Promise<number> {
  const dependencies: ListCommandDependencies = { ...defaultDependencies, ...overrides };
  if (profile !== undefined) {
    try {
      assertSafeProfileName(profile);
    } catch {
      dependencies.stderr("Profile name is unsafe.\n");
      return 1;
    }
  }

  let state: InstallState;
  try {
    state = await dependencies.readState(dependencies.resolveHome());
  } catch {
    dependencies.stderr("Catalog-managed install state could not be read safely.\n");
    return 1;
  }

  const installs = [...state.installs]
    .filter((install) => profile === undefined || install.profile === profile)
    .sort(compareInstalls);
  if (json) {
    dependencies.stdout(`${JSON.stringify({
      profile: profile ?? null,
      count: installs.length,
      empty: installs.length === 0,
      installs: installs.map(listedInstall),
    })}\n`);
    return 0;
  }

  if (installs.length === 0) {
    dependencies.stdout(
      profile === undefined
        ? "No catalog-managed plugins installed.\n"
        : `No catalog-managed plugins installed for profile "${profile}".\n`,
    );
    return 0;
  }

  for (const install of installs) {
    dependencies.stdout(
      `${install.profile}\t${install.id}\t${install.packageName}\tcatalog-managed\n`,
    );
  }
  return 0;
}
