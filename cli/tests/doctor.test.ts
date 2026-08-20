import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";

import { describe, expect, it, vi } from "vitest";

import {
  DOCTOR_STALE_AFTER_DAYS,
  doctorCommand,
  probeDshVersion,
} from "../src/commands/doctor.js";
import { listCommand } from "../src/commands/list.js";
import type { CatalogCommandContext } from "../src/commands/catalog.js";
import type { InstallState, RecoveryRequiredMarker } from "../src/dsh/installState.js";
import type { CatalogSnapshot, PublicCatalogEntry } from "../src/model.js";

function outputHarness(): {
  readonly stdout: (value: string) => void;
  readonly stderr: (value: string) => void;
  readonly output: () => { readonly stdout: string; readonly stderr: string };
} {
  let stdout = "";
  let stderr = "";
  return {
    stdout: (value) => {
      stdout += value;
    },
    stderr: (value) => {
      stderr += value;
    },
    output: () => ({ stdout, stderr }),
  };
}

const installState: InstallState = {
  version: 1,
  installs: [
    {
      id: "zeta",
      profile: "web",
      packageName: "@creator/zeta",
      fingerprint: `sha256:${"a".repeat(64)}`,
      cacheRelativePath: "zeta/fingerprint/zeta.tgz",
      installedAt: "2026-08-15T12:00:00.000Z",
    },
    {
      id: "terminal-only",
      profile: "terminal",
      packageName: "terminal-only",
      fingerprint: `sha256:${"b".repeat(64)}`,
      cacheRelativePath: "terminal-only/fingerprint/terminal-only.tgz",
      installedAt: "2026-08-13T12:00:00.000Z",
    },
    {
      id: "alpha",
      profile: "web",
      packageName: "@creator/alpha",
      fingerprint: `sha256:${"c".repeat(64)}`,
      cacheRelativePath: "alpha/fingerprint/alpha.tgz",
      installedAt: "2026-08-14T12:00:00.000Z",
    },
  ],
};

function catalogEntry(checkedAt: string): PublicCatalogEntry {
  return {
    schemaVersion: 1,
    id: "fixture-plugin",
    name: "Fixture Plugin",
    description: {
      en: "A sufficiently detailed fixture plugin description for doctor checks.",
      evidencePath: "README.md",
    },
    unofficial: true,
    kind: "plugin",
    primaryCategory: "diagnostics-observability",
    tags: ["diagnostics"],
    source: {
      repository: "https://github.com/creator/fixture-plugin",
      repositoryNodeId: "R_fixture",
      subpath: null,
      commit: "a".repeat(40),
    },
    creator: { github: "creator" },
    package: { ecosystem: "npm", name: "fixture-plugin", version: "1.0.0" },
    dsh: { profiles: ["default"], evidencePath: "package.json" },
    repositoryScope: "dedicated",
    popularity: { starsPolicy: "exact-repository", stars: 1 },
    license: { spdx: "MIT" },
    verification: {
      status: "eligible",
      checkedAt,
      repositoryIdentity: "resolved",
      smokeTest: null,
    },
    provenance: { discussion: null, comment: null },
    canonicalKey: "R_fixture:.",
  };
}

function doctorHarness(snapshot: CatalogSnapshot): {
  readonly context: CatalogCommandContext;
  readonly output: () => { readonly stdout: string; readonly stderr: string };
} {
  const io = outputHarness();
  return {
    context: {
      loadCatalog: vi.fn(async () => snapshot),
      stdout: io.stdout,
      stderr: io.stderr,
    },
    output: io.output,
  };
}

describe("catalog-managed list", () => {
  it("filters by profile and renders deterministic catalog-managed state without mutation", async () => {
    const io = outputHarness();
    const resolveHome = vi.fn(() => "/must-not-be-created");
    const readState = vi.fn(async () => installState);

    expect(await listCommand("web", false, {
      resolveHome,
      readState,
      stdout: io.stdout,
      stderr: io.stderr,
    })).toBe(0);

    expect(resolveHome).toHaveBeenCalledOnce();
    expect(readState).toHaveBeenCalledWith("/must-not-be-created");
    expect(io.output()).toEqual({
      stdout:
        "web\talpha\t@creator/alpha\tcatalog-managed\n" +
        "web\tzeta\t@creator/zeta\tcatalog-managed\n",
      stderr: "",
    });
  });

  it("emits a stable JSON zero-state without exposing state or cache paths", async () => {
    const io = outputHarness();

    expect(await listCommand("empty", true, {
      resolveHome: () => "/private/dsh-home",
      readState: async () => installState,
      stdout: io.stdout,
      stderr: io.stderr,
    })).toBe(0);

    expect(io.output()).toEqual({
      stdout: `${JSON.stringify({
        profile: "empty",
        count: 0,
        empty: true,
        installs: [],
      })}\n`,
      stderr: "",
    });
    expect(io.output().stdout).not.toContain("/private/dsh-home");
    expect(io.output().stdout).not.toContain("cacheRelativePath");
  });

  it("sanitizes state-read failures", async () => {
    const io = outputHarness();

    expect(await listCommand(undefined, false, {
      resolveHome: () => "/private/dsh-home",
      readState: async () => {
        throw new Error("token=secret at /private/dsh-home/state.json\n    at stack");
      },
      stdout: io.stdout,
      stderr: io.stderr,
    })).toBe(1);

    expect(io.output()).toEqual({
      stdout: "",
      stderr: "Catalog-managed install state could not be read safely.\n",
    });
  });
});

describe("doctor", () => {
  it("diagnoses unsupported Node, missing dsh and a snapshot stale after 30 days", async () => {
    const test = doctorHarness({
      source: { kind: "snapshot", declaredRevision: "a".repeat(40), pinStatus: "declared-local" },
      entries: [catalogEntry("2026-06-01T00:00:00.000Z")],
      diagnostics: [],
    });

    expect(DOCTOR_STALE_AFTER_DAYS).toBe(30);
    expect(await doctorCommand(test.context, undefined, false, {
      nodeVersion: "18.19.0",
      now: () => new Date("2026-08-16T12:00:00.000Z"),
      probeDsh: async () => ({ status: "missing", version: null }),
    })).toBe(1);

    expect(test.output()).toEqual({
      stdout:
        "node [error]: Node 20 or newer is required\n" +
        "dsh [error]: dsh executable was not found\n" +
        "catalog [error]: catalog has 1 stale entry; freshness threshold is 30 days\n",
      stderr: "",
    });
  });

  it("reports present dsh and an empty valid catalog as healthy stable JSON", async () => {
    const test = doctorHarness({
      source: { kind: "snapshot", declaredRevision: "b".repeat(40), pinStatus: "declared-local" },
      entries: [],
      diagnostics: [],
    });

    expect(await doctorCommand(test.context, undefined, true, {
      nodeVersion: "22.4.0",
      now: () => new Date("2026-08-16T12:00:00.000Z"),
      probeDsh: async () => ({ status: "present", version: "1.2.3" }),
    })).toBe(0);

    expect(test.output()).toEqual({
      stdout: `${JSON.stringify({
        ok: true,
        checks: [
          { name: "node", status: "ok", message: "Node 22.4.0 is supported" },
          { name: "dsh", status: "ok", message: "dsh 1.2.3 is available" },
          { name: "catalog", status: "ok", message: "catalog is valid and empty" },
        ],
      })}\n`,
      stderr: "",
    });
  });

  it("uses literal dsh --version argv with shell disabled and sanitizes captured output", async () => {
    const child = new EventEmitter() as EventEmitter & { stdout: PassThrough };
    child.stdout = new PassThrough();
    const spawn = vi.fn(() => child);

    const probing = probeDshVersion({ spawn: spawn as never });
    child.stdout.write("DeepSeek Harness v2.3.4 token=must-not-leak\n");
    child.emit("close", 0, null);

    await expect(probing).resolves.toEqual({ status: "present", version: "2.3.4" });
    expect(spawn).toHaveBeenCalledWith(
      "dsh",
      ["--version"],
      {
        detached: process.platform !== "win32",
        shell: false,
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
  });

  it("reports a bounded dsh deadline as a sanitized error check", async () => {
    const test = doctorHarness({
      source: { kind: "snapshot", declaredRevision: "c".repeat(40), pinStatus: "declared-local" },
      entries: [],
      diagnostics: [],
    });
    const controller = new AbortController();
    const probeDsh = vi.fn(async () => ({ status: "timeout" as const, version: null }));

    expect(await doctorCommand(test.context, undefined, false, {
      nodeVersion: "22.4.0",
      now: () => new Date("2026-08-16T12:00:00.000Z"),
      probeDsh,
      signal: controller.signal,
      dshTimeoutMs: 25,
      terminationGraceMs: 5,
      reapTimeoutMs: 10,
    })).toBe(1);

    expect(probeDsh).toHaveBeenCalledWith({
      signal: controller.signal,
      timeoutMs: 25,
      terminationGraceMs: 5,
      reapTimeoutMs: 10,
    });
    expect(test.output()).toEqual({
      stdout:
        "node [ok]: Node 22.4.0 is supported\n" +
        "dsh [error]: dsh version probe timed out safely\n" +
        "catalog [ok]: catalog is valid and empty\n",
      stderr: "",
    });
  });

  it("never emits raw paths, tokens or stacks when probes fail", async () => {
    const io = outputHarness();
    const context: CatalogCommandContext = {
      loadCatalog: async () => {
        throw new Error("token=secret at /private/catalog\n    at stack");
      },
      stdout: io.stdout,
      stderr: io.stderr,
    };

    expect(await doctorCommand(context, undefined, false, {
      nodeVersion: "not-a-version /private/node",
      now: () => new Date("2026-08-16T12:00:00.000Z"),
      probeDsh: async () => {
        throw new Error("token=secret at /private/dsh\n    at stack");
      },
    })).toBe(1);

    expect(io.output()).toEqual({
      stdout:
        "node [error]: Node version could not be determined\n" +
        "dsh [error]: dsh version probe failed safely\n" +
        "catalog [error]: catalog could not be loaded safely\n",
      stderr: "",
    });
    expect(io.output().stdout).not.toMatch(/secret|\/private|stack/iu);
  });

  it.each([
    [true, "recovery is pending; DSH process tree is still alive"],
    [false, "recovery is pending; DSH process tree is dead and explicit recovery is required"],
  ] as const)("reports pending recovery with tree alive=%s without mutating", async (
    alive,
    message,
  ) => {
    const recoveryRequired: RecoveryRequiredMarker = {
      status: "recovery_required",
      profile: "web",
      fencingToken: 5,
      processTree: {
        pid: 5_555,
        processGroupId: 5_555,
        treeIdentity: "linux:555",
        processStartIdentity: "linux:555",
        platform: "linux",
      },
      artifact: null,
      transaction: {
        profile: "web",
        fencingToken: 5,
        existed: true,
        journalRelativePath: "profiles/.dsh-plugins-transaction-web-doctor.json",
        backupRelativePath: "profiles/.dsh-plugins-backup-web-doctor",
      },
    };
    const test = doctorHarness({
      source: { kind: "snapshot", declaredRevision: "d".repeat(40), pinStatus: "declared-local" },
      entries: [],
      diagnostics: [],
    });
    const readState = vi.fn(async () => ({
      version: 1 as const,
      generation: 1,
      fencingToken: 5,
      installs: [],
      recoveryRequired,
    }));
    const isProcessTreeAlive = vi.fn(async () => alive);

    expect(await doctorCommand(test.context, undefined, false, {
      nodeVersion: "22.4.0",
      now: () => new Date("2026-08-16T12:00:00.000Z"),
      probeDsh: async () => ({ status: "present", version: "1.2.3" }),
      resolveHome: () => "/private/dsh-home",
      readState,
      isProcessTreeAlive,
    })).toBe(1);

    expect(readState).toHaveBeenCalledWith("/private/dsh-home");
    expect(isProcessTreeAlive).toHaveBeenCalledWith(recoveryRequired.processTree);
    expect(test.output().stdout).toContain(`recovery [error]: ${message}\n`);
    expect(test.output().stdout).not.toContain("/private/dsh-home");
  });
});
