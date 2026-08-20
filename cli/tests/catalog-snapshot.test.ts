import { execFileSync } from "node:child_process";
import { EventEmitter } from "node:events";
import { access, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough } from "node:stream";

import { afterEach, describe, expect, it } from "vitest";

import {
  CATALOG_SNAPSHOT_FORMAT_V1,
  PUBLIC_CATALOG_RAW_ORIGIN,
  PUBLIC_SNAPSHOT_SITE_URL,
  materializeCatalog,
} from "../src/catalogSnapshot.js";
import type { ChildSpawn } from "../src/dsh/childSupervisor.js";
import { CliSafetyError } from "../src/errors.js";

const REVISION_A = "a".repeat(40);
const REVISION_B = "b".repeat(40);
const temporaryRoots: string[] = [];

function snapshot(
  files: Record<string, string>,
  revision = REVISION_A,
): string {
  return JSON.stringify({
    format: CATALOG_SNAPSHOT_FORMAT_V1,
    revision,
    files,
  });
}

function publicSnapshotUrl(revision = REVISION_A): string {
  return `${PUBLIC_CATALOG_RAW_ORIGIN}/${revision}/catalog.snapshot.json`;
}

async function temporaryRoot(prefix: string): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), prefix));
  temporaryRoots.push(root);
  return root;
}

function git(root: string, args: readonly string[]): string {
  return execFileSync("git", [...args], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

async function initializeGitRepository(
  root: string,
  ignoredFiles: readonly string[] = [],
): Promise<string> {
  git(root, ["init", "--quiet"]);
  git(root, ["config", "user.name", "Catalog Test"]);
  git(root, ["config", "user.email", "catalog-test@example.invalid"]);
  await writeFile(join(root, "README.md"), "# Catalog fixture\n");
  if (ignoredFiles.length > 0) {
    await writeFile(join(root, ".gitignore"), `${ignoredFiles.join("\n")}\n`);
  }
  git(root, ["add", "-A"]);
  git(root, ["commit", "--quiet", "-m", "catalog fixture"]);
  return git(root, ["rev-parse", "HEAD"]);
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe("catalog snapshot materialization", () => {
  it("returns a canonical local directory without taking ownership of it", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-directory-");
    await mkdir(join(sourceRoot, "catalog/plugins"), { recursive: true });

    const materialized = await materializeCatalog({ kind: "directory", root: sourceRoot });

    expect(materialized).toMatchObject({
      kind: "directory",
      root: await realpath(sourceRoot),
    });
    await materialized.cleanup();
    await materialized.cleanup();
    await expect(access(sourceRoot)).resolves.toBeUndefined();
  });

  it("materializes a pinned directory into an owned temporary root", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-git-");
    const revision = await initializeGitRepository(sourceRoot);

    const materialized = await materializeCatalog({
      kind: "directory",
      root: sourceRoot,
      revision,
    });

    expect(materialized).toMatchObject({ kind: "snapshot", revision });
    expect(materialized.root).not.toBe(await realpath(sourceRoot));
    await materialized.cleanup();
    await expect(access(sourceRoot)).resolves.toBeUndefined();
  });

  it("rejects a declared revision for a non-Git local directory", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-non-git-");

    await expect(
      materializeCatalog({ kind: "directory", root: sourceRoot, revision: REVISION_A }),
    ).rejects.toBeInstanceOf(CliSafetyError);
  });

  it("materializes the selected commit even when HEAD has advanced", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-wrong-head-");
    await mkdir(join(sourceRoot, "schemas"), { recursive: true });
    await writeFile(join(sourceRoot, "schemas/version.txt"), "selected commit\n");
    const previousRevision = await initializeGitRepository(sourceRoot);
    await writeFile(join(sourceRoot, "schemas/version.txt"), "new HEAD\n");
    git(sourceRoot, ["add", "schemas/version.txt"]);
    git(sourceRoot, ["commit", "--quiet", "-m", "second revision"]);

    const materialized = await materializeCatalog({
      kind: "directory",
      root: sourceRoot,
      revision: previousRevision,
    });

    expect(await readFile(join(materialized.root, "schemas/version.txt"), "utf8"))
      .toBe("selected commit\n");
    expect(await readFile(join(sourceRoot, "schemas/version.txt"), "utf8")).toBe("new HEAD\n");
    await materialized.cleanup();
  });

  it("ignores tracked working-tree modifications and reads the committed blob", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-dirty-");
    await mkdir(join(sourceRoot, "catalog/plugins"), { recursive: true });
    const pluginPath = join(sourceRoot, "catalog/plugins/example.yaml");
    await writeFile(pluginPath, "id: committed\n");
    const revision = await initializeGitRepository(sourceRoot);
    await writeFile(pluginPath, "id: dirty-working-tree\n");

    const materialized = await materializeCatalog({ kind: "directory", root: sourceRoot, revision });

    expect(await readFile(join(materialized.root, "catalog/plugins/example.yaml"), "utf8"))
      .toBe("id: committed\n");
    await materialized.cleanup();
  });

  it("materializes a local JSON snapshot and cleans it up idempotently", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-file-");
    const sourcePath = join(sourceRoot, "catalog.snapshot.json");
    await writeFile(
      sourcePath,
      snapshot({
        "schemas/plugin.schema.json": "{\"type\":\"object\"}\n",
        "catalog/plugins/example.yaml": "schemaVersion: 1\nid: example\n",
      }),
    );

    const materialized = await materializeCatalog({
      kind: "snapshot-file",
      path: sourcePath,
    });
    if (materialized.kind !== "snapshot") throw new Error("expected snapshot result");

    expect(materialized.revision).toBe(REVISION_A);
    expect(await readFile(join(materialized.root, "catalog/plugins/example.yaml"), "utf8"))
      .toBe("schemaVersion: 1\nid: example\n");
    const stagedRoot = materialized.root;
    await materialized.cleanup();
    await materialized.cleanup();
    await expect(access(stagedRoot)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("rejects a pinned snapshot file whose declared revision does not match the requested commit", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-file-git-");
    const sourcePath = join(sourceRoot, "catalog.snapshot.json");
    await writeFile(
      sourcePath,
      snapshot({ "schemas/from-commit.txt": "committed snapshot bytes\n" }, REVISION_A),
    );
    const revision = await initializeGitRepository(sourceRoot);
    expect(revision).not.toBe(REVISION_A);
    await writeFile(sourcePath, "working tree replacement is not JSON\n");

    // The committed blob declares REVISION_A while the pin requests the actual
    // commit; rebadging the snapshot as "verified at <revision>" must fail with
    // the same mismatch validation the snapshot-URL path applies. The specific
    // mismatch message also proves the bytes came from the tracked commit blob:
    // reading the working-tree replacement would fail JSON parsing instead.
    await expect(
      materializeCatalog({
        kind: "snapshot-file",
        path: sourcePath,
        revision,
      }),
    ).rejects.toMatchObject({
      name: "CliSafetyError",
      message: "catalog snapshot revision does not match the requested commit",
    });
  });

  it("rejects an ignored or untracked local snapshot absent from the selected commit", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-file-untracked-");
    const revision = await initializeGitRepository(sourceRoot, ["catalog.snapshot.json"]);
    const sourcePath = join(sourceRoot, "catalog.snapshot.json");
    await writeFile(sourcePath, snapshot({}, REVISION_A));

    await expect(
      materializeCatalog({ kind: "snapshot-file", path: sourcePath, revision }),
    ).rejects.toBeInstanceOf(CliSafetyError);
  });

  it("rejects a symlink recorded in the selected catalog tree", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-tree-symlink-");
    await mkdir(join(sourceRoot, "catalog/plugins"), { recursive: true });
    await symlink("../target.yaml", join(sourceRoot, "catalog/plugins/link.yaml"));
    const revision = await initializeGitRepository(sourceRoot);

    await expect(
      materializeCatalog({ kind: "directory", root: sourceRoot, revision }),
    ).rejects.toBeInstanceOf(CliSafetyError);
  });

  it("rejects a gitlink recorded in the selected catalog tree", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-tree-gitlink-");
    const parentRevision = await initializeGitRepository(sourceRoot);
    git(sourceRoot, [
      "update-index",
      "--add",
      "--cacheinfo",
      `160000,${parentRevision},catalog/plugins/nested-repository`,
    ]);
    git(sourceRoot, ["commit", "--quiet", "-m", "add gitlink"]);
    const revision = git(sourceRoot, ["rev-parse", "HEAD"]);

    await expect(
      materializeCatalog({ kind: "directory", root: sourceRoot, revision }),
    ).rejects.toBeInstanceOf(CliSafetyError);
  });

  it("rejects unsafe and over-deep paths recorded in the selected tree", async () => {
    const unsafeRoot = await temporaryRoot("dsh-catalog-tree-unsafe-");
    await mkdir(join(unsafeRoot, "catalog/plugins"), { recursive: true });
    await writeFile(join(unsafeRoot, "catalog/plugins/%2e%2e.yaml"), "unsafe\n");
    const unsafeRevision = await initializeGitRepository(unsafeRoot);

    await expect(
      materializeCatalog({ kind: "directory", root: unsafeRoot, revision: unsafeRevision }),
    ).rejects.toBeInstanceOf(CliSafetyError);

    const deepRoot = await temporaryRoot("dsh-catalog-tree-deep-");
    const deepPath = join(deepRoot, "schemas", ...Array.from({ length: 20 }, () => "level"));
    await mkdir(deepPath, { recursive: true });
    await writeFile(join(deepPath, "schema.json"), "{}\n");
    const deepRevision = await initializeGitRepository(deepRoot);

    await expect(
      materializeCatalog({ kind: "directory", root: deepRoot, revision: deepRevision }),
    ).rejects.toBeInstanceOf(CliSafetyError);
  });

  it("accepts an intentional zero-entry snapshot", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-empty-");
    const sourcePath = join(sourceRoot, "catalog.snapshot.json");
    await writeFile(sourcePath, snapshot({}));

    const materialized = await materializeCatalog({ kind: "snapshot-file", path: sourcePath });
    if (materialized.kind !== "snapshot") throw new Error("expected snapshot result");

    expect(materialized.revision).toBe(REVISION_A);
    expect(materialized.root).toBe(await realpath(materialized.root));
    await materialized.cleanup();
  });

  it("fetches only a pinned public raw snapshot without credentials", async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const fetchSnapshot = async (url: string, init: RequestInit): Promise<Response> => {
      calls.push({ url, init });
      return new Response(snapshot({}), {
        status: 200,
        headers: { "content-length": String(Buffer.byteLength(snapshot({}))) },
      });
    };

    const materialized = await materializeCatalog(
      { kind: "snapshot-url", url: publicSnapshotUrl(), revision: REVISION_A },
      { fetch: fetchSnapshot },
    );

    expect(materialized).toMatchObject({ kind: "snapshot", revision: REVISION_A });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe(publicSnapshotUrl());
    expect(calls[0]?.init.redirect).toBe("manual");
    expect(calls[0]?.init.credentials).toBe("omit");
    const headers = new Headers(calls[0]?.init.headers);
    expect(headers.has("authorization")).toBe(false);
    expect(headers.has("cookie")).toBe(false);
    await materialized.cleanup();
  });

  it("fetches the site-hosted snapshot when its declared revision matches the requested pin", async () => {
    // REV-44: a snapshot committed to the catalog repository can never declare its own commit,
    // so the site-hosted stable URL is the operational remote source. The caller's revision
    // remains the out-of-band anchor.
    const calls: string[] = [];
    const fetchSnapshot = async (url: string): Promise<Response> => {
      calls.push(url);
      return new Response(snapshot({}, REVISION_A), { status: 200 });
    };

    const materialized = await materializeCatalog(
      { kind: "snapshot-url", url: PUBLIC_SNAPSHOT_SITE_URL, revision: REVISION_A },
      { fetch: fetchSnapshot },
    );

    expect(materialized).toMatchObject({ kind: "snapshot", revision: REVISION_A });
    expect(calls).toEqual([PUBLIC_SNAPSHOT_SITE_URL]);
    await materialized.cleanup();
  });

  it("rejects a site-hosted snapshot whose declared revision differs from the requested pin", async () => {
    const fetchSnapshot = async (): Promise<Response> =>
      new Response(snapshot({}, REVISION_B), { status: 200 });

    await expect(
      materializeCatalog(
        { kind: "snapshot-url", url: PUBLIC_SNAPSHOT_SITE_URL, revision: REVISION_A },
        { fetch: fetchSnapshot },
      ),
    ).rejects.toBeInstanceOf(CliSafetyError);
  });

  it.each([
    "https://dsh-plugins.omniroute.online/other.json",
    "https://dsh-plugins.omniroute.online/catalog.snapshot.json?x=1",
    "https://dsh-plugins.omniroute.online:8443/catalog.snapshot.json",
    "https://evil.invalid/catalog.snapshot.json",
  ])("rejects the near-miss site URL %s without fetching", async (badUrl) => {
    let fetched = false;
    const fetchSnapshot = async (): Promise<Response> => {
      fetched = true;
      return new Response(snapshot({}, REVISION_A));
    };

    await expect(
      materializeCatalog(
        { kind: "snapshot-url", url: badUrl, revision: REVISION_A },
        { fetch: fetchSnapshot },
      ),
    ).rejects.toBeInstanceOf(CliSafetyError);
    expect(fetched).toBe(false);
  });

  it("aborts a stalled response body at the configured deadline and cancels its reader", async () => {
    let requestedSignal: AbortSignal | null = null;
    let readerCanceled = false;
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("{"));
      },
      cancel() {
        readerCanceled = true;
      },
    });
    const fetchSnapshot = async (_url: string, init: RequestInit): Promise<Response> => {
      requestedSignal = init.signal ?? null;
      return new Response(body, { status: 200 });
    };

    const operation = materializeCatalog(
      { kind: "snapshot-url", url: publicSnapshotUrl(), revision: REVISION_A },
      { fetch: fetchSnapshot, fetchTimeoutMs: 40 },
    );
    const guarded = Promise.race([
      operation,
      new Promise<never>((_resolve, reject) => {
        setTimeout(() => reject(new Error("catalog fetch deadline was not enforced")), 300);
      }),
    ]);

    await expect(guarded).rejects.toBeInstanceOf(CliSafetyError);
    expect((requestedSignal as AbortSignal | null)?.aborted).toBe(true);
    expect(readerCanceled).toBe(true);
  });

  it("rejects a URL whose embedded commit does not match the requested revision", async () => {
    let fetched = false;
    const fetchSnapshot = async (): Promise<Response> => {
      fetched = true;
      return new Response(snapshot({}));
    };

    await expect(
      materializeCatalog(
        { kind: "snapshot-url", url: publicSnapshotUrl(REVISION_A), revision: REVISION_B },
        { fetch: fetchSnapshot },
      ),
    ).rejects.toBeInstanceOf(CliSafetyError);
    expect(fetched).toBe(false);
  });

  it.each([
    "/absolute.yaml",
    "../escape.yaml",
    "catalog/plugins/../../escape.yaml",
    "catalog\\plugins\\escape.yaml",
    "catalog/plugins/%2e%2e/escape.yaml",
  ])("rejects unsafe snapshot path %s", async (unsafePath) => {
    const sourceRoot = await temporaryRoot("dsh-catalog-traversal-");
    const sourcePath = join(sourceRoot, "catalog.snapshot.json");
    await writeFile(sourcePath, snapshot({ [unsafePath]: "unsafe" }));

    await expect(
      materializeCatalog({ kind: "snapshot-file", path: sourcePath }),
    ).rejects.toBeInstanceOf(CliSafetyError);
    await expect(access(join(sourceRoot, "escape.yaml"))).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("rejects a symlinked local snapshot", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-symlink-");
    const targetPath = join(sourceRoot, "target.json");
    const linkPath = join(sourceRoot, "catalog.snapshot.json");
    await writeFile(targetPath, snapshot({}));
    await symlink(targetPath, linkPath);

    await expect(
      materializeCatalog({ kind: "snapshot-file", path: linkPath }),
    ).rejects.toBeInstanceOf(CliSafetyError);
  });

  it("rejects a manual redirect that escapes the public catalog host", async () => {
    const calls: string[] = [];
    const fetchSnapshot = async (url: string): Promise<Response> => {
      calls.push(url);
      return new Response(null, {
        status: 302,
        headers: {
          location: `https://catalog.invalid/${REVISION_A}/catalog.snapshot.json`,
        },
      });
    };

    const result = materializeCatalog(
      { kind: "snapshot-url", url: publicSnapshotUrl(), revision: REVISION_A },
      { fetch: fetchSnapshot },
    );
    await expect(result).rejects.toBeInstanceOf(CliSafetyError);
    await expect(result).rejects.not.toThrow(/catalog\.invalid/);
    expect(calls).toEqual([publicSnapshotUrl()]);
  });

  it("terminates, kills and reaps a Git probe that exceeds its deadline", async () => {
    const sourceRoot = await temporaryRoot("dsh-catalog-git-timeout-");
    const events = new EventEmitter();
    const stdout = new PassThrough();
    const stderr = new PassThrough();
    const signals: NodeJS.Signals[] = [];
    let closed = false;
    const child = Object.assign(events, {
      stdout,
      stderr,
      exitCode: null as number | null,
      signalCode: null as NodeJS.Signals | null,
      kill(signal: NodeJS.Signals) {
        signals.push(signal);
        if (signal === "SIGKILL") {
          child.signalCode = signal;
          queueMicrotask(() => {
            closed = true;
            events.emit("close", null, signal);
            stdout.end();
            stderr.end();
          });
        }
        return true;
      },
    });
    const spawnGit = (() => child) as unknown as ChildSpawn;
    let rejectedBeforeClose = false;

    const operation = materializeCatalog(
        { kind: "directory", root: sourceRoot, revision: REVISION_A },
        {
          spawnGit,
          gitTimeoutMs: 20,
          gitKillGraceMs: 20,
        },
      ).catch((error: unknown) => {
        rejectedBeforeClose = !closed;
        throw error;
      });
    await expect(operation).rejects.toBeInstanceOf(CliSafetyError);

    expect(signals).toEqual(["SIGTERM", "SIGKILL"]);
    expect(closed).toBe(true);
    expect(rejectedBeforeClose).toBe(false);
  });
});
