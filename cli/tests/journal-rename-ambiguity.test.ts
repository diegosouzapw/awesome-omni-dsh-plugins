import { createHash } from "node:crypto";
import { mkdir, mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it, vi } from "vitest";

import {
  updateJournalAuthoritatively,
  type RecoveryDependencies,
} from "../src/commands/mutate.js";
import {
  createMutationRecoveryJournal,
  MutationRecoveryJournalAuthorityUnknownError,
  MutationRecoveryJournalDurabilityAmbiguousError,
  readMutationRecoveryJournal,
  removeCompletedMutationRecoveryJournal,
  updateMutationRecoveryJournal,
  type MutationRecoveryJournal,
  type MutationRecoveryJournalPatch,
} from "../src/dsh/mutationRecoveryJournal.js";

const SHA512 = `sha512-${createHash("sha512").update("profile").digest("base64")}`;
const SHA256 = `sha256:${createHash("sha256").update(JSON.stringify({ version: 1, installs: [] })).digest("hex")}`;

async function fixture() {
  const home = await mkdtemp(join(tmpdir(), "dsh-journal-ambiguity-"));
  await mkdir(join(home, "profiles"));
  const journal = await createMutationRecoveryJournal(home, {
    ownerToken: "owner-one",
    fencingToken: 1,
    profile: "web",
    transaction: {
      profile: "web",
      fencingToken: 1,
      existed: false,
      journalRelativePath: "profiles/.dsh-plugins-transaction-web-one.json",
      backupRelativePath: "profiles/.dsh-plugins-backup-web-one",
      backupFingerprint: null,
    },
    artifact: null,
    channel: null,
    createdAt: "2026-08-16T12:00:00.000Z",
    decision: "undecided",
    stateEvidence: {
      oldGeneration: 0,
      oldFingerprint: SHA256,
      oldInstalls: [],
      intendedFingerprint: SHA256,
      intendedInstalls: [],
    },
  });
  return { home, journal };
}

function reconciliationDependencies(
  updateRecoveryJournal: RecoveryDependencies["updateRecoveryJournal"],
  readRecoveryJournal: RecoveryDependencies["readRecoveryJournal"],
): RecoveryDependencies {
  return { updateRecoveryJournal, readRecoveryJournal } as RecoveryDependencies;
}

describe("mutation journal rename/fsync ambiguity", () => {
  it("exposes possiblyPublished while each visible decision/phase remains authoritative", async () => {
    const { home, journal: initial } = await fixture();
    let current = initial;
    const patches = [
      { decision: "roll_forward" as const, phase: "dsh_succeeded" as const, activeFingerprint: SHA512 },
      { phase: "state_published" as const },
      { phase: "profile_finalized" as const },
      { phase: "artifact_released" as const },
      { phase: "completed" as const, status: "completed" as const },
    ];
    const updateWithFault = updateMutationRecoveryJournal as unknown as (
      home: string,
      expected: typeof current,
      patch: (typeof patches)[number],
      dependencies: { syncDirectory: (path: string) => Promise<void> },
    ) => Promise<typeof current>;

    for (const patch of patches) {
      const before = current;
      await expect(updateWithFault(home, before, patch, {
        syncDirectory: async () => { throw new Error("directory fsync failed"); },
      })).rejects.toMatchObject({ possiblyPublished: true });
      const visible = await readMutationRecoveryJournal(home);
      expect(visible).not.toBeNull();
      expect(visible?.revision).toBe(before.revision + 1);
      expect(visible).toMatchObject(patch);
      current = visible!;
    }
  });

  it("adopts only its exact next revision after a typed durability ambiguity", async () => {
    const { home, journal } = await fixture();
    const patch: MutationRecoveryJournalPatch = { status: "recovery_required" };
    const visible = {
      ...journal,
      ...patch,
      revision: journal.revision + 1,
    } as MutationRecoveryJournal;
    const readRecoveryJournal = vi.fn(async () => visible);

    await expect(updateJournalAuthoritatively(
      reconciliationDependencies(
        vi.fn(async () => {
          throw new MutationRecoveryJournalDurabilityAmbiguousError("update");
        }),
        readRecoveryJournal,
      ),
      home,
      journal,
      patch,
    )).resolves.toEqual(visible);
    expect(readRecoveryJournal).toHaveBeenCalledOnce();
  });

  it("propagates generic update errors without consulting or adopting disk", async () => {
    const { home, journal } = await fixture();
    const patch: MutationRecoveryJournalPatch = { status: "recovery_required" };
    const genericError = Object.assign(new Error("ownership changed"), {
      possiblyPublished: true,
    });
    const readRecoveryJournal = vi.fn(async () => ({
      ...journal,
      ...patch,
      revision: journal.revision + 1,
    } as MutationRecoveryJournal));

    await expect(updateJournalAuthoritatively(
      reconciliationDependencies(
        vi.fn(async () => { throw genericError; }),
        readRecoveryJournal,
      ),
      home,
      journal,
      patch,
    )).rejects.toBe(genericError);
    expect(readRecoveryJournal).not.toHaveBeenCalled();
  });

  it("returns typed authority-unknown when an ambiguous publication cannot be reread", async () => {
    const { home, journal } = await fixture();
    const patch: MutationRecoveryJournalPatch = { status: "recovery_required" };

    await expect(updateJournalAuthoritatively(
      reconciliationDependencies(
        vi.fn(async () => {
          throw new MutationRecoveryJournalDurabilityAmbiguousError("update");
        }),
        vi.fn(async () => { throw new Error("marker unreadable"); }),
      ),
      home,
      journal,
      patch,
    )).rejects.toBeInstanceOf(MutationRecoveryJournalAuthorityUnknownError);
  });

  it.each([
    ["later revision", (next: MutationRecoveryJournal) => ({
      ...next,
      revision: next.revision + 1,
    })],
    ["different owner", (next: MutationRecoveryJournal) => ({
      ...next,
      ownerToken: "owner-two",
    })],
    ["different fencing token", (next: MutationRecoveryJournal) => ({
      ...next,
      fencingToken: next.fencingToken + 1,
    })],
    ["different transaction", (next: MutationRecoveryJournal) => ({
      ...next,
      transaction: {
        ...next.transaction,
        journalRelativePath: "profiles/.dsh-plugins-transaction-web-other.json",
      },
    })],
    ["unexpected phase with the same patch", (next: MutationRecoveryJournal) => ({
      ...next,
      phase: "profile_restored" as const,
    })],
    ["unexpected decision with the same patch", (next: MutationRecoveryJournal) => ({
      ...next,
      decision: "rollback" as const,
    })],
  ] as const)("rejects %s instead of adopting another writer", async (_label, mutateVisible) => {
    const { home, journal } = await fixture();
    const patch: MutationRecoveryJournalPatch = { status: "recovery_required" };
    const exactNext = {
      ...journal,
      ...patch,
      revision: journal.revision + 1,
    } as MutationRecoveryJournal;
    const visible = mutateVisible(exactNext) as MutationRecoveryJournal;

    await expect(updateJournalAuthoritatively(
      reconciliationDependencies(
        vi.fn(async () => {
          throw new MutationRecoveryJournalDurabilityAmbiguousError("update");
        }),
        vi.fn(async () => visible),
      ),
      home,
      journal,
      patch,
    )).rejects.toBeInstanceOf(MutationRecoveryJournalAuthorityUnknownError);
  });

  it("keeps completed active before rename failure and treats post-rename failure as ambiguous removal", async () => {
    const before = await fixture();
    const completed = await updateMutationRecoveryJournal(before.home, before.journal, {
      phase: "completed",
      status: "completed",
    });
    const removeWithFault = removeCompletedMutationRecoveryJournal as unknown as (
      home: string,
      expected: typeof completed,
      dependencies: {
        beforeRename?: () => Promise<void>;
        afterRename?: () => Promise<void>;
      },
    ) => Promise<void>;

    await expect(removeWithFault(before.home, completed, {
      beforeRename: async () => { throw new Error("before rename"); },
    })).rejects.toThrow();
    expect(await readMutationRecoveryJournal(before.home)).toMatchObject({
      phase: "completed",
      status: "completed",
    });
    await removeCompletedMutationRecoveryJournal(before.home, completed);
    expect(await readMutationRecoveryJournal(before.home)).toBeNull();

    const after = await fixture();
    const afterCompleted = await updateMutationRecoveryJournal(after.home, after.journal, {
      phase: "completed",
      status: "completed",
    });
    await expect(removeWithFault(after.home, afterCompleted, {
      afterRename: async () => { throw new Error("after rename"); },
    })).rejects.toMatchObject({ possiblyPublished: true });
    expect(await readMutationRecoveryJournal(after.home)).toBeNull();
  });
});
