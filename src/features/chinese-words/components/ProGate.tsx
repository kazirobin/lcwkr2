"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAccount } from "@/features/student-auth";
import ProAccessButton, { type ProAccessHandle } from "./ProAccessButton";
import ProPanel from "./ProPanel";
import TrialRequestForm from "./TrialRequestForm";
import { useProAccess } from "./pro-access";

/**
 * Wrap any Pro page content.
 *
 * A visitor gets ten minutes to try the thing before being asked for money, and
 * after that the page becomes the join panel, which is where the ৳500 student
 * account and the ৳500 lifetime Pro live.
 *
 * The ten minutes are asked for by name, number and location, because the admin
 * can only renew a preview they can put a name to. A student who is already
 * signed in is not asked: their account holds all three, so the window opens
 * without a form.
 *
 * The corner control is the shared ProAccessButton, which shows the Pro button
 * and the preview clock together, so a page never has to invent its own.
 */
export default function ProGate({ children }: { children: React.ReactNode }) {
  const { status, remainingMs, isPro, resetTrial } = useProAccess();
  const { student: account } = useAccount();
  const [modalOpen, setModalOpen] = useState(false);
  const proRef = useRef<ProAccessHandle>(null);

  // auto-close the modal right after a successful unlock
  useEffect(() => {
    if (isPro) {
      queueMicrotask(() => setModalOpen(false));
    }
  }, [isPro]);

  if (status === "expired") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-12">
        {/* The panel carries the status line and the form, so nothing is
            repeated here. */}
        <ProPanel status={status} remainingMs={remainingMs} />
      </div>
    );
  }

  // No window yet, and nobody to get one for automatically. The form is the
  // page; there is no point also hanging a Pro badge over it.
  if (status === "unstarted" && !account) {
    return <TrialRequestForm onStarted={resetTrial} />;
  }

  return (
    <>
      {children}

      {/* The corner control carries the Pro button and the preview clock
          together, so this page does not add a second set of chips that would
          land on top of it. */}
      <ProAccessButton ref={proRef} />

      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div className="mx-auto my-6 max-w-xl" onClick={(e) => e.stopPropagation()}>
            <ProPanel
              status={status}
              remainingMs={remainingMs}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
