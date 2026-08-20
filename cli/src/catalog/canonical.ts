import { types as utilTypes } from "node:util";

/**
 * Canonical serialization — deterministic, sorted-key JSON.
 *
 * Two families with deliberately different semantics live here under distinct names, and they
 * must never be merged: their output feeds digests that are already recorded elsewhere, so a
 * change in either would invalidate comparisons against data that already exists.
 *
 * 1. `canonicalSerialize` — undefined-THROWS. Rejects `undefined` property values, non-finite
 *    numbers and unsupported types outright, because silently dropping a key would let two
 *    different inputs collide on one digest.
 * 2. `canonicalJsonDroppingUndefined` — undefined-DROPS. Silently omits `undefined`-valued keys,
 *    mirroring `JSON.stringify`, for digests that were minted with that behavior.
 */

/**
 * Undefined-THROWS canonical serializer: deterministic, sorted-key JSON with
 * hard rejection of `undefined` values, non-finite numbers and unsupported
 * types. Output is byte-stable and safe to digest.
 */
export function canonicalSerialize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("canonical serialization rejects non-finite numbers");
    }
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => canonicalSerialize(entry)).join(",")}]`;
  }
  if (typeof value === "object") {
    const object = value as Record<string, unknown>;
    const keys = Object.keys(object).sort();
    return `{${keys.map((key) => {
      if (object[key] === undefined) {
        throw new Error("canonical serialization rejects undefined values");
      }
      return `${JSON.stringify(key)}:${canonicalSerialize(object[key])}`;
    }).join(",")}}`;
  }
  throw new Error("canonical serialization rejects unsupported values");
}

function canonicalValueDroppingUndefined(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValueDroppingUndefined);
  if (value !== null && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) {
      if (source[key] !== undefined) {
        result[key] = canonicalValueDroppingUndefined(source[key]);
      }
    }
    return result;
  }
  return value;
}

/**
 * Undefined-DROPS canonical serializer: sorted-key `JSON.stringify` that
 * silently omits `undefined`-valued keys. Kept as a SEPARATE family from
 * `canonicalSerialize` on purpose — see the module doc comment.
 */
export function canonicalJsonDroppingUndefined(value: unknown): string {
  return JSON.stringify(canonicalValueDroppingUndefined(value));
}

/**
 * Asserts `value` is a non-Proxy plain object (prototype `Object.prototype`
 * or `null`) and returns it typed as a record.
 */
export function plainRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value === "object" && value !== null && utilTypes.isProxy(value)) {
    throw new Error(`${label} must not be a Proxy`);
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be a plain object`);
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error(`${label} must be a plain object`);
  }
  return value as Record<string, unknown>;
}

/**
 * Asserts `value` is a plain object whose own keys are EXACTLY `expected`
 * (order-insensitive), every property is a data property with a defined
 * value, and — when `allowedSymbol` is provided — at most that one
 * non-enumerable, non-writable, non-configurable `true`-valued symbol brand
 * is present. Any other symbol key is rejected.
 */
export function assertExactKeys(
  value: unknown,
  expected: readonly string[],
  label: string,
  allowedSymbol?: symbol,
): void {
  const record = plainRecord(value, label);
  const ownKeys = Reflect.ownKeys(record);
  const actual: string[] = [];
  for (const key of ownKeys) {
    if (typeof key === "string") {
      actual.push(key);
    } else if (key !== allowedSymbol) {
      throw new Error(`${label} has an invalid runtime shape`);
    }
  }
  actual.sort();
  const canonicalExpected = [...expected].sort();
  if (
    actual.length !== canonicalExpected.length ||
    actual.some((key, index) => key !== canonicalExpected[index])
  ) {
    throw new Error(`${label} has an invalid runtime shape`);
  }
  for (const key of ownKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(record, key);
    if (descriptor === undefined || !("value" in descriptor)) {
      throw new Error(`${label} contains an accessor instead of a data property`);
    }
    if (typeof key === "symbol") {
      if (
        descriptor.value !== true ||
        descriptor.enumerable ||
        descriptor.configurable ||
        descriptor.writable
      ) {
        throw new Error(`${label} has an invalid verification brand`);
      }
    } else if (descriptor.value === undefined) {
      throw new Error(`${label}.${key} cannot be undefined`);
    }
  }
}
