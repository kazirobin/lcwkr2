"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import { summarizeDialogueMarks } from "@/features/hw/dialogue-store";
import { Button, Card, Field } from "@/components/ui";

interface ExamRow {
  level: number;
  lesson: number;
  best: number;
  latest: number;
  attempts: number;
  totalMarks: number;
}

interface SubRow {
  _id: string;
  level: number;
  lesson: number;
  audioUrl: string;
  mark: number | null;
  feedback: string;
  status: string;
}

interface HandwritingRow {
  _id: string;
  level: number;
  lesson: number;
  images: { url: string; publicId?: string }[];
  mark: number | null;
  feedback: string;
  status: string;
}

export default function AccountPage() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const router = useRouter();
  const { student, checking, logout, changePassword, refresh } = useAccount();

  const [exams, setExams] = useState<ExamRow[]>([]);
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [handwriting, setHandwriting] = useState<HandwritingRow[]>([]);
  const [dialogueTotal, setDialogueTotal] = useState(0);

  const [cur, setCur] = useState("");
  const [nw, setNw] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNw, setShowNw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  // Load my HW data once logged in (event-free initial load via key change).
  const phone = student?.whatsapp ?? null;
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  if (phone && loadedFor !== phone) {
    setLoadedFor(phone);
    queueMicrotask(() => {
      fetch(`/api/hw/exam-results?phone=${encodeURIComponent(phone)}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setExams(d.results ?? []);
        })
        .catch(() => {});
      fetch(`/api/hw/dialogues?phone=${encodeURIComponent(phone)}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setSubs(d.submissions ?? []);
        })
        .catch(() => {});
      fetch(`/api/hw/handwriting?phone=${encodeURIComponent(phone)}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setHandwriting(d.submissions ?? []);
        })
        .catch(() => {});
      fetch(`/api/hw/marks?phone=${encodeURIComponent(phone)}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setDialogueTotal(summarizeDialogueMarks(d.marks ?? []).total);
        })
        .catch(() => {});
    });
  }

  useEffect(() => {
    if (!checking && !student) router.replace("/login");
  }, [checking, student, router]);

  if (checking || !student) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-text/50">
        {t("লোড হচ্ছে...", "Loading...")}
      </div>
    );
  }

  const examBest = exams.reduce((n, r) => n + r.best, 0);
  const examMax = exams.reduce((n, r) => n + r.totalMarks, 0);
  const grand = examBest + dialogueTotal;
  const initial = (student.nameEnglish.trim()[0] ?? "•").toUpperCase();

  const submitPw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwBusy) return;
    setPwBusy(true);
    setPwMsg(null);
    const res = await changePassword(cur, nw);
    setPwBusy(false);
    if (res.ok) {
      setCur("");
      setNw("");
      setPwMsg({ ok: true, text: t("পাসওয়ার্ড বদলে গেছে।", "Password changed.") });
    } else {
      setPwMsg({ ok: false, text: res.error });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-6">
      {/* ── profile ── */}
      <Card className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold text-background">
          {initial}
        </span>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h1 className="flex flex-wrap items-center justify-center gap-2 text-xl font-bold text-text sm:justify-start">
            <span className="truncate">{student.nameEnglish}</span>
            {student.isPro && (
              <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-bold text-amber-500">
                ⭐ Pro
              </span>
            )}
          </h1>
          <p className="mt-1 font-mono text-xs text-text/55">
            {t("রোল", "Roll")} #{student.rollNumber} · {student.whatsapp}
          </p>
          <p className="text-xs text-text/55">{student.location}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button variant="ghost" size="sm" onClick={() => void refresh()}>
              {t("রিফ্রেশ", "Refresh")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              {t("লগআউট", "Logout")}
            </Button>
          </div>
        </div>
        <div className="grid shrink-0 grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-text/10 bg-background px-3 py-2">
            <p className="font-mono text-lg font-bold tabular-nums text-text">{examBest}</p>
            <p className="text-[10px] text-text/50">
              {t("পরীক্ষা", "Exams")}/{examMax}
            </p>
          </div>
          <div className="rounded-xl border border-text/10 bg-background px-3 py-2">
            <p className="font-mono text-lg font-bold tabular-nums text-text">{dialogueTotal}</p>
            <p className="text-[10px] text-text/50">{t("সংলাপ", "Dialogue")}</p>
          </div>
          <div className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2">
            <p className="font-mono text-lg font-bold tabular-nums text-primary">{grand}</p>
            <p className="text-[10px] text-text/50">{t("মোট", "Total")}</p>
          </div>
        </div>
      </Card>

      {/* ── exam results ── */}
      <Card className="p-6">
        <h2 className="text-sm font-bold text-text">
          📝 {t("আমার পরীক্ষার ফল", "My exam results")}
        </h2>
        {exams.length === 0 ? (
          <p className="mt-2 text-xs text-text/50">
            {t("এখনো পরীক্ষা দাওনি — HW page থেকে শুরু করো।", "No exams yet — start from a HW page.")}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-text/10">
            {exams.map((r) => (
              <li key={`${r.level}-${r.lesson}`} className="flex items-center justify-between py-2 text-sm">
                <span className="text-text">
                  HSK {r.level} · {t("লেসন", "Lesson")} {r.lesson}
                  <span className="ml-2 text-[11px] text-text/45">×{r.attempts}</span>
                </span>
                <span className="font-mono font-bold tabular-nums text-text">
                  {t("সেরা", "Best")} {r.best}/{r.totalMarks}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* ── recordings ── */}
      <Card className="p-6">
        <h2 className="text-sm font-bold text-text">
          🎙️ {t("আমার রেকর্ডিং", "My recordings")}
        </h2>
        {subs.length === 0 ? (
          <p className="mt-2 text-xs text-text/50">
            {t("এখনো কিছু পাঠাওনি।", "Nothing submitted yet.")}
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {subs.map((s) => (
              <div key={s._id} className="rounded-xl border border-text/10 bg-background p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text">
                    HSK {s.level} · {t("লেসন", "Lesson")} {s.lesson}
                  </span>
                  {s.status === "Marked" && s.mark !== null ? (
                    <span className="font-mono font-bold text-ok">{s.mark}/10</span>
                  ) : (
                    <span className="font-mono text-warn">{t("অপেক্ষমাণ", "Pending")}</span>
                  )}
                </div>
                <audio controls src={s.audioUrl} className="h-8 w-full" />
                {s.feedback && <p className="text-[11px] text-text/70">💬 {s.feedback}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── handwriting photos ── */}
      <Card className="p-6">
        <h2 className="text-sm font-bold text-text">
          ✍️ {t("আমার হাতে লেখার কাজ", "My handwriting work")}
        </h2>
        {handwriting.length === 0 ? (
          <p className="mt-2 text-xs text-text/50">
            {t("এখনো কোনো ছবি পাঠাওনি — HW পেজ থেকে পাঠাতে পারো।", "No photos yet — send one from any HW lesson page.")}
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {handwriting.map((h) => (
              <div key={h._id} className="rounded-xl border border-text/10 bg-background p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text">
                    HSK {h.level} · {t("লেসন", "Lesson")} {h.lesson}
                    <span className="ml-1.5 font-mono text-text/45">
                      ({h.images.length} {t("ছবি", "photos")})
                    </span>
                  </span>
                  {h.status === "Marked" && h.mark !== null ? (
                    <span className="font-mono font-bold text-ok">{h.mark}/10</span>
                  ) : (
                    <span className="font-mono text-warn">{t("অপেক্ষমাণ", "Pending")}</span>
                  )}
                </div>
                <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                  {h.images.map((img, i) => (
                    <li key={img.url}>
                      <a href={img.url} target="_blank" rel="noopener noreferrer" className="block">
                        {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary CDN, no next.config images setup */}
                        <img
                          src={img.url}
                          alt={`${t("পাঠানো হাতে-লেখার ছবি", "Submitted handwriting photo")} ${i + 1}`}
                          loading="lazy"
                          className="h-20 w-full rounded-lg border border-text/10 bg-card object-cover"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
                {h.feedback && <p className="text-[11px] text-text/70">💬 {h.feedback}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── change password ── */}
      <Card className="p-6">
        <h2 className="text-sm font-bold text-text">
          🔑 {t("পাসওয়ার্ড বদলান", "Change password")}
        </h2>
        <form onSubmit={submitPw} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label={t("বর্তমান পাসওয়ার্ড", "Current password")} required>
            <div className="relative">
              <input
                type={showCur ? "text" : "password"}
                value={cur}
                onChange={(e) => setCur(e.target.value)}
                className="w-full rounded-lg border border-text/15 bg-card px-3 py-2 pr-10 text-sm text-text outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
              />
              <button
                type="button"
                onClick={() => setShowCur((v) => !v)}
                aria-label={showCur ? t("লুকান", "Hide") : t("দেখান", "Show")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text/40 hover:text-text"
              >
                {showCur ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <Field label={t("নতুন পাসওয়ার্ড", "New password")} required>
            <div className="relative">
              <input
                type={showNw ? "text" : "password"}
                value={nw}
                onChange={(e) => setNw(e.target.value)}
                placeholder={t("কমপক্ষে ৪ অক্ষর", "At least 4 characters")}
                className="w-full rounded-lg border border-text/15 bg-card px-3 py-2 pr-10 text-sm text-text outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
              />
              <button
                type="button"
                onClick={() => setShowNw((v) => !v)}
                aria-label={showNw ? t("লুকান", "Hide") : t("দেখান", "Show")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text/40 hover:text-text"
              >
                {showNw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
        </form>
        {pwMsg && (
          <p
            className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium ${
              pwMsg.ok ? "bg-ok/10 text-ok" : "bg-red-500/10 text-red-400"
            }`}
          >
            {pwMsg.text}
          </p>
        )}
        <Button loading={pwBusy} onClick={submitPw} className="mt-3">
          {t("বদলান", "Change")}
        </Button>
        <p className="mt-4 text-center text-xs text-text/55">
          <Link href={`/academy/students/${student.rollNumber}`} className="font-semibold text-secondary hover:underline">
            {t("পাবলিক প্রোফাইল দেখুন", "View public profile")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
