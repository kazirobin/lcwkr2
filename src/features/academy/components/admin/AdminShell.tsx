"use client";

import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  HandCoins,
  Languages,
  LogOut,
  Megaphone,
  MessageSquareQuote,
  MoreHorizontal,
  PenLine,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import {
  Breadcrumb,
  Button,
  Eyebrow,
  Field,
  IconButton,
  PageHeader,
  SectionHanzi,
  useConfirm,
} from "@/components/ui";
import { AdminStatsProvider, useAdminStats, type AdminCounts } from "./AdminStats";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";
const PIN_KEY = "academy_admin_pin";
const UNLOCK_KEY = "academy_admin_unlocked";

/**
 * The primary bar: the modules Robin Sir opens most days.
 *
 * This used to be fourteen pills in a row, which meant a phone saw about four
 * of them and a laptop had to scroll to reach Announcements. The bar now carries
 * only what gets used daily — intake, students, courses, homework, money, reach
 * — and everything else lives behind "More", where it is still one tap away but
 * no longer competes for the same strip.
 */
const ADMIN_MODULES = [
  { href: "/admin/registrations", bn: "আবেদন", en: "Intake", icon: UserPlus, badge: "pendingStudents" },
  { href: "/admin/students", bn: "শিক্ষার্থী", en: "Students", icon: Users, badge: "totalStudents" },
  { href: "/admin/courses", bn: "কোর্স", en: "Courses", icon: BookOpen, badge: "pendingEnrollments" },
  { href: "/admin/hw", bn: "হোমওয়ার্ক", en: "Homework", icon: PenLine, badge: null },
  { href: "/admin/pro", bn: "Pro", en: "Pro", icon: Sparkles, badge: "pendingPro" },
  { href: "/admin/announcements", bn: "ঘোষণা", en: "Notices", icon: Megaphone, badge: null },
  { href: "/admin/analytics", bn: "ট্রাফিক", en: "Traffic", icon: BarChart3, badge: null },
] as const satisfies readonly {
  href: string;
  bn: string;
  en: string;
  icon: typeof Users;
  badge: keyof AdminCounts | null;
}[];

/** Everything that did not earn a place in the bar, in one tidy menu. */
const ADMIN_MORE = [
  { href: "/admin/pro-trials", label: "ফ্রি প্রিভিউ", en: "Free trial", icon: Timer },
  { href: "/admin/chinese-words", label: "কোর ওয়ার্ডস", en: "Core words", icon: Languages },
  { href: "/admin/hanzi-pro", label: "হানজি প্রো", en: "Hanzi Pro", icon: Trophy },
  { href: "/admin/donations", label: "অনুদান", en: "Donations", icon: HandCoins },
  { href: "/admin/reviews", label: "রিভিউ", en: "Reviews", icon: MessageSquareQuote },
] as const;

/**
 * Shared gate + chrome for every /admin page. NOTE: the passcode check
 * is still client-side only — real server-enforced auth is a separate,
 * deferred piece of work. This unifies the previously inconsistent gating
 * (the dashboard had one, the sub-pages had none) and the visual shell.
 */
export function AdminShell({
  title,
  crumb,
  seal,
  lede,
  actions,
  children,
}: {
  title: string;
  crumb: string;
  seal: string;
  lede?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PIN_KEY);
      if (saved && saved.trim() === ADMIN_PASSCODE.trim()) {
        queueMicrotask(() => {
          setAuthed(true);
          try {
            sessionStorage.setItem(UNLOCK_KEY, "true");
          } catch {
            /* ignore */
          }
        });
      }
    } catch {
      /* storage unavailable */
    }
    queueMicrotask(() => setChecking(false));
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_PASSCODE.trim()) {
      try {
        localStorage.setItem(PIN_KEY, pin.trim());
        sessionStorage.setItem(UNLOCK_KEY, "true");
      } catch {
        /* ignore */
      }
      setAuthed(true);
    } else {
      setError(t("ভুল পাসকোড।", "Incorrect passcode."));
    }
  };

  const logout = async () => {
    const ok = await confirm({
      title: t("লগ আউট করবেন?", "Log out?"),
      message: t("সংরক্ষিত পাসকোড মুছে যাবে।", "The saved passcode will be cleared."),
      confirmLabel: t("লগ আউট", "Log out"),
    });
    if (!ok) return;
    try {
      localStorage.removeItem(PIN_KEY);
      sessionStorage.removeItem(UNLOCK_KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
    setPin("");
  };

  if (checking) {
    return (
      <div className="mx-auto max-w-md px-4 pt-40 text-center" role="status" aria-live="polite">
        <p className="text-sm text-text/50">{t("যাচাই করা হচ্ছে…", "Verifying access…")}</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="relative isolate mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pt-28 pb-20">
        <SectionHanzi char={seal} className="-top-6 right-0 text-[13rem]" />
        <Eyebrow seal="门" label={t("স্টাফ প্রবেশ", "Staff access")} />
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-text">
          {t("অ্যাডমিন কনসোল", "Admin console")}
        </h1>
        <p className="mt-2 text-sm text-text/60">
          {t("চালিয়ে যেতে অ্যাডমিন পাসকোড দিন।", "Enter the admin passcode to continue.")}
        </p>
        <form onSubmit={login} className="mt-6 space-y-4 rounded-2xl border border-text/10 bg-card p-6">
          <Field
            type="password"
            label={t("অ্যাডমিন পাসকোড", "Admin passcode")}
            autoFocus
            value={pin}
            error={error}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            className="text-center tracking-widest"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => router.push("/academy")}
            >
              {t("বাতিল", "Cancel")}
            </Button>
            <Button type="submit" className="flex-1">
              {t("আনলক", "Unlock")}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <AdminStatsProvider>
      <div className="relative isolate mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char={seal} className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("অ্যাডমিন", "Admin"), href: "/admin" },
          { label: crumb },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={
          <Eyebrow
            seal={seal}
            label={t("অ্যাডমিন", "Admin")}
            detail={
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {t("যাচাইকৃত", "verified")}
              </span>
            }
          />
        }
        title={title}
        lede={lede}
        actions={
          <>
            {actions}
            <IconButton label={t("লগ আউট", "Log out")} size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </IconButton>
          </>
        }
      />

      {/* persistent quick-access bar — visible on every /admin page */}
      <AdminQuickBar />

      <div className="mt-10">{children}</div>
      </div>
    </AdminStatsProvider>
  );
}

/** The sticky module bar — counters come from the shared admin stats. */
function AdminQuickBar() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const { counts, loading } = useAdminStats();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);

  // The menu is a plain popover rather than a focus-trapping dialog: it closes
  // on Escape or an outside click, and takes the first item on Tab so a
  // keyboard user is not stranded behind it.
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [moreOpen]);

  const moreActive = ADMIN_MORE.some(
    (m) => pathname === m.href || pathname.startsWith(`${m.href}/`),
  );

  // The bar scrolls sideways on narrow screens. Without this the current page
  // can sit off-screen after a jump, and there is no clue that more modules
  // exist to the right.
  const listRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft < max - 4 });
  }, []);

  useEffect(() => {
    measure();
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  // Bring the active module into view whenever the route changes.
  useEffect(() => {
    const el = listRef.current;
    const active = el?.querySelector<HTMLElement>('[aria-current="page"]');
    active?.scrollIntoView({ block: "nearest", inline: "center" });
    measure();
  }, [pathname, measure]);

  const nudge = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(200, el.clientWidth * 0.6), behavior: "smooth" });
  };

  /**
   * Press-and-drag to scroll, on a mouse as well as a finger.
   *
   * Native touch scrolling already works, so touch is left alone except that a
   * horizontal drag must not fire the link underneath it. A mouse has no such
   * behaviour, so holding the button and dragging would otherwise select text
   * and leave the bar stuck.
   */
  const drag = useRef<{
    id: number;
    startX: number;
    startScroll: number;
    moved: boolean;
    pointerType: string;
  } | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = listRef.current;
    if (!el) return;
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      pointerType: e.pointerType,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const el = listRef.current;
    if (!d || !el || d.id !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      // Only a mouse needs capturing and cursor feedback; a finger is already
      // scrolling natively and must keep its own behaviour.
      if (d.pointerType === "mouse") {
        el.setPointerCapture(e.pointerId);
        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
      }
    }
    if (d.moved) {
      // A drag that started on a link must not also follow it.
      e.preventDefault();
      el.scrollLeft = d.startScroll - dx;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const el = listRef.current;
    drag.current = null;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    if (!d || !el || d.id !== e.pointerId) return;
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    measure();
  };

  /** Swallow the click a drag would otherwise turn into a navigation. */
  const onClickCapture = (e: React.MouseEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (d?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <nav
      aria-label={t("অ্যাডমিন মডিউল", "Admin modules")}
      className="sticky top-16 z-30 border-b border-text/10 bg-background/90 backdrop-blur-sm"
    >
      <div className="relative mx-auto flex max-w-5xl items-center">
        {/* Arrows only when there is somewhere to scroll, and never on phones
            where a swipe is the natural gesture. */}
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label={t("বাঁয়ে", "Scroll left")}
          className={`absolute left-0 z-10 hidden h-full w-9 shrink-0 items-center justify-center bg-gradient-to-r from-background to-transparent text-lg leading-none text-text/60 transition-opacity hover:text-text sm:flex ${
            edges.left ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          ‹
        </button>

        <ul
          ref={listRef}
          onScroll={measure}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          className="flex flex-1 cursor-grab touch-pan-x items-center gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] active:cursor-grabbing sm:px-10 lg:px-12 [&::-webkit-scrollbar]:hidden"
        >
          {ADMIN_MODULES.map((m) => {
            const Icon = m.icon;
            const active = pathname === m.href || pathname.startsWith(`${m.href}/`);
            const count = m.badge ? counts[m.badge] : null;
            return (
              <li key={m.href} className="shrink-0">
                <Link
                  href={m.href}
                  draggable={false}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                    active
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-text/15 bg-card text-text/75 hover:border-primary/50 hover:bg-primary/[0.06] hover:text-text"
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {t(m.bn, m.en)}
                  {count != null && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                        active ? "bg-primary/15 text-primary" : "bg-text/8 text-text/60"
                      }`}
                    >
                      {loading ? "—" : count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}

          {/* The overflow: same links, out of the way until asked for. */}
          <li className="relative shrink-0" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                moreActive
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-text/15 bg-card text-text/75 hover:border-primary/50 hover:bg-primary/[0.06] hover:text-text"
              }`}
            >
              <MoreHorizontal className="size-4" aria-hidden="true" />
              {t("আরও", "More")}
            </button>

            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-text/12 bg-card p-1.5 shadow-2xl"
              >
                {ADMIN_MORE.map((m) => {
                  const Icon = m.icon;
                  const active = pathname === m.href || pathname.startsWith(`${m.href}/`);
                  return (
                    <Link
                      key={m.href}
                      href={m.href}
                      role="menuitem"
                      draggable={false}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-text/75 hover:bg-text/[0.05] hover:text-text"
                      }`}
                    >
                      <Icon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
                      {t(m.label, m.en)}
                    </Link>
                  );
                })}
              </div>
            )}
          </li>
        </ul>

        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label={t("ডানে", "Scroll right")}
          className={`absolute right-0 z-10 hidden h-full w-9 shrink-0 items-center justify-center bg-gradient-to-l from-background to-transparent text-lg leading-none text-text/60 transition-opacity hover:text-text sm:flex ${
            edges.right ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          ›
        </button>
      </div>
    </nav>
  );
}
