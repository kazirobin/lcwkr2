import { isSubAdminPasscode } from "@/features/academy/subAdminPasswords";

/**
 * Passcode checks for the academy routes.
 *
 * The app has no server session — an admin "signs in" by handing the passcode
 * with each request, and the admin pages are a client-side gate. That is a
 * weak model (the passcode ships to the browser and every check is only as
 * strong as the caller's honesty), so anything that reveals personal data is
 * treated as admin-only here, and the client is expected to hide the UI too.
 * Both together are a speed bump for scrapers, not a vault.
 */

/**
 * Read the passcode a caller sent.
 *
 * Header or query string only. Body-based passcodes are not read here on
 * purpose: the body would have to be parsed, which consumes it, and a route
 * handler cannot then also read its own payload. Callers that already parse a
 * body check it inline.
 */
export function passcodeFrom(req: Request, url?: URL): string {
  const fromHeader = req.headers.get("x-admin-passcode");
  const fromQuery = url?.searchParams.get("passcode") ?? null;
  return (fromHeader || fromQuery || "").trim();
}

/** The full admin passcode. Mirrors the fallback chain used across the app. */
export function adminPasscode(): string {
  return (process.env.ADMIN_PASSCODE || process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131").trim();
}

export function isAdminPasscode(value: unknown): boolean {
  const given = String(value ?? "").trim();
  return Boolean(given) && given === adminPasscode();
}

/** Full admin, or a teacher/sub-admin passcode. */
export function isAdminOrSub(value: unknown): boolean {
  const given = String(value ?? "").trim();
  return isAdminPasscode(given) || isSubAdminPasscode(given);
}

/** True when the request is allowed to see private contact details. */
export function canSeeContact(req: Request, url: URL): boolean {
  return isAdminOrSub(passcodeFrom(req, url));
}
