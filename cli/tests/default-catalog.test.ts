// The default catalog — what `search`, `info` and `discover` read when nobody passes --catalog —
// used to be a hardcoded EMPTY snapshot. That was correct while the public catalog had zero
// entries and became a silent lie afterwards: `search vision` answered "No plugins found"
// against 160 published plugins, with nothing in the output explaining why.
import { describe, expect, it, vi } from "vitest";

import { PUBLIC_SNAPSHOT_SITE_URL } from "../src/catalogSnapshot.js";
import { DEFAULT_CATALOG_REVISION, loadDefaultCatalog } from "../src/catalogSource.js";

const REVISION = "bcf6a89f12dadee801dee32aa22f8396756a0e95";
const OTHER = "f01d1d2d22b80222c121db6dfc0fd4035c24b390";

function snapshot(revision: string) {
  return JSON.stringify({
    format: "omni-dsh-catalog-snapshot-v1",
    revision,
    files: {},
  });
}

function fetchStub(body: string) {
  // Typed through the fetch signature so `mock.calls` carries the URL argument; an inferred
  // zero-argument stub types the call tuple as empty and hides what was requested.
  return vi.fn(
    async (_url: string, _init?: RequestInit) =>
      new Response(body, { status: 200, headers: { "content-type": "application/json" } }),
  );
}

describe("the default catalog reads what the site publishes", () => {
  it("fetches the published snapshot instead of returning an empty one", async () => {
    const fetch = fetchStub(snapshot(REVISION));

    const result = await loadDefaultCatalog(undefined, { fetch });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0]?.[0]).toBe(PUBLIC_SNAPSHOT_SITE_URL);
    expect(result.source).toMatchObject({ kind: "snapshot" });
  });

  it("accepts whatever revision the site declares, so a merged plugin does not need a release", async () => {
    // The catalog moves every time a plugin is merged. A CLI that demanded one exact commit
    // would go blind on the next merge and need a republish to see it again.
    const fetch = fetchStub(snapshot(OTHER));

    await expect(loadDefaultCatalog(undefined, { fetch })).resolves.toMatchObject({
      source: { kind: "snapshot" },
    });
  });

  it("still demands the exact commit when one is asked for", async () => {
    // --revision is the strict mode: it is an assertion about which tree is being read, and a
    // site serving anything else must fail rather than quietly answer from a different commit.
    const fetch = fetchStub(snapshot(OTHER));

    await expect(loadDefaultCatalog({ revision: REVISION }, { fetch })).rejects.toThrow(
      /revision does not match/u,
    );
  });

  it("records the revision this build was cut against", () => {
    expect(DEFAULT_CATALOG_REVISION).toMatch(/^[0-9a-f]{40}$/u);
  });
});
