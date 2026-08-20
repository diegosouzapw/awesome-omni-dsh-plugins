import { createHash, randomBytes } from "node:crypto";
import { createServer, type Server } from "node:http";
import type { AddressInfo, Socket } from "node:net";

import { CliSafetyError } from "../errors.js";
import type { StagedArtifactLease } from "./staging.js";

const DEFAULT_CHANNEL_TIMEOUT_MS = 120_000;
const DEFAULT_CHANNEL_BYTES = 64 * 1024 * 1024;

export interface ArtifactChannelDescriptor {
  readonly kind: "loopback-buffer-v1";
  readonly sha512: string;
  readonly bytes: number;
  readonly sourceFingerprint: string;
}

export interface ArtifactDeliveryChannel {
  readonly installTarget: string;
  readonly descriptor: ArtifactChannelDescriptor;
  close(): Promise<void>;
}

export interface ArtifactDeliveryChannelOptions {
  readonly sourceFingerprint: string;
  readonly timeoutMs?: number;
  readonly maxBytes?: number;
  readonly signal?: AbortSignal;
}

function boundedPositive(value: number | undefined, fallback: number): number {
  const resolved = value ?? fallback;
  if (!Number.isSafeInteger(resolved) || resolved <= 0 || resolved > 2_147_483_647) {
    throw new CliSafetyError("artifact delivery channel limits are invalid");
  }
  return resolved;
}

function isLoopback(address: string | undefined): boolean {
  return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}

export async function openArtifactDeliveryChannel(
  lease: StagedArtifactLease,
  options: ArtifactDeliveryChannelOptions,
): Promise<ArtifactDeliveryChannel> {
  const timeoutMs = boundedPositive(options.timeoutMs, DEFAULT_CHANNEL_TIMEOUT_MS);
  const maxBytes = boundedPositive(options.maxBytes, DEFAULT_CHANNEL_BYTES);
  if (options.signal?.aborted === true) throw new CliSafetyError("artifact delivery was cancelled");
  if (
    typeof options.sourceFingerprint !== "string" ||
    options.sourceFingerprint.length < 8 ||
    options.sourceFingerprint.length > 256
  ) {
    throw new CliSafetyError("artifact source fingerprint is invalid");
  }

  const reference = lease.recoveryReference;
  if (reference.bytes <= 0 || reference.bytes > maxBytes) {
    throw new CliSafetyError("artifact exceeds the delivery byte limit");
  }
  const bytes = Buffer.from(await lease.readVerifiedBytes());
  if (bytes.byteLength !== reference.bytes || bytes.byteLength > maxBytes) {
    throw new CliSafetyError("transaction artifact changed; recovery required");
  }
  const sha512 = `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
  if (sha512 !== reference.sha512) {
    throw new CliSafetyError("transaction artifact changed; recovery required");
  }

  const token = randomBytes(32).toString("base64url");
  const pathname = `/${token}/artifact.tgz`;
  let headServed = false;
  let getServed = false;
  let closed = false;
  let closePromise: Promise<void> | undefined;
  const sockets = new Set<Socket>();
  let deadline: ReturnType<typeof setTimeout> | undefined;

  const server: Server = createServer((request, response) => {
    if (!isLoopback(request.socket.remoteAddress)) {
      response.writeHead(403, { "content-length": "0", connection: "close" });
      response.end();
      return;
    }
    if (request.url !== pathname) {
      response.writeHead(404, { "content-length": "0", connection: "close" });
      response.end();
      return;
    }
    if (request.headers.range !== undefined) {
      response.writeHead(416, { "content-length": "0", connection: "close" });
      response.end();
      return;
    }
    const headers = {
      "cache-control": "no-store",
      "content-length": String(bytes.byteLength),
      "content-type": "application/octet-stream",
      "x-content-type-options": "nosniff",
    };
    if (request.method === "HEAD" && !headServed && !getServed) {
      headServed = true;
      response.writeHead(200, headers);
      response.end();
      return;
    }
    if (request.method === "GET" && !getServed) {
      getServed = true;
      response.writeHead(200, headers);
      response.end(bytes);
      return;
    }
    response.writeHead(request.method === "HEAD" || request.method === "GET" ? 410 : 405, {
      allow: "HEAD, GET",
      "content-length": "0",
      connection: "close",
    });
    response.end();
  });
  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.once("close", () => sockets.delete(socket));
  });

  const onAbort = (): void => {
    void close();
  };
  const close = async (): Promise<void> => {
    if (closePromise !== undefined) return closePromise;
    closed = true;
    if (deadline !== undefined) clearTimeout(deadline);
    options.signal?.removeEventListener("abort", onAbort);
    closePromise = new Promise<void>((resolve) => {
      for (const socket of sockets) socket.destroy();
      if (!server.listening) {
        resolve();
        return;
      }
      server.close(() => resolve());
    });
    return closePromise;
  };

  try {
    await new Promise<void>((resolve, reject) => {
      const onError = (): void => reject(new CliSafetyError("artifact delivery channel failed"));
      server.once("error", onError);
      server.listen({ host: "127.0.0.1", port: 0, exclusive: true }, () => {
        server.removeListener("error", onError);
        resolve();
      });
    });
  } catch (error) {
    await close();
    if (error instanceof CliSafetyError) throw error;
    throw new CliSafetyError("artifact delivery channel failed");
  }
  server.unref();
  options.signal?.addEventListener("abort", onAbort, { once: true });
  deadline = setTimeout(() => void close(), timeoutMs);
  deadline.unref?.();
  const address = server.address();
  if (closed || address === null || typeof address === "string") {
    await close();
    throw new CliSafetyError("artifact delivery channel failed");
  }

  return {
    installTarget: `http://127.0.0.1:${(address as AddressInfo).port}${pathname}`,
    descriptor: {
      kind: "loopback-buffer-v1",
      sha512,
      bytes: bytes.byteLength,
      sourceFingerprint: options.sourceFingerprint,
    },
    close,
  };
}
