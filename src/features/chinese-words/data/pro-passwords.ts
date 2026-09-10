// Pro access passwords — LOCAL list (checked client-side).
//
// TO ADD A NEW PASSWORD IN THE FUTURE:
// just add another string to the array below and save. Comparison is
// case-insensitive and ignores surrounding spaces, so "lcwkr-pro" works
// for "LCWKR-PRO".
//
// The admin passcode from .env.local (NEXT_PUBLIC_ADMIN_PASSCODE) is
// also always accepted automatically.

export const PRO_PASSWORDS: string[] = [
  "LCWKR-PRO",
  "LCWKR2026",
  "ROBIN-PRO",
  "PRO-HSK2026",
  "KCW-ROBIN",
];

export function isValidProPassword(input: string): boolean {
  const value = input.trim().toUpperCase();
  if (!value) return false;

  const envPass = (process.env.NEXT_PUBLIC_ADMIN_PASSCODE ?? "").trim().toUpperCase();

  return (
    PRO_PASSWORDS.some((p) => p.trim().toUpperCase() === value) ||
    (envPass !== "" && value === envPass)
  );
}
