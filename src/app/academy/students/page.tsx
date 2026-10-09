"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Copy,
  Lock,
  LockOpen,
  MapPin,
  MessageCircle,
  RefreshCw,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { ICourse } from "@/features/academy";
import { isSubAdminPasscode } from "@/features/academy/subAdminPasswords";
import { useLanguage } from "@/i18n";
import {
  Breadcrumb,
  Button,
  Card,
  Dialog,
  EmptyState,
  Eyebrow,
  Field,
  IconButton,
  InlineSelect,
  LoadingBlock,
  PageHeader,
  ProgressBar,
  SectionHanzi,
  StatusMark,
} from "@/components/ui";

type Tally = { held: number; attended: number; rate: number | null };

type Homework = {
  totalMarks: number;
  obtained: number;
  percent: number | null;
  examsGiven: number;
  examsTotal: number;
};

type DirectoryRow = {
  rollNumber: number;
  nameEnglish: string;
  avatarUrl?: string;
  isPro?: boolean;
  location?: string;
  courseIds: string[];
  attendance: Tally;
  homework: Homework;
  badges: { topAttendee: boolean; leastAttendee: boolean };
};

type SortKey = "roll" | "attendanceDesc" | "attendanceAsc" | "marksDesc" | "name";

const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

/** Only the digits, so `0`, `+880` and spaces never get in the way. */
const digitsOnly = (s: string) => (s || "").replace(/\D/g, "");
/** Local form — `8801673550666`, `+8801673550666` and `016735550666` all become `1673550666`. */
const coreDigits = (s: string) => digitsOnly(s).replace(/^(?:880|0)+/, "");

export default function ScholarsDirectoryPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [rows, setRows] = useState<DirectoryRow[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [phoneByRoll, setPhoneByRoll] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const [query, setQuery] = useState("");
  const [track, setTrack] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("roll");
  const [only, setOnly] = useState<"all" | "present" | "absent">("all");

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  /** Stops a failing contacts request from re-firing on every keystroke. */
  const contactsTriedRef = useRef(false);

  /** One way out of admin mode, so the number cache is always dropped with it. */
  const lockAdminMode = useCallback(() => {
    setAdminUnlocked(false);
    setPhoneByRoll({});
    setCopied(null);
    contactsTriedRef.current = false;
    try {
      sessionStorage.removeItem("academy_admin_unlocked");
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setAdminUnlocked(sessionStorage.getItem("academy_admin_unlocked") === "true");
      } catch {
        /* storage unavailable */
      }
    });
  }, []);

  // One request for the whole directory. The old page fetched students, courses
  // and every dialogue mark separately and recomputed attendance in the
  // browser, so the three numbers on a card could disagree with the profile
  // page — and all three had to load before the page was usable.
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dir, c] = await Promise.all([
        fetch("/api/academy/students/overview", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (dir.success && Array.isArray(dir.students)) setRows(dir.students);
      if (c.success && Array.isArray(c.courses)) setCourses(c.courses);
    } catch (err) {
      console.error("Failed to load directory:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Phone numbers are a second, opt-in request. They are used to match a
  // search by number, and only rendered while admin mode is on — so "hidden"
  // still means absent from the card, not covered up in it.
  const fetchContacts = useCallback(async () => {
    setLoadingContacts(true);
    try {
      const res = await fetch(
        `/api/academy/students?status=Approved&include=contact&passcode=${encodeURIComponent(ADMIN_SECRET_PIN)}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.students)) {
        const map: Record<string, string> = {};
        for (const s of data.students) map[String(s.rollNumber)] = s.whatsapp;
        setPhoneByRoll(map);
      }
    } catch {
      /* ignore */
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
  }, [fetchData]);

  useEffect(() => {
    if (!adminUnlocked) return;
    queueMicrotask(() => {
      void fetchContacts();
    });
  }, [adminUnlocked, fetchContacts]);

  // A number search should still work with admin mode off. The numbers are
  // pulled in the first time the query contains digits, then used only to
  // match — rendering them stays behind admin mode. Without this the mobile
  // would silently drop out of every search unless the mode was unlocked.
  useEffect(() => {
    if (adminUnlocked) return;
    if (digitsOnly(query).length < 3) return;
    if (contactsTriedRef.current) return;
    contactsTriedRef.current = true;
    queueMicrotask(() => {
      void fetchContacts();
    });
  }, [query, adminUnlocked, fetchContacts]);

  const listed = useMemo(() => {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return rows
      .filter((r) => {
        // Every typed word has to find a home somewhere — name, roll,
        // location or, when admin mode has loaded the numbers, the mobile.
        const anyMatches = (tok: string) => {
          const name = (r.nameEnglish || "").toLowerCase();
          const location = (r.location || "").toLowerCase();
          const phone = phoneByRoll[String(r.rollNumber)];
          const tokDigits = digitsOnly(tok);
          const tokCore = coreDigits(tok);
          return (
            name.includes(tok) ||
            String(r.rollNumber).includes(tok) ||
            location.includes(tok) ||
            (tokDigits.length > 0 && digitsOnly(phone).includes(tokDigits)) ||
            (tokCore.length > 0 && coreDigits(phone).includes(tokCore))
          );
        };
        const matchesQ = tokens.length === 0 || tokens.every(anyMatches);
        const matchesTrack =
          track === "all" ||
          r.courseIds.some((id) => id.toLowerCase() === track.toLowerCase());
        const matchesOnly =
          only === "all" ||
          (only === "present" && r.badges.topAttendee) ||
          (only === "absent" && r.badges.leastAttendee);
        return matchesQ && matchesTrack && matchesOnly;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "attendanceDesc":
            return (b.attendance.rate ?? -1) - (a.attendance.rate ?? -1);
          case "attendanceAsc":
            return (a.attendance.rate ?? 101) - (b.attendance.rate ?? 101);
          case "marksDesc":
            return b.homework.obtained - a.homework.obtained;
          case "name":
            return (a.nameEnglish || "").localeCompare(b.nameEnglish || "");
          default:
            return a.rollNumber - b.rollNumber;
        }
      });
  }, [rows, query, track, only, sortBy, phoneByRoll]);

  const filtersActive = query !== "" || track !== "all" || sortBy !== "roll" || only !== "all";

  const rateTone = (rate: number | null) =>
    rate === null ? "neutral" : rate >= 75 ? "done" : "pending";

  const submitPin = (e: React.FormEvent) => {
    e.preventDefault();
    const v = pin.trim();
    if (v === ADMIN_SECRET_PIN.trim() || isSubAdminPasscode(v)) {
      setAdminUnlocked(true);
      try {
        sessionStorage.setItem("academy_admin_unlocked", "true");
      } catch {
        /* ignore */
      }
      setPinOpen(false);
    } else {
      setPinError(t("ভুল পাসকোড।", "Incorrect passcode."));
    }
  };

  const copyNumber = async (num: string) => {
    try {
      await navigator.clipboard.writeText(num || "");
      setCopied(num);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  /** Digits only, in international form, for wa.me. */
  const waHref = (num: string) => {
    const digits = (num || "").replace(/\D/g, "");
    const intl = digits.startsWith("880") ? digits : `88${digits.replace(/^0+/, "")}`;
    return `https://wa.me/${intl}?text=${encodeURIComponent("Hi")}`;
  };

  const topCount = rows.filter((r) => r.badges.topAttendee).length;
  const lowCount = rows.filter((r) => r.badges.leastAttendee).length;

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="生" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("শিক্ষার্থী", "Scholars") },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={<Eyebrow seal="生" label={t("শিক্ষার্থী তালিকা", "Scholars")} detail={`${rows.length}`} />}
        title={t("যাঁরা একসাথে শিখছেন", "The people learning together")}
        lede={t(
          "চলমান ব্যাচের শিক্ষার্থী, তাঁদের উপস্থিতি আর কতটুকু কাজ হয়েছে।",
          "Everyone in the running cohorts, how their attendance is going, and how much they have actually completed.",
        )}
        actions={
          <div className="flex items-center gap-2">
            {adminUnlocked ? (
              <Button variant="ghost" size="sm" onClick={lockAdminMode} iconLeft={<LockOpen className="h-3.5 w-3.5" />}>
                {t("অ্যাডমিন মোড বন্ধ", "Leave admin mode")}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPin(""); setPinError(""); setPinOpen(true); }}
                iconLeft={<Lock className="h-3.5 w-3.5" />}
              >
                {t("অ্যাডমিন মোড", "Admin mode")}
              </Button>
            )}
            <IconButton
              label={t("তালিকা রিফ্রেশ করুন", "Refresh list")}
              size="sm"
              spinning={loading || loadingContacts}
              onClick={fetchData}
            >
              <RefreshCw className="h-4 w-4" />
            </IconButton>
          </div>
        }
      />

      {/* Attendance highlights */}
      {!loading && rows.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setOnly(only === "present" ? "all" : "present")}
            aria-pressed={only === "present"}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
              only === "present"
                ? "border-ok/50 bg-ok/10"
                : "border-ok/25 bg-ok/5 hover:border-ok/50"
            }`}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ok/15 text-ok">
              <TrendingUp className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-text">
                {t("সবচেয়ে বেশি উপস্থিত", "Most present")}
              </span>
              <span className="block text-[11px] text-text/55">
                {t(`${topCount} জন শিক্ষার্থী`, `${topCount} scholars`)}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOnly(only === "absent" ? "all" : "absent")}
            aria-pressed={only === "absent"}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
              only === "absent"
                ? "border-danger/50 bg-danger/10"
                : "border-danger/25 bg-danger/5 hover:border-danger/50"
            }`}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-danger/15 text-danger">
              <TrendingDown className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-text">
                {t("সবচেয়ে বেশি অনুপস্থিত", "Least present")}
              </span>
              <span className="block text-[11px] text-text/55">
                {t(`${lowCount} জন শিক্ষার্থী`, `${lowCount} scholars`)}
              </span>
            </span>
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-text/12 bg-card px-4 py-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-text">
                {t("গড় উপস্থিতি", "Average attendance")}
              </span>
              <span className="block text-[11px] tabular-nums text-text/55">
                {(() => {
                  const withRate = rows.filter((r) => r.attendance.rate !== null);
                  if (!withRate.length) return t("এখনো ক্লাস হয়নি", "No classes yet");
                  const avg = Math.round(
                    withRate.reduce((sum, r) => sum + (r.attendance.rate ?? 0), 0) / withRate.length,
                  );
                  return t(
                    `${avg}% · ${withRate.length} জনের তথ্য`,
                    `${avg}% across ${withRate.length} scholars`,
                  );
                })()}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <label htmlFor="dir-search" className="sr-only">
            {t("নাম, রোল, অবস্থান বা মোবাইল খুঁজুন", "Search by name, roll, location, or mobile")}
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40" aria-hidden="true" />
          <input
            id="dir-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("নাম, রোল, অবস্থান বা মোবাইল…", "Name, roll, location, or mobile…")}
            className="w-full rounded-xl border border-text/15 bg-card py-2.5 pl-9 pr-9 text-sm text-text placeholder:text-text/40 focus:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("সার্চ মুছুন", "Clear search")}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-text/40 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <InlineSelect label={t("কোর্স", "Course")} value={track} onChange={(e) => setTrack(e.target.value)}>
          <option value="all">{t("সব কোর্স", "All courses")}</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseId}
            </option>
          ))}
        </InlineSelect>
        <InlineSelect
          label={t("সাজান", "Sort")}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
        >
          <option value="roll">{t("রোল অনুযায়ী", "By roll")}</option>
          <option value="name">{t("নাম অনুযায়ী", "By name")}</option>
          <option value="attendanceDesc">{t("সবচেয়ে বেশি উপস্থিত", "Most present first")}</option>
          <option value="attendanceAsc">{t("সবচেয়ে কম উপস্থিত", "Least present first")}</option>
          <option value="marksDesc">{t("সবচেয়ে বেশি নম্বর", "Most marks first")}</option>
        </InlineSelect>
      </div>

      <div className="mt-4 flex items-center justify-between px-1 text-xs text-text/50" aria-live="polite">
        <span className="tabular-nums">
          {t(
            `${rows.length} জনের মধ্যে ${listed.length} জন`,
            `Showing ${listed.length} of ${rows.length}`,
          )}
        </span>
        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTrack("all");
              setSortBy("roll");
              setOnly("all");
            }}
            className="font-medium text-text underline decoration-text/25 underline-offset-2 hover:decoration-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
          >
            {t("ফিল্টার বাদ দিন", "Clear filters")}
          </button>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingBlock label={t("তালিকা লোড হচ্ছে", "Loading directory")} rows={3} />
        ) : listed.length === 0 ? (
          <EmptyState
            title={t("কোনো শিক্ষার্থী পাওয়া যায়নি", "No scholars found")}
            description={t("অন্য নাম দিয়ে খুঁজুন বা ফিল্টার বাদ দিন।", "Try a different name, or clear the filters.")}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listed.map((r) => {
              const phone = phoneByRoll[String(r.rollNumber)];
              return (
                <li key={r.rollNumber}>
                  <Card interactive className="flex h-full flex-col p-5">
                    <div className="flex items-center gap-3">
                      <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-text/10 bg-text/5">
                        <Image
                          src={
                            r.avatarUrl ||
                            `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(r.nameEnglish || "student")}`
                          }
                          alt=""
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </span>
                      <div className="min-w-0">
                        <h3 className="flex items-center gap-1.5 truncate text-sm font-bold text-text">
                          <span className="truncate">{r.nameEnglish}</span>
                          {r.isPro && (
                            <span className="inline-flex shrink-0 items-center rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
                              ⭐ Pro
                            </span>
                          )}
                        </h3>
                        <p className="text-xs tabular-nums text-text/45">
                          {t("রোল", "Roll")} #{r.rollNumber}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 flex items-center gap-1.5 text-xs text-text/55">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-text/35" aria-hidden="true" />
                      <span className="truncate">{r.location || t("অবস্থান নেই", "Location not set")}</span>
                    </p>

                    {/* Attendance — the headline number, with the sessions behind it. */}
                    <div className="mt-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text/45">
                          {t("উপস্থিতি", "Attendance")}
                        </span>
                        <span className="font-mono text-lg font-bold tabular-nums text-text">
                          {r.attendance.rate === null
                            ? "—"
                            : `${r.attendance.rate}%`}
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <ProgressBar
                          value={r.attendance.rate ?? 0}
                          max={100}
                          label={t("উপস্থিতি", "Attendance")}
                        />
                      </div>
                      <p className="mt-1 text-[11px] tabular-nums text-text/45">
                        {r.attendance.held > 0
                          ? t(
                              `${r.attendance.attended}/${r.attendance.held} ক্লাসে`,
                              `${r.attendance.attended} of ${r.attendance.held} classes`,
                            )
                          : t("এখনো ক্লাস হয়নি", "No classes held yet")}
                      </p>
                    </div>

                    {/* Homework totals, in place of the old single dialogue mark. */}
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-text/10 bg-text/3 px-3.5 py-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text/45">
                        {t("হোমওয়ার্ক", "Homework")}
                      </span>
                      <span className="flex items-center gap-2">
                        {r.homework.totalMarks > 0 && (
                          <span className="font-mono text-[11px] tabular-nums text-text/45">
                            {r.homework.obtained} / {r.homework.totalMarks}
                          </span>
                        )}
                        <StatusMark tone={rateTone(r.homework.percent)}>
                          <span className="tabular-nums">
                            {r.homework.percent === null
                              ? t("এখনো নেই", "—")
                              : `${r.homework.percent}%`}
                          </span>
                        </StatusMark>
                      </span>
                    </div>

                    {(r.badges.topAttendee || r.badges.leastAttendee) && (
                      <p
                        className={`mt-2.5 text-[11px] font-bold ${
                          r.badges.topAttendee ? "text-ok" : "text-danger"
                        }`}
                      >
                        {r.badges.topAttendee
                          ? t("সর্বোচ্চ উপস্থিতি", "Highest attendance")
                          : t("সর্বনিম্ন উপস্থিতি", "Lowest attendance")}
                      </p>
                    )}

                    {/* Contact details exist only while admin mode is on. */}
                    {adminUnlocked && phone && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-text/10 bg-text/[0.03] px-3.5 py-2.5">
                        <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-text">
                          {phone}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyNumber(phone)}
                          aria-label={t("নম্বর কপি করুন", "Copy number")}
                          title={t("কপি করুন", "Copy")}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-text/15 text-text/50 transition-colors hover:border-text/30 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                        >
                          {copied === phone ? (
                            <Check className="h-3.5 w-3.5 text-ok" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <a
                          href={waHref(phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ok px-2.5 py-1.5 text-[11px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                        >
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          {t("হোয়াটসঅ্যাপ", "WhatsApp")}
                        </a>
                      </div>
                    )}

                    <Link
                      href={`/academy/students/${r.rollNumber}`}
                      className="mt-auto inline-flex items-center gap-1 border-t border-text/10 pt-3 text-sm font-semibold text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                    >
                      {t("প্রোফাইল", "Profile")}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* PIN dialog */}
      <Dialog
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        title={t("অ্যাডমিন মোড", "Admin mode")}
        description={t(
          "ফোন নম্বর দেখতে পাসকোড দিন। সাধারণ দর্শকেরা নম্বর ও হোয়াটসঅ্যাপ লিংক কোনোভাবেই পাবে না।",
          "Enter the passcode to see phone numbers. Visitors never receive a number or a WhatsApp link.",
        )}
        size="sm"
      >
        <form onSubmit={submitPin} className="space-y-4">
          <Field
            type="password"
            label={t("পাসকোড", "Passcode")}
            autoFocus
            value={pin}
            error={pinError}
            onChange={(e) => { setPin(e.target.value); setPinError(""); }}
            className="text-center tracking-widest"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setPinOpen(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button type="submit" size="sm">{t("আনলক", "Unlock")}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
