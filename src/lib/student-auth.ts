/**
 * Student password hashing — Node stdlib scrypt, no new dependencies.
 * SERVER ONLY: imports node:crypto, never import from client components.
 *
 * Stored format: `scrypt:<salt-hex>:<hash-hex>`. An empty stored value
 * means "never set" and accepts the default password once, then upgrades
 * to a real hash on first successful login.
 */
import { scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);

export const DEFAULT_STUDENT_PASSWORD = "lcwkr2026";
const SALT_BYTES = 16;
const KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const { randomBytes } = await import("node:crypto");
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const hash = (await scrypt(password, salt, KEYLEN)) as Buffer;
  return `scrypt:${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored) return password === DEFAULT_STUDENT_PASSWORD;
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, expectedHex] = parts;
  try {
    const actual = (await scrypt(password, salt, KEYLEN)) as Buffer;
    const expected = Buffer.from(expectedHex, "hex");
    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
