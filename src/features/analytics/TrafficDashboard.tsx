"use client";

import { useEffect, useState } from "react";
import { BarChart3, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { useLanguage } from "@/i18n";
import { Eyebrow } from "@/components/ui/surfaces";

/**
 * The public traffic board at the foot of the home page.
 *
 * Only rolled-up daily totals are shown — how many people visited, how many
 * pages they read, and which parts of the site they use most. Nothing here is
 * about an individual, and the numbers come from the same /api/traffic/summary
 * the admin page reads.
 */

type Summary = {
  today: {
    day: string;
    pageViews: number;
    clicks: number;
    logins: number;
    newVisitors: number;
    uniqueVisitors: number;
  };
  daily: Array<{ day: string; pageViews: number; uniqueVisitors: number; logins: number }>;
  topPages: Array<{ label: string; count: number }>;
  topButtons: Array<{ label: string; count: number }>;
  totals: { pageViews: number; uniqueVisitorsAllTime: number; sessions: number };
};

const bn = {
  eyebrow: "সাইট ট্রাফিক",
  title: "প্রতিদিনের ভিজিটর",
  intro:
    "আমাদের শিক্ষার্থীরা প্রতিদিন কতটা ব্যবহার করছেন তার সরাসরি হিসাব, নিচে দেখানো হলো।",
  visitors: "আজকের ভিজিটর",
  views: "পেজ ভিউ",
  logins: "লগইন",
  newVisitors: "নতুন ভিজিটর",
  last14: "গত ১৪ দিন",
  viewsLabel: "পেজ ভিউ",
  topPages: "সবচেয়ে বেশি পঠা পেজ",
  topButtons: "সবচেয়ে বেশি ব্যবহৃত বাটন",
  allTime: "মোট",
  sessions: "সেশন",
  loading: "ট্রাফিক তথ্য আসছে…",
  unavailable: "ট্রাফিক তথ্য এখন দেখানো যাচ্ছে না।",
  noData: "এখনো কোনো তথ্য নেই।",
  days: "দিন",
  viewsShort: "ভিউ",
};

const en: typeof bn = {
  eyebrow: "Site traffic",
  title: "Daily visitors",
  intro: "A live count of how much our students are using the site each day.",
  visitors: "Visitors today",
  views: "Page views",
  logins: "Sign-ins",
  newVisitors: "New visitors",
  last14: "Last 14 days",
  viewsLabel: "Page views",
  topPages: "Most read pages",
  topButtons: "Most used buttons",
  allTime: "All time",
  sessions: "Sessions",
  loading: "Loading traffic…",
  unavailable: "Traffic figures are unavailable right now.",
  noData: "No data yet.",
  days: "days",
  viewsShort: "views",
};

/** A short, friendly name for a path so the list reads like a menu. */
function prettyPath(path: string): string {
  const map: Record<string, string> = {
    "/": "Home",
    "/hsk": "HSK courses",
    "/pinyin": "Pinyin",
    "/academy": "Academy",
    "/pdf": "PDF library",
    "/chinese-words": "Core words",
    "/hanzi-pro": "Hanzi Pro",
    "/community": "Community",
    "/account": "My account",
    "/donate": "Donate",
    "/register": "Register",
    "/login": "Login",
  };
  if (map[path]) return map[path];
  if (path.startsWith("/hsk/")) {
    const m = path.match(/^\/hsk\/(\d)/);
    if (m) return `HSK ${m[1]}`;
  }
  if (path.startsWith("/hw")) return "Homework";
  if (path.startsWith("/admin")) return "Admin";
  return path;
}

export default function TrafficDashboard() {
  const { language } = useLanguage();
  const c = language === "bn" ? bn : en;
  const [data, setData] = useState<Summary | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let alive = true;
    const load = () => {
      fetch("/api/traffic/summary?days=14", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (!alive) return;
          if (d.success) {
            setData(d as Summary);
            setState("ready");
          } else {
            setState("error");
          }
        })
        .catch(() => {
          if (alive) setState("error");
        });
    };
    load();
    // Refresh every couple of minutes so a long-open tab does not go stale.
    const timer = setInterval(load, 120000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const maxViews = Math.max(1, ...(data?.daily.map((d) => d.pageViews) ?? [1]));
  const hasNumbers = (data?.totals.pageViews ?? 0) > 0;

  const tiles = data
    ? [
        { icon: Users, value: data.today.uniqueVisitors, label: c.visitors },
        { icon: BarChart3, value: data.today.pageViews, label: c.views },
        { icon: TrendingUp, value: data.today.newVisitors, label: c.newVisitors },
        { icon: MousePointerClick, value: data.today.logins, label: c.logins },
      ]
    : [];

  return (
    <section id="traffic" className="relative isolate border-t border-text/10 bg-background/60 py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <Eyebrow seal="数" label={c.eyebrow} />
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          {c.title}
        </h2>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-7 text-text/70">{c.intro}</p>

        {state === "loading" && (
          <p className="mt-8 text-sm text-text/55" role="status" aria-live="polite">
            {c.loading}
          </p>
        )}

        {state === "error" && (
          <p className="mt-8 text-sm text-text/55">{c.unavailable}</p>
        )}

        {state === "ready" && data && (
          <>
            <dl className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tiles.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-text/12 bg-background px-4 py-4"
                >
                  <Icon className="size-4 text-secondary" aria-hidden="true" />
                  <dd className="mt-2 font-mono text-2xl font-bold tabular-nums text-text">
                    {value.toLocaleString("en-US")}
                  </dd>
                  <dt className="mt-0.5 text-[11px] leading-snug text-text/55">{label}</dt>
                </div>
              ))}
            </dl>

            {hasNumbers ? (
              <>
                <div className="mt-8 rounded-2xl border border-text/12 bg-background p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text/50">
                    {c.last14}
                  </p>
                  {/* A plain bar row rather than a chart library: no extra
                      dependency, and it still reads at a glance. Each column
                      is full height with the bar pinned to the bottom, so the
                      percentage height has something to resolve against. */}
                  <div
                    className="mt-4 flex h-28 items-stretch gap-1"
                    role="img"
                    aria-label={`${c.viewsLabel}: ${data.daily
                      .map((d) => `${d.day} ${d.pageViews}`)
                      .join(", ")}`}
                  >
                    {data.daily.map((d) => {
                      const height = Math.max(3, Math.round((d.pageViews / maxViews) * 100));
                      return (
                        <div
                          key={d.day}
                          className="group relative flex h-full flex-1 flex-col justify-end"
                        >
                          <div
                            className="w-full rounded-t bg-secondary/70 transition-colors group-hover:bg-secondary"
                            style={{ height: `${height}%` }}
                          />
                          <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-text px-1.5 py-0.5 font-mono text-[10px] text-background group-hover:block">
                            {d.pageViews}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-text/40">
                    <span>{data.daily[0]?.day}</span>
                    <span>{data.daily[data.daily.length - 1]?.day}</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <RankedList
                    title={c.topPages}
                    rows={data.topPages.map((r) => ({ label: prettyPath(r.label), count: r.count }))}
                    empty={c.noData}
                  />
                  <RankedList title={c.topButtons} rows={data.topButtons} empty={c.noData} />
                </div>

                <p className="mt-6 text-xs text-text/45">
                  {c.allTime}: {data.totals.pageViews.toLocaleString("en-US")} {c.viewsShort} ·{" "}
                  {data.totals.uniqueVisitorsAllTime.toLocaleString("en-US")} {c.visitors} ·{" "}
                  {data.totals.sessions.toLocaleString("en-US")} {c.sessions}
                </p>
              </>
            ) : (
              <p className="mt-8 text-sm text-text/55">{c.noData}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function RankedList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: Array<{ label: string; count: number }>;
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-2xl border border-text/12 bg-background p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text/50">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-text/50">{empty}</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-text/80">{r.label}</span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-text/50">
                  {r.count}
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-text/8">
                <div
                  className="h-full rounded-full bg-secondary/60"
                  style={{ width: `${Math.max(4, (r.count / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
