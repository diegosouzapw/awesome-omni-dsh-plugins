import type { ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import { tmpdir } from "node:os";
import { PassThrough } from "node:stream";

import { describe, expect, it } from "vitest";

import {
  runSupervisedChild,
  type ChildSpawn,
  type ProcessGroupSignaler,
} from "../src/dsh/childSupervisor.js";

interface FakeChild {
  readonly child: ChildProcess;
  readonly events: EventEmitter;
  readonly stdout: PassThrough;
  readonly stderr: PassThrough;
  readonly spawn: ChildSpawn;
  readonly wasUnrefed: () => boolean;
}

function fakeChild(): FakeChild {
  const events = new EventEmitter();
  const stdout = new PassThrough();
  const stderr = new PassThrough();
  let unrefed = false;
  const child = Object.assign(events, {
    pid: 4_242,
    stdout,
    stderr,
    exitCode: null as number | null,
    signalCode: null as NodeJS.Signals | null,
    kill: () => true,
    unref: () => {
      unrefed = true;
    },
  }) as unknown as ChildProcess;
  return {
    child,
    events,
    stdout,
    stderr,
    spawn: (() => child) as ChildSpawn,
    wasUnrefed: () => unrefed,
  };
}

const REQUEST = {
  command: "git",
  args: ["status"],
  cwd: tmpdir(),
  env: {},
  timeoutMs: 15,
  termGraceMs: 15,
  reapTimeoutMs: 25,
  maxOutputBytes: 1_024,
  processGroup: true,
} as const;

describe("child process supervisor", () => {
  it("signals the whole process group and rejects only after close reaps the child", async () => {
    const fake = fakeChild();
    const signals: Array<{ groupId: number; signal: NodeJS.Signals }> = [];
    let closed = false;
    const signalProcessGroup: ProcessGroupSignaler = (groupId, signal) => {
      signals.push({ groupId, signal });
      if (signal === "SIGKILL") {
        queueMicrotask(() => {
          closed = true;
          fake.events.emit("close", null, signal);
        });
      }
      return true;
    };

    const result = await runSupervisedChild(REQUEST, {
      spawn: fake.spawn,
      signalProcessGroup,
    });

    expect(result).toMatchObject({ reaped: true, reason: "timeout" });
    expect(closed).toBe(true);
    expect(signals).toEqual([
      { groupId: -4_242, signal: "SIGTERM" },
      { groupId: -4_242, signal: "SIGKILL" },
    ]);
  });

  it("returns a bounded typed unreaped result when close never arrives", async () => {
    const fake = fakeChild();
    const signals: NodeJS.Signals[] = [];
    const signalProcessGroup: ProcessGroupSignaler = (_groupId, signal) => {
      signals.push(signal);
      return true;
    };

    const guarded = Promise.race([
      runSupervisedChild(REQUEST, { spawn: fake.spawn, signalProcessGroup }),
      new Promise<never>((_resolve, reject) => {
        setTimeout(() => reject(new Error("supervisor did not enforce its reap deadline")), 250);
      }),
    ]);
    const result = await guarded;

    expect(result).toMatchObject({
      reaped: false,
      reason: "reap-timeout",
      terminationReason: "timeout",
    });
    expect(signals).toEqual(["SIGTERM", "SIGKILL"]);
    expect(fake.wasUnrefed()).toBe(true);
    expect(fake.stdout.destroyed).toBe(true);
    expect(fake.stderr.destroyed).toBe(true);
    expect(fake.events.listenerCount("close")).toBe(0);
  });
});
