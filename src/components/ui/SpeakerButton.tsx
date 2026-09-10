"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";

import { speakChinese } from "@/lib/chinese-speech";

/**
 * Small round button that pronounces a Chinese word/sentence with the
 * Web Speech API (zh-CN, slightly slow). Stop propagation so it can sit
 * inside clickable cards without triggering them.
 */
export default function SpeakerButton({
  text,
  className = "size-7",
  title,
}: {
  text: string;
  className?: string;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (playing) return;
    if (!speakChinese(text)) return;

    setPlaying(true);
    if (timer.current) clearTimeout(timer.current);
    // roughly follow how long the utterance will take
    timer.current = setTimeout(
      () => setPlaying(false),
      1200 + Math.min(text.length * 350, 4000),
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={title ?? text}
      aria-label={title ?? `Pronounce: ${text}`}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
        playing
          ? "border-primary/60 bg-primary/10 text-primary animate-pulse"
          : "border-text/15 bg-card/60 text-text/50 hover:border-primary/50 hover:text-primary"
      } ${className}`}
    >
      <Volume2 className="h-[60%] w-[60%]" aria-hidden="true" />
    </button>
  );
}
