import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  beginProfileTransaction,
  recoverProfileTransaction,
} from "../src/dsh/profileTransaction.js";

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("crash-idempotent profile recovery", () => {
  it("retries safely after backup was renamed to active but the journal still exists", async () => {
    const home = mkdtempSync(join(tmpdir(), "dsh-recovery-rename-crash-"));
    roots.push(home);
    const active = join(home, "profiles", "web");
    mkdirSync(active, { recursive: true });
    writeFileSync(join(active, "package.json"), "before\n");
    const transaction = await beginProfileTransaction(home, "web", { fencingToken: 7 });
    writeFileSync(join(active, "package.json"), "after\n");

    const reference = transaction.recoveryReference;
    expect(reference.backupFingerprint).toMatch(/^sha512-/u);
    rmSync(active, { recursive: true, force: true });
    renameSync(join(home, reference.backupRelativePath), active);
    expect(existsSync(join(home, reference.journalRelativePath))).toBe(true);
    expect(existsSync(join(home, reference.backupRelativePath))).toBe(false);

    await expect(recoverProfileTransaction(
      home,
      reference,
      async () => undefined,
    )).resolves.toBeUndefined();

    expect(readFileSync(join(active, "package.json"), "utf8")).toBe("before\n");
    expect(existsSync(join(home, reference.journalRelativePath))).toBe(true);
  });
});
