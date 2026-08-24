"use client";

import { Dialogue } from "@/types/vocabulary";

interface DialogueComponentProps {
  dialogue: Dialogue;
}

export default function DialogueComponent({
  dialogue,
}: DialogueComponentProps) {
  // Get the speaker color with better contrast
  const getSpeakerColor = (speaker: string): string => {
    const colors: Record<string, string> = {
      Teacher: "bg-primary text-background",
      Students: "bg-secondary text-background",
      Customer: "bg-accent text-background",
      Waiter: "bg-primary/80 text-background",
      "Shop Assistant": "bg-secondary/80 text-background",
      A: "bg-accent/80 text-background",
      B: "bg-primary/60 text-background",
    };
    return colors[speaker] || "bg-text/20 text-text";
  };

  // Get the border color
  const getBorderColor = (speaker: string): string => {
    const colors: Record<string, string> = {
      Teacher: "border-primary/40",
      Students: "border-secondary/40",
      Customer: "border-accent/40",
      Waiter: "border-primary/30",
      "Shop Assistant": "border-secondary/30",
      A: "border-accent/30",
      B: "border-primary/20",
    };
    return colors[speaker] || "border-text/10";
  };

  // Get the background color with better contrast
  const getBgColor = (speaker: string): string => {
    const colors: Record<string, string> = {
      Teacher: "bg-primary/5 hover:bg-primary/10",
      Students: "bg-secondary/5 hover:bg-secondary/10",
      Customer: "bg-accent/5 hover:bg-accent/10",
      Waiter: "bg-primary/5 hover:bg-primary/10",
      "Shop Assistant": "bg-secondary/5 hover:bg-secondary/10",
      A: "bg-accent/5 hover:bg-accent/10",
      B: "bg-primary/5 hover:bg-primary/10",
    };
    return colors[speaker] || "bg-text/5 hover:bg-text/10";
  };

  return (
    <div className="bg-background rounded-xl shadow-lg overflow-hidden border border-secondary/20 transition-colors">
      <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
        <h3 className="text-lg font-semibold text-background flex items-center gap-2">
          <span className="text-xl">💬</span>
          {dialogue.title}
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {dialogue.lines.map((line, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-200 ${getBgColor(line.speaker)} border-l-4 ${getBorderColor(line.speaker)}`}
          >
            <div className="flex-shrink-0 min-w-[90px]">
              <span
                className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getSpeakerColor(line.speaker)}`}
              >
                {line.speaker}
              </span>
            </div>

            <div className="flex-1 space-y-1.5">
              <p className="text-lg font-medium text-text leading-relaxed">
                {line.hanzi}
              </p>
              <p className="text-sm text-text/60 font-medium">
                {line.pinyin}
              </p>
              <p className="text-sm text-text/70 border-t border-text/5 pt-2 mt-1">
                {line.english}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}