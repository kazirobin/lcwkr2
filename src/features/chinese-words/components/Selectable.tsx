"use client";

import React, { useRef } from "react";

/**
 * A span whose text can be selected for copying via double-click or a
 * long-press (~450ms, mobile). Selects the whole contents, not just the
 * tapped character. Parent click handlers (e.g. expand/collapse) still get
 * normal single clicks — a long-press suppresses the trailing click so the
 * card doesn't toggle.
 */
export default function SelectableText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const touchStart = useRef<{ t: number; x: number; y: number } | null>(null);

  const selectAll = () => {
    const el = ref.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  return (
    <span
      ref={ref}
      className={`select-text ${className ?? ""}`}
      onDoubleClick={(e) => {
        e.stopPropagation();
        selectAll();
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        touchStart.current = { t: Date.now(), x: t.clientX, y: t.clientY };
      }}
      onTouchMove={() => {
        touchStart.current = null;
      }}
      onClick={(e) => {
        // a long-press just fired the native selection UI — don't let the
        // tap-through toggle the parent card
        const start = touchStart.current;
        if (start && Date.now() - start.t > 450) {
          touchStart.current = null;
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {children}
    </span>
  );
}
