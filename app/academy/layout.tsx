import type { ReactNode } from "react";
import { AcademyProviders } from "@/components/academy/ui";

/**
 * Shared academy chrome — the rice-paper ground of the sumi-e register plus
 * the toast / confirm-dialog providers every page uses in place of the old
 * blocking alert() / confirm() calls.
 */
export default function AcademyLayout({ children }: { children: ReactNode }) {
  return (
    <AcademyProviders>
      {/* cancel <main>'s nav clearance and re-add it so the paper ground runs
         seamlessly under the fixed glass nav (see project note: fixed nav overlay) */}
      <div className="-mt-16 min-h-screen bg-paper pt-16 text-text transition-colors sm:-mt-20 sm:pt-20">
        {children}
      </div>
    </AcademyProviders>
  );
}
