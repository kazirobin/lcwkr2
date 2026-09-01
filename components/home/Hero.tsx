"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { gsap } from "gsap";

type Props = {
  /** Optional real instructor portrait. Omitted → an initials mark is used instead. */
  photoSrc?: string;
};

/**
 * Vocabulary hidden in the paper — revealed on cursor pointer move.
 */
const SCATTER_CHARS = [
  { ch: "学", top: "3%", left: "43%", size: "text-8xl", rotate: "-rotate-6" },
  { ch: "好", top: "11%", left: "64%", size: "text-2xl", rotate: "rotate-3" },
  { ch: "听", top: "20%", left: "90%", size: "text-6xl", rotate: "rotate-6" },
  { ch: "读", top: "47%", left: "60%", size: "text-3xl", rotate: "-rotate-4" },
  { ch: "写", top: "56%", left: "94%", size: "text-7xl", rotate: "rotate-2" },
  { ch: "说", top: "71%", left: "65%", size: "text-4xl", rotate: "-rotate-6" },
  { ch: "你好", top: "87%", left: "37%", size: "text-xl", rotate: "rotate-2" },
  { ch: "加油", top: "2%", left: "3%", size: "text-5xl", rotate: "-rotate-3" },
  { ch: "谢谢", top: "92%", left: "6%", size: "text-2xl", rotate: "rotate-4" },
  { ch: "习", top: "34%", left: "2%", size: "text-7xl", rotate: "rotate-6" },
  { ch: "语", top: "62%", left: "24%", size: "text-8xl", rotate: "-rotate-3" },
  { ch: "我", top: "42%", left: "82%", size: "text-2xl", rotate: "rotate-5" },
  { ch: "问", top: "80%", left: "84%", size: "text-5xl", rotate: "-rotate-2" },
  { ch: "字", top: "15%", left: "12%", size: "text-3xl", rotate: "rotate-3" },
];

export function Hero({ photoSrc }: Props) {
  const root = useRef<HTMLElement>(null);
  const torchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);

    // Torch reveal
    const torch = torchRef.current;
    const onTorchMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--tx", `${e.clientX - r.left}px`);
      el.style.setProperty("--ty", `${e.clientY - r.top}px`);
      if (torch) torch.style.opacity = "0.3";
    };

    const onTorchLeave = () => {
      if (torch) torch.style.opacity = "0";
    };

    el.addEventListener("pointermove", onTorchMove);
    el.addEventListener("pointerleave", onTorchLeave);

    if (reduce) {
      gsap.set(q("[data-line], [data-soft], [data-chip], [data-seal], [data-card]"), {
        clearProps: "all",
        opacity: 1,
      });
      gsap.set(q("[data-stroke], [data-check]"), { strokeDashoffset: 0 });
      gsap.set(q("[data-dot]"), { scale: 1, opacity: 1 });
      return () => {
        el.removeEventListener("pointermove", onTorchMove);
        el.removeEventListener("pointerleave", onTorchLeave);
      };
    }

    const ctx = gsap.context(() => {
      gsap.set(q("[data-card]"), { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(q("[data-line]"), { yPercent: 120 });
      gsap.set(q("[data-soft]"), { y: 20, opacity: 0 });
      gsap.set(q("[data-chip]"), { y: 14, opacity: 0 });
      gsap.set(q("[data-seal]"), { scale: 1.6, rotate: -18, opacity: 0 });
      gsap.set(q("[data-stroke]"), { strokeDashoffset: 100 });
      gsap.set(q("[data-check]"), { strokeDashoffset: 100 });
      gsap.set(q("[data-dot]"), { scale: 0, opacity: 0 });
      gsap.set(q("[data-guide]"), { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(q("[data-seal]"), { scale: 1, rotate: -6, opacity: 1, duration: 0.55, ease: "back.out(2.6)" }, 0)
        .to(q("[data-line]"), { yPercent: 0, duration: 0.85, stagger: 0.09 }, 0.12)
        .to(q("[data-check]"), { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, 0.75)
        .to(q("[data-card]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power4.inOut" }, 0.3)
        .to(q("[data-guide]"), { opacity: 1, duration: 0.5 }, 0.55)
        .to(q("[data-soft]"), { y: 0, opacity: 1, duration: 0.55, stagger: 0.06 }, 0.5)
        .to(q("[data-stroke]"), { strokeDashoffset: 0, duration: 0.42, stagger: 0.32, ease: "power2.inOut" }, 0.7)
        .to(
          q("[data-dot]"),
          { scale: 1, opacity: 1, duration: 0.3, stagger: 0.32, ease: "back.out(3)" },
          0.7,
        )
        .to(q("[data-chip]"), { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.3");

      const cardInner = q("[data-card-inner]")[0] as HTMLElement | undefined;
      const cx = cardInner ? gsap.quickTo(cardInner, "x", { duration: 0.9, ease: "power3" }) : null;
      const cy = cardInner ? gsap.quickTo(cardInner, "y", { duration: 0.9, ease: "power3" }) : null;

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        cx?.(((e.clientX - r.left) / r.width - 0.5) * 10);
        cy?.(((e.clientY - r.top) / r.height - 0.5) * 8);
      };

      const onLeave = () => {
        cx?.(0);
        cy?.(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    }, el);

    return () => {
      ctx.revert();
      el.removeEventListener("pointermove", onTorchMove);
      el.removeEventListener("pointerleave", onTorchLeave);
    };
  }, []);

  const sectionStyles: CSSProperties = {
    "--bg": "180 50% 98%",
    "--paper2": "180 30% 95%",
    "--ink": "165 70% 5%",
    "--primary": "18 95% 64%",
    "--secondary": "5 100% 57%",
    "--secondary-deep": "5 85% 40%",
  } as CSSProperties;

  return (
    <section
      ref={root}
      aria-labelledby="hl-title"
      style={sectionStyles}
      className="relative isolate min-h-screen w-full overflow-hidden bg-[hsl(var(--bg))] font-[family-name:var(--font-hind)] text-[hsl(var(--ink))]"
    >
      {/* Colour wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_100%_0%,hsl(var(--secondary)/0.16),transparent_55%),radial-gradient(100%_80%_at_0%_100%,hsl(var(--primary)/0.2),transparent_60%)]"
      />

      {/* Ruled practice-sheet grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_63px,hsl(var(--ink)/0.06)_63px_64px),repeating-linear-gradient(to_right,transparent_0_63px,hsl(var(--ink)/0.06)_63px_64px)] [mask-image:radial-gradient(75%_75%_at_50%_30%,black,transparent_92%)]"
      />

      {/* Vocabulary hidden in the paper */}
      <div
        ref={torchRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 z-10 text-[hsl(var(--ink))] transition-opacity duration-300 ease-out [mask-image:radial-gradient(circle_240px_at_var(--tx,-9999px)_var(--ty,-9999px),black_0%,black_35%,transparent_78%)]"
      >
        {SCATTER_CHARS.map((c, i) => (
          <span
            key={i}
            lang="zh"
            className={`absolute font-bold select-none ${c.size} ${c.rotate}`}
            style={{ top: c.top, left: c.left }}
          >
            {c.ch}
          </span>
        ))}
      </div>

      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-[1360px] flex-col px-5 pt-24 pb-8 sm:px-8 sm:pt-28 lg:px-12">
        <div className="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* ---------------- Left Content ---------------- */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3" data-soft>
              <span
                data-seal
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[hsl(var(--secondary-deep))] text-sm font-bold text-[hsl(var(--bg))] shadow-[2px_2px_0_hsl(var(--ink)/0.18)]"
              >
                汉
              </span>
              <span className="h-px w-8 bg-[hsl(var(--ink)/0.25)]" aria-hidden="true" />
              <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.18em] text-[hsl(var(--ink)/0.55)]">
                পাঠ ০১ · বিনামূল্যে কোর্স
              </span>
            </div>

            <h1 id="hl-title" lang="bn" className="mt-6 flex flex-col text-[2.5rem] leading-[1.1] font-bold tracking-tight sm:text-6xl lg:text-[4.5rem]">
              <span className="block overflow-hidden pb-1">
                <span data-line className="block">
                  চাইনিজ শেখা শুরু,
                </span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span data-line className="inline-flex items-baseline">
                  <span className="text-[hsl(var(--secondary-deep))]">একদম বিনামূল্যে।</span>
                  <svg
                    data-check
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="ml-3 mb-2 h-7 w-7 shrink-0 self-center text-[hsl(var(--secondary-deep))]"
                  >
                    <path
                      d="M4 13 L9.5 18.5 L20 5"
                      pathLength={100}
                      strokeDasharray={100}
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </h1>

            <p lang="bn" data-soft className="mt-6 max-w-[46ch] text-base leading-[1.75] text-[hsl(var(--ink)/0.72)] sm:text-lg">
              শূন্য থেকে সাবলীল পর্যন্ত — কাজী রবিনের সাথে প্রতি সপ্তাহে লাইভ ক্লাসে, ধাপে ধাপে।
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" data-soft>
              <span className="relative inline-block">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-sm bg-[hsl(var(--ink))]"
                />
                <a
                  href="#live"
                  lang="bn"
                  className="relative inline-flex items-center gap-2 rounded-sm bg-[hsl(var(--secondary-deep))] px-6 py-3.5 text-[15px] font-semibold text-[hsl(var(--bg))] transition-transform duration-200 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--secondary-deep))]"
                >
                  লাইভ ক্লাসে যোগ দিন <span aria-hidden="true">→</span>
                </a>
              </span>

              <a
                href="#pdf"
                lang="bn"
                className="rounded-sm border border-[hsl(var(--ink)/0.25)] px-6 py-3.5 text-[15px] font-medium text-[hsl(var(--ink))] transition-colors hover:border-[hsl(var(--secondary-deep))] hover:text-[hsl(var(--secondary-deep))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--secondary-deep))]"
              >
                PDF নোট ডাউনলোড
              </a>

              <a
                href="#intro"
                lang="bn"
                className="inline-flex items-center gap-1.5 text-[15px] text-[hsl(var(--ink)/0.7)] underline decoration-[hsl(var(--ink)/0.3)] underline-offset-4 transition-colors hover:text-[hsl(var(--secondary-deep))] hover:decoration-[hsl(var(--secondary-deep))]"
              >
                ভাষা পরিচিতি দেখুন <span aria-hidden="true">→</span>
              </a>
            </div>

            <p
              lang="bn"
              data-soft
              className="mt-10 font-[family-name:var(--font-geist-mono)] text-[13px] tracking-wide text-[hsl(var(--ink)/0.55)]"
            >
              ৪.৯ ★ শিক্ষার্থী রেটিং &nbsp;·&nbsp; ১২,০০০+ শিক্ষার্থী &nbsp;·&nbsp; HSK ১–৬ রোডম্যাপ &nbsp;·&nbsp; ১০০% ফ্রি
            </p>
          </div>

          {/* ---------------- Right Practice Cell ---------------- */}
          <div className="flex flex-col items-center lg:items-end">
            <div
              data-card
              className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-[3px] border border-[hsl(var(--ink)/0.16)] bg-[hsl(var(--paper2))] shadow-[10px_10px_0_hsl(var(--ink)/0.06)] sm:max-w-[340px]"
            >
              <div data-card-inner className="absolute inset-0">
                {/* 田字格 guide lines */}
                <svg
                  data-guide
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full text-[hsl(var(--secondary))] opacity-30"
                  aria-hidden="true"
                >
                  <path d="M50 4 L50 96" stroke="currentColor" strokeWidth={0.6} strokeDasharray="3 3" />
                  <path d="M4 50 L96 50" stroke="currentColor" strokeWidth={0.6} strokeDasharray="3 3" />
                  <path d="M8 8 L92 92" stroke="currentColor" strokeWidth={0.4} strokeDasharray="2 3" />
                  <path d="M92 8 L8 92" stroke="currentColor" strokeWidth={0.4} strokeDasharray="2 3" />
                </svg>

                {/* 中 (zhōng) Stroke Animation */}
                <svg viewBox="0 0 100 140" className="absolute inset-[14%] h-[72%] w-[72%]" aria-hidden="true">
                  <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={8}>
                    <path data-stroke pathLength={100} strokeDasharray={100} d="M25 35 L25 95" stroke="hsl(var(--ink))" />
                    <path data-stroke pathLength={100} strokeDasharray={100} d="M25 35 L75 35 L75 95" stroke="hsl(var(--ink))" />
                    <path data-stroke pathLength={100} strokeDasharray={100} d="M25 95 L75 95" stroke="hsl(var(--ink))" />
                    <path data-stroke pathLength={100} strokeDasharray={100} d="M50 15 L50 115" stroke="hsl(var(--secondary-deep))" />
                  </g>
                  {[
                    [15, 30],
                    [34, 25],
                    [15, 100],
                    [50, 6],
                  ].map(([cx, cy], i) => (
                    <g key={i} data-dot transform={`translate(${cx} ${cy})`}>
                      <circle r={7} fill="hsl(var(--secondary-deep))" />
                      <text x={0} y={2.5} textAnchor="middle" fontSize={8} fontWeight={700} fill="hsl(var(--bg))">
                        {i + 1}
                      </text>
                    </g>
                  ))}
                </svg>

                <p
                  lang="en"
                  data-chip
                  className="absolute bottom-4 left-4 font-[family-name:var(--font-geist-mono)] text-xs text-[hsl(var(--ink)/0.6)]"
                >
                  zhōng
                  <span lang="bn" className="ml-1 text-[hsl(var(--ink)/0.45)]">
                    · মধ্য / চীন
                  </span>
                </p>

                <span
                  data-chip
                  aria-hidden="true"
                  className="absolute top-4 right-4 rounded-sm bg-[hsl(var(--secondary-deep))] px-2 py-1 font-[family-name:var(--font-geist-mono)] text-[10px] tracking-widest text-[hsl(var(--bg))]"
                >
                  中文
                </span>
              </div>
            </div>

            {/* Instructor Credit */}
            <div className="mt-5 flex w-full max-w-[300px] items-center gap-3 sm:max-w-[340px]" data-chip>
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-[hsl(var(--ink)/0.18)] bg-[hsl(var(--paper2))]">
                {photoSrc ? (
                  <Image
                    src={photoSrc}
                    alt="শিক্ষক কাজী রবিন"
                    fill
                    sizes="48px"
                    className="object-cover grayscale"
                    unoptimized
                  />
                ) : (
                  <span lang="bn" className="flex h-full w-full items-center justify-center text-sm font-bold text-[hsl(var(--ink)/0.7)]">
                    কর
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="absolute -right-1.5 -bottom-1.5 flex h-5 w-5 items-center justify-center rounded-sm bg-[hsl(var(--secondary-deep))] text-[9px] font-bold text-[hsl(var(--bg))]"
                >
                  名
                </span>
              </div>
              <p lang="bn" className="text-[13px] leading-snug text-[hsl(var(--ink)/0.65)]">
                <strong className="block font-semibold text-[hsl(var(--ink))]">কাজী রবিন</strong>
                শিক্ষক · HSK ৬ · চীনে ৫+ বছর
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- Bottom Footer Anchor ---------------- */}
        <div
          data-soft
          className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[hsl(var(--ink)/0.12)] pt-5 sm:flex-row sm:items-center"
        >
          <span className="font-[family-name:var(--font-geist-mono)] text-[11px] tracking-[0.14em] text-[hsl(var(--ink)/0.45)]">
            LESSON 01 · 汉语
          </span>
          <a
            href="#next"
            lang="bn"
            className="inline-flex items-center gap-2 text-xs tracking-wide text-[hsl(var(--ink)/0.55)] transition-colors hover:text-[hsl(var(--secondary-deep))]"
          >
            নিচে স্ক্রল করুন <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}