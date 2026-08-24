"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Globe, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  const hero = t.hero;

  return (
    <section className="bg-background text-text">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative lg:order-2">
            <div className="relative mx-auto w-full max-w-md xl:max-w-lg">
              <div className="absolute -inset-4 rounded-[30px] bg-primary/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-secondary/50 bg-background p-4 shadow-2xl">
                <Image
                  src="/assets/hero1.png"
                  alt="Chinese Teacher"
                  width={700}
                  height={850}
                  priority
                  className="h-auto w-full rounded-2xl object-cover"
                />

                <h1 className="mt-4 text-center text-3xl font-extrabold text-primary">
                  {hero.title.edu}
                </h1>
              </div>
            </div>
          </div>
          {/* ================= LEFT ================= */}

          <div>
            {/* Badge */}

            <Link
              href="/msg"
              className="inline-flex items-center gap-2 rounded-full border border-secondary px-4 py-2 text-sm font-semibold text-primary transition hover:opacity-90"
            >
              <Globe size={18} />

              {hero.title.badge}
            </Link>

            {/* Heading */}

            <h1 className="mt-8 text-4xl font-black leading-tight md:text-5xl xl:text-6xl">
              {hero.title.line1}

              <span className="block text-primary">{hero.title.line2}</span>

              <span className="block">{hero.title.line3}</span>

              <span className="mt-2 block text-primary">
                {hero.title.line4}
              </span>
            </h1>

            {/* Description */}

            <p className="mt-8 max-w-xl text-2xl text-text/80 leading-relaxed font-semibold">
              {hero.description}
            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/pdf"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-background transition hover:scale-[1.02]"
              >
                <BookOpen size={20} />

                {hero.buttons.resources}

                <ArrowRight size={18} />
              </Link>
              <Link
                href="/intro"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-secondary bg-background px-8 py-4 font-semibold transition hover:bg-secondary"
              >
                <Users size={20} />

                {hero.buttons.whatsapp}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
