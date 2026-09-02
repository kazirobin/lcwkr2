import type { Dialogue as DialogueType } from "@/features/vocabulary/types";

/**
 * The short dialogue that opens some texts, shown as the conversation it is:
 * a two-person exchange sits left / right like a chat; three or more speakers
 * (or a scene with a Narrator) fall back to a stacked, avatared transcript.
 * Bubble position carries the speaker — the text inside every bubble stays
 * left-aligned so it reads cleanly.
 */

const NARRATOR = new Set(["Narrator", "旁白", "Narration"]);

/** First code point — works for "Wang Yixue" → W and "服务员" → 服. */
const initialOf = (name: string) => [...name.trim()][0] ?? "·";

export default function Dialogue({
  dialogue,
  speakersLabel,
}: {
  dialogue: DialogueType;
  speakersLabel: string;
}) {
  const speakers: string[] = [];
  const firstLineOf = new Map<string, number>();
  dialogue.lines.forEach((line, i) => {
    if (NARRATOR.has(line.speaker)) return;
    if (!speakers.includes(line.speaker)) {
      speakers.push(line.speaker);
      firstLineOf.set(line.speaker, i);
    }
  });
  const duo = speakers.length <= 2;

  return (
    <figure className="mt-3">
      <figcaption className="font-serif text-base font-medium text-text">
        {dialogue.title}
      </figcaption>

      <ol aria-label={speakersLabel} className="mt-4 space-y-1.5">
        {dialogue.lines.map((line, i) => {
          const sameAsPrev = dialogue.lines[i - 1]?.speaker === line.speaker;

          if (NARRATOR.has(line.speaker)) {
            return (
              <li key={i} className="px-4 py-2 text-center">
                <p lang="zh" className="text-sm leading-relaxed text-text/60">
                  {line.hanzi}
                </p>
                <p className="mt-0.5 text-[12px] italic leading-5 text-text/45">
                  {line.english}
                </p>
              </li>
            );
          }

          const side = duo && speakers.indexOf(line.speaker) === 1;
          const isAB = /^[AB]$/.test(line.speaker);
          // Duo mode: name once (position + avatar carry it after). Group
          // mode: name on every turn change.
          const showName =
            !isAB &&
            (duo ? firstLineOf.get(line.speaker) === i : !sameAsPrev);

          return (
            <li
              key={i}
              className={`flex items-start gap-2.5 ${side ? "flex-row-reverse" : ""} ${
                sameAsPrev ? "" : "pt-2"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                  sameAsPrev
                    ? "invisible"
                    : side
                      ? "bg-primary/15 text-text/70"
                      : "bg-text/10 text-text/65"
                }`}
              >
                {initialOf(line.speaker)}
              </span>

              <div
                className={`max-w-[82%] rounded-2xl border px-4 py-2.5 ${
                  side
                    ? "rounded-tr-sm border-primary/15 bg-primary/[0.07]"
                    : "rounded-tl-sm border-text/10 bg-card/75"
                }`}
              >
                <span className="sr-only">{line.speaker}: </span>
                {showName && (
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-text/45">
                    {line.speaker}
                  </span>
                )}
                <p lang="zh" className="text-[1.05rem] leading-relaxed text-text">
                  {line.hanzi}
                </p>
                <p
                  lang="zh-Latn-pinyin"
                  className="mt-0.5 text-[13px] leading-5 text-text/55"
                >
                  {line.pinyin}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-text/70">
                  {line.english}
                </p>
                {line.bangla && (
                  <p className="mt-0.5 text-[13px] leading-relaxed text-text/70">
                    {line.bangla}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
