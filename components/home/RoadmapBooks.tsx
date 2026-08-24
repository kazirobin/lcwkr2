"use client";

import Image from "next/image";
import {
  BookOpen,
  GraduationCap,
  MessageCircle,
  Mic,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Step = {
  title: string;
  description: string;
};

export default function RoadmapBooks() {
  const { t } = useLanguage();

  const roadmap = t.roadmap;

  const icons = [
    <BookOpen key={0} className="h-5 w-5" />,
    <Mic key={1} className="h-5 w-5" />,
    <MessageCircle key={2} className="h-5 w-5" />,
    <GraduationCap key={3} className="h-5 w-5" />,
  ];

  return (
    <section className="bg-background py-6">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}

        <div className="mx-auto mb-4 max-w-3xl text-center">
          <span className="inline-flex rounded-full border-primary border-2 px-4 py-2 text-lg font-semibold text-primary">
            {roadmap.badge}
          </span>

          <h2 className="text-4xl font-black text-text md:text-5xl">
            {roadmap.title}
          </h2>

          <p className="mt-2 text-lg leading-8 text-text/80">
            {roadmap.description}
          </p>
        </div>

        <div className="grid gap-2 lg:grid-cols-2">
          {/* LEFT */}

          <div>
            <div className="overflow-hidden">
              <Image
                src="/assets/pinyin2.jpeg"
                alt={roadmap.imageAlt}
                width={600}
                height={600}
                className="w-full rounded-2xl"
              />

              <div className="mt-2 rounded-2xl bg-background">
                <h3 className="text-xl border-3 rounded-2xl p-2  border-primary font-extrabold text-primary">
                  {roadmap.imageNote}
                </h3>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-secondary bg-background p-5 text-center">
                <h4 className="text-xl lg:text-3xl font-black text-primary">
                  4
                </h4>
                <p className="mt-1 text-sm text-text">Steps</p>
              </div>
              <div className="rounded-2xl border border-secondary bg-background p-5 text-center">
                <h4 className="text-xl lg:text-3xl font-black text-primary">
                  Free
                </h4>
                <p className="mt-1 text-sm text-text">Learning</p>
              </div>
              <div className="rounded-2xl border border-secondary bg-background p-5 text-center">
                <h4 className="text-xl lg:text-3xl font-black text-primary">
                  100%
                </h4>
                <p className="mt-1 text-sm text-text">Online</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="space-y-5">
            {roadmap.steps.map((step: Step, index: number) => (
              <div
                key={index}
                className="group flex gap-5 rounded-3xl border border-secondary bg-background p-2 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-background px-3 py-1 text-xs font-bold text-primary border-2 border-primary">
                      {roadmap.stepLabel} {index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-text">{step.title}</h3>

                  <p className="mt-2 leading-7 text-text/75">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
            {/* Result Card */}

            <div className="rounded-3xl border-4 border-primary text-primary p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-8 text-primary" />

                <h3 className="text-3xl font-extrabold">
                  {roadmap.finalTitle}
                </h3>
              </div>

              <p className="mt-4 leading-7 font-semibold">
                {roadmap.finalDescription}
              </p>
            </div>

            {/* Buttons */}

            <div className="grid gap-4 pt-2 sm:grid-cols-2 ">
              <a
                href="https://drive.google.com/drive/folders/12fEKjDBRU5NgnpgE4WluoRMer94LIkaQ"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-background bg-primary transition hover:opacity-90"
              >
                <BookOpen className="h-5 w-5" />

                {roadmap.learnButton}

                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </a>

              <a
                href="https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-primary bg-background px-6 py-4 font-semibold text-primary transition hover:bg-secondary hover:text-background"
              >
                <MessageCircle className="h-5 w-5" />

                {roadmap.submitButton}

                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
