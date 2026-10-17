"use client";

import { alignPinyin } from "@/features/vocabulary/pinyin-align";

/**
 * Hanzi text with each syllable sitting directly above the character it
 * belongs to (ruby-style), wrapped in a light red rule so long passages read
 * as one block. Punctuation keeps its slot but carries no pinyin. When the
 * pinyin can't be split to the character count, it falls back to a plain
 * line under the characters rather than mis-aligning.
 *
 * Sizes come from the caller's font-size (see `className`) — the pinyin is
 * always `0.6em`, so the same component fits a 2.2rem headword and a small
 * example line. Pinyin carries `data-pinyin`, so the site-wide toggle hides it.
 */
export default function RubyText({
  hanzi,
  pinyin,
  className = "",
  bordered = true,
  wrap = true,
}: {
  hanzi: string;
  pinyin?: string;
  /** Sets the font-size / colour context; the pinyin scales from it. */
  className?: string;
  /** The light red box — on for reading text, off for compact chips. */
  bordered?: boolean;
  /**
   * Allow the characters to break onto a second line. Single words keep
   * `wrap={false}` so a narrow column never stacks the hanzi vertically;
   * whole sentences leave it on and flow normally.
   */
  wrap?: boolean;
}) {
  const box = bordered
    ? "rounded-lg border border-danger/40 px-2.5 py-1.5"
    : "";
  const flow = wrap ? "flex-wrap" : "flex-nowrap";
  const aligned = pinyin ? alignPinyin(hanzi, pinyin) : null;

  if (!aligned) {
    return (
      <span
        lang="zh"
        className={`inline-flex flex-col items-start gap-0.5 ${box} ${className}`}
      >
        <span className="font-chinese leading-none">{hanzi}</span>
        {pinyin && (
          <span
            data-pinyin
            lang="zh-Latn-pinyin"
            className="text-[0.6em] leading-none text-text/55"
          >
            {pinyin}
          </span>
        )}
      </span>
    );
  }

  const chars = [...hanzi];

  return (
    <span
      lang="zh"
      className={`inline-flex ${flow} items-end gap-x-[0.06em] ${box} ${className}`}
    >
      {chars.map((ch, i) => (
        <span key={i} className="inline-flex flex-col items-center leading-none">
          <span
            data-pinyin
            lang="zh-Latn-pinyin"
            className="mb-[0.14em] whitespace-nowrap text-[0.6em] leading-none text-text/55"
          >
            {aligned[i] ?? "\u00A0"}
          </span>
          <span className="font-chinese">{ch}</span>
        </span>
      ))}
    </span>
  );
}
