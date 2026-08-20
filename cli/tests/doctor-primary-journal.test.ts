import { describe, expect, it, vi } from "vitest";

import { doctorCommand } from "../src/commands/doctor.js";

const context = (output: string[]) => ({
  loadCatalog: async () => ({ source: { kind: "directory" as const }, entries: [], diagnostics: [] }),
  stdout: (value: string) => output.push(value),
  stderr: (value: string) => output.push(value),
});

const primary = (overrides: Record<string, unknown> = {}) => ({
  version: 1,
  revision: 2,
  status: "recovery_required",
  phase: "needs_restore",
  ownerToken: "secret-owner-token",
  fencingToken: 9,
  profile: "web",
  processTree: {
    pid: 44,
    processGroupId: 44,
    treeIdentity: "secret-tree-identity",
    processStartIdentity: "secret-start-identity",
    platform: "linux",
  },
  ...overrides,
});

function runtime(output: string[], marker: unknown) {
  return {
    platform: "linux" as const,
    nodeVersion: "20.0.0",
    probeDsh: async () => ({ status: "present" as const, version: "1.2.3" }),
    readRecoveryJournal: vi.fn(async () => marker as never),
    readState: vi.fn(async () => ({ version: 1 as const, installs: [] })),
    resolveHome: () => "/not-exposed",
    isProcessTreeAlive: vi.fn(async () => false),
    stdout: (value: string) => output.push(value),
  };
}

describe("doctor primary mutation journal", () => {
  it("prefers a POSIX primary journal when the state mirror is absent", async () => {
    const output: string[] = [];
    const dependencies = runtime(output, primary());
    expect(await doctorCommand(context(output), undefined, false, dependencies)).toBe(1);
    expect(output.join("")).toMatch(/recovery.*pending/iu);
    expect(dependencies.readState).not.toHaveBeenCalled();
    expect(output.join("")).not.toContain("secret-owner-token");
    expect(output.join("")).not.toContain("secret-tree-identity");
    expect(output.join("")).not.toContain("/not-exposed");
  });

  it("reports completed primary cleanup without process probing", async () => {
    const output: string[] = [];
    const dependencies = runtime(output, primary({ status: "completed", phase: "completed" }));
    expect(await doctorCommand(context(output), undefined, false, dependencies)).toBe(1);
    expect(output.join("")).toMatch(/completed.*cleanup/iu);
    expect(dependencies.isProcessTreeAlive).not.toHaveBeenCalled();
  });

  it("keeps a Windows primary marker manual without liveness inference", async () => {
    const output: string[] = [];
    const dependencies = runtime(output, primary({
      processTree: { ...primary().processTree, platform: "win32" },
    }));
    expect(await doctorCommand(context(output), undefined, false, dependencies)).toBe(1);
    expect(output.join("")).toMatch(/native Windows.*manual/iu);
    expect(dependencies.isProcessTreeAlive).not.toHaveBeenCalled();
  });

  it("sanitizes an unreadable primary journal and does not fall through to state", async () => {
    const output: string[] = [];
    const dependencies = runtime(output, null);
    dependencies.readRecoveryJournal.mockRejectedValue(
      new Error("secret /absolute/path owner-token"),
    );
    expect(await doctorCommand(context(output), undefined, false, dependencies)).toBe(1);
    expect(output.join("")).toMatch(/journal.*safely/iu);
    expect(output.join("")).not.toMatch(/secret|absolute|owner-token/iu);
    expect(dependencies.readState).not.toHaveBeenCalled();
  });
});
