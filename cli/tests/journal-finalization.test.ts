import { createHash } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import { executePluginMutation, recoverPluginMutation } from "../src/commands/mutate.js";

const ACTIVE_FINGERPRINT = `sha512-${createHash("sha512").update("active").digest("base64")}`;

describe("completed mutation journal finalization", () => {
  it("never downgrades completed after final removal fails and a fresh recovery removes it", async () => {
    const lock = {
      canonicalHome: "/dsh",
      profile: "web",
      ownerToken: "owner-1",
      fencingToken: 7,
      assertOwned: vi.fn(async () => undefined),
      heartbeat: vi.fn(async () => undefined),
      release: vi.fn(async () => undefined),
    };
    const transaction = {
      recoveryReference: {
        profile: "web",
        fencingToken: 7,
        existed: true,
        journalRelativePath: "profiles/.dsh-plugins-transaction-web-one.json",
        backupRelativePath: "profiles/.dsh-plugins-backup-web-one",
        backupFingerprint: ACTIVE_FINGERPRINT,
      },
      commit: vi.fn(async () => undefined),
      rollback: vi.fn(async () => undefined),
    };
    const artifact = {
      relativePath: ".dsh-plugins/artifact-leases/.lease-one/artifact.tgz",
      sha512: ACTIVE_FINGERPRINT,
      bytes: 6,
      packageName: "@example/plugin",
    };
    const lease = {
      recoveryReference: artifact,
      revalidate: vi.fn(async () => undefined),
      readVerifiedBytes: vi.fn(async () => Buffer.from("plugin")),
      release: vi.fn(async () => undefined),
    };
    const channel = {
      installTarget: "http://127.0.0.1:43123/token/artifact.tgz",
      descriptor: {
        kind: "loopback-buffer-v1" as const,
        sha512: ACTIVE_FINGERPRINT,
        bytes: 6,
        sourceFingerprint: "npm:@example/plugin@1.0.0",
      },
      close: vi.fn(async () => undefined),
    };
    let state = { version: 1 as const, generation: 3, fencingToken: 2, installs: [] };
    let journal: Record<string, unknown> | null = null;
    let removeAttempts = 0;
    const updateJournal = vi.fn(async (_home, current, patch) => {
      journal = {
        ...current,
        ...patch,
        revision: Number((current as { revision: number }).revision) + 1,
      };
      return journal as never;
    });
    const removeJournal = vi.fn(async () => {
      removeAttempts += 1;
      if (removeAttempts === 1) throw new Error("remove failed before rename");
      journal = null;
    });
    const common = {
      platform: "linux" as const,
      dshHome: "/dsh",
      acquireLock: vi.fn(async () => lock),
      readState: vi.fn(async () => state),
      writeState: vi.fn(async (_home, next) => {
        state = { ...next, generation: state.generation + 1, fencingToken: 7 };
        return state;
      }),
      readRecoveryJournal: vi.fn(async () => journal as never),
      updateRecoveryJournal: updateJournal,
      removeRecoveryJournal: removeJournal,
      fingerprintActiveProfile: vi.fn(async () => ACTIVE_FINGERPRINT),
      isProcessTreeAlive: vi.fn(async () => false),
      recoverTransaction: vi.fn(async () => undefined),
      finalizeRecoveredTransaction: vi.fn(async () => undefined),
      releaseRecoveredArtifact: vi.fn(async () => undefined),
      stdout: vi.fn(),
      stderr: vi.fn(),
    };

    const exitCode = await executePluginMutation(
      {
        operation: "add",
        entry: {
          id: "example-plugin",
          name: "Example Plugin",
          kind: "plugin",
          creator: { github: "example" },
          source: { repository: "https://github.com/example/plugin", commit: "a".repeat(40) },
          license: { spdx: "MIT" },
          dsh: { profiles: ["web"] },
          verification: { status: "verified" },
        } as never,
        profile: "web",
        dryRun: false,
        allowCodeExecution: true,
      },
      {
        ...common,
        stageEntry: vi.fn(async () => ({
          packageName: "@example/plugin",
          installTarget: "@example/plugin@1.0.0",
          displayTarget: "@example/plugin@1.0.0",
          fingerprint: "npm:@example/plugin@1.0.0",
          cacheRelativePath: ".dsh-plugins/cache/example",
          artifactLease: lease,
        })),
        runDsh: vi.fn(async () => 0),
        beginTransaction: vi.fn(async () => transaction),
        openArtifactChannel: vi.fn(async () => channel),
        createRecoveryJournal: vi.fn(async (_home, input) => {
          journal = {
            version: 1,
            revision: 1,
            status: "in_progress",
            phase: "needs_restore",
            ...input,
          };
          return journal as never;
        }),
        now: () => new Date("2026-08-16T12:00:00.000Z"),
      },
    );

    expect(exitCode).toBe(1);
    expect(journal).toMatchObject({ status: "completed", phase: "completed" });
    expect(transaction.rollback).not.toHaveBeenCalled();

    expect(await recoverPluginMutation(common)).toBe(0);
    expect(removeJournal).toHaveBeenCalledTimes(2);
    expect(journal).toBeNull();
  });
});
