import type { ReactNode } from "react";
import { AcademyQuickNav } from "@/features/academy/components/AcademyQuickNav";

/**
 * Shared academy chrome — the rice-paper ground of the sumi-e register. The
 * toast / confirm-dialog providers now live in the root layout so every page
 * can use them.
 */
export default function AcademyLayout({ children }: { children: ReactNode }) {
  return (
    /* cancel <main>'s nav clearance and re-add it so the paper ground runs
        seamlessly under the fixed glass nav (see project note: fixed nav overlay) */
    <div className="-mt-16 min-h-screen bg-paper pt-16 text-text transition-colors sm:-mt-20 sm:pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:max-w-6xl lg:px-8">
        <AcademyQuickNav />
      </div>
      {children}
    </div>
  );
}
