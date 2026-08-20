import { describe, expect, it } from "vitest";

import { runCli, type CliDependencies } from "../src/app.js";
import { loadDefaultCatalog } from "../src/catalogSource.js";

function harness(loadCatalog: CliDependencies["loadCatalog"]) {
  let stdout = "";
  let stderr = "";
  const dependencies: CliDependencies = {
    loadCatalog,
    stdout: (value) => {
      stdout += value;
    },
    stderr: (value) => {
      stderr += value;
    },
  };
  return { dependencies, output: () => ({ stdout, stderr }) };
}

describe("CLI failure output", () => {
  it("explains a remote catalog URL without --revision instead of failing silently", async () => {
    const { dependencies, output } = harness(loadDefaultCatalog);

    const exitCode = await runCli(
      [
        "add",
        "fixture-plugin",
        "--profile",
        "web",
        "--catalog",
        "https://raw.githubusercontent.com/diegosouzapw/awesome-omni-dsh-plugins/main/catalog.snapshot.json",
      ],
      dependencies,
    );

    expect(exitCode).toBe(1);
    expect(output().stderr).toContain("remote catalog snapshots require an exact revision");
    expect(output().stderr).toContain("Command failed safely; no changes were made.");
  });

  it("keeps unexpected internal error details out of the failure output", async () => {
    const { dependencies, output } = harness(async () => {
      throw new Error("boom-internal-detail");
    });

    const exitCode = await runCli(
      ["add", "fixture-plugin", "--profile", "web"],
      dependencies,
    );

    expect(exitCode).toBe(1);
    expect(output().stderr).toContain(
      "Operation failed safely; no unverified changes were accepted.",
    );
    expect(output().stderr).toContain("Command failed safely; no changes were made.");
    expect(output().stderr).not.toContain("boom-internal-detail");
    // Stack-frame marker: a leaked V8 stack always renders " at /abs/path".
    expect(output().stderr).not.toContain(" at /");
    expect(output().stdout).not.toContain(" at /");
  });
});
