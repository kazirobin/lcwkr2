// Sub-admin (teacher / assistant) passcodes.
//
// Anyone who knows one of these can, from the public academy course page:
//   • start a live class  (class on)
//   • submit a class      (save class log & end class)
//
// They CANNOT do full admin actions (course/lesson editing, deleting logs,
// approving pending logs, etc.) — those still require the real ADMIN_PASSCODE
// (NEXT_PUBLIC_ADMIN_PASSCODE / 8131).
//
// Edit this list freely; it is the single source of truth for sub-admins.
export const SUB_ADMIN_PASSWORDS: string[] = [
  "2026", // teacher passcode (known to teachers)
  "5500",
  "7788",
];

export function isSubAdminPasscode(passcode: string): boolean {
  return SUB_ADMIN_PASSWORDS.includes((passcode ?? "").trim());
}
