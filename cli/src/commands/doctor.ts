import { spawn as nodeSpawn } from "node:child_process";

import {
  DSH_REAP_TIMEOUT_MS,
  DSH_TERMINATION_GRACE_MS,
  resolveChildDeadlinePolicy,
  waitForChildWithDeadline,
  type ChildProcessDeadlineOptions,
  isDshProcessTreeAlive,
} from "../dsh/runDsh.js";
import { readInstallState, resolveDshHome, type InstallState } from "../dsh/installState.js";
import {
  readMutationRecoveryJournal,
  type MutationRecoveryJournal,
} from "../dsh/mutationRecoveryJournal.js";
import type { CatalogSelection, CatalogSnapshot, PublicCatalogEntry } from "../model.js";
import type { CatalogCommandContext } from "./catalog.js";

export const DOCTOR_STALE_AFTER_DAYS = 30;
export const DSH_VERSION_TIMEOUT_MS = 5_000;

const MINIMUM_NODE_MAJOR = 20;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1_000;
const SAFE_SEMVER = /^v?([0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?)$/u;
const EMBEDDED_SEMVER = /(?:^|[^0-9A-Za-z])v?([0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?)(?=$|[^0-9A-Za-z.-])/u;

export interface DshVersionProbe {
  readonly status: "present" | "missing" | "timeout" | "aborted" | "failed";
  readonly version: string | null;
}

export interface DshVersionProbeDependencies extends ChildProcessDeadlineOptions {
  readonly spawn?: typeof nodeSpawn;
}

export interface DoctorDshProbeOptions {
  readonly signal?: AbortSignal;
  readonly timeoutMs: number;
  readonly terminationGraceMs: number;
  readonly reapTimeoutMs: number;
}

export interface DoctorRuntimeDependencies {
  readonly platform: NodeJS.Platform;
  readonly nodeVersion: string;
  readonly now: () => Date;
  readonly probeDsh: (options: DoctorDshProbeOptions) => Promise<DshVersionProbe>;
  readonly signal: AbortSignal | undefined;
  readonly dshTimeoutMs: number;
  readonly terminationGraceMs: number;
  readonly reapTimeoutMs: number;
  readonly resolveHome: () => string;
  readonly readState: (home: string) => Promise<InstallState>;
  readonly readRecoveryJournal: (home: string) => Promise<MutationRecoveryJournal | null>;
  readonly isProcessTreeAlive: typeof isDshProcessTreeAlive;
}

export type DoctorCheckName = "node" | "dsh" | "platform" | "recovery" | "catalog";
export type DoctorCheckStatus = "ok" | "error";

export interface DoctorCheck {
  readonly name: DoctorCheckName;
  readonly status: DoctorCheckStatus;
  readonly message: string;
}

const defaultRuntime: DoctorRuntimeDependencies = {
  platform: process.platform,
  nodeVersion: process.versions.node,
  now: () => new Date(),
  probeDsh: probeDshVersion,
  signal: undefined,
  dshTimeoutMs: DSH_VERSION_TIMEOUT_MS,
  terminationGraceMs: DSH_TERMINATION_GRACE_MS,
  reapTimeoutMs: DSH_REAP_TIMEOUT_MS,
  resolveHome: resolveDshHome,
  readState: readInstallState,
  readRecoveryJournal: readMutationRecoveryJournal,
  isProcessTreeAlive: isDshProcessTreeAlive,
};

function safeExactVersion(value: string | null): string | null {
  if (value === null) {
    return null;
  }
  return SAFE_SEMVER.exec(value)?.[1] ?? null;
}

function capturedVersion(output: string): string | null {
  return EMBEDDED_SEMVER.exec(output)?.[1] ?? null;
}

export async function probeDshVersion(
  dependencies: DshVersionProbeDependencies = {},
): Promise<DshVersionProbe> {
  const policy = resolveChildDeadlinePolicy(dependencies, DSH_VERSION_TIMEOUT_MS);
  if (policy.signal?.aborted === true) {
    return { status: "aborted", version: null };
  }
  const spawn = dependencies.spawn ?? nodeSpawn;
  let child: ReturnType<typeof nodeSpawn>;
  try {
    child = spawn(
      "dsh",
      ["--version"],
      {
        detached: policy.platform !== "win32",
        shell: false,
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
  } catch {
    return { status: "failed", version: null };
  }

  let output = "";
  child.stdout?.on("data", (chunk: Buffer | string) => {
    if (output.length >= 4_096) return;
    output += String(chunk).slice(0, 4_096 - output.length);
  });
  const outcome = await waitForChildWithDeadline(child, policy);
  if (outcome.status === "spawn-error") {
    return {
      status: outcome.errorCode === "ENOENT" ? "missing" : "failed",
      version: null,
    };
  }
  if (outcome.status === "terminated") {
    return {
      status: outcome.reason === "tree-alive" ? "failed" : outcome.reason,
      version: null,
    };
  }
  if (outcome.code !== 0) {
    return { status: "failed", version: null };
  }
  return { status: "present", version: capturedVersion(output) };
}

function nodeCheck(nodeVersion: string): DoctorCheck {
  const version = safeExactVersion(nodeVersion);
  if (version === null) {
    return { name: "node", status: "error", message: "Node version could not be determined" };
  }
  const major = Number.parseInt(version.split(".")[0] ?? "", 10);
  if (major < MINIMUM_NODE_MAJOR) {
    return { name: "node", status: "error", message: "Node 20 or newer is required" };
  }
  return { name: "node", status: "ok", message: `Node ${version} is supported` };
}

async function dshCheck(probe: () => Promise<DshVersionProbe>): Promise<DoctorCheck> {
  try {
    const result = await probe();
    if (result.status === "missing") {
      return { name: "dsh", status: "error", message: "dsh executable was not found" };
    }
    if (result.status === "timeout") {
      return { name: "dsh", status: "error", message: "dsh version probe timed out safely" };
    }
    if (result.status === "aborted") {
      return { name: "dsh", status: "error", message: "dsh version probe was cancelled safely" };
    }
    if (result.status === "failed") {
      return { name: "dsh", status: "error", message: "dsh version probe failed safely" };
    }
    const version = safeExactVersion(result.version);
    return version === null
      ? { name: "dsh", status: "ok", message: "dsh is available (version unavailable)" }
      : { name: "dsh", status: "ok", message: `dsh ${version} is available` };
  } catch {
    return { name: "dsh", status: "error", message: "dsh version probe failed safely" };
  }
}

function isStale(entry: PublicCatalogEntry, now: Date): boolean {
  const checkedAt = Date.parse(entry.verification.checkedAt);
  if (!Number.isFinite(checkedAt)) {
    return true;
  }
  const age = now.getTime() - checkedAt;
  return entry.verification.status === "stale" ||
    age > DOCTOR_STALE_AFTER_DAYS * MILLISECONDS_PER_DAY;
}

function catalogCheck(snapshot: CatalogSnapshot, now: Date): DoctorCheck {
  if (snapshot.diagnostics.length > 0) {
    const count = snapshot.diagnostics.length;
    return {
      name: "catalog",
      status: "error",
      message: `catalog validation failed with ${count} diagnostic${count === 1 ? "" : "s"}`,
    };
  }
  if (snapshot.entries.length === 0) {
    return { name: "catalog", status: "ok", message: "catalog is valid and empty" };
  }

  const staleCount = snapshot.entries.filter((entry) => isStale(entry, now)).length;
  if (staleCount > 0) {
    return {
      name: "catalog",
      status: "error",
      message:
        `catalog has ${staleCount} stale ${staleCount === 1 ? "entry" : "entries"}; ` +
        `freshness threshold is ${DOCTOR_STALE_AFTER_DAYS} days`,
    };
  }
  return {
    name: "catalog",
    status: "ok",
    message: `catalog is valid and fresh with ${snapshot.entries.length} ` +
      `${snapshot.entries.length === 1 ? "entry" : "entries"}`,
  };
}

async function loadCatalogCheck(
  context: CatalogCommandContext,
  selection: CatalogSelection | undefined,
  now: () => Date,
): Promise<DoctorCheck> {
  try {
    return catalogCheck(await context.loadCatalog(selection), now());
  } catch {
    return { name: "catalog", status: "error", message: "catalog could not be loaded safely" };
  }
}

async function recoveryCheck(runtime: DoctorRuntimeDependencies): Promise<DoctorCheck | null> {
  let primary: MutationRecoveryJournal | null;
  try {
    primary = await runtime.readRecoveryJournal(runtime.resolveHome());
  } catch {
    return {
      name: "recovery",
      status: "error",
      message: "primary recovery journal could not be inspected safely",
    };
  }
  if (primary !== null) {
    if (primary.phase === "completed" && primary.status === "completed") {
      return {
        name: "recovery",
        status: "error",
        message: "recovery completed; final journal cleanup is pending",
      };
    }
    if (primary.processTree === undefined) {
      return {
        name: "recovery",
        status: "error",
        message: "recovery is pending; process identity is incomplete and manual recovery is required",
      };
    }
    if (runtime.platform === "win32" || primary.processTree.platform === "win32") {
      return {
        name: "recovery",
        status: "error",
        message:
          "native Windows recovery remains fail-closed; use WSL or documented manual recovery",
      };
    }
    try {
      const alive = await runtime.isProcessTreeAlive(primary.processTree);
      return {
        name: "recovery",
        status: "error",
        message: alive
          ? "recovery is pending; DSH process tree is still alive"
          : "recovery is pending; DSH process tree is dead and explicit recovery is required",
      };
    } catch {
      return {
        name: "recovery",
        status: "error",
        message: "primary recovery journal could not be inspected safely",
      };
    }
  }
  try {
    const marker = (await runtime.readState(runtime.resolveHome())).recoveryRequired;
    if (marker === undefined) return null;
    if (runtime.platform === "win32" || marker.processTree.platform === "win32") {
      return {
        name: "recovery",
        status: "error",
        message:
          "native Windows recovery remains fail-closed; use WSL or documented manual recovery",
      };
    }
    const alive = await runtime.isProcessTreeAlive(marker.processTree);
    return {
      name: "recovery",
      status: "error",
      message: alive
        ? "recovery is pending; DSH process tree is still alive"
        : "recovery is pending; DSH process tree is dead and explicit recovery is required",
    };
  } catch {
    return {
      name: "recovery",
      status: "error",
      message: "recovery state could not be inspected safely",
    };
  }
}

export async function doctorCommand(
  context: CatalogCommandContext,
  selection: CatalogSelection | undefined,
  json: boolean,
  overrides: Partial<DoctorRuntimeDependencies> = {},
): Promise<number> {
  const runtime: DoctorRuntimeDependencies = { ...defaultRuntime, ...overrides };
  const probeOptions: DoctorDshProbeOptions = {
    ...(runtime.signal === undefined ? {} : { signal: runtime.signal }),
    timeoutMs: runtime.dshTimeoutMs,
    terminationGraceMs: runtime.terminationGraceMs,
    reapTimeoutMs: runtime.reapTimeoutMs,
  };
  const recovery = await recoveryCheck(runtime);
  const checks: readonly DoctorCheck[] = [
    nodeCheck(runtime.nodeVersion),
    await dshCheck(() => runtime.probeDsh(probeOptions)),
    ...(runtime.platform === "win32"
      ? [{
          name: "platform" as const,
          status: "error" as const,
          message: "native Windows plugin mutations are disabled; use WSL",
        }]
      : []),
    ...(recovery === null ? [] : [recovery]),
    await loadCatalogCheck(context, selection, runtime.now),
  ];
  const ok = checks.every((check) => check.status === "ok");

  if (json) {
    context.stdout(`${JSON.stringify({ ok, checks })}\n`);
  } else {
    for (const check of checks) {
      context.stdout(`${check.name} [${check.status}]: ${check.message}\n`);
    }
  }
  return ok ? 0 : 1;
}
