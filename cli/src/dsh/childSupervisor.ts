import { spawn as nodeSpawn, type ChildProcess } from "node:child_process";

export interface ChildSpawnOptions {
  readonly cwd: string;
  readonly env: NodeJS.ProcessEnv;
  readonly shell: false;
  readonly detached: boolean;
  readonly stdio: readonly ["ignore", "pipe", "pipe"];
}

export type ChildSpawn = (
  command: string,
  args: readonly string[],
  options: ChildSpawnOptions,
) => ChildProcess;

export type ProcessGroupSignaler = (
  processGroupId: number,
  signal: NodeJS.Signals,
) => boolean;

export type ChildTerminationReason = "timeout" | "aborted" | "output-limit" | "spawn-error";

export interface SupervisedChildRequest {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly env: NodeJS.ProcessEnv;
  readonly timeoutMs: number;
  readonly termGraceMs: number;
  readonly reapTimeoutMs: number;
  readonly maxOutputBytes: number;
  readonly processGroup: boolean;
  readonly signal?: AbortSignal;
}

export interface ChildSupervisorDependencies {
  readonly spawn?: ChildSpawn;
  readonly signalProcessGroup?: ProcessGroupSignaler;
}

interface ChildResultBase {
  readonly stdout: Buffer;
  readonly outputBytes: number;
  readonly exitCode: number | null;
  readonly signal: NodeJS.Signals | null;
}

export interface ReapedChildResult extends ChildResultBase {
  readonly reaped: true;
  readonly reason: "exit" | ChildTerminationReason;
  readonly terminationReason: ChildTerminationReason | null;
}

export interface UnreapedChildResult extends ChildResultBase {
  readonly reaped: false;
  readonly reason: "reap-timeout";
  readonly terminationReason: ChildTerminationReason;
}

export type SupervisedChildResult = ReapedChildResult | UnreapedChildResult;

function assertBoundedPositiveInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive safe integer`);
  }
}

function defaultSpawn(
  command: string,
  args: readonly string[],
  options: ChildSpawnOptions,
): ChildProcess {
  return nodeSpawn(command, [...args], {
    cwd: options.cwd,
    env: options.env,
    shell: false,
    detached: options.detached,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function defaultSignalProcessGroup(
  processGroupId: number,
  signal: NodeJS.Signals,
): boolean {
  process.kill(processGroupId, signal);
  return true;
}

function chunkBuffer(chunk: Buffer | Uint8Array | string): Buffer {
  if (Buffer.isBuffer(chunk)) return chunk;
  return Buffer.from(chunk);
}

export async function runSupervisedChild(
  request: SupervisedChildRequest,
  dependencies: ChildSupervisorDependencies = {},
): Promise<SupervisedChildResult> {
  assertBoundedPositiveInteger(request.timeoutMs, "timeoutMs");
  assertBoundedPositiveInteger(request.termGraceMs, "termGraceMs");
  assertBoundedPositiveInteger(request.reapTimeoutMs, "reapTimeoutMs");
  assertBoundedPositiveInteger(request.maxOutputBytes, "maxOutputBytes");
  if (request.command.length === 0 || request.command.includes("\0")) {
    throw new TypeError("command must be a non-empty executable path");
  }

  const spawn = dependencies.spawn ?? defaultSpawn;
  const signalProcessGroup = dependencies.signalProcessGroup ?? defaultSignalProcessGroup;
  let child: ChildProcess;
  try {
    child = spawn(request.command, request.args, {
      cwd: request.cwd,
      env: request.env,
      shell: false,
      detached: request.processGroup,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    return {
      reaped: true,
      reason: "spawn-error",
      terminationReason: "spawn-error",
      stdout: Buffer.alloc(0),
      outputBytes: 0,
      exitCode: null,
      signal: null,
    };
  }

  return new Promise<SupervisedChildResult>((resolvePromise) => {
    const stdoutChunks: Buffer[] = [];
    let outputBytes = 0;
    let storedStdoutBytes = 0;
    let settled = false;
    let terminationReason: ChildTerminationReason | undefined;
    let termGraceTimer: NodeJS.Timeout | undefined;
    let reapTimer: NodeJS.Timeout | undefined;

    const clearTimers = () => {
      clearTimeout(executionTimer);
      if (termGraceTimer !== undefined) clearTimeout(termGraceTimer);
      if (reapTimer !== undefined) clearTimeout(reapTimer);
    };

    const removeListeners = () => {
      child.removeListener("error", onError);
      child.removeListener("close", onClose);
      child.stdout?.removeListener("data", onStdout);
      child.stderr?.removeListener("data", onStderr);
      request.signal?.removeEventListener("abort", onAbort);
    };

    const capturedStdout = () => Buffer.concat(stdoutChunks, storedStdoutBytes);

    const signalChildTree = (signal: NodeJS.Signals) => {
      let groupSignaled = false;
      if (request.processGroup && child.pid !== undefined && child.pid > 0) {
        try {
          groupSignaled = signalProcessGroup(-child.pid, signal);
        } catch {
          groupSignaled = false;
        }
      }
      if (!groupSignaled) {
        try {
          child.kill(signal);
        } catch {
          // The finite reap deadline remains authoritative when signaling fails.
        }
      }
    };

    const finishUnreaped = () => {
      if (settled) return;
      settled = true;
      clearTimers();
      removeListeners();
      child.stdout?.destroy();
      child.stderr?.destroy();
      child.unref();
      resolvePromise({
        reaped: false,
        reason: "reap-timeout",
        terminationReason: terminationReason ?? "timeout",
        stdout: capturedStdout(),
        outputBytes,
        exitCode: child.exitCode,
        signal: child.signalCode,
      });
    };

    const escalate = () => {
      if (settled) return;
      signalChildTree("SIGKILL");
      reapTimer = setTimeout(finishUnreaped, request.reapTimeoutMs);
      reapTimer.unref();
    };

    const beginTermination = (reason: ChildTerminationReason) => {
      if (settled || terminationReason !== undefined) return;
      terminationReason = reason;
      signalChildTree("SIGTERM");
      termGraceTimer = setTimeout(escalate, request.termGraceMs);
      termGraceTimer.unref();
    };

    const collect = (chunk: Buffer | Uint8Array | string, keep: boolean) => {
      const bytes = chunkBuffer(chunk);
      const remaining = Math.max(0, request.maxOutputBytes - outputBytes);
      if (keep && remaining > 0) {
        const captured = bytes.subarray(0, Math.min(remaining, bytes.byteLength));
        stdoutChunks.push(Buffer.from(captured));
        storedStdoutBytes += captured.byteLength;
      }
      outputBytes += bytes.byteLength;
      if (outputBytes > request.maxOutputBytes) beginTermination("output-limit");
    };

    function onStdout(chunk: Buffer | Uint8Array | string): void {
      collect(chunk, true);
    }

    function onStderr(chunk: Buffer | Uint8Array | string): void {
      collect(chunk, false);
    }

    function onError(): void {
      beginTermination("spawn-error");
    }

    function onAbort(): void {
      beginTermination("aborted");
    }

    function onClose(code: number | null, signal: NodeJS.Signals | null): void {
      if (settled) return;
      settled = true;
      clearTimers();
      removeListeners();
      resolvePromise({
        reaped: true,
        reason: terminationReason ?? "exit",
        terminationReason: terminationReason ?? null,
        stdout: capturedStdout(),
        outputBytes,
        exitCode: code,
        signal,
      });
    }

    child.stdout?.on("data", onStdout);
    child.stderr?.on("data", onStderr);
    child.once("error", onError);
    child.once("close", onClose);
    request.signal?.addEventListener("abort", onAbort, { once: true });

    const executionTimer = setTimeout(() => beginTermination("timeout"), request.timeoutMs);
    executionTimer.unref();
    if (request.signal?.aborted === true) beginTermination("aborted");
  });
}
