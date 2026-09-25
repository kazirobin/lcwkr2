"use client";

import { useCallback, useMemo, useState } from "react";
import { useLanguage } from "@/i18n";
import { AdminShell } from "@/features/academy";
import { Button, SelectField, TextArea, useToast } from "@/components/ui";
import SpeakerButton from "@/components/ui/SpeakerButton";
import {
  EXAM_LEVELS,
  LEVEL_TITLES,
  getExamLessonNumbers,
} from "@/features/hw/data/exam";
import { lesson1Dialogue } from "@/features/hw/data/hsk1/lesson1-dialogue";
import {
  clearCustomDialogue,
  listCustomDialogues,
  loadRawDialogue,
  maskPhone,
  parseDialogueScript,
  saveCustomDialogue,
  stringifyDialogue,
} from "@/features/hw/dialogue-store";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

interface Submission {
  _id: string;
  name: string;
  whatsapp: string;
  level: number;
  lesson: number;
  audioUrl: string;
  durationSec: number;
  mark: number | null;
  feedback: string;
  status: string;
  createdAt: string;
  rollNumber: number | null;
}

interface HandwritingSubmission {
  _id: string;
  name: string;
  whatsapp: string;
  level: number;
  lesson: number;
  images: { url: string; publicId?: string }[];
  mark: number | null;
  feedback: string;
  status: string;
  createdAt: string;
  rollNumber: number | null;
}

export default function AdminHwPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const toast = useToast();

  const [level, setLevel] = useState<number>(1);
  const [lesson, setLesson] = useState<number>(1);
  const [raw, setRaw] = useState<string>(
    () => loadRawDialogue(1, 1) ?? stringifyDialogue(lesson1Dialogue),
  );
  const [customKeys, setCustomKeys] = useState<string[]>(() => listCustomDialogues());
  const [tab, setTab] = useState<"scripts" | "subs" | "handwriting" | "marks">("scripts");
  const [subs, setSubs] = useState<Submission[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState<string | null>(null);
  const [marks, setMarks] = useState<Record<string, { mark: string; feedback: string }>>({});
  const [delConfirm, setDelConfirm] = useState<string | null>(null);
  /* ── handwriting photos (DB): admin looks at the photo + marks 0–10 ── */
  const [hwSubs, setHwSubs] = useState<HandwritingSubmission[]>([]);
  const [hwLoading, setHwLoading] = useState(false);
  const [hwError, setHwError] = useState<string | null>(null);
  const [hwMarks, setHwMarks] = useState<Record<string, { mark: string; feedback: string }>>({});
  const [hwDelConfirm, setHwDelConfirm] = useState<string | null>(null);
  /* ── manual marks (any approved student, no recording needed) ── */
  const [markStudent, setMarkStudent] = useState("");
  const [markLevel, setMarkLevel] = useState(1);
  const [markLesson, setMarkLesson] = useState(0);
  const [markValue, setMarkValue] = useState("");
  const [markFeedback, setMarkFeedback] = useState("");
  const [markStudents, setMarkStudents] = useState<{ name: string; phone: string }[]>([]);
  const [history, setHistory] = useState<
    { _id: string; name: string; whatsapp: string; level: number; lesson: number; mark: number; source: string; createdAt: string }[]
  >([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const availableLessons = useMemo(() => getExamLessonNumbers(level), [level]);

  const loadTarget = (lvl: number, les: number) => {
    const saved = loadRawDialogue(lvl, les);
    setRaw(saved ?? (lvl === 1 && les === 1 ? stringifyDialogue(lesson1Dialogue) : ""));
    setCustomKeys(listCustomDialogues());
  };

  const handleLevelChange = (lvl: number) => {
    const first = getExamLessonNumbers(lvl)[0] ?? 1;
    setLevel(lvl);
    setLesson(first);
    loadTarget(lvl, first);
  };

  const handleLessonChange = (n: number) => {
    setLesson(n);
    loadTarget(level, n);
  };

  const preview = useMemo(() => parseDialogueScript(raw), [raw]);
  const hasBuiltIn = level === 1 && lesson === 1;
  const isCustom = customKeys.includes(`${level}-${lesson}`);

  const handleSave = () => {
    if (preview.length === 0) {
      toast(t("কমপক্ষে একটি লাইন লিখুন।", "Write at least one line."), "error");
      return;
    }
    saveCustomDialogue(level, lesson, raw);
    setCustomKeys(listCustomDialogues());
    toast(
      t(
        `HSK ${level} লেসন ${lesson}-এর ডায়লগ সেভ হয়েছে — ওই লেসন পেজে এখনই শোনা যাবে।`,
        `Dialogue for HSK ${level} lesson ${lesson} saved — playable on that lesson page now.`
      ),
      "success"
    );
  };

  const handleReset = () => {
    clearCustomDialogue(level, lesson);
    setRaw(hasBuiltIn ? stringifyDialogue(lesson1Dialogue) : "");
    setCustomKeys(listCustomDialogues());
    toast(t("ডিফল্টে ফিরে গেছে।", "Reverted to default."), "success");
  };

  const jumpTo = (key: string) => {
    const [l, s] = key.split("-").map(Number);
    if (l && s) {
      setLevel(l);
      setLesson(s);
    }
  };

  /* ── submissions (DB): admin listens + marks 0–10 ── */
  const loadSubs = async () => {
    setSubsLoading(true);
    setSubsError(null);
    try {
      const res = await fetch("/api/hw/dialogues?all=1", {
        headers: { "x-admin-passcode": ADMIN_PASSCODE },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      setSubs(data.submissions ?? []);
    } catch (e) {
      setSubsError(e instanceof Error ? e.message : "Failed.");
    } finally {
      setSubsLoading(false);
    }
  };

  const openSubs = () => {
    setTab("subs");
    void loadSubs();
  };

  /* ── handwriting photos ── */
  const loadHwSubs = async () => {
    setHwLoading(true);
    setHwError(null);
    try {
      const res = await fetch("/api/hw/handwriting?all=1", {
        headers: { "x-admin-passcode": ADMIN_PASSCODE },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      setHwSubs(data.submissions ?? []);
    } catch (e) {
      setHwError(e instanceof Error ? e.message : "Failed.");
    } finally {
      setHwLoading(false);
    }
  };

  const openHandwriting = () => {
    setTab("handwriting");
    void loadHwSubs();
  };

  const saveHwMark = async (id: string) => {
    const m = hwMarks[id];
    try {
      const res = await fetch(`/api/hw/handwriting/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mark: m?.mark === "" || m?.mark === undefined ? undefined : Number(m.mark),
          feedback: m?.feedback ?? "",
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      setHwSubs((prev) => prev.map((s) => (s._id === id ? data.submission : s)));
      toast(t("Mark সেভ হয়েছে।", "Mark saved."), "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    }
  };

  const removeHwSub = async (id: string) => {
    if (hwDelConfirm !== id) {
      setHwDelConfirm(id);
      return;
    }
    try {
      const res = await fetch(`/api/hw/handwriting/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      setHwSubs((prev) => prev.filter((s) => s._id !== id));
      setHwDelConfirm(null);
      toast(
        t("Queue থেকে সরানো হয়েছে — user-এর কাছে mark সহ থাকবে।", "Removed from queue — stays with the user, with mark."),
        "success"
      );
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    }
  };

  /* ── manual marks ── */
  const openMarks = () => {
    setTab("marks");
    if (markStudents.length === 0) {
      fetch("/api/academy/students?status=Approved")
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.students)) {
            setMarkStudents(
              d.students
                .map((s: { nameEnglish?: string; whatsapp?: string }) => ({
                  name: String(s.nameEnglish ?? "").trim(),
                  phone: String(s.whatsapp ?? "").trim(),
                }))
                .filter((s: { name: string; phone: string }) => s.name && s.phone)
                .sort((a: { name: string }, b: { name: string }) =>
                  a.name.localeCompare(b.name),
                ),
            );
          }
        })
        .catch(() => {
          /* offline — ignore */
        });
    }
    setHistoryLoading(true);
    fetch("/api/hw/marks?history=1", {
      headers: { "x-admin-passcode": ADMIN_PASSCODE },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setHistory(d.history ?? []);
      })
      .catch(() => {
        /* ignore */
      })
      .finally(() => setHistoryLoading(false));
  };

  const saveManualMark = async () => {
    if (!markStudent) {
      toast(t("শিক্ষার্থী বেছে নিন।", "Choose a student."), "error");
      return;
    }
    try {
      const res = await fetch("/api/hw/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: markStudent,
          level: markLevel,
          lesson: markLesson,
          mark: Number(markValue),
          feedback: markFeedback,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      setHistory((prev) => [data.mark, ...prev]);
      setMarkValue("");
      setMarkFeedback("");
      toast(t("Mark সেভ হয়েছে — students page-এ দেখাবে।", "Mark saved — shows on the students page."), "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    }
  };

  const removeHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/hw/marks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      setHistory((prev) => prev.filter((h) => h._id !== id));
      toast(t("ডিলিট হয়েছে।", "Deleted."), "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    }
  };

  const saveMark = async (id: string) => {
    const m = marks[id];
    try {
      const res = await fetch(`/api/hw/dialogues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mark: m?.mark === "" || m?.mark === undefined ? undefined : Number(m.mark),
          feedback: m?.feedback ?? "",
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      setSubs((prev) => prev.map((s) => (s._id === id ? data.submission : s)));
      toast(t("Mark সেভ হয়েছে।", "Mark saved."), "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    }
  };

  const removeSub = async (id: string) => {
    if (delConfirm !== id) {
      setDelConfirm(id);
      return;
    }
    try {
      const res = await fetch(`/api/hw/dialogues/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      setSubs((prev) => prev.filter((s) => s._id !== id));
      setDelConfirm(null);
      toast(
        t("Queue থেকে সরানো হয়েছে — user-এর কাছে mark সহ থাকবে।", "Removed from queue — stays with the user, with mark."),
        "success"
      );
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed.", "error");
    }
  };

  return (
    <AdminShell
      title={t("হোমওয়ার্ক ডায়লগ", "Homework dialogues")}
      crumb={t("হোমওয়ার্ক", "Homework")}
      seal="作"
      lede={t(
        "যেকোনো লেসনের শোনা-বলা ডায়লগ এখানে প্যারাগ্রাফ আকারে লিখুন — প্রতি লাইনের আগে ： দিন। সেভ করলেই ওই লেসন পেজে play বাটনসহ দেখা যাবে (এই ডিভাইসে, অফলাইনেও)।",
        "Write any lesson's listening dialogue here as a paragraph — start every line with ：. Saving makes it playable on that lesson page (on this device, even offline)."
      )}
    >
      <div className="inline-flex rounded-xl border border-text/15 bg-card p-1 mb-4">
        <button
          type="button"
          onClick={() => setTab("scripts")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "scripts"
              ? "bg-secondary text-background font-bold shadow-sm"
              : "text-text/70 hover:bg-text/5"
          }`}
        >
          📝 {t("ডায়লগ স্ক্রিপ্ট", "Dialogue scripts")}
        </button>
        <button
          type="button"
          onClick={openSubs}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "subs"
              ? "bg-secondary text-background font-bold shadow-sm"
              : "text-text/70 hover:bg-text/5"
          }`}
        >
          🎙️ {t("পাঠানো রেকর্ডিং", "Submissions")}
          {subs.length > 0 && (
            <span className="ml-1.5 font-mono text-[11px] opacity-80">({subs.length})</span>
          )}
        </button>
        <button
          type="button"
          onClick={openHandwriting}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "handwriting"
              ? "bg-secondary text-background font-bold shadow-sm"
              : "text-text/70 hover:bg-text/5"
          }`}
        >
          ✍️ {t("হাতের লেখা", "Handwriting")}
          {hwSubs.length > 0 && (
            <span className="ml-1.5 font-mono text-[11px] opacity-80">({hwSubs.length})</span>
          )}
        </button>
        <button
          type="button"
          onClick={openMarks}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "marks"
              ? "bg-secondary text-background font-bold shadow-sm"
              : "text-text/70 hover:bg-text/5"
          }`}
        >
          ⭐ {t("মার্ক দিন", "Give marks")}
        </button>
      </div>

      {tab === "subs" ? (
        <div className="rounded-2xl border border-text/10 bg-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-text">
              🎧 {t("শুনে mark দিন (০–১০)", "Listen & mark (0–10)")}
            </h3>
            <button
              type="button"
              onClick={() => void loadSubs()}
              className="text-xs font-semibold text-secondary hover:underline"
            >
              🔄 {t("রিফ্রেশ", "Refresh")}
            </button>
          </div>
          {subsLoading ? (
            <p className="text-xs text-text/50">{t("লোড হচ্ছে...", "Loading...")}</p>
          ) : subsError ? (
            <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-xl p-3">
              {subsError}
            </p>
          ) : subs.length === 0 ? (
            <p className="text-xs text-text/40 border border-dashed border-text/20 rounded-xl p-6 text-center">
              {t("এখনো কেউ পাঠায়নি।", "No submissions yet.")}
            </p>
          ) : (
            <div className="space-y-3">
              {subs.map((s) => {
                const m = marks[s._id] ?? { mark: s.mark !== null ? String(s.mark) : "", feedback: s.feedback ?? "" };
                return (
                  <div key={s._id} className="rounded-xl border border-text/10 bg-background p-3.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-text">
                        {s.name}{" "}
                        <span className="font-mono font-normal text-text/50" title={t("মাস্ক করা নম্বর", "Masked number")}>
                          {maskPhone(s.whatsapp)}
                        </span>
                        {s.rollNumber !== null && s.rollNumber !== undefined && (
                          <a
                            href={`/academy/students/${s.rollNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={t("প্রোফাইল + সব HW দেখুন", "View profile + all HW")}
                            className="ml-2 font-mono font-bold text-secondary hover:underline"
                          >
                            👤 #{s.rollNumber}
                          </a>
                        )}
                      </span>
                      <span className="font-mono text-text/60">
                        HSK {s.level} · {t("লেসন", "Lesson")} {s.lesson} ·{" "}
                        {new Date(s.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <audio controls src={s.audioUrl} className="h-9 w-full" />
                    <div className="grid grid-cols-[88px_1fr] gap-2">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={m.mark}
                        onChange={(e) =>
                          setMarks((p) => ({ ...p, [s._id]: { ...m, mark: e.target.value } }))
                        }
                        placeholder="0–10"
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-sm font-mono text-text focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        value={m.feedback}
                        onChange={(e) =>
                          setMarks((p) => ({ ...p, [s._id]: { ...m, feedback: e.target.value } }))
                        }
                        placeholder={t("মন্তব্য (optional)", "Feedback (optional)")}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-sm text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {s.status === "Marked" && (
                        <span className="text-[11px] font-mono font-bold text-ok">
                          ✓ {s.mark}/10
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => void saveMark(s._id)}
                        className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition"
                      >
                        {t("Mark সেভ", "Save mark")}
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeSub(s._id)}
                        title={t(
                          "শুধু admin queue থেকে সরবে — mark/comment সহ রেকর্ডিং user-এর কাছে থাকবে।",
                          "Removes from admin queue only — recording stays with the user, with mark & comment."
                        )}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          delConfirm === s._id
                            ? "bg-danger text-white"
                            : "border border-danger/40 text-danger hover:bg-danger/10"
                        }`}
                      >
                        {delConfirm === s._id
                          ? t("নিশ্চিত?", "Sure?")
                          : t("তালিকা থেকে সরান", "Remove from queue")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : tab === "handwriting" ? (
        <div className="rounded-2xl border border-text/10 bg-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-text">
              🖼️ {t("ছবি দেখে mark দিন (০–১০)", "Look at the photo & mark (0–10)")}
            </h3>
            <button
              type="button"
              onClick={() => void loadHwSubs()}
              className="text-xs font-semibold text-secondary hover:underline"
            >
              🔄 {t("রিফ্রেশ", "Refresh")}
            </button>
          </div>
          {hwLoading ? (
            <p className="text-xs text-text/50">{t("লোড হচ্ছে...", "Loading...")}</p>
          ) : hwError ? (
            <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-xl p-3">
              {hwError}
            </p>
          ) : hwSubs.length === 0 ? (
            <p className="text-xs text-text/40 border border-dashed border-text/20 rounded-xl p-6 text-center">
              {t("এখনো কেউ হাতে লেখার ছবি পাঠায়নি।", "No handwriting photos submitted yet.")}
            </p>
          ) : (
            <div className="space-y-3">
              {hwSubs.map((s) => {
                const m = hwMarks[s._id] ?? {
                  mark: s.mark !== null ? String(s.mark) : "",
                  feedback: s.feedback ?? "",
                };
                return (
                  <div key={s._id} className="rounded-xl border border-text/10 bg-background p-3.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-text">
                        {s.name}{" "}
                        <span className="font-mono font-normal text-text/50" title={t("মাস্ক করা নম্বর", "Masked number")}>
                          {maskPhone(s.whatsapp)}
                        </span>
                        {s.rollNumber !== null && s.rollNumber !== undefined && (
                          <a
                            href={`/academy/students/${s.rollNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={t("প্রোফাইল + সব HW দেখুন", "View profile + all HW")}
                            className="ml-2 font-mono font-bold text-secondary hover:underline"
                          >
                            👤 #{s.rollNumber}
                          </a>
                        )}
                      </span>
                      <span className="font-mono text-text/60">
                        HSK {s.level} · {t("লেসন", "Lesson")} {s.lesson} ·{" "}
                        {s.images.length} {t("ছবি", "photos")} ·{" "}
                        {new Date(s.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {s.images.map((img, i) => (
                        <li key={img.url}>
                          <a href={img.url} target="_blank" rel="noopener noreferrer" className="block">
                            {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary CDN, no next.config images setup */}
                            <img
                              src={img.url}
                              alt={`${t("শিক্ষার্থীর হাতে লেখার ছবি", "Student handwriting photo")} ${i + 1}`}
                              loading="lazy"
                              className="h-36 w-full rounded-xl border border-text/10 bg-card object-cover"
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="grid grid-cols-[88px_1fr] gap-2">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={m.mark}
                        onChange={(e) =>
                          setHwMarks((p) => ({ ...p, [s._id]: { ...m, mark: e.target.value } }))
                        }
                        placeholder="0–10"
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-sm font-mono text-text focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        value={m.feedback}
                        onChange={(e) =>
                          setHwMarks((p) => ({ ...p, [s._id]: { ...m, feedback: e.target.value } }))
                        }
                        placeholder={t("মন্তব্য (optional)", "Feedback (optional)")}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-sm text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {s.status === "Marked" && (
                        <span className="text-[11px] font-mono font-bold text-ok">
                          ✓ {s.mark}/10
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => void saveHwMark(s._id)}
                        className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition"
                      >
                        {t("Mark সেভ", "Save mark")}
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeHwSub(s._id)}
                        title={t(
                          "শুধু admin queue থেকে সরবে — mark/comment সহ ছবি user-এর কাছে থাকবে।",
                          "Removes from admin queue only — photo stays with the user, with mark & comment."
                        )}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          hwDelConfirm === s._id
                            ? "bg-danger text-white"
                            : "border border-danger/40 text-danger hover:bg-danger/10"
                        }`}
                      >
                        {hwDelConfirm === s._id
                          ? t("নিশ্চিত?", "Sure?")
                          : t("তালিকা থেকে সরান", "Remove from queue")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : tab === "marks" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* ── manual mark form ── */}
          <div className="rounded-2xl border border-text/10 bg-card p-4 sm:p-5 space-y-3">
            <h3 className="text-sm font-bold text-text">
              ⭐ {t("যেকোনো শিক্ষার্থীকে mark দিন", "Mark any student")}
            </h3>
            <p className="text-[11px] text-muted">
              {t(
                "Recording ছাড়াই mark দেওয়া যাবে — academy/students page-এ দেখাবে।",
                "No recording needed — shows on the academy/students page."
              )}
            </p>
            <SelectField
              label={t("শিক্ষার্থী", "Student")}
              value={markStudent}
              onChange={(e) => setMarkStudent(e.target.value)}
            >
              <option value="">{t("— বেছে নিন —", "— Choose —")}</option>
              {markStudents.map((s) => (
                <option key={s.phone} value={s.phone}>
                  {s.name} · {maskPhone(s.phone)}
                </option>
              ))}
            </SelectField>
            <div className="grid grid-cols-3 gap-2">
              <SelectField
                label={t("লেভেল", "Level")}
                value={markLevel}
                onChange={(e) => setMarkLevel(Number(e.target.value))}
              >
                {EXAM_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    HSK {lvl}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label={t("লেসন", "Lesson")}
                value={markLesson}
                onChange={(e) => setMarkLesson(Number(e.target.value))}
              >
                <option value={0}>{t("সামগ্রিক", "Overall")}</option>
                {getExamLessonNumbers(markLevel).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </SelectField>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-text">
                  {t("মার্ক (০–১০)", "Mark (0–10)")}
                </span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={markValue}
                  onChange={(e) => setMarkValue(e.target.value)}
                  placeholder="8"
                  className="rounded-xl border border-text/15 bg-card px-3.5 py-2.5 text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-text">
                {t("মন্তব্য (optional)", "Feedback (optional)")}
              </span>
              <input
                type="text"
                value={markFeedback}
                onChange={(e) => setMarkFeedback(e.target.value)}
                placeholder={t("খুব ভালো হয়েছে!", "Great job!")}
                className="rounded-xl border border-text/15 bg-card px-3.5 py-2.5 text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
              />
            </label>
            <Button onClick={saveManualMark}>{t("Mark সেভ করুন", "Save mark")}</Button>
          </div>

          {/* ── mark history ── */}
          <div className="rounded-2xl border border-text/10 bg-card p-4 sm:p-5 space-y-3">
            <h3 className="text-sm font-bold text-text">
              📋 {t("মার্ক হিস্ট্রি", "Mark history")} ({history.length})
            </h3>
            {historyLoading ? (
              <p className="text-xs text-text/50">{t("লোড হচ্ছে...", "Loading...")}</p>
            ) : history.length === 0 ? (
              <p className="text-xs text-text/40 border border-dashed border-text/20 rounded-xl p-6 text-center">
                {t("এখনো কোনো mark নেই।", "No marks yet.")}
              </p>
            ) : (
              <div className="space-y-2 max-h-[480px] overflow-y-auto">
                {history.map((h) => (
                  <div
                    key={h._id}
                    className="rounded-xl border border-text/10 bg-background p-3 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text truncate">
                        {h.name}{" "}
                        <span className="font-mono font-normal text-text/50">
                          {maskPhone(h.whatsapp)}
                        </span>
                      </p>
                      <p className="text-[11px] text-text/50 font-mono">
                        HSK {h.level} · {h.lesson === 0 ? t("সামগ্রিক", "Overall") : `${t("লেসন", "Lesson")} ${h.lesson}`} ·{" "}
                        {h.source === "manual" ? t("ম্যানুয়াল", "manual") : t("রেকর্ডিং", "recording")} ·{" "}
                        {new Date(h.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-ok">{h.mark}/10</span>
                      <button
                        type="button"
                        onClick={() => void removeHistory(h._id)}
                        aria-label={t("ডিলিট", "Delete")}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-danger/40 text-danger hover:bg-danger/10 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* ── editor ── */}
        <div className="rounded-2xl border border-text/10 bg-card p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label={t("লেভেল", "Level")}
              value={level}
              onChange={(e) => handleLevelChange(Number(e.target.value))}
            >
              {EXAM_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {LEVEL_TITLES[lvl]}
                </option>
              ))}
            </SelectField>
            <SelectField
              label={t("লেসন", "Lesson")}
              value={lesson}
              onChange={(e) => handleLessonChange(Number(e.target.value))}
            >
              {availableLessons.map((n) => (
                <option key={n} value={n}>
                  {t("লেসন", "Lesson")} {n}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span
              className={`px-2.5 py-1 rounded-full font-mono font-bold ${
                isCustom
                  ? "bg-ok/10 text-ok border border-ok/30"
                  : "bg-text/5 text-text/50 border border-text/10"
              }`}
            >
              {isCustom
                ? t("✎ কাস্টম সেভড", "✎ custom saved")
                : hasBuiltIn
                  ? t("★ বিল্ট-ইন", "★ built-in")
                  : t("○ খালি", "○ empty")}
            </span>
            <span className="text-text/40">
              {preview.length} {t("লাইন", "lines")}
            </span>
          </div>

          <TextArea
            label={t("ডায়লগ স্ক্রিপ্ট", "Dialogue script")}
            hint={t(
              "প্রতি লাইনের শুরুতে ： দিন। A/B স্পিকার নিজে নিজে বদলাবে। Pinyin/অর্থ লাগবে না — play hanzi দিয়েই চলবে।",
              "Start every line with ：. Speakers A/B alternate automatically. No pinyin/meaning needed — playback reads hanzi."
            )}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={12}
            placeholder={"：同学们好！\n：老师好！\n：你好！你也是新学生吗？"}
            className="font-chinese text-base leading-loose"
          />

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave}>
              {t("সেভ করুন", "Save")}
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              {t("ডিফল্টে ফেরত", "Revert")}
            </Button>
          </div>
        </div>

        {/* ── live preview ── */}
        <div className="rounded-2xl border border-text/10 bg-card p-4 sm:p-5 space-y-3">
          <h3 className="text-sm font-bold text-text">
            👀 {t("লাইভ প্রিভিউ (লেসন পেজে যেমন দেখাবে)", "Live preview (as on the lesson page)")}
          </h3>
          {preview.length === 0 ? (
            <p className="text-xs text-text/40 border border-dashed border-text/20 rounded-xl p-6 text-center">
              {t("বামে স্ক্রিপ্ট লিখলেই এখানে প্রিভিউ আসবে।", "Write the script on the left to preview it here.")}
            </p>
          ) : (
            <ol className="space-y-1.5">
              {preview.map((line, i) => {
                const right = line.speaker === "B";
                return (
                  <li
                    key={i}
                    className={`flex items-start gap-2 ${right ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        right ? "bg-primary/15 text-text/70" : "bg-text/10 text-text/65"
                      }`}
                    >
                      {line.speaker}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl border px-3 py-2 ${
                        right
                          ? "rounded-tr-sm border-primary/15 bg-primary/[0.07]"
                          : "rounded-tl-sm border-text/10 bg-background"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p lang="zh" className="font-chinese text-xl leading-relaxed text-text">
                          {line.hanzi}
                        </p>
                        <SpeakerButton text={line.hanzi} className="mt-1 size-6" />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {/* ── saved list ── */}
          <div className="border-t border-text/10 pt-3">
            <h4 className="text-xs font-bold text-text/60 mb-2">
              {t("সেভ করা ডায়লগ", "Saved dialogues")} ({customKeys.length})
            </h4>
            {customKeys.length === 0 ? (
              <p className="text-xs text-text/40">
                {t("এখনো কোনো কাস্টম ডায়লগ নেই।", "No custom dialogues yet.")}
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {customKeys.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => jumpTo(k)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono border border-ok/30 bg-ok/10 text-ok hover:bg-ok/20 transition"
                  >
                    HSK {k.replace("-", " · ")}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </AdminShell>
  );
}
