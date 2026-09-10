// Chinese text-to-speech via the browser's Web Speech API.
// zh-CN voice, slightly slow so learners can follow along.

export const CHINESE_RATE = 0.8;

/**
 * Pronounce `text` in Chinese. Returns false when the browser has no
 * speech synthesis support (or the call failed).
 */
export function speakChinese(text: string, rate = CHINESE_RATE): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }
  try {
    const synth = window.speechSynthesis;
    synth.cancel(); // stop any utterance already playing

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = rate;

    // Prefer a dedicated Chinese voice when one is installed.
    const voices = synth.getVoices();
    const zhVoice =
      voices.find((v) => v.lang.toLowerCase() === "zh-cn") ??
      voices.find((v) => v.lang.toLowerCase().startsWith("zh"));
    if (zhVoice) utterance.voice = zhVoice;

    synth.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

/** Stop any ongoing pronunciation. */
export function stopSpeaking(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}
