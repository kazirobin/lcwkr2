// src/features/vocabulary/pdf-reader/DictionaryPopup.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { BookA, Copy, Volume2 } from "lucide-react";
import { findWordEntry } from "@/features/chinese-words/data";
import type { ReaderCopy } from "./copy";

/**
 * What a selected word means, looked up in the site's own vocabulary.
 *
 * No translation service. The project already carries ~985 characters with
 * pinyin and both Bengali and English meanings; sending a reader's selection to
 * a third party to find out the meaning of a word they are reading in a
 * children's Chinese course would be the wrong trade. Where a character is not
 * in the local list, the popup says so plainly rather than inventing a gloss
 * from a machine.
 */

interface Found {
  hanzi: string;
  pinyin: string;
  meaningBn: string;
  meaningEn: string;
}

export default function DictionaryPopup({
  selection,
  language,
  c,
  screen,
  onDismiss,
  onSpeak,
}: {
  selection: string;
  language: "bn" | "en";
  c: ReaderCopy;
  screen: { x: number; y: number };
  onDismiss: () => void;
  onSpeak: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Every distinct Chinese character in the selection, longest words first so a
     two-character word is looked up before its single characters. */
  const hanzi = [...new Set(selection.match(/[\u4e00-\u9fff]/g) ?? [])];
  const found: Found[] = [];
  for (let n = Math.min(4, hanzi.length); n >= 1; n -= 1) {
    for (let i = 0; i + n <= hanzi.length; i += 1) {
      const chunk = hanzi.slice(i, i + n).join("");
      const entry = findWordEntry(chunk);
      if (entry) {
        found.push({
          hanzi: chunk,
          pinyin: entry.pinyin,
          meaningBn: entry.meaningBn,
          meaningEn: entry.meaningEn,
        });
      }
    }
  }
  const seen = new Set<string>();
  const rows = found.filter((f) => !seen.has(f.hanzi) && seen.add(f.hanzi)).slice(0, 8);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    };
    /* `capture` so a click that started inside the text layer still dismisses. */
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [onDismiss]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(selection);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the text is still selectable in the book */
    }
  };

  const width = 288;
  const left = Math.min(Math.max(screen.x - width / 2, 8), (typeof window !== "undefined" ? window.innerWidth : 800) - width - 8);
  const top = Math.max(screen.y + 14, 8);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={c.dictionary}
      className="fixed z-[96] rounded-2xl border border-white/15 bg-[#1b1815]/97 p-3 shadow-2xl backdrop-blur"
      style={{ left, top, width }}
    >
      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-white/50">
        <BookA aria-hidden="true" className="size-3.5" />
        {c.dictionary}
      </p>

      {rows.length === 0 ? (
        <p className="text-xs leading-relaxed text-white/70">
          {hanzi.length === 0
            ? selection.slice(0, 120)
            : language === "bn"
              ? "এই শব্দটি আমাদের শব্দতালিকায় নেই।"
              : "That word is not in our word list."}
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.hanzi} className="border-b border-white/10 pb-2 last:border-0 last:pb-0">
              <p className="flex items-baseline gap-2">
                <span lang="zh" className="text-lg font-bold text-white">
                  {r.hanzi}
                </span>
                <span data-pinyin className="font-mono text-[11px] text-amber-200/90">
                  {r.pinyin}
                </span>
              </p>
              <p className="text-xs leading-relaxed text-white/80">
                {language === "bn" ? r.meaningBn || r.meaningEn : r.meaningEn || r.meaningBn}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex gap-1.5 border-t border-white/10 pt-2">
        <button
          type="button"
          onClick={() => onSpeak(hanzi.join(" ") || selection)}
          className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 text-[11px] font-semibold text-white/85 transition-colors hover:bg-white/10"
        >
          <Volume2 aria-hidden="true" className="size-3.5" />
          {c.speakSelection}
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 text-[11px] font-semibold text-white/85 transition-colors hover:bg-white/10"
        >
          <Copy aria-hidden="true" className="size-3.5" />
          {copied ? "✓" : c.copySelection}
        </button>
      </div>
    </div>
  );
}
