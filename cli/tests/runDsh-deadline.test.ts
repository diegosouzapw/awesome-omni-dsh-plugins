import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";

import { afterEach, describe, expect, it, vi } from "vitest";

import { probeDshVersion } from "../src/commands/doctor.js";
import {
  DshDeadlineConfigurationError,
  DshExecutionUncertainError,
  runDsh,
} from "../src/dsh/runDsh.js";

interface FakeChild extends EventEmitter {
  readonly pid: number;
  readonly stdout: PassThrough;
  readonly kill: ReturnType<typeof vi.fn>;
}

function fakeChild(pid = 4_242): FakeChild {
  const child = new EventEmitter() as FakeChild;
  Object.defineProperties(child, {
    pid: { value: pid, enumerable: true },
    stdout: { value: new PassThrough(), enumerable: true },
    kill: { value: vi.fn(() => true), enumerable: true },
  });
  return child;
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("DSH subprocess deadlines", () => {
  it("escalates TERM to KILL for the process group and settles only after close/reap", async () => {
    vi.useFakeTimers();
    const child = fakeChild();
    const spawn = vi.fn(() => child);
    const killProcess = vi.fn(() => true);
    const execution = runDsh("web", ["add", "pkg && untouched"], {
      spawn: spawn as never,
      timeoutMs: 100,
      terminationGraceMs: 50,
      reapTimeoutMs: 200,
      platform: "linux",
      killProcess,
    });
    let settled = false;
    void execution.then(
      () => {
        settled = true;
      },
      () => {
        settled = true;
      },
    );

    expect(spawn).toHaveBeenCalledWith(
      "dsh",
      ["plugin", "--profile", "web", "add", "pkg && untouched"],
      expect.objectContaining({ shell: false, stdio: "inherit", detached: true }),
    );
    await vi.advanceTimersByTimeAsync(100);
    expect(killProcess).toHaveBeenNthCalledWith(1, -4_242, "SIGTERM");
    expect(settled).toBe(false);

    await vi.advanceTimersByTimeAsync(50);
    expect(killProcess).toHaveBeenNthCalledWith(2, -4_242, "SIGKILL");
    expect(settled).toBe(false);

    child.emit("close", null, "SIGKILL");
    await expect(execution).rejects.toMatchObject({
      name: "DshExecutionUncertainError",
      reason: "timeout",
      ambiguous: true,
      recoveryRequired: true,
      reaped: true,
      message: "dsh execution timed out; result is ambiguous; recovery required",
    } satisfies Partial<DshExecutionUncertainError>);
    expect(settled).toBe(true);
  });

  it("turns AbortSignal cancellation into a sanitized ambiguous result for rollback", async () => {
    vi.useFakeTimers();
    const child = fakeChild(7_007);
    const spawn = vi.fn(() => child);
    const killProcess = vi.fn(() => true);
    const controller = new AbortController();
    const execution = runDsh("web", ["remove", "fixture"], {
      spawn: spawn as never,
      signal: controller.signal,
      timeoutMs: 5_000,
      terminationGraceMs: 100,
      reapTimeoutMs: 100,
      platform: "linux",
      killProcess,
    });

    controller.abort();
    expect(killProcess).toHaveBeenCalledWith(-7_007, "SIGTERM");
    child.emit("close", null, "SIGTERM");

    await expect(execution).rejects.toMatchObject({
      name: "DshExecutionUncertainError",
      reason: "aborted",
      ambiguous: true,
      recoveryRequired: true,
      reaped: true,
      message: "dsh execution was aborted; result is ambiguous; recovery required",
    } satisfies Partial<DshExecutionUncertainError>);
    expect(killProcess).toHaveBeenCalledTimes(1);
  });

  it("bounds a never-closing doctor probe after TERM, KILL and the reap deadline", async () => {
    vi.useFakeTimers();
    const child = fakeChild(8_008);
    const spawn = vi.fn(() => child);
    const killProcess = vi.fn(() => true);
    const probing = probeDshVersion({
      spawn: spawn as never,
      timeoutMs: 20,
      terminationGraceMs: 10,
      reapTimeoutMs: 10,
      platform: "linux",
      killProcess,
    });

    await vi.advanceTimersByTimeAsync(40);

    await expect(probing).resolves.toEqual({ status: "timeout", version: null });
    expect(killProcess.mock.calls).toEqual([
      [-8_008, "SIGTERM"],
      [-8_008, "SIGKILL"],
      [-8_008, "SIGKILL"],
    ]);
    expect(spawn).toHaveBeenCalledWith(
      "dsh",
      ["--version"],
      expect.objectContaining({ shell: false, detached: true }),
    );
  });

  it("rejects non-finite deadline configuration before spawning", async () => {
    const spawn = vi.fn(() => fakeChild());

    await expect(runDsh("web", ["add", "fixture"], {
      spawn: spawn as never,
      timeoutMs: Number.POSITIVE_INFINITY,
    })).rejects.toEqual(expect.objectContaining({
      name: "DshDeadlineConfigurationError",
      message: "dsh subprocess deadline configuration is invalid",
    } satisfies Partial<DshDeadlineConfigurationError>));
    expect(spawn).not.toHaveBeenCalled();
  });

  it.each(["timeout", "aborted"] as const)(
    "returns an unreaped %s with the retained process-tree identity",
    async (reason) => {
      vi.useFakeTimers();
      const child = fakeChild(9_009);
      const controller = new AbortController();
      const execution = runDsh("web", ["add", "/private/artifact.tgz"], {
        spawn: vi.fn(() => child) as never,
        signal: controller.signal,
        timeoutMs: 20,
        terminationGraceMs: 10,
        reapTimeoutMs: 10,
        platform: "linux",
        killProcess: vi.fn(() => true),
        identifyProcessTree: async () => "linux:424242",
      });
      const rejection = expect(execution).rejects.toMatchObject({
        name: "DshExecutionUncertainError",
        reason,
        reaped: false,
        processTree: {
          pid: 9_009,
          processGroupId: 9_009,
          treeIdentity: "linux:424242",
          processStartIdentity: "linux:424242",
          platform: "linux",
        },
      } satisfies Partial<DshExecutionUncertainError>);
      if (reason === "aborted") controller.abort();
      await vi.advanceTimersByTimeAsync(reason === "timeout" ? 40 : 20);
      await rejection;
    },
  );

  it("uses literal taskkill argv for a Windows process tree", async () => {
    vi.useFakeTimers();
    const child = fakeChild(8_181);
    const taskkillChild = fakeChild(8_182);
    Object.defineProperty(taskkillChild, "unref", { value: vi.fn(), enumerable: true });
    const taskkillSpawn = vi.fn(() => taskkillChild);
    let snapshotCalls = 0;
    const execution = runDsh("web", ["remove", "fixture"], {
      spawn: vi.fn(() => child) as never,
      timeoutMs: 20,
      terminationGraceMs: 10,
      reapTimeoutMs: 10,
      platform: "win32",
      taskkillSpawn: taskkillSpawn as never,
      identifyProcessTree: async () => "win32:8181:created",
      snapshotWindowsTree: async () => snapshotCalls++ === 0
        ? [{ pid: 8_181, creationIdentity: "created" }]
        : [],
    });

    await vi.advanceTimersByTimeAsync(20);
    expect(taskkillSpawn).toHaveBeenCalledWith(
      "taskkill",
      ["/PID", "8181", "/T", "/F"],
      { shell: false, stdio: "ignore", windowsHide: true },
    );
    taskkillChild.emit("close", 0, null);
    child.emit("close", null, "SIGKILL");
    await expect(execution).rejects.toMatchObject({ reaped: true, reason: "timeout" });
  });
});
