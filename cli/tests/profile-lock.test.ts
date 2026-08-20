import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  InstallStateGenerationError,
  readInstallState,
  writeInstallState,
} from "../src/dsh/installState.js";
import {
  ProfileLockBusyError,
  ProfileLockOwnershipError,
  acquireProfileLock,
} from "../src/dsh/profileLock.js";
import { beginProfileTransaction } from "../src/dsh/profileTransaction.js";

const roots: string[] = [];

async function temporaryHome(): Promise<string> {
  const home = await mkdtemp(join(tmpdir(), "dsh-profile-lock-"));
  roots.push(home);
  return home;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("profile mutation lock", () => {
  it("serializes alternating profiles behind one home-global mutation fence", async () => {
    const home = await temporaryHome();
    const seed = await acquireProfileLock(home, "web", {
      leaseMs: 5_000,
      heartbeatMs: 1_000,
      ownerToken: () => "seed-owner",
      pid: 101,
      hostname: "test-host",
      isProcessAlive: () => true,
    });
    expect(seed.fencingToken).toBe(1);
    await seed.release();

    const web = await acquireProfileLock(home, "web", {
      leaseMs: 5_000,
      heartbeatMs: 1_000,
      ownerToken: () => "web-owner",
      pid: 202,
      hostname: "test-host",
      isProcessAlive: () => true,
    });
    expect(web.fencingToken).toBe(2);

    let acquiredTerminal = false;
    let terminal: Awaited<ReturnType<typeof acquireProfileLock>> | undefined;
    const terminalOperation = acquireProfileLock(home, "terminal", {
      leaseMs: 5_000,
      heartbeatMs: 1_000,
      acquireTimeoutMs: 500,
      retryMs: 5,
      ownerToken: () => "terminal-owner",
      pid: 303,
      hostname: "test-host",
      isProcessAlive: () => true,
    }).then((lock) => {
      acquiredTerminal = true;
      terminal = lock;
      return lock;
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(acquiredTerminal).toBe(false);
      await web.release();
      terminal = await terminalOperation;
      expect(terminal.profile).toBe("terminal");
      expect(terminal.fencingToken).toBe(3);
      await terminal.release();
      terminal = undefined;

      const webAgain = await acquireProfileLock(home, "web", {
        ownerToken: () => "web-owner-again",
        pid: 404,
        hostname: "test-host",
        isProcessAlive: () => true,
      });
      expect(webAgain.fencingToken).toBe(4);
      await webAgain.release();
    } finally {
      await web.release();
      await terminal?.release();
    }
  });

  it("does not steal an expired lease while the local owner PID is alive", async () => {
    const home = await temporaryHome();
    let now = 1_000;
    const first = await acquireProfileLock(home, "web", {
      now: () => now,
      leaseMs: 50,
      heartbeatMs: 10_000,
      ownerToken: () => "live-owner",
      pid: 303,
      hostname: "test-host",
      isProcessAlive: (pid) => pid === 303,
    });
    now = 5_000;

    await expect(acquireProfileLock(home, "web", {
      now: () => now,
      leaseMs: 50,
      heartbeatMs: 10_000,
      acquireTimeoutMs: 0,
      retryMs: 0,
      ownerToken: () => "contender",
      pid: 404,
      hostname: "test-host",
      isProcessAlive: (pid) => pid === 303,
    })).rejects.toBeInstanceOf(ProfileLockBusyError);
    await first.release();
  });

  it("fences stale owners from state publication and release after dead-owner takeover", async () => {
    const home = await temporaryHome();
    let now = 1_000;
    let firstAlive = true;
    const liveness = (pid: number): boolean => pid !== 505 || firstAlive;
    const first = await acquireProfileLock(home, "web", {
      now: () => now,
      leaseMs: 50,
      heartbeatMs: 10_000,
      ownerToken: () => "stale-owner",
      pid: 505,
      hostname: "test-host",
      isProcessAlive: liveness,
    });
    const firstState = await writeInstallState(
      home,
      { version: 1, installs: [] },
      {
        expectedGeneration: 0,
        fencingToken: first.fencingToken,
        assertLockOwned: first.assertOwned,
      },
    );
    expect(firstState.generation).toBe(1);

    firstAlive = false;
    now = 2_000;
    const second = await acquireProfileLock(home, "web", {
      now: () => now,
      leaseMs: 50,
      heartbeatMs: 10_000,
      ownerToken: () => "new-owner",
      pid: 606,
      hostname: "test-host",
      isProcessAlive: liveness,
    });
    expect(second.fencingToken).toBeGreaterThan(first.fencingToken);

    await expect(writeInstallState(
      home,
      { version: 1, installs: [] },
      {
        expectedGeneration: 1,
        fencingToken: first.fencingToken,
        assertLockOwned: first.assertOwned,
      },
    )).rejects.toBeInstanceOf(ProfileLockOwnershipError);

    const secondState = await writeInstallState(
      home,
      { version: 1, installs: [] },
      {
        expectedGeneration: 1,
        fencingToken: second.fencingToken,
        assertLockOwned: second.assertOwned,
      },
    );
    expect(secondState).toMatchObject({
      generation: 2,
      fencingToken: second.fencingToken,
    });

    await first.release();
    await expect(second.assertOwned()).resolves.toBeUndefined();
    await expect(writeInstallState(
      home,
      { version: 1, installs: [] },
      {
        expectedGeneration: 1,
        fencingToken: second.fencingToken,
        assertLockOwned: second.assertOwned,
      },
    )).rejects.toBeInstanceOf(InstallStateGenerationError);
    expect(await readInstallState(home)).toMatchObject({
      generation: 2,
      fencingToken: second.fencingToken,
    });
    await second.release();
  });
});

describe("recoverable profile transaction", () => {
  it("restores a retained pre-commit backup after a simulated crash", async () => {
    const home = await temporaryHome();
    const profile = join(home, "profiles", "web");
    await mkdir(profile, { recursive: true });
    await writeFile(join(profile, "package.json"), "before\n", "utf8");
    const first = await beginProfileTransaction(home, "web", {
      fencingToken: 1,
      committedFencingToken: 0,
      assertLockOwned: async () => undefined,
    });
    await writeFile(join(profile, "package.json"), "crashed mutation\n", "utf8");

    const second = await beginProfileTransaction(home, "web", {
      fencingToken: 2,
      committedFencingToken: 0,
      assertLockOwned: async () => undefined,
    });

    expect(await readFile(join(profile, "package.json"), "utf8")).toBe("before\n");
    await second.rollback();
    expect(await readFile(join(profile, "package.json"), "utf8")).toBe("before\n");
    await first.commit();
  });
});
