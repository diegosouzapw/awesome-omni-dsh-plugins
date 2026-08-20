import { spawn as nodeSpawn, type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

import { CliSafetyError } from "../errors.js";

export const DSH_MUTATION_TIMEOUT_MS = 120_000;
export const DSH_TERMINATION_GRACE_MS = 1_000;
export const DSH_REAP_TIMEOUT_MS = 5_000;

const MAX_TIMER_MS = 2_147_483_647;
const WINDOWS_TREE_OUTPUT_BYTES = 64 * 1024;
const WINDOWS_TREE_TIMEOUT_MS = 2_000;

export type ChildTerminationReason = "timeout" | "aborted" | "tree-alive";
export type ProcessSignalSender = (pid: number, signal: NodeJS.Signals) => unknown;

export interface WindowsProcessIdentity {
  readonly pid: number;
  readonly creationIdentity: string;
}

export interface DshProcessTreeIdentity {
  readonly pid: number;
  readonly processGroupId: number | null;
  readonly treeIdentity: string;
  readonly processStartIdentity: string | null;
  readonly platform: NodeJS.Platform;
  readonly members?: readonly WindowsProcessIdentity[];
}

export interface ProcessTreeInspectionDependencies {
  readonly snapshotWindowsTree?: (rootPid: number) => Promise<readonly WindowsProcessIdentity[]>;
}

export interface ChildProcessDeadlineOptions extends ProcessTreeInspectionDependencies {
  readonly signal?: AbortSignal;
  readonly timeoutMs?: number;
  readonly terminationGraceMs?: number;
  readonly reapTimeoutMs?: number;
  readonly platform?: NodeJS.Platform;
  readonly killProcess?: ProcessSignalSender;
  readonly taskkillSpawn?: typeof nodeSpawn;
}

export interface ResolvedChildDeadlinePolicy {
  readonly signal: AbortSignal | undefined;
  readonly timeoutMs: number;
  readonly terminationGraceMs: number;
  readonly reapTimeoutMs: number;
  readonly platform: NodeJS.Platform;
  readonly killProcess: ProcessSignalSender;
  readonly taskkillSpawn: typeof nodeSpawn;
}

export type ChildProcessOutcome =
  | {
      readonly status: "exited";
      readonly code: number | null;
      readonly signal: NodeJS.Signals | null;
    }
  | {
      readonly status: "spawn-error";
      readonly errorCode: string | null;
    }
  | {
      readonly status: "terminated";
      readonly reason: ChildTerminationReason;
      readonly reaped: boolean;
    };

export class DshDeadlineConfigurationError extends CliSafetyError {
  constructor() {
    super("dsh subprocess deadline configuration is invalid");
    this.name = "DshDeadlineConfigurationError";
  }
}

export class DshExecutionUncertainError extends CliSafetyError {
  readonly reason: ChildTerminationReason;
  readonly ambiguous = true;
  readonly recoveryRequired = true;
  readonly reaped: boolean;
  readonly processTree: DshProcessTreeIdentity | null;

  constructor(
    reason: ChildTerminationReason,
    reaped: boolean,
    processTree: DshProcessTreeIdentity | null = null,
  ) {
    super(
      reason === "timeout"
        ? "dsh execution timed out; result is ambiguous; recovery required"
        : reason === "aborted"
          ? "dsh execution was aborted; result is ambiguous; recovery required"
          : "dsh process tree remains alive; result is ambiguous; recovery required",
    );
    this.name = "DshExecutionUncertainError";
    this.reason = reason;
    this.reaped = reaped;
    this.processTree = processTree;
  }
}

export interface RunDshDependencies extends ChildProcessDeadlineOptions {
  readonly spawn?: typeof nodeSpawn;
  readonly env?: NodeJS.ProcessEnv;
  readonly identifyProcessTree?: (
    pid: number,
    platform: NodeJS.Platform,
  ) => Promise<string>;
  readonly onSpawn?: (identity: DshProcessTreeIdentity) => Promise<void>;
}

function finiteDuration(value: number | undefined, fallback: number, allowZero: boolean): number {
  const duration = value ?? fallback;
  if (
    !Number.isFinite(duration) ||
    duration > MAX_TIMER_MS ||
    (allowZero ? duration < 0 : duration <= 0)
  ) {
    throw new DshDeadlineConfigurationError();
  }
  return duration;
}

export function resolveChildDeadlinePolicy(
  options: ChildProcessDeadlineOptions,
  defaultTimeoutMs: number,
): ResolvedChildDeadlinePolicy {
  return {
    signal: options.signal,
    timeoutMs: finiteDuration(options.timeoutMs, defaultTimeoutMs, false),
    terminationGraceMs: finiteDuration(
      options.terminationGraceMs,
      DSH_TERMINATION_GRACE_MS,
      true,
    ),
    reapTimeoutMs: finiteDuration(options.reapTimeoutMs, DSH_REAP_TIMEOUT_MS, false),
    platform: options.platform ?? process.platform,
    killProcess: options.killProcess ?? ((pid, signal) => process.kill(pid, signal)),
    taskkillSpawn: options.taskkillSpawn ?? nodeSpawn,
  };
}

async function defaultProcessTreeIdentity(
  pid: number,
  platform: NodeJS.Platform,
): Promise<string> {
  if (platform === "linux") {
    try {
      const source = await readFile(`/proc/${pid}/stat`, "utf8");
      const commandEnd = source.lastIndexOf(")");
      const fields = commandEnd < 0 ? [] : source.slice(commandEnd + 1).trim().split(/\s+/u);
      const startTicks = fields[19];
      if (startTicks !== undefined && /^\d+$/u.test(startTicks)) return `linux:${startTicks}`;
    } catch {
      // A bounded opaque identity is safer than exposing process inspection failures.
    }
  }
  return `${platform}:${pid}:unknown`;
}

const WINDOWS_TREE_SCRIPT = [
  "$root=[int]$env:DSH_ROOT_PID",
  "$all=@(Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,CreationDate)",
  "$front=@($root)",
  "$seen=@{}",
  "$out=@()",
  "while($front.Count -gt 0){$next=@();foreach($id in $front){foreach($p in $all){if(([int]$p.ProcessId -eq $id)-or([int]$p.ParentProcessId -eq $id)){if(-not $seen.ContainsKey([string]$p.ProcessId)){$seen[[string]$p.ProcessId]=$true;$out+=@{pid=[int]$p.ProcessId;creationIdentity=[string]$p.CreationDate};$next+=[int]$p.ProcessId}}}};$front=$next}",
  "$out | ConvertTo-Json -Compress",
].join(";");

async function defaultWindowsTreeSnapshot(rootPid: number): Promise<readonly WindowsProcessIdentity[]> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let outputBytes = 0;
    const chunks: Buffer[] = [];
    let child: ChildProcess;
    try {
      child = nodeSpawn(
        "powershell.exe",
        ["-NoProfile", "-NonInteractive", "-Command", WINDOWS_TREE_SCRIPT],
        {
          shell: false,
          windowsHide: true,
          stdio: ["ignore", "pipe", "ignore"],
          env: { ...process.env, DSH_ROOT_PID: String(rootPid) },
        },
      );
    } catch {
      reject(new CliSafetyError("windows process tree could not be inspected safely"));
      return;
    }
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { child.kill("SIGKILL"); } catch { /* bounded helper cleanup */ }
      reject(new CliSafetyError("windows process tree could not be inspected safely"));
    }, WINDOWS_TREE_TIMEOUT_MS);
    child.stdout?.on("data", (chunk: Buffer | string) => {
      const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      outputBytes += data.byteLength;
      if (outputBytes <= WINDOWS_TREE_OUTPUT_BYTES) chunks.push(data);
      else {
        try { child.kill("SIGKILL"); } catch { /* bounded helper cleanup */ }
      }
    });
    child.once("error", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new CliSafetyError("windows process tree could not be inspected safely"));
    });
    child.once("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code !== 0 || outputBytes > WINDOWS_TREE_OUTPUT_BYTES) {
        reject(new CliSafetyError("windows process tree could not be inspected safely"));
        return;
      }
      try {
        const source = Buffer.concat(chunks).toString("utf8").trim();
        const parsed = source === "" ? [] : JSON.parse(source) as unknown;
        const values = Array.isArray(parsed) ? parsed : [parsed];
        resolve(values.map((value) => {
          const record = value as Record<string, unknown>;
          if (
            !Number.isSafeInteger(record.pid) || Number(record.pid) <= 0 ||
            typeof record.creationIdentity !== "string" || record.creationIdentity.length === 0
          ) {
            throw new Error("invalid-process");
          }
          return { pid: Number(record.pid), creationIdentity: record.creationIdentity };
        }));
      } catch {
        reject(new CliSafetyError("windows process tree could not be inspected safely"));
      }
    });
  });
}

export async function isDshProcessTreeAlive(
  identity: DshProcessTreeIdentity,
  dependencies: ProcessTreeInspectionDependencies = {},
): Promise<boolean> {
  if (identity.platform === "win32") {
    const recorded = identity.members;
    if (recorded === undefined || recorded.length === 0) {
      throw new CliSafetyError("windows process tree could not be inspected safely");
    }
    const current = await (dependencies.snapshotWindowsTree ?? defaultWindowsTreeSnapshot)(identity.pid);
    const currentByPid = new Map(current.map((member) => [member.pid, member.creationIdentity]));
    return recorded.some((member) => currentByPid.get(member.pid) === member.creationIdentity);
  }
  const target = identity.processGroupId === null ? identity.pid : -identity.processGroupId;
  try {
    process.kill(target, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code !== "ESRCH";
  }
}

function signalPosixTree(
  child: ChildProcess,
  signal: NodeJS.Signals,
  policy: ResolvedChildDeadlinePolicy,
): void {
  if (child.pid !== undefined && child.pid > 0) {
    try {
      policy.killProcess(-child.pid, signal);
      return;
    } catch {
      // Fall back to the direct child when a process group was not established.
    }
  }
  try {
    child.kill(signal);
  } catch {
    // A concurrent exit is observed through close; the reap deadline remains bounded.
  }
}

function runTaskkill(
  child: ChildProcess,
  policy: ResolvedChildDeadlinePolicy,
): Promise<boolean> {
  if (child.pid === undefined || child.pid <= 0) return Promise.resolve(false);
  return new Promise<boolean>((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let killer: ChildProcess;
    const finish = (value: boolean): void => {
      if (settled) return;
      settled = true;
      if (timer !== undefined) clearTimeout(timer);
      resolve(value);
    };
    try {
      killer = policy.taskkillSpawn(
        "taskkill",
        ["/PID", String(child.pid), "/T", "/F"],
        { shell: false, stdio: "ignore", windowsHide: true },
      );
    } catch {
      resolve(false);
      return;
    }
    timer = setTimeout(() => {
      try { killer.kill("SIGKILL"); } catch { /* bounded helper cleanup */ }
      finish(false);
    }, policy.terminationGraceMs + policy.reapTimeoutMs);
    killer.once("error", () => finish(false));
    killer.once("close", (code) => finish(code === 0));
  });
}

export function waitForChildWithDeadline(
  child: ChildProcess,
  policy: ResolvedChildDeadlinePolicy,
): Promise<ChildProcessOutcome> {
  return new Promise<ChildProcessOutcome>((resolve) => {
    let settled = false;
    let rootClosed = false;
    let terminationReason: ChildTerminationReason | null = null;
    let windowsTermination: Promise<boolean> | undefined;
    let deadlineTimer: ReturnType<typeof setTimeout> | undefined;
    let graceTimer: ReturnType<typeof setTimeout> | undefined;
    let reapTimer: ReturnType<typeof setTimeout> | undefined;

    const clearTimers = (): void => {
      if (deadlineTimer !== undefined) clearTimeout(deadlineTimer);
      if (graceTimer !== undefined) clearTimeout(graceTimer);
      if (reapTimer !== undefined) clearTimeout(reapTimer);
    };
    const finish = (outcome: ChildProcessOutcome): void => {
      if (settled) return;
      settled = true;
      clearTimers();
      child.removeListener("error", onError);
      child.removeListener("close", onClose);
      policy.signal?.removeEventListener("abort", onAbort);
      resolve(outcome);
    };
    const onError = (error: Error): void => {
      if (terminationReason !== null) return;
      const code = (error as NodeJS.ErrnoException).code;
      finish({ status: "spawn-error", errorCode: typeof code === "string" ? code : null });
    };
    const onClose = (code: number | null, signal: NodeJS.Signals | null): void => {
      if (terminationReason === null) {
        finish({ status: "exited", code, signal });
        return;
      }
      rootClosed = true;
      if (policy.platform !== "win32") {
        finish({ status: "terminated", reason: terminationReason, reaped: true });
        return;
      }
      void (windowsTermination ?? Promise.resolve(false)).then((killed) => {
        finish({ status: "terminated", reason: terminationReason as ChildTerminationReason, reaped: killed });
      });
    };
    const beginTermination = (reason: ChildTerminationReason): void => {
      if (settled || terminationReason !== null) return;
      terminationReason = reason;
      if (deadlineTimer !== undefined) clearTimeout(deadlineTimer);
      if (policy.platform === "win32") {
        windowsTermination = runTaskkill(child, policy);
        void windowsTermination.then((killed) => {
          if (!killed && !settled) finish({ status: "terminated", reason, reaped: false });
          else if (killed && rootClosed && !settled) {
            finish({ status: "terminated", reason, reaped: true });
          }
        });
        reapTimer = setTimeout(() => {
          if (!settled) finish({ status: "terminated", reason, reaped: false });
        }, policy.terminationGraceMs + policy.reapTimeoutMs);
        return;
      }
      signalPosixTree(child, "SIGTERM", policy);
      graceTimer = setTimeout(() => {
        if (settled) return;
        signalPosixTree(child, "SIGKILL", policy);
        reapTimer = setTimeout(() => {
          if (settled) return;
          signalPosixTree(child, "SIGKILL", policy);
          finish({ status: "terminated", reason, reaped: false });
        }, policy.reapTimeoutMs);
      }, policy.terminationGraceMs);
    };
    const onAbort = (): void => beginTermination("aborted");

    child.once("error", onError);
    child.once("close", onClose);
    policy.signal?.addEventListener("abort", onAbort, { once: true });
    deadlineTimer = setTimeout(() => beginTermination("timeout"), policy.timeoutMs);
    if (policy.signal?.aborted === true) beginTermination("aborted");
  });
}

function mergeMembers(
  previous: readonly WindowsProcessIdentity[] | undefined,
  current: readonly WindowsProcessIdentity[],
): readonly WindowsProcessIdentity[] {
  const values = new Map<string, WindowsProcessIdentity>();
  for (const member of [...(previous ?? []), ...current]) {
    values.set(`${member.pid}:${member.creationIdentity}`, member);
  }
  return [...values.values()].sort((left, right) => left.pid - right.pid ||
    left.creationIdentity.localeCompare(right.creationIdentity));
}

async function refreshProcessTree(
  identity: DshProcessTreeIdentity | null,
  dependencies: RunDshDependencies,
): Promise<DshProcessTreeIdentity | null> {
  if (identity === null || identity.platform !== "win32") return identity;
  try {
    const current = await (dependencies.snapshotWindowsTree ?? defaultWindowsTreeSnapshot)(identity.pid);
    const members = mergeMembers(identity.members, current);
    return {
      ...identity,
      members,
      treeIdentity: `win32:${createHash("sha256").update(JSON.stringify(members)).digest("hex")}`,
    };
  } catch {
    return identity;
  }
}

export async function runDsh(
  profile: string,
  args: readonly string[],
  dependencies: RunDshDependencies = {},
): Promise<number> {
  const resolvedPolicy = resolveChildDeadlinePolicy(dependencies, DSH_MUTATION_TIMEOUT_MS);
  if (resolvedPolicy.signal?.aborted === true) {
    throw new DshExecutionUncertainError("aborted", true);
  }
  const controller = new AbortController();
  const forwardAbort = (): void => controller.abort();
  resolvedPolicy.signal?.addEventListener("abort", forwardAbort, { once: true });
  const policy: ResolvedChildDeadlinePolicy = { ...resolvedPolicy, signal: controller.signal };
  const spawn = dependencies.spawn ?? nodeSpawn;
  let child: ChildProcess;
  try {
    child = spawn(
      "dsh",
      ["plugin", "--profile", profile, ...args],
      {
        detached: policy.platform !== "win32",
        shell: false,
        stdio: "inherit",
        ...(dependencies.env === undefined ? {} : { env: dependencies.env }),
      },
    );
  } catch {
    resolvedPolicy.signal?.removeEventListener("abort", forwardAbort);
    throw new CliSafetyError("dsh invocation failed");
  }

  const outcomePromise = waitForChildWithDeadline(child, policy);
  const processTreePromise: Promise<DshProcessTreeIdentity | null> =
    child.pid === undefined || child.pid <= 0
      ? Promise.resolve(null)
      : (dependencies.identifyProcessTree ?? defaultProcessTreeIdentity)(
          child.pid,
          policy.platform,
        ).then(async (treeIdentity) => {
          const members = policy.platform === "win32"
            ? await (dependencies.snapshotWindowsTree ?? defaultWindowsTreeSnapshot)(child.pid as number)
            : undefined;
          const root = members?.find((member) => member.pid === child.pid);
          return {
            pid: child.pid as number,
            processGroupId: policy.platform === "win32" ? null : child.pid as number,
            treeIdentity: members === undefined
              ? treeIdentity
              : `win32:${createHash("sha256").update(JSON.stringify(members)).digest("hex")}`,
            processStartIdentity: root?.creationIdentity ??
              (treeIdentity.endsWith(":unknown") ? null : treeIdentity),
            platform: policy.platform,
            ...(members === undefined ? {} : { members }),
          } satisfies DshProcessTreeIdentity;
        }).catch(() => ({
          pid: child.pid as number,
          processGroupId: policy.platform === "win32" ? null : child.pid as number,
          treeIdentity: `${policy.platform}:${child.pid}:unknown`,
          processStartIdentity: null,
          platform: policy.platform,
        }));

  let processTree = await processTreePromise;
  try {
    if (processTree !== null && dependencies.onSpawn !== undefined) {
      try {
        await dependencies.onSpawn(processTree);
      } catch {
        controller.abort();
        await outcomePromise;
        throw new DshExecutionUncertainError(
          "aborted",
          false,
          processTree,
        );
      }
    }

    const outcome = await outcomePromise;
    processTree = await refreshProcessTree(processTree, dependencies);
    if (outcome.status === "spawn-error") {
      throw new CliSafetyError(
        outcome.errorCode === "ENOENT" ? "dsh executable was not found" : "dsh invocation failed",
      );
    }
    if (outcome.status === "terminated") {
      let reaped = outcome.reaped;
      if (reaped && processTree !== null) {
        try {
          reaped = !await isDshProcessTreeAlive(processTree, dependencies);
        } catch {
          reaped = false;
        }
      }
      throw new DshExecutionUncertainError(outcome.reason, reaped, processTree);
    }
    if (processTree !== null) {
      try {
        if (await isDshProcessTreeAlive(processTree, dependencies)) {
          throw new DshExecutionUncertainError("tree-alive", false, processTree);
        }
      } catch (error) {
        if (error instanceof DshExecutionUncertainError) throw error;
        throw new DshExecutionUncertainError("tree-alive", false, processTree);
      }
    }
    return outcome.code ?? 1;
  } finally {
    resolvedPolicy.signal?.removeEventListener("abort", forwardAbort);
  }
}
