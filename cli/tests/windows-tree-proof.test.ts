import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  isDshProcessTreeAlive,
  runDsh,
  type DshProcessTreeIdentity,
} from "../src/dsh/runDsh.js";

interface FakeChild extends EventEmitter {
  readonly pid: number;
  readonly stdout: PassThrough;
  readonly kill: ReturnType<typeof vi.fn>;
}

function child(pid: number): FakeChild {
  const value = new EventEmitter() as FakeChild;
  Object.defineProperties(value, {
    pid: { value: pid },
    stdout: { value: new PassThrough() },
    kill: { value: vi.fn(() => true) },
  });
  return value;
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const identity: DshProcessTreeIdentity = {
  pid: 100,
  processGroupId: null,
  treeIdentity: "win32:100:root-created",
  processStartIdentity: "root-created",
  platform: "win32",
  members: [
    { pid: 100, creationIdentity: "root-created" },
    { pid: 101, creationIdentity: "child-created" },
  ],
};

describe("Windows whole-tree proof", () => {
  it("reports alive when the root exited but a recorded descendant still has the same identity", async () => {
    await expect(isDshProcessTreeAlive(identity, {
      snapshotWindowsTree: vi.fn(async () => [
        { pid: 101, creationIdentity: "child-created" },
      ]),
    })).resolves.toBe(true);
  });

  it("does not confuse a reused PID with the recorded process", async () => {
    await expect(isDshProcessTreeAlive(identity, {
      snapshotWindowsTree: vi.fn(async () => [
        { pid: 100, creationIdentity: "different-creation" },
        { pid: 101, creationIdentity: "different-child" },
      ]),
    })).resolves.toBe(false);
  });

  it.each(["pending", "failed"] as const)(
    "returns reaped:false when taskkill is %s even if the root closes",
    async (mode) => {
      vi.useFakeTimers();
      const root = child(200);
      const killer = child(201);
      const execution = runDsh("web", ["add", "http://127.0.0.1/artifact.tgz"], {
        spawn: vi.fn(() => root) as never,
        platform: "win32",
        timeoutMs: 20,
        terminationGraceMs: 10,
        reapTimeoutMs: 10,
        taskkillSpawn: vi.fn(() => killer) as never,
        identifyProcessTree: async () => "win32:200:root-created",
        snapshotWindowsTree: vi.fn(async () => [
          { pid: 201, creationIdentity: "child-created" },
        ]),
      });
      const rejection = expect(execution).rejects.toMatchObject({
        name: "DshExecutionUncertainError",
        reason: "timeout",
        reaped: false,
      });

      await vi.advanceTimersByTimeAsync(20);
      root.emit("close", null, "SIGKILL");
      if (mode === "failed") killer.emit("close", 1, null);
      await vi.advanceTimersByTimeAsync(30);
      await rejection;
    },
  );
});
