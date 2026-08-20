import { readFile } from "node:fs/promises";

import { describe, expect, it, vi } from "vitest";

import { doctorCommand } from "../src/commands/doctor.js";

describe("native Windows mutation policy documentation", () => {
  it("keeps CLI help and README aligned with the fail-closed v0.1.0 boundary", async () => {
    const [app, readme, doctor] = await Promise.all([
      readFile(new URL("../src/app.ts", import.meta.url), "utf8"),
      readFile(new URL("../README.md", import.meta.url), "utf8"),
      readFile(new URL("../src/commands/doctor.ts", import.meta.url), "utf8"),
    ]);

    for (const text of [app, readme, doctor]) {
      expect(text).toMatch(/native Windows/iu);
      expect(text).toMatch(/WSL/u);
    }
    expect(readme).not.toMatch(/Windows[^\n]*whole[- ]tree[^\n]*(?:safe|proof)/iu);
  });

  it("reports the native Windows mutation boundary without probing process-tree recovery", async () => {
    const output: string[] = [];
    const isProcessTreeAlive = vi.fn(async () => false);
    const exitCode = await doctorCommand(
      {
        loadCatalog: async () => ({
          source: { kind: "directory" },
          entries: [],
          diagnostics: [],
        }),
        stdout: (value) => output.push(value),
        stderr: (value) => output.push(value),
      },
      undefined,
      false,
      {
        platform: "win32",
        nodeVersion: "20.0.0",
        probeDsh: async () => ({ status: "present", version: "1.2.3" }),
        resolveHome: () => "/unused",
        readState: async () => ({
          version: 1,
          installs: [],
          recoveryRequired: {
            processTree: { platform: "win32" },
          },
        } as never),
        isProcessTreeAlive,
      },
    );

    expect(exitCode).toBe(1);
    expect(output.join("")).toMatch(/native Windows.*WSL/iu);
    expect(output.join("")).toMatch(/manual/iu);
    expect(isProcessTreeAlive).not.toHaveBeenCalled();
  });
});
