"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { speakChinese, stopSpeaking } from "@/lib/chinese-speech";
import type { HwDialogueLine } from "../data/hsk1/lesson1-dialogue";
import { loadCustomDialogue } from "../dialogue-store";
import SectionShell from "./SectionShell";

interface Props {
  level: number;
  lesson: number;
  /** Built-in script (lesson 1). Admin-saved script on this device wins. */
  builtin?: HwDialogueLine[];
  collapsible?: boolean;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";
const MAX_REC_SEC = 120;

interface Submission {
  _id: string;
  level: number;
  lesson: number;
  audioUrl: string;
  durationSec: number;
  mark: number | null;
  feedback: string;
  status: string;
  createdAt: string;
}

/**
 * Playable dialogue script — the whole conversation as one flowing
 * paragraph AND as chat bubbles, with per-line pronunciation (same
 * SpeakerButton/TTS as the vocabulary pages, works offline), pinyin
 * under every line, hideable meanings, plus play-all / stop.
 * Renders nothing when neither built-in nor admin script exists.
 */
export default function DialoguePlayer({ level, lesson, builtin, collapsible }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const { student: account } = useAccount();
  const [showMeaning, setShowMeaning] = useState(true);
  const [paraView, setParaView] = useState(false);
  // ── record & send (logged-in account only — no shared dropdown) ──
  const [recording, setRecording] = useState(false);
  const [starting, setStarting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [reviewUrl, setReviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sentOk, setSentOk] = useState(false);
  const [myList, setMyList] = useState<Submission[] | null>(null);
  const [subsOpen, setSubsOpen] = useState(false);
  const [busyExisting, setBusyExisting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  // Guards double-tap: getUserMedia is async, and a second recorder
  // feeding the same chunks array = longer, garbled audio.
  const startingRef = useRef(false);
  const pendingBlobRef = useRef<Blob | null>(null);
  const reviewUrlRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Synchronous localStorage read during render (pure, SSR-guarded) —
  // always fresh for the current lesson, no effect needed.
  const custom = loadCustomDialogue(level, lesson);
  // Built-in script from the server registry (everyday → textbook).
  // Cached by the SW api handler, so it works offline after one visit.
  const [remote, setRemote] = useState<HwDialogueLine[] | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      if (loadCustomDialogue(level, lesson)) {
        setRemote(null);
        return;
      }
      fetch(`/api/hw/dialogue?level=${level}&lesson=${lesson}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.lines) && d.lines.length > 0) {
            setRemote(d.lines);
          } else {
            setRemote(null);
          }
        })
        .catch(() => {
          /* offline — fall back to builtin prop */
          setRemote(null);
        });
    });
  }, [level, lesson]);

  useEffect(() => () => stopSpeaking(), []);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      recRef.current?.stream?.getTracks().forEach((tr) => tr.stop());
      if (reviewUrlRef.current) URL.revokeObjectURL(reviewUrlRef.current);
    },
    [],
  );

  const accountPhone = account?.whatsapp.trim() ?? "";

  const toggleMine = () => {
    if (subsOpen) {
      setSubsOpen(false);
      return;
    }
    setSubsOpen(true);
    if (accountPhone) void loadMine(accountPhone);
  };

  const discardReview = () => {
    if (reviewUrlRef.current) URL.revokeObjectURL(reviewUrlRef.current);
    reviewUrlRef.current = null;
    pendingBlobRef.current = null;
    setReviewUrl(null);
    setSendError(null);
  };

  const loadMine = async (phone: string) => {
    try {
      const res = await fetch(`/api/hw/dialogues?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data.success) setMyList(data.submissions ?? []);
    } catch {
      /* offline — ignore */
    }
  };

  // This lesson's submissions only — a lesson shows exactly what was
  // recorded in THAT lesson (one slot per lesson).
  const lessonSubs = (myList ?? []).filter((s) => s.level === level && s.lesson === lesson);
  const existing = lessonSubs[0] ?? null;

  const deleteExisting = async () => {
    if (!existing || busyExisting) return;
    setBusyExisting(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/hw/dialogues/${existing._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: accountPhone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      setMyList((prev) => (prev ?? []).filter((s) => s._id !== existing._id));
      setConfirmDel(false);
    } catch (e) {
      setSendError(e instanceof Error ? e.message : t("ডিলিট হয়নি।", "Delete failed."));
    } finally {
      setBusyExisting(false);
    }
  };

  // Load own submissions on mount so an existing recording for this
  // lesson replaces the recorder (one slot per lesson).
  useEffect(() => {
    queueMicrotask(() => {
      if (accountPhone) void loadMine(accountPhone);
    });
  }, [accountPhone]);

  const uploadAndSubmit = async (blob: Blob, secs: number) => {
    if (!account) return;
    setUploading(true);
    setSendError(null);
    setSentOk(false);
    try {
      const form = new FormData();
      // Unique filename per upload — otherwise Cloudinary reuses the same
      // public_id/URL and browsers play stale cached bytes ("wrong recording").
      form.append("file", blob, `dialogue-${level}-${lesson}-${Date.now()}.webm`);
      form.append("upload_preset", UPLOAD_PRESET);
      const up = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
        method: "POST",
        body: form,
      });
      const upJson = await up.json();
      if (!up.ok || !upJson.secure_url) {
        throw new Error(t("অডিও আপলোড হয়নি। আবার চেষ্টা করুন।", "Audio upload failed. Try again."));
      }
      const res = await fetch("/api/hw/dialogues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: account.nameEnglish,
          phone: accountPhone,
          level,
          lesson,
          audioUrl: upJson.secure_url,
          durationSec: Math.round(upJson.duration ?? secs),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error ?? t("পাঠানো যায়নি।", "Could not submit.")
        );
      }
      setSentOk(true);
      if (reviewUrlRef.current) URL.revokeObjectURL(reviewUrlRef.current);
      reviewUrlRef.current = null;
      pendingBlobRef.current = null;
      setReviewUrl(null);
      setSubsOpen(true);
      void loadMine(accountPhone);
    } catch (e) {
      setSendError(e instanceof Error ? e.message : t("পাঠানো যায়নি।", "Could not submit."));
    } finally {
      setUploading(false);
    }
  };

  const stopRecording = () => {
    if (recRef.current?.state === "recording") recRef.current.stop();
  };

  const sendFromReview = () => {
    const blob = pendingBlobRef.current;
    if (!blob) return;
    void uploadAndSubmit(blob, Math.max(1, elapsed));
  };

  const startRecording = async () => {
    if (startingRef.current || recording) return;
    setSendError(null);
    setSentOk(false);
    discardReview();
    if (!account) {
      setSendError(t("আগে লগইন করুন।", "Please login first."));
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setSendError(
        t(
          "আপনার ব্রাউজার রেকর্ডিং সাপোর্ট করে না। Chrome/Edge ব্যবহার করুন।",
          "Your browser does not support recording. Please use Chrome/Edge."
        )
      );
      return;
    }
    startingRef.current = true;
    setStarting(true);
    try {
      // Defensive: stop any lingering tracks/recorder before starting fresh.
      try {
        recRef.current?.stream?.getTracks().forEach((tr) => tr.stop());
      } catch {
        /* ignore */
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        // Snapshot + clear immediately so a late event can never
        // leak into the next recording.
        const chunks = chunksRef.current;
        chunksRef.current = [];
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        stream.getTracks().forEach((tr) => tr.stop());
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
        // Review first — upload only when the student presses Send.
        if (reviewUrlRef.current) URL.revokeObjectURL(reviewUrlRef.current);
        pendingBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        reviewUrlRef.current = url;
        setReviewUrl(url);
      };
      recorder.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
      stopTimerRef.current = setTimeout(stopRecording, MAX_REC_SEC * 1000);
    } catch {
      setSendError(
        t("মাইক্রোফোনের অনুমতি দিন, তারপর আবার চেষ্টা করুন।", "Please allow microphone access and try again.")
      );
    } finally {
      startingRef.current = false;
      setStarting(false);
    }
  };

  const lines = custom ?? remote ?? builtin ?? null;
  if (!lines || lines.length === 0) return null;

  const paragraph = lines.map((l) => l.hanzi).join(" ");

  const playAll = () => {
    stopSpeaking();
    for (const line of lines) speakChinese(line.hanzi);
  };

  const meaningOf = (line: HwDialogueLine) =>
    language === "bn" ? line.bn || line.en : line.en || line.bn;

  return (
    <SectionShell
      index="💬"
      title={t("ডায়লগ শুনুন ও বলুন", "Listen & say the dialogue")}
      marks={lines.length}
      marksLabel={t("লাইন", "lines")}
      collapsible={collapsible}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={playAll}
          className="px-4 py-2 rounded-xl font-semibold text-sm transition bg-primary text-primary-foreground hover:opacity-90"
        >
          ▶ {t("সবগুলো শুনুন", "Play all")}
        </button>
        <button
          type="button"
          onClick={stopSpeaking}
          className="px-4 py-2 rounded-xl font-semibold text-sm transition border border-border bg-card text-text hover:bg-text/5"
        >
          ⏹ {t("থামান", "Stop")}
        </button>
        <div className="inline-flex rounded-xl border border-text/15 bg-background/60 p-1">
          <button
            type="button"
            onClick={() => setParaView(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              !paraView ? "bg-secondary text-background font-bold" : "text-text/70 hover:bg-text/5"
            }`}
          >
            💬 {t("বাবল", "Bubbles")}
          </button>
          <button
            type="button"
            onClick={() => setParaView(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              paraView ? "bg-secondary text-background font-bold" : "text-text/70 hover:bg-text/5"
            }`}
          >
            📄 {t("প্যারাগ্রাফ", "Paragraph")}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowMeaning((v) => !v)}
          aria-pressed={!showMeaning}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
            showMeaning
              ? "border-text/15 text-text/55 hover:border-text/40 hover:text-text"
              : "border-primary/50 bg-primary/10 text-primary"
          }`}
        >
          {showMeaning ? (
            <Eye className="size-3.5" aria-hidden="true" />
          ) : (
            <EyeOff className="size-3.5" aria-hidden="true" />
          )}
          {showMeaning ? t("অর্থ লুকান", "Hide meaning") : t("অর্থ দেখান", "Show meaning")}
        </button>
      </div>

      {paraView ? (
        <div className="rounded-2xl border border-border bg-background p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <p lang="zh" className="font-chinese text-xl sm:text-2xl leading-loose text-text">
              {paragraph}
            </p>
            <SpeakerButton text={paragraph} className="mt-1 size-8 shrink-0" />
          </div>
          <p data-pinyin lang="zh-Latn-pinyin" className="text-[13px] leading-6 text-text/55">
            {lines
              .map((l) => l.pinyin)
              .filter(Boolean)
              .join(" ")}
          </p>
          {showMeaning && (
            <div className="space-y-1 border-t border-text/10 pt-2">
              {lines.map((l, i) => {
                const m = meaningOf(l);
                return m ? (
                  <p key={i} className="text-[13px] leading-relaxed text-text/70">
                    <span className="font-mono text-[11px] text-text/40 mr-2">{l.speaker}</span>
                    {m}
                  </p>
                ) : null;
              })}
            </div>
          )}
        </div>
      ) : (
        <ol className="space-y-1.5">
          {lines.map((line, i) => {
            const right = line.speaker === "B";
            const meaning = meaningOf(line);
            return (
              <li key={i} className={`flex items-start gap-2.5 ${right ? "flex-row-reverse" : ""}`}>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                    right ? "bg-primary/15 text-text/70" : "bg-text/10 text-text/65"
                  }`}
                >
                  {line.speaker}
                </span>
                <div
                  className={`max-w-[82%] rounded-2xl border px-4 py-2.5 ${
                    right
                      ? "rounded-tr-sm border-primary/15 bg-primary/[0.07]"
                      : "rounded-tl-sm border-text/10 bg-card/75"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p lang="zh" className="font-chinese text-2xl sm:text-3xl leading-relaxed text-text">
                      {line.hanzi}
                    </p>
                    <SpeakerButton text={line.hanzi} className="mt-1.5 size-7" />
                  </div>
                  {line.pinyin && (
                    <p data-pinyin lang="zh-Latn-pinyin" className="mt-0.5 text-[13px] leading-5 text-text/55">
                      {line.pinyin}
                    </p>
                  )}
                  {showMeaning && meaning && (
                    <p className="mt-1 text-[13px] leading-relaxed text-text/70">
                      {meaning}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {/* ── record & send (approved students only, admin marks 0–10) ── */}
      <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
        <div>
          <p className="text-sm font-bold text-text">
            🎙️ {t("ডায়লগ পড়ে পাঠান", "Read aloud & send")}
          </p>
          <p className="text-[11px] text-muted mt-0.5">
            {t(
              "রেকর্ড admin শুনে ০–১০ mark দেবেন। শুধু student list-এর approved student পাঠাতে পারবে — তোমার পাঠানো শুধু তুমি আর admin দেখবে।",
              "Admin listens and marks 0–10. Only approved students on the student list can submit — your recording is visible only to you and admin."
            )}
          </p>
        </div>

        {!CLOUD_NAME || !UPLOAD_PRESET ? (
          <p className="text-xs text-warn bg-warn/10 border border-warn/30 rounded-xl p-3">
            {t(
              "অডিও পাঠানো এখনো চালু হয়নি — admin সেটআপ করছেন।",
              "Audio submission is not enabled yet — admin is setting it up."
            )}
          </p>
        ) : (
          <>
            {!account ? (
              <div className="rounded-xl border border-text/15 bg-card p-4 text-center space-y-2">
                <p className="text-sm font-semibold text-text">
                  🔑 {t("রেকর্ড পাঠাতে লগইন করুন", "Login to send recordings")}
                </p>
                <p className="text-[11px] text-muted">
                  {t(
                    "শুধু লগইন করা শিক্ষার্থী পাঠাতে পারবে।",
                    "Only logged-in students can submit."
                  )}
                </p>
                <Link
                  href="/login"
                  className="inline-block px-5 py-2 rounded-xl bg-secondary text-background text-sm font-bold hover:opacity-90 transition"
                >
                  {t("লগইন", "Login")}
                </Link>
              </div>
            ) : (
              <p className="flex items-center gap-2 text-xs text-text/60">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-background">
                  {(account.nameEnglish.trim()[0] ?? "•").toUpperCase()}
                </span>
                {t("হিসেবে পাঠাচ্ছো", "Submitting as")}{" "}
                <span className="font-bold text-text">{account.nameEnglish}</span>
                {account.isPro && <span className="text-amber-500 font-bold">⭐</span>}
              </p>
            )}

            {account &&
              (existing ? (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 space-y-2">
                <p className="text-xs font-bold text-text">
                  🎧 {t("তোমার পাঠানো রেকর্ডিং", "Your submitted recording")}
                </p>
                <audio controls src={existing.audioUrl} className="h-9 w-full" />
                <div className="flex items-center justify-between gap-2">
                  {existing.status === "Marked" && existing.mark !== null ? (
                    <span className="font-mono text-xs font-bold text-ok">
                      {existing.mark}/10
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-warn">
                      {t("অপেক্ষমাণ", "Pending")}
                    </span>
                  )}
                  {existing.feedback && (
                    <span className="truncate text-[11px] text-text/60">
                      💬 {existing.feedback}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void deleteExisting()}
                    disabled={busyExisting}
                    className="px-4 py-2 rounded-xl font-semibold text-sm transition border border-secondary/40 text-secondary hover:bg-secondary/10 disabled:opacity-40"
                  >
                    ✏️ {t("এডিট (আবার রেকর্ড)", "Edit (re-record)")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirmDel) void deleteExisting();
                      else setConfirmDel(true);
                    }}
                    disabled={busyExisting}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition disabled:opacity-40 ${
                      confirmDel
                        ? "bg-danger text-white"
                        : "border border-danger/40 text-danger hover:bg-danger/10"
                    }`}
                  >
                    🗑️ {confirmDel ? t("নিশ্চিত?", "Sure?") : t("ডিলিট", "Delete")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  {!recording && !reviewUrl ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      disabled={uploading || starting}
                      className="px-4 py-2 rounded-xl font-semibold text-sm transition bg-secondary text-background hover:opacity-90 disabled:opacity-40"
                    >
                      🎙️ {t("রেকর্ড করুন", "Record")}
                    </button>
                  ) : recording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-4 py-2 rounded-xl font-semibold text-sm bg-danger text-background animate-pulse"
                    >
                      ⏹ {t("স্টপ", "Stop")} ({elapsed}s)
                    </button>
                  ) : null}
                  {uploading && (
                    <span className="text-xs text-secondary animate-pulse">
                      ⏳ {t("আপলোড হচ্ছে...", "Uploading...")}
                    </span>
                  )}
                </div>

                {reviewUrl && (
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
                    <p className="text-xs font-bold text-text">
                      👂 {t("শুনে দেখুন, তারপর পাঠান", "Listen back, then send")}
                    </p>
                    <audio controls src={reviewUrl} className="h-9 w-full" />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={sendFromReview}
                        disabled={uploading}
                        className="px-4 py-2 rounded-xl font-semibold text-sm transition bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
                      >
                        📤 {t("পাঠান", "Send")}
                      </button>
                      <button
                        type="button"
                        onClick={discardReview}
                        disabled={uploading}
                        className="px-4 py-2 rounded-xl font-semibold text-sm transition border border-danger/40 text-danger hover:bg-danger/10 disabled:opacity-40"
                      >
                        🗑️ {t("ডিলিট করে আবার", "Delete & re-record")}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ))}

            {sentOk && (
              <p className="text-xs text-ok font-medium">
                ✓ {t("পৌঁছেছে! Admin শুনে mark দেবেন।", "Sent! Admin will listen and mark.")}
              </p>
            )}
            {sendError && (
              <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-xl p-2.5">
                {sendError}
              </p>
            )}

            <div className="border-t border-text/10 pt-2">
              <button
                type="button"
                onClick={toggleMine}
                aria-expanded={subsOpen}
                className="flex w-full items-center justify-between gap-2 text-xs font-semibold text-secondary hover:underline"
              >
                <span>
                  📋 {t("এই লেসনে আমার পাঠানো", "My submissions in this lesson")}
                  {myList !== null && (
                    <span className="ml-1.5 font-mono opacity-80">({lessonSubs.length})</span>
                  )}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 shrink-0 transition-transform duration-300 ${
                    subsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  subsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  {myList === null ? (
                    <p className="pt-2 text-[11px] text-muted">
                      {t(
                        "লগইন করে খুলুন।",
                        "Login, then open."
                      )}
                    </p>
                  ) : lessonSubs.length === 0 ? (
                    <p className="pt-2 text-xs text-muted">
                      {t("এই লেসনে এখনো কিছু পাঠাওনি।", "Nothing submitted in this lesson yet.")}
                    </p>
                  ) : (
                    <div className="space-y-2 pt-2">
                      {lessonSubs.map((s) => (
                        <div
                          key={s._id}
                          className="rounded-xl border border-text/10 bg-card p-3 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-text">
                              HSK {s.level} · {t("লেসন", "Lesson")} {s.lesson}
                            </span>
                            {s.status === "Marked" && s.mark !== null ? (
                              <span className="font-mono font-bold text-ok">
                                {s.mark}/10
                              </span>
                            ) : (
                              <span className="font-mono text-warn">
                                {t("অপেক্ষমাণ", "Pending")}
                              </span>
                            )}
                          </div>
                          <audio controls src={s.audioUrl} className="h-8 w-full" />
                          {s.feedback && (
                            <p className="text-[11px] text-text/70">
                              💬 {s.feedback}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </SectionShell>
  );
}
