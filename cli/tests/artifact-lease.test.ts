import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { gunzipSync } from "node:zlib";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  stageCatalogEntry,
  type ProcessRequest,
  type StagedCatalogInstall,
} from "../src/dsh/staging.js";
import type { PublicCatalogEntry } from "../src/model.js";

const roots: string[] = [];

function tempRoot(prefix: string): string {
  const root = mkdtempSync(join(tmpdir(), prefix));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
});

function entryFor(packageDescriptor: PublicCatalogEntry["package"]): PublicCatalogEntry {
  return {
    schemaVersion: 1,
    id: "leased-plugin",
    name: "Leased Plugin",
    description: { en: "A leased test plugin.", evidencePath: "README.md" },
    unofficial: true,
    kind: "plugin",
    primaryCategory: "developer-tools",
    tags: ["test"],
    source: {
      repository: "https://github.com/creator/leased-plugin",
      repositoryNodeId: "R_leased",
      subpath: null,
      commit: "c".repeat(40),
    },
    creator: { github: "creator" },
    package: packageDescriptor,
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
    canonicalKey: "R_leased:.",
  };
}

async function stageNpm(home: string): Promise<{ staged: StagedCatalogInstall; bytes: Buffer }> {
  const bytes = Buffer.from("verified leased tarball");
  const integrity = `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
  const entry = entryFor({
    ecosystem: "npm",
    name: "@creator/leased-plugin",
    version: "1.0.0",
    integrity,
  });
  const fetchImpl = vi.fn(async (input: string | URL | Request) => {
    if (String(input).includes("%40creator%2Fleased-plugin")) {
      return new Response(JSON.stringify({
        versions: {
          "1.0.0": {
            dist: {
              integrity,
              tarball: "https://registry.npmjs.org/@creator/leased-plugin/-/leased-plugin-1.0.0.tgz",
            },
          },
        },
      }), { status: 200 });
    }
    return new Response(bytes, {
      status: 200,
      headers: { "content-length": String(bytes.length) },
    });
  });
  return {
    staged: await stageCatalogEntry(entry, { dshHome: home, fetchImpl: fetchImpl as typeof fetch }),
    bytes,
  };
}

describe("transaction-private artifact leases", () => {
  it("never returns the mutable shared cache pathname to the DSH consumer", async () => {
    const home = tempRoot("dsh-private-lease-");
    const { staged, bytes } = await stageNpm(home);

    expect(staged.installTarget).toContain(join(".dsh-plugins", "artifact-leases"));
    expect(staged.installTarget).not.toContain(join(".dsh-plugins", "cache"));
    expect(readFileSync(staged.installTarget)).toEqual(bytes);
    expect(staged.artifactLease.recoveryReference.relativePath).toContain("artifact-leases/");
    await expect(staged.artifactLease.revalidate()).resolves.toBeUndefined();
  });

  it("detects a file-to-symlink swap after transaction setup and before spawn", async () => {
    const home = tempRoot("dsh-private-symlink-");
    const outside = join(tempRoot("dsh-private-outside-"), "malicious.tgz");
    writeFileSync(outside, "malicious-after-verification");
    const { staged } = await stageNpm(home);

    rmSync(staged.installTarget);
    symlinkSync(outside, staged.installTarget);

    await expect(staged.artifactLease.revalidate()).rejects.toThrow(
      "transaction artifact changed; recovery required",
    );
  });

  it("detects same-content inode replacement by comparing the held descriptor", async () => {
    const home = tempRoot("dsh-private-inode-");
    const { staged, bytes } = await stageNpm(home);
    const displaced = `${staged.installTarget}.old`;
    renameSync(staged.installTarget, displaced);
    writeFileSync(staged.installTarget, bytes, { mode: 0o400 });

    await expect(staged.artifactLease.revalidate()).rejects.toThrow(
      "transaction artifact changed; recovery required",
    );
  });

  it("creates independent leases for concurrent consumers of one verified cache", async () => {
    const home = tempRoot("dsh-private-concurrent-");
    const first = await stageNpm(home);
    const second = await stageNpm(home);

    expect(first.staged.installTarget).not.toBe(second.staged.installTarget);
    expect(readFileSync(first.staged.installTarget)).toEqual(second.bytes);
    expect(readFileSync(second.staged.installTarget)).toEqual(first.bytes);
    await first.staged.artifactLease.release();
    expect(existsSync(dirname(first.staged.installTarget))).toBe(false);
    expect(existsSync(second.staged.installTarget)).toBe(true);
  });

  it("materializes source installs as deterministic private archives, never live directories", async () => {
    const home = tempRoot("dsh-source-archive-");
    const entry = entryFor({ ecosystem: "source" });
    const runProcess = vi.fn(async (request: ProcessRequest) => {
      if (request.args.includes("checkout")) {
        mkdirSync(join(request.cwd, "lib"), { recursive: true });
        writeFileSync(join(request.cwd, "package.json"), JSON.stringify({ name: "source-plugin" }));
        writeFileSync(join(request.cwd, "lib", "index.js"), "export default 1;\n");
      }
      return request.args.includes("rev-parse") ? `${entry.source.commit}\n` : "";
    });

    const first = await stageCatalogEntry(entry, { dshHome: home, runProcess });
    const second = await stageCatalogEntry(entry, { dshHome: home, runProcess });
    expect(first.installTarget.endsWith(".tgz")).toBe(true);
    expect(first.installTarget.startsWith("file:")).toBe(false);
    expect(readFileSync(first.installTarget)).toEqual(readFileSync(second.installTarget));
    const tar = gunzipSync(readFileSync(first.installTarget));
    expect(tar.subarray(0, 100).toString("utf8")).toContain("package/");
    expect(tar.includes(Buffer.from("source-plugin"))).toBe(true);
    await expect(first.artifactLease.revalidate()).resolves.toBeUndefined();
  });
});
