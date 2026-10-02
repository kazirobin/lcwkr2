// src/features/vocabulary/pdf-reader/useSpeak.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Read the page aloud with the browser's own voice.
 *
 * Deliberately no server, no API key, no audio file: a page of text is a few
 * kilobytes, the OS already has a Mandarin voice, and sending a child's lesson
 * text off the device to be turned into speech is a trade nobody needs to make
 * for this. `speechSynthesis` is also the only path that works offline, which
 * is where half of this site's reading happens.
 *
 * The pinyin in the book's text layer is stored with broken tone marks (we
 * measured "Xičoуй" for 小语), so Mandarin letters are read as prose and come
 * out as nonsense. Feeding the voice hanzi only avoids the worst of it, and the
 * caller is expected to pass filtered text, not raw page text.
 */
export function useSpeak() {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    utterRef.current = null;
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string, lang = "zh-CN") => {
      if (!supported) return false;
      const clean = text.replace(/\s+/g, " ").trim();
      if (!clean) return false;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = lang;
      utter.rate = 0.95;
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      utterRef.current = utter;
      setSpeaking(true);
      window.speechSynthesis.speak(utter);
      return true;
    },
    [supported],
  );

  /* Leaving the reader with the voice still running would keep talking over
     the lesson the reader just went back to. */
  useEffect(() => () => {
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  return { speak, stop, speaking, supported };
}

/**
 * The page's text with the pinyin lines taken out.
 *
 * These books set every romanised syllable with its own embedded font and the
 * tone marks are mis-mapped, so a voice reading the text layer aloud says
 * things like "Xi-čo-уй". Keeping hanzi and punctuation — which the same voice
 * reads correctly — is the difference between hearing the lesson and hearing
 * alphabet soup.
 */
export function speakableText(items: { str: string; fontName?: string }[]): string {
  const joined = items.map((i) => i.str).join("");
  // A romanised run is ASCII letters plus tone punctuation; a line of it is the
  // pinyin gloss. Chinese, digits and English words are left alone.
  return joined
    .replace(/[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňḿ\s,'’·-]{6,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when a page carries enough real text for the text tools to be worth showing. */
export function pageHasText(charCount: number): boolean {
  return charCount > 40;
}
