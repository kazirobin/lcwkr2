"use client";

import { usePinyin } from "@/providers/PinyinProvider";

/** Nav toggle: show/hide pinyin across the whole site. */
export default function PinyinToggle() {
  const { show, toggle } = usePinyin();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!show}
      title={show ? "Hide pinyin / পিনইন লুকান" : "Show pinyin / পিনইন দেখান"}
      aria-label={show ? "Hide pinyin" : "Show pinyin"}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
        show
          ? "border-text/15 text-text/60 hover:border-text/40 hover:text-text"
          : "border-primary/50 bg-primary/10 text-primary"
      }`}
    >
      <span lang="zh" aria-hidden="true" className="font-chinese text-[13px] leading-none">
        拼
      </span>
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${show ? "bg-ok" : "bg-danger"}`}
      />
    </button>
  );
}
