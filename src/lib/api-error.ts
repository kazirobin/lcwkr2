/**
 * Turn anything thrown into a message a route handler can hand back.
 *
 * Route handlers in this project use `catch (error: unknown)` rather than
 * `any`, so the message has to be narrowed before it can go into a response.
 */
export function messageOf(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}
