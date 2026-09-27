import type { ReactNode } from "react";

/**
 * Admin chrome — the rice-paper ground of the sumi-e register. Admin lives at
 * the top-level /admin route (moved out of /academy/admin); AdminShell still
 * provides the client-side passcode gate.
 *
 * The toast / confirm providers now sit in the root layout, so every page can
 * use them and nesting them here would only give each one a second, unused
 * context.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    /* cancel <main>'s nav clearance and re-add it so the paper ground runs
       seamlessly under the fixed glass nav (see project note: fixed nav overlay) */
    <div className="-mt-16 min-h-screen bg-paper pt-16 text-text transition-colors sm:-mt-20 sm:pt-20">
      {children}
    </div>
  );
}
