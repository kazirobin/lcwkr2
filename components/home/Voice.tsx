"use client";

import { Volume2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Voice() {
  const { language } = useLanguage();

  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Volume2 className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">
                {t("ভয়েস নির্দেশনা", "Voice Instruction")}
              </h2>

              <p className="text-sm text-muted-foreground">
                {t(
                  "শুরু করার আগে মনোযোগ দিয়ে শুনুন।",
                  "Listen carefully before starting.",
                )}
              </p>
            </div>
          </div>

          <audio controls className="w-full rounded-lg">
            <source src="/assets/audio/voice.m4a" type="audio/mpeg" />
            {t(
              "আপনার ব্রাউজার অডিও সমর্থন করে না।",
              "Your browser does not support audio.",
            )}
          </audio>
        </div>
      </div>
    </section>
  );
}
