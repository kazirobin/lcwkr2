"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  /** Number/emoji badge shown before the title (e.g. "1", "▶"). */
  index: string;
  title: string;
  marks: number;
  marksLabel: string;
  /** When true the title row toggles the body open/closed. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * Shared homework section chrome: focused title row (numbered badge +
 * bold title + marks pill) with an optional click-to-collapse dropdown.
 * `collapsible` defaults to false so existing lessons render exactly
 * like before; pass it for the new dropdown behaviour.
 */
export default function SectionShell({
  index,
  title,
  marks,
  marksLabel,
  collapsible = false,
  defaultOpen = true,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const expanded = !collapsible || open;

  const header = (
    <div className="flex items-center gap-2.5 sm:gap-3 border-b border-border pb-3">
      <span
        aria-hidden="true"
        className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm sm:text-base font-bold text-primary-foreground shadow-sm"
      >
        {index}
      </span>
      <h2 className="min-w-0 flex-1 text-lg sm:text-2xl font-bold tracking-tight text-text">
        {title}
      </h2>
      <span className="shrink-0 text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
        {marks} {marksLabel}
      </span>
      {collapsible && (
        <ChevronDown
          aria-hidden="true"
          className={`size-5 shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      )}
    </div>
  );

  return (
    <section className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm">
      {collapsible ? (
        <div
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((v) => !v);
            }
          }}
          className="cursor-pointer select-none rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {header}
        </div>
      ) : (
        header
      )}
      {expanded && <div className="mt-4 space-y-4">{children}</div>}
    </section>
  );
}
