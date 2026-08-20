import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  InstallStateWriterBusyError,
  InstallStateWriterOwnershipError,
  readInstallState,
  writeInstallState,
  type InstallState,
  type InstallStateWriterContext,
  type InstallStateWriterOptions,
} from "../src/dsh/installState.js";

const roots: string[] = [];

async function temporaryHome(): Promise<string> {
  const home = await mkdtemp(join(tmpdir(), "dsh-state-writer-"));
  roots.push(home);
  return home;
}

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

function plugin(id: string): InstallState["installs"][number] {
  return {
    id,
    profile: "web",
    packageName: id,
    fingerprint: `sha256:${"a".repeat(64)}`,
    cacheRelativePath: `npm/${id}/${id}.tgz`,
    installedAt: "2026-08-16T00:00:00.000Z",
  };
}

function writer(
  ownerToken: string,
  pid: number,
  processStartIdentity: string,
  now: () => number,
  beforeRename?: (context: InstallStateWriterContext) => Promise<void>,
  isProcessAlive: InstallStateWriterOptions["isProcessAlive"] = async () => true,
): InstallStateWriterOptions {
  return {
    leaseMs: 50,
    heartbeatMs: 10_000,
    acquireTimeoutMs: 0,
    retryMs: 0,
    ownerToken: () => ownerToken,
    pid,
    processStartIdentity,
    hostname: "test-host",
    now,
    isProcessAlive,
    ...(beforeRename === undefined ? {} : { beforeRename }),
  };
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("install state writer fencing", () => {
  it("lets a dead-owner takeover publish and rejects paused stale writer A", async () => {
    const home = await temporaryHome();
    let now = 1_000;
    const observedWriterFences: number[] = [];
    const aPaused = deferred();
    const resumeA = deferred();

    const seed = await writeInstallState(
      home,
      { version: 1, installs: [] },
      {
        expectedGeneration: 0,
        fencingToken: 1,
        assertLockOwned: async () => undefined,
        writer: writer("seed-writer", 100, "start-seed", () => now, async (context) => {
          observedWriterFences.push(context.fencingToken);
        }),
      },
    );
    expect(seed.generation).toBe(1);

    const staleWrite = writeInstallState(
      home,
      { version: 1, installs: [plugin("loser")] },
      {
        expectedGeneration: 1,
        fencingToken: 2,
        assertLockOwned: async () => undefined,
        writer: writer("writer-a", 101, "start-a", () => now, async (context) => {
          observedWriterFences.push(context.fencingToken);
          aPaused.resolve();
          await resumeA.promise;
        }),
      },
    );
    await aPaused.promise;

    now = 2_000;
    const winner = await writeInstallState(
      home,
      { version: 1, installs: [plugin("winner")] },
      {
        expectedGeneration: 1,
        fencingToken: 3,
        assertLockOwned: async () => undefined,
        writer: writer(
          "writer-b",
          202,
          "start-b",
          () => now,
          async (context) => {
            observedWriterFences.push(context.fencingToken);
          },
          async (pid, identity) => !(pid === 101 && identity === "start-a"),
        ),
      },
    );
    expect(winner).toMatchObject({ generation: 2, fencingToken: 3 });

    resumeA.resolve();
    await expect(staleWrite).rejects.toBeInstanceOf(InstallStateWriterOwnershipError);
    expect(await readInstallState(home)).toMatchObject({
      generation: 2,
      fencingToken: 3,
      installs: [{ id: "winner" }],
    });
    expect(observedWriterFences).toEqual([1, 2, 3]);
  });

  it("never steals an expired writer lease from the same live process identity", async () => {
    const home = await temporaryHome();
    let now = 1_000;
    const aPaused = deferred();
    const resumeA = deferred();
    const firstWrite = writeInstallState(
      home,
      { version: 1, installs: [plugin("first")] },
      {
        expectedGeneration: 0,
        fencingToken: 1,
        assertLockOwned: async () => undefined,
        writer: writer("live-writer", 303, "start-live", () => now, async () => {
          aPaused.resolve();
          await resumeA.promise;
        }),
      },
    );
    await aPaused.promise;
    now = 2_000;

    await expect(writeInstallState(
      home,
      { version: 1, installs: [plugin("contender")] },
      {
        expectedGeneration: 0,
        fencingToken: 2,
        assertLockOwned: async () => undefined,
        writer: writer(
          "contender",
          404,
          "start-contender",
          () => now,
          undefined,
          async (pid, identity) => pid === 303 && identity === "start-live",
        ),
      },
    )).rejects.toBeInstanceOf(InstallStateWriterBusyError);

    resumeA.resolve();
    await expect(firstWrite).resolves.toMatchObject({ generation: 1, fencingToken: 1 });
  });

  it("uses release owner-CAS so stale writer A cannot detach writer B", async () => {
    const home = await temporaryHome();
    let now = 1_000;
    const aPaused = deferred();
    const resumeA = deferred();
    const bPaused = deferred();
    const resumeB = deferred();
    const staleWrite = writeInstallState(
      home,
      { version: 1, installs: [plugin("loser")] },
      {
        expectedGeneration: 0,
        fencingToken: 1,
        assertLockOwned: async () => undefined,
        writer: writer("writer-a", 505, "start-a", () => now, async () => {
          aPaused.resolve();
          await resumeA.promise;
        }),
      },
    );
    await aPaused.promise;
    now = 2_000;

    const winningWrite = writeInstallState(
      home,
      { version: 1, installs: [plugin("winner")] },
      {
        expectedGeneration: 0,
        fencingToken: 2,
        assertLockOwned: async () => undefined,
        writer: writer(
          "writer-b",
          606,
          "start-b",
          () => now,
          async () => {
            bPaused.resolve();
            await resumeB.promise;
          },
          async (pid, identity) => !(pid === 505 && identity === "start-a"),
        ),
      },
    );
    await bPaused.promise;

    resumeA.resolve();
    await expect(staleWrite).rejects.toBeInstanceOf(InstallStateWriterOwnershipError);
    resumeB.resolve();
    await expect(winningWrite).resolves.toMatchObject({ generation: 1, fencingToken: 2 });
    expect(await readInstallState(home)).toMatchObject({
      generation: 1,
      fencingToken: 2,
      installs: [{ id: "winner" }],
    });
  });
});
