"use client";

import React, { useEffect, useRef, useState } from "react";
import ProAccessButton, { type ProAccessHandle } from "./ProAccessButton";
import ProPanel from "./ProPanel";
import { useProAccess } from "./pro-access";

/**
 * Wrap any Pro page content.
 *
 * Everyone gets a ten-minute preview so a visitor can actually try the thing
 * before being asked for money. After that the page becomes the join panel,
 * which is where the ৳500 student account and the ৳500 lifetime Pro live.
 *
 * The corner control is the shared ProAccessButton, which shows the Pro button
 * and the preview clock together, so a page never has to invent its own.
 */
export default function ProGate({ children }: { children: React.ReactNode }) {
  const { status, remainingMs, isPro } = useProAccess();
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
        <ProPanel
          status={status}
          remainingMs={remainingMs}

        />
      </div>
    );
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
