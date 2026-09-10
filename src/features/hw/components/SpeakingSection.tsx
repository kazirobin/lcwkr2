"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n";
import type { SpeakingQuestion } from "../exam-types";

interface Props {
  questions: SpeakingQuestion[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled?: boolean;
  results?: Record<string, { earned: number; marks: number }>;
}

const MAX_MS = 60000;

export default function SpeakingSection({ questions, answers, onChange, disabled, results }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
      recorderRef.current?.stream?.getTracks().forEach((tr) => tr.stop());
    },
    [],
  );

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  };

  const startRecording = async (id: string) => {
    setMicError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMicError(
        t(
          "আপনার ব্রাউজার রেকর্ডিং সাপোর্ট করে না। Chrome/Edge ব্যবহার করুন।",
          "Your browser does not support recording. Please use Chrome/Edge."
        ),
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") onChange(id, reader.result);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((tr) => tr.stop());
        setRecordingId(null);
        if (timerRef.current) clearInterval(timerRef.current);
        if (autoStopRef.current) clearTimeout(autoStopRef.current);
      };

      recorder.start();
      setRecordingId(id);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
      autoStopRef.current = setTimeout(stopRecording, MAX_MS);
    } catch {
      setMicError(
        t(
          "মাইক্রোফোনের অনুমতি দিন, তারপর আবার চেষ্টা করুন।",
          "Please allow microphone access and try again."
        ),
      );
    }
  };

  return (
    <section className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-3">
        <h2 className="text-base sm:text-xl font-semibold text-text">
          5. {t("ভয়েস রেকর্ডিং ও স্পিকিং এক্টিভিটি", "Voice Recording & Speaking Activity")}
        </h2>
        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
          {questions.reduce((n, q) => n + q.marks, 0)} {t("নম্বর", "Marks")}
        </span>
      </div>

      <p className="text-xs text-muted">
        {t(
          "প্রতিটি বাক্য জোরে পড়ুন, রেকর্ড করুন এবং শুনে যাচাই করুন। রেকর্ডিং আপনার ডিভাইসেই (localStorage) সেভ থাকে।",
          "Read each sentence aloud, record it and listen back. Recordings stay on your device (localStorage)."
        )}
      </p>

      {micError && (
        <p className="text-xs text-danger bg-danger-surface border border-danger/30 rounded-xl p-3">
          ⚠ {micError}
        </p>
      )}

      {questions.map((q, idx) => {
        const val = answers[q.id] ?? "";
        const res = results?.[q.id];
        const isRecording = recordingId === q.id;

        return (
          <div key={q.id} className="bg-background p-4 rounded-xl space-y-3 border border-border">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-text text-sm">
                {idx + 1}. {t("জোরে বলুন", "Say aloud")}:
              </p>
              {res && (
                <span
                  className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    res.earned === res.marks
                      ? "bg-ok/10 text-ok border border-ok/30"
                      : "bg-danger/10 text-danger border border-danger/30"
                  }`}
                >
                  {res.earned}/{res.marks}
                </span>
              )}
            </div>

            <p className="text-xl font-chinese font-bold text-text">{q.line}</p>
            <p data-pinyin className="text-xs font-mono text-secondary">{q.pinyin}</p>
            <p className="text-xs text-muted">
              {language === "bn" ? q.bn || q.en : q.en}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {!isRecording ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => startRecording(q.id)}
                  className="px-4 py-2 rounded-xl font-semibold text-sm transition bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
                >
                  🎙️ {val ? t("আবার রেকর্ড করুন", "Re-record") : t("রেকর্ড করুন", "Record")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-4 py-2 rounded-xl font-semibold text-sm bg-secondary text-background animate-pulse"
                >
                  ⏹ {t("স্টপ করুন", "Stop")} ({elapsed}s / 60s)
                </button>
              )}

              {val && (
                <audio controls src={val} className="h-9 max-w-full" />
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
