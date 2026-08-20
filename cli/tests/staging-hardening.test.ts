import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_STAGE_BUDGETS,
  stageCatalogEntry,
  type ProcessRequest,
} from "../src/dsh/staging.js";
import type { PublicCatalogEntry } from "../src/model.js";

const roots: string[] = [];

function tempRoot(prefix: string): string {
  const root = mkdtempSync(join(tmpdir(), prefix));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

function entryFor(
  packageDescriptor: PublicCatalogEntry["package"],
): PublicCatalogEntry {
  return {
    schemaVersion: 1,
    id: "bounded-plugin",
    name: "Bounded Plugin",
    description: { en: "A bounded test plugin.", evidencePath: "README.md" },
    unofficial: true,
    kind: "plugin",
    primaryCategory: "developer-tools",
    tags: ["test"],
    source: {
      repository: "https://github.com/creator/bounded-plugin",
      repositoryNodeId: "R_bounded",
      subpath: null,
      commit: "b".repeat(40),
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
    canonicalKey: "R_bounded:.",
  };
}

function npmFixture(bytes = Buffer.from("verified tarball")) {
  const integrity = `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
  const entry = entryFor({
    ecosystem: "npm",
    name: "@creator/bounded-plugin",
    version: "1.2.3",
    integrity,
  });
  const fetchImpl = vi.fn(async (input: string | URL | Request) => {
    if (String(input).includes("%40creator%2Fbounded-plugin")) {
      return new Response(JSON.stringify({
        versions: {
          "1.2.3": {
            dist: {
              integrity,
              tarball:
                "https://registry.npmjs.org/@creator/bounded-plugin/-/bounded-plugin-1.2.3.tgz",
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
  return { bytes, entry, fetchImpl };
}

describe("immutable cache acceptance", () => {
  it("rehashes a cached npm tarball and quarantines then refetches tampered content", async () => {
    const home = tempRoot("dsh-cache-rehash-");
    const fixture = npmFixture();
    const first = await stageCatalogEntry(fixture.entry, {
      dshHome: home,
      fetchImpl: fixture.fetchImpl as typeof fetch,
    });
    writeFileSync(
      join(home, ".dsh-plugins", "cache", first.cacheRelativePath),
      "tampered-cache-content",
    );

    const second = await stageCatalogEntry(fixture.entry, {
      dshHome: home,
      fetchImpl: fixture.fetchImpl as typeof fetch,
    });

    expect(fixture.fetchImpl).toHaveBeenCalledTimes(4);
    expect(readFileSync(second.installTarget)).toEqual(fixture.bytes);
    expect(readdirSync(join(home, ".dsh-plugins", "cache", "bounded-plugin")))
      .not.toContain(expect.stringContaining("quarantine"));
  });

  it("never accepts a tampered or symlinked npm cache while offline", async () => {
    const home = tempRoot("dsh-cache-offline-");
    const outside = join(tempRoot("dsh-cache-outside-"), "outside.tgz");
    writeFileSync(outside, "attacker content");
    const fixture = npmFixture();
    const staged = await stageCatalogEntry(fixture.entry, {
      dshHome: home,
      fetchImpl: fixture.fetchImpl as typeof fetch,
    });
    const cachedArtifact = join(home, ".dsh-plugins", "cache", staged.cacheRelativePath);
    rmSync(cachedArtifact);
    symlinkSync(outside, cachedArtifact);
    const fetchImpl = vi.fn(async () => new Response("must not fetch"));

    await expect(stageCatalogEntry(fixture.entry, {
      dshHome: home,
      fetchImpl: fetchImpl as typeof fetch,
      offline: true,
    })).rejects.toThrow("cached artifact failed verification while offline");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rehashes the complete source cache and checks its commit pin metadata", async () => {
    const home = tempRoot("dsh-source-cache-");
    const entry = entryFor({ ecosystem: "source" });
    const runProcess = vi.fn(async (request: ProcessRequest) => {
      if (request.args.includes("checkout")) {
        writeFileSync(join(request.cwd, "package.json"), JSON.stringify({ name: "source-plugin" }));
        writeFileSync(join(request.cwd, "index.js"), "export default 1;\n");
      }
      return request.args.includes("rev-parse") ? `${entry.source.commit}\n` : "";
    });
    const staged = await stageCatalogEntry(entry, { dshHome: home, runProcess });
    writeFileSync(
      join(home, ".dsh-plugins", "cache", staged.cacheRelativePath, "index.js"),
      "tampered\n",
    );

    await expect(stageCatalogEntry(entry, {
      dshHome: home,
      runProcess,
      offline: true,
    })).rejects.toThrow("cached artifact failed verification while offline");
  });
});

describe("bounded downloads", () => {
  it("cancels a chunked body immediately after the configured byte budget", async () => {
    const home = tempRoot("dsh-stream-limit-");
    const fixture = npmFixture();
    let pulls = 0;
    let cancellations = 0;
    const fetchImpl = vi.fn(async () => new Response(new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        controller.enqueue(new Uint8Array(600));
        if (pulls === 10) controller.close();
      },
      cancel() {
        cancellations += 1;
      },
    }, { highWaterMark: 0 }), { status: 200 }));

    await expect(stageCatalogEntry(fixture.entry, {
      dshHome: home,
      fetchImpl: fetchImpl as typeof fetch,
      budgets: { metadataBytes: 1024 },
    })).rejects.toThrow("download exceeds the safe size limit");
    expect(pulls).toBeLessThanOrEqual(2);
    expect(cancellations).toBe(1);
  });

  it("rejects malformed and understated Content-Length values", async () => {
    for (const contentLength of ["invalid", "1"]) {
      const home = tempRoot("dsh-content-length-");
      const fixture = npmFixture();
      const fetchImpl = vi.fn(async () => new Response("not-one-byte", {
        status: 200,
        headers: { "content-length": contentLength },
      }));
      await expect(stageCatalogEntry(fixture.entry, {
        dshHome: home,
        fetchImpl: fetchImpl as typeof fetch,
      })).rejects.toThrow("download Content-Length is invalid");
    }
  });

  it("aborts a fetch that never resolves within the configured deadline", async () => {
    const home = tempRoot("dsh-fetch-deadline-");
    const fixture = npmFixture();
    let aborted = false;
    const fetchImpl = vi.fn((_input: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          aborted = true;
          reject(new DOMException("aborted", "AbortError"));
        }, { once: true });
      }));

    await expect(stageCatalogEntry(fixture.entry, {
      dshHome: home,
      fetchImpl: fetchImpl as typeof fetch,
      budgets: { fetchTimeoutMs: 20 },
    })).rejects.toThrow("download timed out");
    expect(aborted).toBe(true);
  });
});

describe("bounded source materialization", () => {
  it("enforces configured byte, file and path-depth budgets and cleans temporary staging", async () => {
    const home = tempRoot("dsh-source-budget-");
    const entry = entryFor({ ecosystem: "source" });
    const runProcess = vi.fn(async (request: ProcessRequest) => {
      if (request.args.includes("checkout")) {
        writeFileSync(join(request.cwd, "package.json"), JSON.stringify({ name: "source-plugin" }));
        mkdirSync(join(request.cwd, "a", "b", "c"), { recursive: true });
        writeFileSync(join(request.cwd, "a", "b", "c", "large.bin"), Buffer.alloc(256));
      }
      return request.args.includes("rev-parse") ? `${entry.source.commit}\n` : "";
    });

    await expect(stageCatalogEntry(entry, {
      dshHome: home,
      runProcess,
      budgets: { sourceBytes: 128, sourceFiles: 3, sourceDepth: 2 },
    })).rejects.toThrow(/source tree exceeds the (byte|file|depth) limit/u);
    const idRoot = join(home, ".dsh-plugins", "cache", "bounded-plugin");
    expect(existsSync(idRoot) ? readdirSync(idRoot).some((name) => name.startsWith(".stage-")) : false)
      .toBe(false);
  });

  it("rejects submodules and Git LFS pointer content", async () => {
    const entry = entryFor({ ecosystem: "source" });
    for (const unsafe of ["submodule", "lfs"] as const) {
      const home = tempRoot(`dsh-source-${unsafe}-`);
      const runProcess = vi.fn(async (request: ProcessRequest) => {
        if (request.args.includes("checkout")) {
          writeFileSync(join(request.cwd, "package.json"), JSON.stringify({ name: "source-plugin" }));
          if (unsafe === "submodule") {
            writeFileSync(join(request.cwd, ".gitmodules"), "[submodule \"x\"]\n");
          } else {
            writeFileSync(
              join(request.cwd, "asset.bin"),
              "version https://git-lfs.github.com/spec/v1\noid sha256:abc\nsize 1\n",
            );
          }
        }
        return request.args.includes("rev-parse") ? `${entry.source.commit}\n` : "";
      });
      await expect(stageCatalogEntry(entry, { dshHome: home, runProcess })).rejects.toThrow(
        unsafe === "submodule" ? "source tree contains submodules" : "source tree contains Git LFS content",
      );
    }
  });

  it("exports finite defaults for every network, process and source resource budget", () => {
    expect(DEFAULT_STAGE_BUDGETS).toMatchObject({
      metadataBytes: expect.any(Number),
      tarballBytes: expect.any(Number),
      sourceBytes: expect.any(Number),
      sourceFiles: expect.any(Number),
      sourceDepth: expect.any(Number),
      fetchTimeoutMs: expect.any(Number),
      gitTimeoutMs: expect.any(Number),
      killGraceMs: expect.any(Number),
      gitReapTimeoutMs: expect.any(Number),
    });
    for (const value of Object.values(DEFAULT_STAGE_BUDGETS)) {
      expect(value).toBeGreaterThan(0);
      expect(Number.isFinite(value)).toBe(true);
    }
  });
});
