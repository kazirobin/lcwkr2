"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Info, ShieldCheck, Users, CheckCircle2, MessageCircle } from "lucide-react";
import type { MarksKind, PaidEntry, PaidInput } from "../types";
import {
  CLASS_SLOTS,
  HOMEWORK_SLOTS,
  HSK_LEVELS,
  LABEL_SIZES,
  LABEL_OFFSETS,
  labelName,
  DEFAULT_WA_MESSAGE,
} from "../lib";
import { listPaid, createPaid, bulkPaidMarks, getPaidSettings, savePaidMessage } from "../server/paid";
import PaidCard from "./PaidCard";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";
const ADMIN_STORAGE_KEY = "paid:adminPasscode";
const ADMIN_SKIP_KEY = "paid:adminSkipped";

const emptyForm: PaidInput = {
  name: "",
  whatsapp: "",
  address: "",
  occupation: "",
  dateOfBirth: "",
  details: "",
  hskLevel: "",
};

const inputClass =
  "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-text focus:border-primary focus:outline-none";

type SortKey = "classesDesc" | "classesAsc" | "homeworkDesc" | "homeworkAsc" | "name" | "newest";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "classesDesc", label: "Most present · বেশি উপস্থিত" },
  { value: "classesAsc", label: "Fewest present · কম উপস্থিত" },
  { value: "homeworkDesc", label: "Most homework · বেশি হোমওয়ার্ক" },
  { value: "homeworkAsc", label: "Fewest homework · কম হোমওয়ার্ক" },
  { value: "name", label: "Name (A–Z) · নাম" },
  { value: "newest", label: "Newest · নতুন" },
];

function matches(entry: PaidEntry, words: string[]): boolean {
  if (words.length === 0) return true;
  const haystack = [
    entry.name,
    entry.whatsapp,
    entry.occupation,
    entry.address,
    entry.details,
    entry.dateOfBirth,
    entry.hskLevel,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return words.every((w) => haystack.includes(w));
}

export default function PaidApp({ showRegistration = false }: { showRegistration?: boolean }) {
  const [entries, setEntries] = useState<PaidEntry[]>([]);
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("classesDesc");
  const [showForm, setShowForm] = useState(showRegistration);
  const [registered, setRegistered] = useState(false);
  const [form, setForm] = useState<PaidInput>(emptyForm);

  const [bulkKind, setBulkKind] = useState<MarksKind>("class");
  const [bulkLabel, setBulkLabel] = useState(1);
  const [bulkLesson, setBulkLesson] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkBusy, setBulkBusy] = useState(false);

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState("");

  const [waMessage, setWaMessage] = useState(DEFAULT_WA_MESSAGE);
  const [waSaving, setWaSaving] = useState(false);
  const [waSaved, setWaSaved] = useState(false);

  const isAdmin = passcode.trim() !== "" && passcode.trim() === ADMIN_PASSCODE;

  useEffect(() => {
    listPaid()
      .then(setEntries)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load entries."))
      .finally(() => setLoading(false));
  }, []);

  // The WhatsApp greeting is shared by everyone; the admin can override it.
  useEffect(() => {
    if (showRegistration) return;
    getPaidSettings()
      .then((settings) => setWaMessage(settings.waMessage))
      .catch(() => {
        // Settings are optional — fall back to the default greeting.
      });
  }, [showRegistration]);

  // Admin login lives behind a popup. Restore a saved passcode; otherwise show
  // the popup on first visit (unless the visitor already skipped it).
  useEffect(() => {
    if (showRegistration) return;
    let saved: string | null = null;
    let skipped: string | null = null;
    try {
      saved = window.localStorage.getItem(ADMIN_STORAGE_KEY);
      skipped = window.localStorage.getItem(ADMIN_SKIP_KEY);
    } catch {
      // localStorage unavailable — just show the popup.
    }
    if (saved && saved === ADMIN_PASSCODE) {
      // Restoring persisted admin state on mount — not a render-time update.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPasscode(saved);
    } else if (!skipped) {
      // First visit — prompt for the passcode.
      setShowAdminModal(true);
    }
  }, [showRegistration]);

  const filtered = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return entries.filter((e) => matches(e, words));
  }, [entries, query]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
        break;
      case "classesAsc":
        list.sort((a, b) => (a.classesDone ?? 0) - (b.classesDone ?? 0) || a.name.localeCompare(b.name));
        break;
      case "homeworkDesc":
        list.sort((a, b) => (b.homeworkDone ?? 0) - (a.homeworkDone ?? 0) || a.name.localeCompare(b.name));
        break;
      case "homeworkAsc":
        list.sort((a, b) => (a.homeworkDone ?? 0) - (b.homeworkDone ?? 0) || a.name.localeCompare(b.name));
        break;
      case "newest":
        list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
        break;
      case "classesDesc":
      default:
        // Most present first — the default the page opens on.
        list.sort((a, b) => (b.classesDone ?? 0) - (a.classesDone ?? 0) || a.name.localeCompare(b.name));
    }
    return list;
  }, [filtered, sort]);

  const set = (key: keyof PaidInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const required: { key: keyof PaidInput; label: string }[] = [
      { key: "name", label: "Name" },
      { key: "whatsapp", label: "WhatsApp" },
      { key: "dateOfBirth", label: "Date of birth" },
      { key: "occupation", label: "Occupation" },
      { key: "hskLevel", label: "HSK level" },
      { key: "address", label: "Address" },
      { key: "details", label: "Describe yourself" },
    ];
    const missing = required.filter(({ key }) => !String(form[key] ?? "").trim()).map((f) => f.label);
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}.`);
      return;
    }
    try {
      setSaving(true);
      setError("");
      const created = await createPaid(form);
      setEntries((prev) => [created, ...prev]);
      setForm(emptyForm);
      if (showRegistration) {
        setRegistered(true);
        setShowForm(false);
      } else {
        setShowForm(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save entry.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const allSelected = sorted.length > 0 && sorted.every((e) => selectedIds.includes(e._id));

  const toggleAll = () => setSelectedIds(allSelected ? [] : sorted.map((e) => e._id));

  const runBulk = async (value: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      setBulkBusy(true);
      setError("");
      const index = LABEL_OFFSETS[bulkLabel - 1] + (bulkLesson - 1);
      await bulkPaidMarks(bulkKind, index, value, passcode, selectedIds);
      setEntries(await listPaid());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update attendance.");
    } finally {
      setBulkBusy(false);
    }
  };

  const submitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const value = adminInput.trim();
    if (value !== ADMIN_PASSCODE) {
      setAdminError("Wrong passcode. Try again.");
      return;
    }
    setPasscode(value);
    setAdminInput("");
    setAdminError("");
    setShowAdminModal(false);
    try {
      window.localStorage.setItem(ADMIN_STORAGE_KEY, value);
      window.localStorage.removeItem(ADMIN_SKIP_KEY);
    } catch {
      // ignore storage failures
    }
  };

  const skipAdmin = () => {
    setShowAdminModal(false);
    setAdminError("");
    setAdminInput("");
    try {
      window.localStorage.setItem(ADMIN_SKIP_KEY, "1");
    } catch {
      // ignore
    }
  };

  const adminLogout = () => {
    setPasscode("");
    try {
      window.localStorage.removeItem(ADMIN_STORAGE_KEY);
      window.localStorage.removeItem(ADMIN_SKIP_KEY);
    } catch {
      // ignore
    }
  };

  const saveWa = async () => {
    try {
      setWaSaving(true);
      setError("");
      const settings = await savePaidMessage(waMessage, passcode);
      setWaMessage(settings.waMessage);
      setWaSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save message.");
    } finally {
      setWaSaving(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-md">
        <div>
          <h1 className="text-xl font-semibold tracking-wide text-primary">
            {showRegistration ? "Paid Registration" : "Paid Members"}
          </h1>
          <p className="mt-0.5 text-xs text-muted">
            {showRegistration
              ? "Fill in your details once — your entry appears on the members list. একবার তথ্য দিলেই হবে।"
              : "Classes & homework are set with toggle buttons by the admin. Sorted most-present first."}
          </p>
        </div>
        {!showRegistration && (
          <div className="flex flex-col items-end gap-1">
            {isAdmin ? (
              <>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ok">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Admin mode on
                </span>
                <button
                  type="button"
                  onClick={adminLogout}
                  className="rounded-md border border-border bg-background px-3 py-1 text-xs font-medium text-muted transition hover:border-text/40 hover:text-text"
                >
                  Turn off admin mode
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAdminError("");
                  setAdminInput("");
                  setShowAdminModal(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Admin mode
              </button>
            )}
          </div>
        )}
      </div>

      {showRegistration && (
        <Link
          href="/paid"
          className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-primary transition hover:opacity-80"
        >
          ← Back to paid members · ফিরে যান
        </Link>
      )}

      {/* Info / legend banner — English + Bangla */}
      {!showRegistration && (
      <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/[0.05] px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-1.5 text-[13px] leading-relaxed text-text/80">
          <p>
            <span className="font-semibold text-text">English: </span>
            Each HSK label has its own lessons — <span className="font-semibold">Label 1: {LABEL_SIZES[0]},
            Label 2: {LABEL_SIZES[1]}, Label 3: {LABEL_SIZES[2]}</span> (total {CLASS_SLOTS}) — and every
            lesson has a class slot and a homework slot. With the admin passcode, tap a lesson number to
            mark it present; anything left untapped stays{" "}
            <span className="font-semibold">absent</span>. Open the bulk panel to tick{" "}
            <span className="font-semibold">specific students</span>, pick a label + lesson and mark them
            present (or homework done) — or Select all. You can also edit one member&apos;s classes and
            homework inside their Edit form. The list is sorted most-present first.
          </p>
          <p>
            <span className="font-semibold text-text">বাংলা: </span>
            প্রতিটা HSK label-এর নিজের lesson আছে — <span className="font-semibold">Label 1: {LABEL_SIZES[0]},
            Label 2: {LABEL_SIZES[1]}, Label 3: {LABEL_SIZES[2]}</span> (মোট {CLASS_SLOTS}) — আর প্রতি
            lesson-এর জন্য একটা class ও একটা homework slot। admin passcode দিয়ে lesson নম্বরে ট্যাপ করে
            present করা যায়; যা ট্যাপ করবেন না সেটা <span className="font-semibold">absent</span> থেকে
            যাবে। Bulk panel খুলে <span className="font-semibold">নির্দিষ্ট student</span> টিক দিন, label +
            lesson বেছে present (বা homework done) করুন — অথবা Select all। একজন member-এর class ও homework
            তার Edit form-এর ভেতরেও বদলাতে পারবেন। সবচেয়ে বেশি present থাকা
            নাম উপরে দেখায়।
          </p>
        </div>
      </div>
      )}

      {error && (
        <div className="rounded-lg border border-danger bg-danger-surface px-4 py-2 text-xs text-danger">
          {error}
        </div>
      )}

      {/* Bulk panel — admin only. Pick a slot, tick the students, then apply. */}
      {isAdmin && !showRegistration && (
        <div className="rounded-lg border border-primary/30 bg-primary/[0.04] p-3">
          <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <Users className="h-3.5 w-3.5" aria-hidden="true" /> Bulk · select students · একসাথে অনেককে
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={bulkKind}
                onChange={(e) => setBulkKind(e.target.value as MarksKind)}
                aria-label="Bulk kind"
                className="rounded-md border border-border bg-background px-2 py-1 font-semibold text-text focus:border-primary focus:outline-none"
              >
                <option value="class">Class</option>
                <option value="homework">Homework</option>
              </select>
              <select
                value={bulkLabel}
                onChange={(e) => {
                  const nextLabel = Number(e.target.value);
                  setBulkLabel(nextLabel);
                  setBulkLesson((n) => Math.min(n, LABEL_SIZES[nextLabel - 1]));
                }}
                aria-label="Bulk label"
                className="rounded-md border border-border bg-background px-2 py-1 text-text focus:border-primary focus:outline-none"
              >
                {LABEL_SIZES.map((_, i) => (
                  <option key={i} value={i + 1}>
                    {labelName(i + 1)}
                  </option>
                ))}
              </select>
              <select
                value={bulkLesson}
                onChange={(e) => setBulkLesson(Number(e.target.value))}
                aria-label="Bulk lesson"
                className="rounded-md border border-border bg-background px-2 py-1 text-text focus:border-primary focus:outline-none"
              >
                {Array.from({ length: LABEL_SIZES[bulkLabel - 1] }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={bulkBusy || selectedIds.length === 0}
                onClick={() => runBulk(true)}
                className={`rounded-md px-3 py-1 font-semibold transition hover:opacity-90 disabled:opacity-40 ${
                  bulkKind === "class" ? "bg-primary text-primary-foreground" : "bg-ok text-background"
                }`}
              >
                {bulkKind === "class" ? "Mark present" : "Mark done"}
              </button>
              <button
                type="button"
                disabled={bulkBusy || selectedIds.length === 0}
                onClick={() => runBulk(false)}
                className="rounded-md border border-border bg-background px-3 py-1 font-medium text-text transition hover:border-text/40 disabled:opacity-40"
              >
                Clear
              </button>
              <span className="ml-auto font-semibold text-muted">Selected: {selectedIds.length}</span>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-md border border-border bg-background">
              <label className="sticky top-0 flex cursor-pointer items-center gap-2 border-b border-border bg-background px-3 py-1.5 text-xs font-semibold text-text">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                Select all ({sorted.length})
              </label>
              {sorted.length === 0 ? (
                <p className="px-3 py-3 text-xs text-muted">No members to select.</p>
              ) : (
                sorted.map((e) => (
                  <label
                    key={e._id}
                    className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-xs hover:bg-border/20"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(e._id)}
                      onChange={() => toggleSelect(e._id)}
                    />
                    <span className="text-text">{e.name}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted">
                      {e.classesDone}/{CLASS_SLOTS} · {e.homeworkDone}/{HOMEWORK_SLOTS}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin-only WhatsApp greeting — prefilled when a number is tapped. */}
      {isAdmin && !showRegistration && (
        <div className="rounded-lg border border-primary/30 bg-primary/[0.04] p-3">
          <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp default message · হোয়াটসঅ্যাপ ডিফল্ট মেসেজ
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={waMessage}
              onChange={(e) => {
                setWaMessage(e.target.value);
                if (waSaved) setWaSaved(false);
              }}
              maxLength={300}
              placeholder={DEFAULT_WA_MESSAGE}
              aria-label="WhatsApp default message"
              className={`${inputClass} min-w-[220px] flex-1`}
            />
            <button
              type="button"
              onClick={saveWa}
              disabled={waSaving}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              {waSaving ? "Saving..." : "Save"}
            </button>
            {waSaved && <span className="text-xs font-semibold text-ok">Saved · সেভ হয়েছে</span>}
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
            Prefilled when someone taps a WhatsApp number. Empty resets to &ldquo;{DEFAULT_WA_MESSAGE}&rdquo;. ·
            কেউ নম্বরে ট্যাপ করলে এই মেসেজ আগে থেকে লেখা থাকবে।
          </p>
        </div>
      )}

      {/* Toolbar */}
      {!showRegistration && (
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 text-xs text-muted">
          <span className="font-semibold">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort entries"
            className="rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-text focus:border-primary focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <div className="relative ml-auto w-full sm:w-72">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, area..."
            aria-label="Search entries"
            className={`${inputClass} pl-8`}
          />
        </div>
      </div>
      )}

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-lg"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-primary">Name *</span>
              <input className={inputClass} value={form.name} onChange={set("name")} placeholder="Full name" required autoFocus />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-primary">WhatsApp *</span>
              <input className={inputClass} value={form.whatsapp} onChange={set("whatsapp")} placeholder="01XXXXXXXXX" inputMode="tel" required />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-primary">Date of birth *</span>
              <input type="date" className={inputClass} value={form.dateOfBirth} onChange={set("dateOfBirth")} required />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-primary">Occupation *</span>
              <input className={inputClass} value={form.occupation} onChange={set("occupation")} placeholder="Student / Job / Business" required />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-primary">HSK level *</span>
              <select className={inputClass} value={form.hskLevel ?? ""} onChange={set("hskLevel")} required>
                <option value="">Select your HSK level...</option>
                {HSK_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase text-primary">Address *</span>
            <input className={inputClass} value={form.address} onChange={set("address")} placeholder="Village / Area, District" required />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase text-primary">Describe yourself *</span>
            <textarea
              className={`${inputClass} min-h-[120px] resize-y`}
              value={form.details}
              onChange={set("details")}
              placeholder="Describe yourself — why do you want to learn Chinese? What is your goal? Anything else about you..."
              required
            />
          </label>
          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                if (!showRegistration) setShowForm(false);
              }}
              disabled={saving}
              className="rounded px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-border/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save details"}
            </button>
          </div>
        </form>
      )}

      {/* Registration success */}
      {showRegistration && registered && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-ok bg-ok/10 px-4 py-8 text-center">
          <CheckCircle2 className="h-8 w-8 text-ok" aria-hidden="true" />
          <p className="text-base font-semibold text-text">
            You&apos;re registered! · রেজিস্ট্রেশন সম্পন্ন হয়েছে
          </p>
          <p className="max-w-md text-sm text-muted">
            Your details have been added to the paid members list. Classes and homework are marked by
            the admin. · আপনার তথ্য পেইড মেম্বার লিস্টে যোগ হয়েছে।
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setRegistered(false);
                setShowForm(true);
                setError("");
              }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Register another · আরেকজন যোগ করুন
            </button>
            <Link
              href="/paid"
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text transition hover:border-text/40"
            >
              Back to paid members
            </Link>
          </div>
        </div>
      )}

      {/* List — hidden on the registration page */}
      {!showRegistration && (loading ? (
        <p className="py-8 text-center text-sm text-muted">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          No details yet. Contact the admin to be added.
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">No match for &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="flex w-full flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-3">
          {sorted.map((entry) => (
            <PaidCard
              key={entry._id}
              entry={entry}
              passcode={passcode}
              isAdmin={isAdmin}
              waMessage={waMessage}
              onUpdate={(updated) =>
                setEntries((prev) => prev.map((e) => (e._id === updated._id ? updated : e)))
              }
              onDelete={(id) => setEntries((prev) => prev.filter((e) => e._id !== id))}
              onError={setError}
            />
          ))}
        </div>
      ))}

      {/* Admin popup — first-load prompt to unlock admin mode with the passcode. */}
      {!showRegistration && showAdminModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Turn on admin mode"
        >
          <form
            onSubmit={submitAdmin}
            className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-2xl"
          >
            <h2 className="inline-flex items-center gap-1.5 text-base font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Admin mode
            </h2>
            <p className="mt-1 text-xs text-muted">
              Enter the passcode to unlock editing and the attendance toggles.
              <br />
              passcode দিলে admin mode চালু হবে।
            </p>
            <input
              type="password"
              value={adminInput}
              onChange={(e) => {
                setAdminInput(e.target.value);
                if (adminError) setAdminError("");
              }}
              placeholder="Admin passcode..."
              aria-label="Admin passcode"
              className={`${inputClass} mt-3`}
              autoFocus
            />
            {adminError && <p className="mt-1.5 text-xs font-semibold text-danger">{adminError}</p>}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={skipAdmin}
                className="rounded px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-border/50"
              >
                Skip
              </button>
              <button
                type="submit"
                className="rounded bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Turn on
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
