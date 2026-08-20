import { createHash } from "node:crypto";
import {
  mkdtempSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { openArtifactDeliveryChannel } from "../src/dsh/artifactChannel.js";
import type { StagedArtifactLease } from "../src/dsh/staging.js";

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe("immutable artifact delivery channel", () => {
  it("serves the verified descriptor bytes when the pathname is swapped after revalidation", async () => {
    const root = mkdtempSync(join(tmpdir(), "dsh-channel-swap-"));
    roots.push(root);
    const artifact = join(root, "artifact.tgz");
    const displaced = join(root, "verified.tgz");
    const verified = Buffer.from("verified-before-spawn");
    writeFileSync(artifact, verified);
    const sha512 = `sha512-${createHash("sha512").update(verified).digest("base64")}`;
    const lease = {
      recoveryReference: {
        relativePath: ".dsh-plugins/artifact-leases/.lease-test/artifact.tgz",
        sha512,
        bytes: verified.length,
        packageName: "fixture-plugin",
      },
      revalidate: vi.fn(async () => undefined),
      readVerifiedBytes: vi.fn(async () => Buffer.from(verified)),
      release: vi.fn(async () => undefined),
    } as StagedArtifactLease;

    await lease.revalidate();
    const channel = await openArtifactDeliveryChannel(lease, {
      sourceFingerprint: "sha256:pinned-source",
      timeoutMs: 5_000,
    });

    // This is the DSH spawn seam: the old pathname is replaced before pnpm opens its target.
    renameSync(artifact, displaced);
    writeFileSync(artifact, "malicious-after-revalidate");
    const response = await fetch(channel.installTarget);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-length")).toBe(String(verified.length));
    expect(Buffer.from(await response.arrayBuffer())).toEqual(verified);
    expect(channel.descriptor).toEqual({
      kind: "loopback-buffer-v1",
      sha512,
      bytes: verified.length,
      sourceFingerprint: "sha256:pinned-source",
    });
    expect(channel.installTarget).not.toContain(artifact);
    await channel.close();
  });

  it("accepts at most one HEAD and one GET and rejects range requests", async () => {
    const bytes = Buffer.from("one-shot");
    const lease = {
      recoveryReference: {
        relativePath: ".dsh-plugins/artifact-leases/.lease-test/artifact.tgz",
        sha512: `sha512-${createHash("sha512").update(bytes).digest("base64")}`,
        bytes: bytes.length,
        packageName: "fixture-plugin",
      },
      revalidate: vi.fn(async () => undefined),
      readVerifiedBytes: vi.fn(async () => Buffer.from(bytes)),
      release: vi.fn(async () => undefined),
    } as StagedArtifactLease;
    const channel = await openArtifactDeliveryChannel(lease, {
      sourceFingerprint: "sha256:pinned-source",
      timeoutMs: 5_000,
    });

    expect((await fetch(channel.installTarget, { method: "HEAD" })).status).toBe(200);
    expect((await fetch(channel.installTarget, { headers: { range: "bytes=0-1" } })).status).toBe(416);
    expect(Buffer.from(await (await fetch(channel.installTarget)).arrayBuffer())).toEqual(bytes);
    await channel.close();
  });
});
