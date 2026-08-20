import { describe, expect, it, vi } from "vitest";

import { recoverPluginMutation } from "../src/commands/mutate.js";
import type { MutationRecoveryJournal } from "../src/dsh/mutationRecoveryJournal.js";

describe("durable recovery phase machine", () => {
  it("retries from needs_restore after a crash before profile_restored publication", async () => {
    const order: string[] = [];
    let failAfterPhysicalRestore = true;
    let durable: MutationRecoveryJournal | null = {
      version: 1,
      revision: 1,
      status: "recovery_required",
      phase: "needs_restore",
      ownerToken: "old-owner",
      fencingToken: 7,
      profile: "web",
      transaction: {
        profile: "web",
        fencingToken: 7,
        existed: true,
        journalRelativePath: "profiles/.dsh-plugins-transaction-web-phase.json",
        backupRelativePath: "profiles/.dsh-plugins-backup-web-phase",
        backupFingerprint: `sha512-${"A".repeat(86)}==`,
      },
      artifact: {
        relativePath: ".dsh-plugins/artifact-leases/.lease-phase/artifact.tgz",
        sha512: `sha512-${"B".repeat(86)}==`,
        bytes: 128,
        packageName: "fixture-plugin",
      },
      channel: {
        kind: "loopback-buffer-v1",
        sha512: `sha512-${"B".repeat(86)}==`,
        bytes: 128,
        sourceFingerprint: "sha256:pinned-source",
      },
      processTree: {
        pid: 7_777,
        processGroupId: 7_777,
        treeIdentity: "linux:created",
        processStartIdentity: "linux:created",
        platform: "linux",
      },
      createdAt: "2026-08-16T00:00:00.000Z",
    };
    let lockNumber = 0;
    const locks = [0, 1].map((index) => ({
      canonicalHome: "/canonical/home",
      profile: "web",
      ownerToken: `recovery-owner-${index + 1}`,
      fencingToken: 8 + index,
      assertOwned: vi.fn(async () => undefined),
      heartbeat: vi.fn(async () => undefined),
      release: vi.fn(async () => {
        order.push(`release-lock-${index + 1}`);
      }),
    }));
    const dependencies = {
      dshHome: "/canonical/home",
      acquireLock: vi.fn(async () => locks[lockNumber++]!),
      readRecoveryJournal: vi.fn(async () => durable),
      updateRecoveryJournal: vi.fn(async (_home: string, current: MutationRecoveryJournal, patch: object) => {
        if (
          failAfterPhysicalRestore &&
          "phase" in patch &&
          (patch as { phase?: string }).phase === "profile_restored"
        ) {
          failAfterPhysicalRestore = false;
          throw new Error("injected crash after backup-to-active rename");
        }
        durable = { ...current, ...patch, revision: current.revision + 1 } as MutationRecoveryJournal;
        return durable;
      }),
      removeRecoveryJournal: vi.fn(async () => {
        order.push("remove-marker");
        durable = null;
      }),
      readState: vi.fn(async () => ({ version: 1 as const, installs: [] })),
      writeState: vi.fn(async () => undefined),
      isProcessTreeAlive: vi.fn(async () => false),
      recoverTransaction: vi.fn(async () => {
        order.push("restore-profile");
      }),
      finalizeRecoveredTransaction: vi.fn(async () => {
        order.push("finalize-profile");
      }),
      releaseRecoveredArtifact: vi.fn(async () => {
        order.push("release-artifact");
      }),
      stdout: vi.fn(),
      stderr: vi.fn(),
    };

    expect(await recoverPluginMutation(dependencies)).toBe(1);
    expect(durable?.phase).toBe("needs_restore");
    expect(locks[0]!.release).not.toHaveBeenCalled();

    expect(await recoverPluginMutation(dependencies)).toBe(0);
    expect(durable).toBeNull();
    expect(order).toEqual([
      "restore-profile",
      "restore-profile",
      "finalize-profile",
      "release-artifact",
      "remove-marker",
      "release-lock-2",
    ]);
  });
});
