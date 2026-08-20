import { createHash } from "node:crypto";

import type { InstalledPlugin } from "./installState.js";

export function fingerprintInstallState(installs: readonly InstalledPlugin[]): string {
  const bytes = JSON.stringify({ version: 1, installs });
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}
