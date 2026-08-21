import type { ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough } from "node:stream";

import { afterEach, describe, expect, it } from "vitest";

import type { ChildSpawn, ProcessGroupSignaler } from "../src/dsh/childSupervisor.js";
import { stageCatalogEntry } from "../src/dsh/staging.js";
import type { PublicCatalogEntry } from "../src/model.js";

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function sourceEntry(): PublicCatalogEntry {
  return {
    schemaVersion: 1,
    id: "unreaped-source",
    name: "Unreaped Source",
    description: { en: "A source process fixture.", evidencePath: "README.md" },
    unofficial: true,
    kind: "plugin",
    primaryCategory: "developer-tools",
    tags: ["test"],
    source: {
      repository: "https://github.com/creator/unreaped-source",
      repositoryNodeId: "R_unreaped",
      subpath: null,
      commit: "d".repeat(40),
    },
    creator: { github: "creator" },
    package: { ecosystem: "source" },
    dsh: { profiles: ["web"], evidencePath: "package.json" },
    repositoryScope: "dedicated",
    popularity: { starsPolicy: "exact-repository", stars: 1 },
    license: { spdx: "MIT" },
    verification: {
      status: "eligible",
      checkedAt: "2026-08-16T00:00:00Z",
      repositoryIdentity: "resolved",
      smokeTest: null,
    },
    provenance: { discussion: null, comment: null },
    canonicalKey: "R_unreaped:.",
  };
}

describe("source Git reap boundary", () => {
  it("returns a bounded typed error and preserves the work area when the process tree never closes", { timeout: 15_000 }, async () => {
    const home = mkdtempSync(join(tmpdir(), "dsh-staging-unreaped-"));
    roots.push(home);
    const events = new EventEmitter();
    const child = Object.assign(events, {
      pid: 7_777,
      stdout: new PassThrough(),
      stderr: new PassThrough(),
      exitCode: null,
      signalCode: null,
      kill: () => true,
      unref: () => undefined,
    }) as unknown as ChildProcess;
    const spawn = (() => child) as ChildSpawn;
    const signals: Array<{ group: number; signal: NodeJS.Signals }> = [];
    const signalProcessGroup: ProcessGroupSignaler = (group, signal) => {
      signals.push({ group, signal });
      return true;
    };

    const guarded = Promise.race([
      stageCatalogEntry(sourceEntry(), {
        dshHome: home,
        budgets: { gitTimeoutMs: 10, killGraceMs: 10, gitReapTimeoutMs: 20 },
        childSupervisor: { spawn, signalProcessGroup },
      }),
      new Promise<never>((_resolve, reject) => {
        // Liveness detector only: the assertions that matter are the unreaped error, the
        // TERM→KILL sequence on the process group and the preserved work area — none change
        // with this bound. 250ms promised wall-clock over real setTimeout chains, which a
        // loaded vitest worker pool cannot keep (observed 146ms on a green run, 1.7x from the
        // cliff); 5s stays a liveness proof without racing the scheduler. (issue #50)
        setTimeout(() => reject(new Error("source Git reap boundary stayed pending")), 5_000);
      }),
    ]);

    await expect(guarded).rejects.toMatchObject({
      name: "GitProcessUnreapedError",
      reaped: false,
      recoveryRequired: true,
    });
    expect(signals).toEqual([
      { group: -7_777, signal: "SIGTERM" },
      { group: -7_777, signal: "SIGKILL" },
    ]);
    const cacheRoot = join(home, ".dsh-plugins", "cache", "unreaped-source");
    expect(readdirSync(cacheRoot).some((name) => name.startsWith(".unreaped-"))).toBe(true);
    expect(readdirSync(cacheRoot).some((name) => name.startsWith(".stage-"))).toBe(false);
  });
});
