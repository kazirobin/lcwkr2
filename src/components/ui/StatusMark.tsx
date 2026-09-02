import { Check, Minus, Circle } from "lucide-react";
import type { ReactNode } from "react";

/* Status shown by an ink MARK first, colour only as quiet reinforcement.
   Clears the contrast failures from emerald/amber pills. */

type Tone = "done" | "pending" | "closed" | "neutral";

const marks: Record<Tone, { icon: ReactNode; ink: string }> = {
  done: { icon: <Check className="h-3.5 w-3.5" strokeWidth={3} />, ink: "text-ok" },
  pending: { icon: <Circle className="h-3 w-3" strokeWidth={2.5} />, ink: "text-text/60" },
  closed: { icon: <Minus className="h-3.5 w-3.5" strokeWidth={3} />, ink: "text-danger" },
  neutral: { icon: null, ink: "text-text/60" },
};

export function StatusMark({
  tone,
  children,
  className = "",
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  const m = marks[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${m.ink} ${className}`}
    >
      {m.icon && (
        <span aria-hidden="true" className="inline-flex">
          {m.icon}
        </span>
      )}
      {children}
    </span>
  );
}

/* A larger pill form for card headers — still mark-led. */
export function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  const m = marks[tone];
  const bg =
    tone === "done"
      ? "bg-ok-surface"
      : tone === "closed"
        ? "bg-danger-surface"
        : "bg-text/5";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-text/10 px-2.5 py-1 text-[11px] font-semibold ${m.ink} ${bg}`}
    >
      {m.icon && <span aria-hidden="true">{m.icon}</span>}
      {children}
    </span>
  );
}
