"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

export default function ClassRoutineSection() {
  const { language } = useLanguage();

  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const routine = [
    {
      day: t("শনিবার", "Saturday"),
      type: t("লাইভ ক্লাস", "Live Class"),
      status: "class",
    },
    {
      day: t("রবিবার", "Sunday"),
      type: t("লাইভ ক্লাস", "Live Class"),
      status: "class",
    },
    {
      day: t("সোমবার", "Monday"),
      type: t("লাইভ ক্লাস", "Live Class"),
      status: "class",
    },
    {
      day: t("মঙ্গলবার", "Tuesday"),
      type: t("লাইভ ক্লাস", "Live Class"),
      status: "class",
    },
    {
      day: t("বুধবার", "Wednesday"),
      type: t("লাইভ ক্লাস", "Live Class"),
      status: "class",
    },
    {
      day: t("বৃহস্পতিবার", "Thursday"),
      type: t("সাপ্তাহিক পরীক্ষা", "Weekly Exam"),
      status: "exam",
    },
    {
      day: t("শুক্রবার", "Friday"),
      type: t("সাপ্তাহিক ছুটি", "Weekly Holiday"),
      status: "holiday",
    },
  ];

  const learningSteps = [
    t("Pinyin", "Pinyin"),
    t("লেভেল ১", "Level 1"),
    t("লেভেল ২", "Level 2"),
    t("লেভেল ৩", "Level 3"),
    t("লেভেল ৪", "Level 4"),
    t("লেভেল ৫", "Level 5"),
    t("লেভেল ৬", "Level 6"),
    t("HSK প্রস্তুতি", "HSK Preparation"),
  ];

  return (
    <section className="bg-background py-6 ">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Routine */}
          <div className="rounded-3xl border border-border bg-card p-7">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-text">
                  {t("ক্লাস রুটিন", "Class Routine")}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {t(
                    "সপ্তাহে ৫ দিন লাইভ ক্লাস",
                    "Live classes 5 days every week",
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {routine.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        item.status === "holiday"
                          ? "bg-secondary"
                          : "bg-primary/10"
                      }`}
                    >
                      <BookOpen
                        className={`h-5 w-5 ${
                          item.status === "holiday"
                            ? "text-muted"
                            : "text-primary"
                        }`}
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-text">{item.day}</p>

                      <p className="text-sm text-muted">{item.type}</p>
                    </div>
                  </div>

                  {item.status === "class" && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {t("ক্লাস", "Class")}
                    </span>
                  )}

                  {item.status === "exam" && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {t("পরীক্ষা", "Exam")}
                    </span>
                  )}

                  {item.status === "holiday" && (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted">
                      {t("ছুটি", "Holiday")}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-background p-4">
              <p className="text-sm text-muted">
                {t(
                  "✔ প্রতিটি ক্লাসে উপস্থিতি নেওয়া হয়।",
                  "✔ Attendance is taken in every class.",
                )}
              </p>
            </div>
          </div>

          {/* Learning */}
          <div className="rounded-3xl border border-border bg-card p-7">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-text">
                  {t("শেখার ধাপ", "Learning Steps")}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {t(
                    "এক ধাপ শেষ করে পরবর্তী ধাপে যান",
                    "Complete one step before moving to the next",
                  )}
                </p>
              </div>
            </div>

            <div className="relative ml-3 border-l-2 border-primary/20 pl-8">
              {learningSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative mb-6 last:mb-0 flex items-center"
                >
                  <div className="absolute -left-[41px] rounded-full bg-background">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>

                  <div className="w-full rounded-2xl border border-border bg-background px-4 py-3">
                    <p className="font-medium text-text">{step}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-primary/10 p-5">
              <p className="text-sm leading-7 text-text">
                {t(
                  "প্রতিটি লেভেল সফলভাবে শেষ করার পরে আপনি পরবর্তী লেভেলে অগ্রসর হবেন। সবগুলো লেভেল শেষ হলে HSK পরীক্ষার জন্য প্রস্তুতি শুরু হবে।",
                  "After successfully completing each level, you'll move to the next one. Once all levels are completed, you'll begin HSK preparation.",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
