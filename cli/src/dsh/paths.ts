import { lstat, mkdir, realpath } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

import { CliSafetyError } from "../errors.js";

const SAFE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/u;

export function isPathWithin(root: string, candidate: string): boolean {
  const child = relative(root, candidate);
  return child === "" || (!isAbsolute(child) && child !== ".." && !child.startsWith(`..${sep}`));
}

export function assertSafeProfileName(profile: string): void {
  if (!SAFE_SEGMENT.test(profile) || profile === "." || profile === "..") {
    throw new CliSafetyError("profile name is unsafe");
  }
}

export function assertSafeCacheSegment(value: string, label: string): void {
  if ((value !== ".dsh-plugins" && !SAFE_SEGMENT.test(value)) || value === "." || value === "..") {
    throw new CliSafetyError(`${label} is unsafe`);
  }
}

export async function ensureCanonicalHome(home: string): Promise<string> {
  const absolute = resolve(home);
  await mkdir(absolute, { recursive: true, mode: 0o700 });
  const info = await lstat(absolute);
  if (info.isSymbolicLink() || !info.isDirectory()) {
    throw new CliSafetyError("DSH home is not a safe directory");
  }
  return realpath(absolute);
}

export async function ensureContainedDirectory(
  canonicalRoot: string,
  ...segments: readonly string[]
): Promise<string> {
  let current = canonicalRoot;
  for (const segment of segments) {
    assertSafeCacheSegment(segment, "managed path segment");
    const candidate = join(current, segment);
    if (!isPathWithin(canonicalRoot, candidate)) {
      throw new CliSafetyError("managed path escapes its root");
    }
    try {
      const info = await lstat(candidate);
      if (info.isSymbolicLink() || !info.isDirectory()) {
        throw new CliSafetyError("managed path contains an unsafe symlink");
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
      await mkdir(candidate, { mode: 0o700 });
    }
    const canonical = await realpath(candidate);
    if (!isPathWithin(canonicalRoot, canonical)) {
      throw new CliSafetyError("managed path contains an unsafe symlink");
    }
    current = canonical;
  }
  return current;
}
