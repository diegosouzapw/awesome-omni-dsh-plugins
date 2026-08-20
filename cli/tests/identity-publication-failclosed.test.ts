import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DshExecutionUncertainError,
  runDsh,
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
  vi.restoreAllMocks();
});

describe("spawned identity persistence failure", () => {
  it("is unreaped even when the root closes while an observed descendant remains alive", async () => {
    const root = child(4_001);
    const snapshots = vi.fn(async () => [
      { pid: 4_001, creationIdentity: "root-created" },
      { pid: 4_002, creationIdentity: "descendant-created" },
    ]);
    const execution = runDsh("web", ["add", "http://127.0.0.1/artifact.tgz"], {
      spawn: vi.fn(() => root) as never,
      platform: "win32",
      snapshotWindowsTree: snapshots,
      identifyProcessTree: async () => "win32:root-created",
      onSpawn: async () => {
        root.emit("close", 0, null);
        throw new Error("durable identity update failed");
      },
    });

    await expect(execution).rejects.toMatchObject({
      name: "DshExecutionUncertainError",
      reason: "aborted",
      reaped: false,
      recoveryRequired: true,
      processTree: expect.objectContaining({
        members: expect.arrayContaining([
          { pid: 4_002, creationIdentity: "descendant-created" },
        ]),
      }),
    } satisfies Partial<DshExecutionUncertainError>);
  });
});
