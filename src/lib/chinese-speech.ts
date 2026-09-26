// Chinese text-to-speech via the browser's Web Speech API.
// zh-CN voice, slightly slow so learners can follow along.
//
// Two things make this reliable rather than intermittently silent:
//
//  1. `getVoices()` is empty on the first call in most browsers — the voice
//     list arrives asynchronously and the `voiceschanged` event fires later.
//     We cache the Chinese voice and, when speaking before it has loaded, wait
//     for that event (with a timeout) instead of speaking through a default
//     English voice, which is what produced garbled or missing audio.
//  2. Callers pass hanzi, never pinyin orthography. A zh-CN engine does not
//     reliably read "lü" or "juan" aloud, but reads 女 or 卷 correctly.

export const CHINESE_RATE = 0.8;

/** Matches any Chinese voice, preferring mainland Mandarin. */
function isChinese(voice: SpeechSynthesisVoice): boolean {
  return voice.lang.toLowerCase().replace("_", "-").startsWith("zh");
}

function pickChineseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  return (
    voices.find((v) => v.lang.toLowerCase().replace("_", "-") === "zh-cn") ??
    voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith("zh-cn")) ??
    voices.find(isChinese) ??
    null
  );
}

let cachedVoice: SpeechSynthesisVoice | null = null;
let voiceLookup: Promise<SpeechSynthesisVoice | null> | null = null;

function supported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Drop the cached voice; call when the user changes system voices. */
export function resetChineseVoice(): void {
  cachedVoice = null;
  voiceLookup = null;
}

/**
 * Resolve a Chinese voice, waiting for `voiceschanged` if the list is not
 * populated yet. Resolves with null when the platform has no Chinese voice
 * after the timeout — the caller can then show a hint instead of pretending.
 */
export function chineseVoice(timeoutMs = 2000): Promise<SpeechSynthesisVoice | null> {
  if (!supported()) return Promise.resolve(null);
  if (cachedVoice) return Promise.resolve(cachedVoice);
  if (voiceLookup) return voiceLookup;

  const immediate = pickChineseVoice(window.speechSynthesis.getVoices());
  if (immediate) {
    cachedVoice = immediate;
    return Promise.resolve(immediate);
  }

  voiceLookup = new Promise<SpeechSynthesisVoice | null>((resolve) => {
    let settled = false;
    const finish = (voice: SpeechSynthesisVoice | null) => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener("voiceschanged", onChange);
      clearTimeout(timer);
      cachedVoice = voice;
      voiceLookup = null;
      resolve(voice);
    };
    const onChange = () => finish(pickChineseVoice(window.speechSynthesis.getVoices()));
    const timer = setTimeout(
      () => finish(pickChineseVoice(window.speechSynthesis.getVoices())),
      timeoutMs,
    );
    window.speechSynthesis.addEventListener("voiceschanged", onChange);
  });

  return voiceLookup;
}

/** Whether a Chinese voice is installed, without waiting for one to load. */
export function hasChineseVoice(): boolean {
  if (!supported()) return false;
  if (cachedVoice) return true;
  return pickChineseVoice(window.speechSynthesis.getVoices()) !== null;
}

/** Whether this browser can speak at all. */
export function speechSupported(): boolean {
  return supported();
}

function buildUtterance(text: string, voice: SpeechSynthesisVoice | null, rate: number) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang ?? "zh-CN";
  utterance.rate = rate;
  if (voice) utterance.voice = voice;
  return utterance;
}

/**
 * Pronounce `text` in Chinese straight away. Returns false when the browser
 * has no speech synthesis support. Uses whichever voice is already known; if
 * the voice list has not loaded it still speaks (the engine falls back to
 * `utterance.lang`), so use `speakChineseAsync` when you can wait.
 */
export function speakChinese(text: string, rate = CHINESE_RATE): boolean {
  if (!supported()) return false;
  try {
    const synth = window.speechSynthesis;
    synth.cancel(); // stop any utterance already playing
    const voice = cachedVoice ?? pickChineseVoice(synth.getVoices());
    synth.speak(buildUtterance(text, voice, rate));
    return true;
  } catch {
    return false;
  }
}

/**
 * Pronounce `text` in Chinese, first waiting for the Chinese voice list if
 * necessary. This is the one to use for tap-to-hear UI, where the first tap
 * must not be swallowed.
 */
export async function speakChineseAsync(text: string, rate = CHINESE_RATE): Promise<boolean> {
  if (!supported()) return false;
  const voice = await chineseVoice();
  if (!supported()) return false;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    synth.speak(buildUtterance(text, voice, rate));
    return true;
  } catch {
    return false;
  }
}

/** Stop any ongoing pronunciation. */
export function stopSpeaking(): void {
  if (!supported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}
