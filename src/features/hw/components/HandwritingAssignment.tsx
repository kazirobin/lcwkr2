"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Eye, EyeOff, Link2 as LinkIcon } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import { formatBytes } from "@/lib/format";
import SectionShell from "./SectionShell";

interface Props {
  level: number;
  lesson: number;
  /** The lesson's Hanzi to copy by hand. */
  items: { hanzi: string; pinyin: string; meaning: string }[];
  collapsible?: boolean;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
// Falls back to the recording preset when a dedicated image preset is not set.
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_UPLOAD_PRESET ||
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
  "";
const MAX_PHOTOS = 8;
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * A picked photo. `bytes` is null for one the student pasted as a link, since
 * the site never saw the file — the browser only fetched the host's headers.
 */
interface QueuedPhoto {
  key: string;
  file: File | null;
  url: string;
  bytes: number | null;
  /** Set when the entry came from a pasted image link rather than a file. */
  externalUrl?: string;
  /** The browser could not draw `url` — almost always an image host's share
   *  page rather than the picture itself. The link is still submitted; only the
   *  preview changes, so the student is not left staring at a broken box. */
  previewBroken?: boolean;
}

interface Submission {
  _id: string;
  level: number;
  lesson: number;
  images: { url: string; publicId?: string; bytes?: number; source?: string }[];
  mark: number | null;
  feedback: string;
  status: string;
  createdAt: string;
}

/**
 * Handwritten-homework assignment — the student writes this lesson's Hanzi on
 * paper and sends one or more photos (up to MAX_PHOTOS, e.g. several pages);
 * the admin looks at the set and marks it 0–10 by hand. Like the dialogue
 * recorder it is optional, independent of the auto-graded exam, and visible
 * only to the submitter + admin.
 */
export default function HandwritingAssignment({ level, lesson, items, collapsible }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const { student: account } = useAccount();
  const [showMeaning, setShowMeaning] = useState(true);
  const [queue, setQueue] = useState<QueuedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sentOk, setSentOk] = useState(false);
  const [myList, setMyList] = useState<Submission[] | null>(null);
  /* Submitted photos whose URL the browser could not draw — an image host's
     share page rather than the picture. Kept per URL, not per submission, so a
     later submission of the same lesson is judged on its own. */
  const [brokenImages, setBrokenImages] = useState<Record<string, true>>({});
  const [subsOpen, setSubsOpen] = useState(false);
  const [busyExisting, setBusyExisting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const camInputRef = useRef<HTMLInputElement | null>(null);
  const multiInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const [linkInput, setLinkInput] = useState("");

  const accountPhone = account?.whatsapp.trim() ?? "";

  useEffect(
    () => () => {
      previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );

  const revoke = (url: string) => {
    URL.revokeObjectURL(url);
    previewUrlsRef.current = previewUrlsRef.current.filter((u) => u !== url);
  };

  const loadMine = async (phone: string) => {
    try {
      const res = await fetch(`/api/hw/handwriting?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data.success) setMyList(data.submissions ?? []);
    } catch {
      /* offline — ignore */
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      if (accountPhone) void loadMine(accountPhone);
    });
  }, [accountPhone]);

  // This lesson's submission only — one slot per lesson holding N photos.
  const existing = (myList ?? []).find((s) => s.level === level && s.lesson === lesson) ?? null;
  const savedCount = existing?.images.length ?? 0;
  const slotsLeft = Math.max(0, MAX_PHOTOS - savedCount);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setSentOk(false);
    let problem: string | null = null;
    const accepted: QueuedPhoto[] = [];
    for (const file of Array.from(files)) {
      if (accepted.length + queue.length >= slotsLeft) {
        problem = t(
          `এই লেসনে সর্বোচ্চ ${MAX_PHOTOS}টি ছবি পাঠানো যাবে।`,
          `You can send up to ${MAX_PHOTOS} photos for this lesson.`
        );
        break;
      }
      if (!file.type.startsWith("image/")) {
        problem = t("একটি ছবি বেছে নিন।", "Please choose an image file.");
        break;
      }
      if (file.size > MAX_BYTES) {
        problem = t(
          "প্রতিটি ছবি ৮ MB-এর বেশি হতে পারবে না। ছোট করে আবার নিন।",
          "Each photo must be under 8 MB. Please use a smaller one."
        );
        break;
      }
      const url = URL.createObjectURL(file);
      previewUrlsRef.current.push(url);
      accepted.push({
        key: `${Date.now()}-${file.name}-${file.size}`,
        file,
        url,
        bytes: file.size,
      });
    }
    if (accepted.length > 0) setQueue((prev) => [...prev, ...accepted]);
    setSendError(problem);
  };

  const dropQueued = (key: string) => {
    setQueue((prev) => {
      const hit = prev.find((q) => q.key === key);
      if (hit) revoke(hit.url);
      return prev.filter((q) => q.key !== key);
    });
    setSendError(null);
  };

  /** One flag flip, no refetch: the entry stays queued and is still sent. */
  const markPreviewBroken = (key: string) => {
    setQueue((prev) => prev.map((q) => (q.key === key ? { ...q, previewBroken: true } : q)));
  };

  /** Same idea for photos already on the server. */
  const noteImageBroken = (url: string) => {
    setBrokenImages((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
  };

  const clearQueue = () => {
    queue.forEach((q) => revoke(q.url));
    setQueue([]);
    setSendError(null);
    setSentOk(false);
  };

  /**
   * Add a photo the student already uploaded somewhere else (ImageBB and
   * friends) by pasting the link. It goes into the same queue as a local file,
   * so the size cap, the slot count and the submit call behave identically —
   * only the upload step is skipped.
   */
  const addLinkedImage = async () => {
    const raw = linkInput.trim();
    setSendError(null);
    if (!raw) return;
    if (queue.length + savedCount >= MAX_PHOTOS) {
      setSendError(
        t(
          `এই লেসনে সর্বোচ্চ ${MAX_PHOTOS}টি ছবি পাঠানো যাবে।`,
          `You can send up to ${MAX_PHOTOS} photos for this lesson.`,
        ),
      );
      return;
    }
    let parsed: URL;
    try {
      parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    } catch {
      setSendError(t("সঠিক লিংক দিন।", "That doesn't look like a valid link."));
      return;
    }
    if (parsed.protocol !== "https:") {
      setSendError(t("শুধু https লিংক নেওয়া যাবে।", "Only https links are accepted."));
      return;
    }
    if (!/\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(parsed.pathname)) {
      setSendError(
        t("সরাসরি ছবির লিংক দিন (.jpg, .png, .webp)।", "Link to the image file itself (.jpg, .png, .webp)."),
      );
      return;
    }
    setQueue((prev) => [
      ...prev,
      {
        key: `${Date.now()}-link-${parsed.href}`,
        file: null,
        url: parsed.href,
        bytes: null,
        externalUrl: parsed.href,
      },
    ]);
    setLinkInput("");
  };

  const uploadOne = async (q: QueuedPhoto) => {
    if (!q.file) {
      return { url: q.externalUrl ?? q.url, publicId: "", bytes: 0, source: "external" as const };
    }
    const form = new FormData();
    // Unique filename per upload — otherwise Cloudinary reuses the same
    // public_id/URL and browsers show stale cached bytes.
    form.append("file", q.file, `handwriting-${level}-${lesson}-${Date.now()}.jpg`);
    form.append("upload_preset", UPLOAD_PRESET);
    const up = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: form,
    });
    const upJson = await up.json();
    if (!up.ok || !upJson.secure_url) {
      throw new Error(t("ছবি আপলোড হয়নি। আবার চেষ্টা করুন।", "Photo upload failed. Try again."));
    }
    return {
      url: String(upJson.secure_url),
      publicId: String(upJson.public_id ?? ""),
      // Cloudinary reports the stored size; falling back to the local file size
      // keeps the storage counter honest when it is missing.
      bytes: Math.max(0, Math.round(Number(upJson.bytes ?? q.file.size ?? 0))),
      source: "cloudinary" as const,
    };
  };

  const uploadAndSubmit = async () => {
    if (!account || queue.length === 0) return;
    setUploading(true);
    setSendError(null);
    setSentOk(false);
    setUploadedCount(0);
    try {
      const images: {
        url: string;
        publicId: string;
        bytes: number;
        source: "cloudinary" | "external";
      }[] = [];
      for (const q of queue) {
        images.push(await uploadOne(q));
        setUploadedCount(images.length);
      }
      const res = await fetch(
        existing ? `/api/hw/handwriting/${existing._id}/photos` : "/api/hw/handwriting",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: accountPhone,
            name: account.nameEnglish,
            level,
            lesson,
            images,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? t("পাঠানো যায়নি।", "Could not submit."));
      }
      setSentOk(true);
      clearQueue();
      setSubsOpen(true);
      void loadMine(accountPhone);
    } catch (e) {
      setSendError(e instanceof Error ? e.message : t("পাঠানো যায়নি।", "Could not submit."));
    } finally {
      setUploading(false);
      setUploadedCount(0);
    }
  };

  const deleteExisting = async () => {
    if (!existing || busyExisting) return;
    setBusyExisting(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/hw/handwriting/${existing._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: accountPhone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      setMyList((prev) => (prev ?? []).filter((s) => s._id !== existing._id));
      setConfirmDel(false);
      setSentOk(false);
    } catch (e) {
      setSendError(e instanceof Error ? e.message : t("ডিলিট হয়নি।", "Delete failed."));
    } finally {
      setBusyExisting(false);
    }
  };

  const removeOne = async (index: number) => {
    if (!existing || removingIndex !== null) return;
    setRemovingIndex(index);
    setSendError(null);
    try {
      const res = await fetch(
        `/api/hw/handwriting/${existing._id}/photos?index=${index}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: accountPhone }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed.");
      if (data.deleted) {
        setMyList((prev) => (prev ?? []).filter((s) => s._id !== existing._id));
      } else {
        setMyList((prev) =>
          (prev ?? []).map((s) => (s._id === existing._id ? data.submission : s)),
        );
      }
    } catch (e) {
      setSendError(e instanceof Error ? e.message : t("ছবিটি মুছে যায়নি।", "Could not remove photo."));
    } finally {
      setRemovingIndex(null);
    }
  };

  const wordList = items;
  const full = savedCount + queue.length >= MAX_PHOTOS;

  return (
    <SectionShell
      index="✍️"
      title={t("হাতে লিখে ছবি পাঠাও", "Handwrite & send photos")}
      marks={items.length}
      marksLabel={t("শব্দ", "words")}
      collapsible={collapsible}
    >
      {/* ── the words to copy by hand ── */}
      <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-text">
            📄 {t("এই লেসনের শব্দগুলো হাতে লিখো", "Copy these lesson words by hand")}
          </p>
          <button
            type="button"
            onClick={() => setShowMeaning((v) => !v)}
            aria-pressed={!showMeaning}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
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
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {wordList.map((w, i) => (
            <li
              key={`${w.hanzi}-${i}`}
              className="rounded-xl border border-text/10 bg-card px-2.5 py-2 text-center"
            >
              <p lang="zh" className="font-chinese text-2xl leading-tight text-text">
                {w.hanzi}
              </p>
              {w.pinyin && (
                <p data-pinyin lang="zh-Latn-pinyin" className="text-[11px] leading-4 text-text/55">
                  {w.pinyin}
                </p>
              )}
              {showMeaning && w.meaning && (
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-text/60">{w.meaning}</p>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* ── take / upload photos (approved students only, admin marks 0–10) ── */}
      <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
        <div>
          <p className="text-sm font-bold text-text">
            📷 {t("কাগজে লেখার ছবি পাঠাও", "Send photos of your paper")}
          </p>
          <p className="text-[11px] text-muted mt-0.5">
            {t(
              `উপরের শব্দগুলো কাগজে হাতে লিখে ছবি তুলে পাঠাও। একসাথে বা একে একে সর্বোচ্চ ${MAX_PHOTOS}টি ছবি পাঠানো যাবে। Admin সবগুলো দেখে ০–১০ mark ও মন্তব্য দেবেন। শুধু student list-এর approved student পাঠাতে পারবে — তোমার ছবি শুধু তুমি আর admin দেখবে।`,
              `Write the words above on paper and send photos — up to ${MAX_PHOTOS} at a time or one by one. Admin reviews the whole set and marks 0–10 with feedback. Only approved students can submit — your photos are visible only to you and admin.`
            )}
          </p>
        </div>

        {!CLOUD_NAME || !UPLOAD_PRESET ? (
          <p className="text-xs text-warn bg-warn/10 border border-warn/30 rounded-xl p-3">
            {t(
              "ছবি পাঠানো এখনো চালু হয়নি — admin সেটআপ করছেন।",
              "Photo submission is not enabled yet — admin is setting it up."
            )}
          </p>
        ) : (
          <>
            {!account ? (
              <div className="rounded-xl border border-text/15 bg-card p-4 text-center space-y-2">
                <p className="text-sm font-semibold text-text">
                  🔑 {t("ছবি পাঠাতে লগইন করুন", "Login to send photos")}
                </p>
                <p className="text-[11px] text-muted">
                  {t("শুধু লগইন করা শিক্ষার্থী পাঠাতে পারবে।", "Only logged-in students can submit.")}
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

            {account && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => camInputRef.current?.click()}
                    disabled={uploading || full}
                    className="px-4 py-2 rounded-xl font-semibold text-sm transition bg-secondary text-background hover:opacity-90 disabled:opacity-40"
                  >
                    📷 {t("ছবি তুলুন", "Take photo")}
                  </button>
                  <button
                    type="button"
                    onClick={() => multiInputRef.current?.click()}
                    disabled={uploading || full}
                    className="px-4 py-2 rounded-xl font-semibold text-sm transition border border-secondary/40 text-secondary hover:bg-secondary/10 disabled:opacity-40"
                  >
                    🖼️ {t("একাধিক ছবি বেছে নিন", "Choose multiple")}
                  </button>
                  {/* Slow connection: the photo is already on their phone, so
                      sending a link beats waiting on a re-upload. */}
                  {!CLOUD_NAME || !UPLOAD_PRESET ? (
                    <p className="text-[11px] text-warn">
                      {t(
                        "ডাইরেক্ট আপলোড চালু নেই — লিংক দিয়ে পাঠান।",
                        "Direct upload is off — send a link instead.",
                      )}
                    </p>
                  ) : null}
                  {full && (
                    <span className="text-[11px] font-mono text-warn">
                      {t(`${MAX_PHOTOS}টির সীমা পূর্ণ`, `Limit reached (${MAX_PHOTOS})`)}
                    </span>
                  )}
                  {uploading && (
                    <span className="text-xs text-secondary animate-pulse">
                      ⏳{" "}
                      {uploadedCount > 0
                        ? t(
                            `${uploadedCount}/${queue.length} আপলোড হচ্ছে...`,
                            `Uploading ${uploadedCount}/${queue.length}...`
                          )
                        : t("আপলোড হচ্ছে...", "Uploading...")}
                    </span>
                  )}
                </div>

                {/* Link fallback — paste an image you already uploaded. */}
                <div className="flex flex-col gap-2 rounded-xl border border-dashed border-text/15 bg-background p-3 sm:flex-row sm:items-center">
                  <label htmlFor={`hw-link-${level}-${lesson}`} className="flex items-center gap-1.5 text-xs font-semibold text-text/70">
                    <LinkIcon className="size-3.5 shrink-0" aria-hidden="true" />
                    {t("আগে আপলোড করা ছবির লিংক", "Already-uploaded image link")}
                  </label>
                  <div className="flex flex-1 gap-2">
                    <input
                      id={`hw-link-${level}-${lesson}`}
                      type="url"
                      inputMode="url"
                      placeholder="https://i.ibb.co/…"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void addLinkedImage();
                        }
                      }}
                      className="min-w-0 flex-1 rounded-xl border border-border bg-card px-3 py-2 text-xs text-text placeholder:text-text/40 focus:ring-2 focus:ring-primary outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => void addLinkedImage()}
                      disabled={full || !linkInput.trim()}
                      className="shrink-0 rounded-xl border border-secondary/40 px-3 py-2 text-xs font-bold text-secondary hover:bg-secondary/10 disabled:opacity-40"
                    >
                      {t("যোগ করো", "Add")}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted sm:w-full">
                    {t(
                      "ImageBB-তে ছবি আপলোড করে সেই লিংক এখানে দিলেই চলবে।",
                      "Upload the photo on ImageBB, then paste that link here.",
                    )}
                  </p>
                </div>

                {/* picked-but-not-sent photos */}
                {queue.length > 0 && (
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
                    <p className="text-xs font-bold text-text">
                      👀 {t("বেছে নেওয়া ছবি — দেখে পাঠাও", "Picked photos — check, then send")} ({queue.length})
                    </p>
                    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {queue.map((q) => (
                        <li key={q.key} className="relative">
                          {q.previewBroken ? (
                            /* An image host's share link is a web page, not a
                               picture, so the browser cannot draw it. Rather
                               than show a torn-image box, say what it is and
                               keep it clickable — the server swaps in the real
                               file on submit. */
                            <a
                              href={q.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-28 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-text/20 bg-card px-2 text-center"
                            >
                              <LinkIcon className="size-4 text-text/45" aria-hidden="true" />
                              <span className="text-[10px] leading-tight text-text/60">
                                {t("লিংক — ছবি খুলে দেখুন", "Link — tap to open")}
                              </span>
                            </a>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element -- local blob preview */
                            <img
                              src={q.url}
                              alt={t("বেছে নেওয়া ছবির প্রিভিউ", "Preview of a chosen photo")}
                              onError={() => markPreviewBroken(q.key)}
                              className="h-28 w-full rounded-lg border border-text/10 bg-card object-cover"
                            />
                          )}
                          {/* Per-photo size, so a student can see which page is
                              the heavy one before sending everything. */}
                          <span className="absolute bottom-1 left-1 rounded bg-background/85 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-text">
                            {q.bytes !== null ? formatBytes(q.bytes) : t("লিংক", "link")}
                          </span>
                          <button
                            type="button"
                            onClick={() => dropQueued(q.key)}
                            disabled={uploading}
                            aria-label={t("ছবিটি বাদ দিন", "Remove this photo")}
                            className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border border-danger/40 bg-background text-xs text-danger transition hover:bg-danger/10 disabled:opacity-40"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-muted">
                      {t("মোট আকার", "Total size")}:{" "}
                      <span className="font-mono tabular-nums text-text">
                        {formatBytes(
                          queue.reduce((n, q) => n + (q.bytes ?? 0), 0),
                        )}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void uploadAndSubmit()}
                        disabled={uploading}
                        className="px-4 py-2 rounded-xl font-semibold text-sm transition bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
                      >
                        📤 {t(`${queue.length}টি ছবি পাঠাও`, `Send ${queue.length} photo${queue.length > 1 ? "s" : ""}`)}
                      </button>
                      <button
                        type="button"
                        onClick={clearQueue}
                        disabled={uploading}
                        className="px-4 py-2 rounded-xl font-semibold text-sm transition border border-danger/40 text-danger hover:bg-danger/10 disabled:opacity-40"
                      >
                        🗑️ {t("সব বাদ দাও", "Discard all")}
                      </button>
                    </div>
                  </div>
                )}

                {/* already-submitted photos for this lesson */}
                {existing && (
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 space-y-2">
                    <p className="text-xs font-bold text-text">
                      🖼️ {t("তোমার পাঠানো ছবি", "Your submitted photos")} ({existing.images.length})
                    </p>
                          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {existing.images.map((img, i) => (
                        <li key={img.url} className="relative">
                          <a href={img.url} target="_blank" rel="noopener noreferrer" className="block">
                            {brokenImages[img.url] ? (
                              <span className="flex h-28 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-text/20 bg-card px-2 text-center">
                                <LinkIcon className="size-4 text-text/45" aria-hidden="true" />
                                <span className="text-[10px] leading-tight text-text/60">
                                  {t("লিংক — ছবি খুলে দেখুন", "Link — tap to open")}
                                </span>
                              </span>
                            ) : (
                              /* eslint-disable-next-line @next/next/no-img-element -- Cloudinary CDN, no next.config images setup */
                              <img
                                src={img.url}
                                alt={`${t("পাঠানো হাতে-লেখার ছবি", "Submitted handwriting photo")} ${i + 1}`}
                                onError={() => noteImageBroken(img.url)}
                                className="h-28 w-full rounded-lg border border-text/10 bg-card object-cover"
                              />
                            )}
                          </a>
                          <span className="absolute bottom-1 left-1 rounded bg-background/85 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-text">
                            {/* A photo the student hosted themselves has no size
                                on our side — the browser never sees the bytes.
                                "0 B" would read as a failed upload, so say
                                where it actually is. */}
                            {img.bytes ? formatBytes(img.bytes) : t("লিংক", "link")}
                          </span>
                          <button
                            type="button"
                            onClick={() => void removeOne(i)}
                            disabled={busyExisting || removingIndex !== null}
                            aria-label={t("ছবিটি মুছুন", "Remove this photo")}
                            title={t("শুধু এই ছবিটি মুছবে", "Removes only this photo")}
                            className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border border-danger/40 bg-background text-xs text-danger transition hover:bg-danger/10 disabled:opacity-40"
                          >
                            {removingIndex === i ? "…" : "✕"}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
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
                          <span className="truncate text-[11px] text-text/60">💬 {existing.feedback}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirmDel) void deleteExisting();
                            else setConfirmDel(true);
                          }}
                          disabled={busyExisting}
                          className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition disabled:opacity-40 ${
                            confirmDel
                              ? "bg-danger text-white"
                              : "border border-danger/40 text-danger hover:bg-danger/10"
                          }`}
                        >
                          🗑️ {confirmDel ? t("সব মুছবে — নিশ্চিত?", "Delete all — sure?") : t("সব ছবি মুছুন", "Delete all")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {sentOk && (
              <p className="text-xs text-ok font-medium">
                ✓ {t("পৌঁছেছে! Admin দেখে mark দেবেন।", "Sent! Admin will review and mark.")}
              </p>
            )}
            {sendError && (
              <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-xl p-2.5">
                {sendError}
              </p>
            )}

            {/* Camera (single shot) + gallery (multi-select) pickers. */}
            <input
              ref={camInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <input
              ref={multiInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />

            <div className="border-t border-text/10 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (subsOpen) {
                    setSubsOpen(false);
                    return;
                  }
                  setSubsOpen(true);
                  if (accountPhone) void loadMine(accountPhone);
                }}
                aria-expanded={subsOpen}
                className="flex w-full items-center justify-between gap-2 text-xs font-semibold text-secondary hover:underline"
              >
                <span>
                  📋 {t("সব লেসনে আমার ছবি", "My photos in all lessons")}
                  {myList !== null && (
                    <span className="ml-1.5 font-mono opacity-80">({myList.length})</span>
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
                    <p className="pt-2 text-[11px] text-muted">{t("লগইন করে খুলুন।", "Login, then open.")}</p>
                  ) : myList.length === 0 ? (
                    <p className="pt-2 text-xs text-muted">
                      {t("এখনো কোনো ছবি পাঠাওনি।", "No photos submitted yet.")}
                    </p>
                  ) : (
                    <div className="space-y-2 pt-2">
                      {myList.map((s) => (
                        <div key={s._id} className="rounded-xl border border-text/10 bg-card p-3 space-y-1.5">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-text">
                              HSK {s.level} · {t("লেসন", "Lesson")} {s.lesson}
                              <span className="ml-1.5 font-mono text-text/45">
                                ({s.images.length} {t("ছবি", "photos")}
                                {/* Summing the bytes of photos hosted elsewhere
                                    would always be 0, so only mention a size
                                    when at least one photo has one. */}
                                {s.images.some((img) => img.bytes)
                                  ? ` · ${formatBytes(
                                      s.images.reduce((n, img) => n + (img.bytes ?? 0), 0),
                                    )}`
                                  : null}
                                )
                              </span>
                            </span>
                            {s.status === "Marked" && s.mark !== null ? (
                              <span className="font-mono font-bold text-ok">
                                {s.mark}/10
                              </span>
                            ) : (
                              <span className="font-mono text-warn">{t("অপেক্ষমাণ", "Pending")}</span>
                            )}
                          </div>
                          <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                            {s.images.map((img, i) => (
                              <li key={img.url}>
                                <a href={img.url} target="_blank" rel="noopener noreferrer" className="block">
                                  {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary CDN, no next.config images setup */}
                                  <img
                                    src={img.url}
                                    alt={`${t("পাঠানো হাতে-লেখার ছবি", "Submitted handwriting photo")} ${i + 1}`}
                                    loading="lazy"
                                    className="h-20 w-full rounded-lg border border-text/10 bg-background object-cover"
                                  />
                                </a>
                              </li>
                            ))}
                          </ul>
                          {s.feedback && <p className="text-[11px] text-text/70">💬 {s.feedback}</p>}
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
