"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Info,
  ShieldCheck,
  Users,
  CheckCircle2,
  MessageCircle,
  GraduationCap,
} from "lucide-react";
import {
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Eyebrow,
  Field,
  LoadingBlock,
  PageHeader,
  SectionHanzi,
  SelectField,
  TextArea,
} from "@/components/ui";
import type { MarksKind, PaidEntry, PaidInput, PaidMemberTeam, PaidTeamView } from "../types";
import {
  CLASS_SLOTS,
  HOMEWORK_SLOTS,
  HSK_LEVELS,
  LABEL_SIZES,
  LABEL_OFFSETS,
  labelName,
  DEFAULT_WA_MESSAGE,
} from "../lib";
import {
  listPaid,
  createPaid,
  bulkPaidMarks,
  getPaidSettings,
  savePaidMessage,
  listPaidTeams,
} from "../server/paid";
import PaidCard from "./PaidCard";
import PaidTeams from "./PaidTeams";

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
  "w-full rounded-xl border border-text/15 bg-card px-3.5 py-2.5 text-sm text-text transition-colors placeholder:text-text/40 focus:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text";

const selectClass =
  "rounded-xl border border-text/15 bg-card px-3 py-2 text-sm text-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text";

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

  const [teams, setTeams] = useState<PaidTeamView[]>([]);

  const isAdmin = passcode.trim() !== "" && passcode.trim() === ADMIN_PASSCODE;

  const refreshTeams = () => {
    listPaidTeams()
      .then(setTeams)
      .catch(() => {
        // Teams are optional — the member list still works without them.
      });
  };

  useEffect(() => {
    listPaid()
      .then(setEntries)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load entries."))
      .finally(() => setLoading(false));
  }, []);

  // Teams are public to read; admins create and manage them.
  useEffect(() => {
    if (showRegistration) return;
    listPaidTeams()
      .then(setTeams)
      .catch(() => {
        // ignore — teams are optional
      });
  }, [showRegistration]);

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

  const teamByMember = useMemo(() => {
    const map = new Map<string, PaidMemberTeam>();
    for (const team of teams) {
      const teamName = team.name.trim() || "Team";
      if (team.captain) {
        map.set(team.captain._id, { teamName, isCaptain: true, captainName: team.captain.name });
      }
      for (const m of team.members) {
        map.set(m._id, { teamName, isCaptain: false, captainName: team.captain?.name ?? "" });
      }
    }
    return map;
  }, [teams]);

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
    // Captains always float to the top, keeping the order chosen above.
    list.sort(
      (a, b) =>
        Number(teamByMember.get(b._id)?.isCaptain ?? false) -
        Number(teamByMember.get(a._id)?.isCaptain ?? false)
    );
    return list;
  }, [filtered, sort, teamByMember]);

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
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <div className="relative">
        <SectionHanzi char={showRegistration ? "籍" : "员"} className="-top-10 right-0" />
        <PageHeader
          eyebrow={
            <Eyebrow
              seal={showRegistration ? "籍" : "员"}
              label={showRegistration ? "Paid registration" : "Paid members"}
              detail={showRegistration ? "নতুন সদস্য" : `${sorted.length} shown`}
            />
          }
          title={showRegistration ? "Paid Registration" : "Paid Members"}
          lede={
            showRegistration
              ? "Fill in your details once and your entry appears on the members list. · একবার তথ্য দিলেই হবে।"
              : "Every lesson carries a class mark and a homework mark, set by the admin. Sorted most-present first. · অ্যাডমিনের টগল বাটনে ক্লাস ও হোমওয়ার্ক সেট হয়।"
          }
          actions={
            showRegistration ? (
              <ButtonLink href="/paid" variant="secondary" size="sm">
                ← Back to members
              </ButtonLink>
            ) : isAdmin ? (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok-surface px-3 py-1.5 text-[11px] font-semibold text-ok">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Admin mode on
                </span>
                <Button variant="secondary" size="sm" onClick={adminLogout}>
                  Turn off admin mode
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                iconLeft={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                onClick={() => {
                  setAdminError("");
                  setAdminInput("");
                  setShowAdminModal(true);
                }}
              >
                Admin mode
              </Button>
            )
          }
        />
      </div>

      {/* Info / legend banner — English + Bangla */}
      {!showRegistration && (
      <div className="flex items-start gap-3 rounded-2xl border border-text/10 bg-text/[0.03] px-5 py-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-2 text-[13px] leading-relaxed text-text/70">
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
        <div
          role="alert"
          className="rounded-2xl border border-danger/40 bg-danger-surface px-4 py-3 text-sm font-medium text-danger"
        >
          {error}
        </div>
      )}

      {/* Bulk panel — admin only. Pick a slot, tick the students, then apply. */}
      {isAdmin && !showRegistration && (
        <Card className="p-4">
          <p className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-text/60">
            <Users className="h-3.5 w-3.5" aria-hidden="true" /> Bulk · select students · একসাথে অনেককে
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={bulkKind}
                onChange={(e) => setBulkKind(e.target.value as MarksKind)}
                aria-label="Bulk kind"
                className={`${selectClass} font-semibold`}
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
                className={selectClass}
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
                className={selectClass}
              >
                {Array.from({ length: LABEL_SIZES[bulkLabel - 1] }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                disabled={bulkBusy || selectedIds.length === 0}
                onClick={() => runBulk(true)}
              >
                {bulkKind === "class" ? "Mark present" : "Mark done"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={bulkBusy || selectedIds.length === 0}
                onClick={() => runBulk(false)}
              >
                Clear
              </Button>
              <span className="ml-auto text-xs font-semibold tabular-nums text-text/60">
                Selected: {selectedIds.length}
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-text/10 bg-card">
              <label className="sticky top-0 flex cursor-pointer items-center gap-2 border-b border-text/10 bg-card px-3 py-2 text-sm font-semibold text-text">
                <input type="checkbox" className="accent-text" checked={allSelected} onChange={toggleAll} />
                Select all ({sorted.length})
              </label>
              {sorted.length === 0 ? (
                <p className="px-3 py-3 text-sm text-text/50">No members to select.</p>
              ) : (
                sorted.map((e) => (
                  <label
                    key={e._id}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-text/[0.04]"
                  >
                    <input
                      type="checkbox"
                      className="accent-text"
                      checked={selectedIds.includes(e._id)}
                      onChange={() => toggleSelect(e._id)}
                    />
                    <span className="text-text">{e.name}</span>
                    <span className="ml-auto font-mono text-[10px] tabular-nums text-text/50">
                      {e.classesDone}/{CLASS_SLOTS} · {e.homeworkDone}/{HOMEWORK_SLOTS}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Admin-only WhatsApp greeting — prefilled when a number is tapped. */}
      {isAdmin && !showRegistration && (
        <Card className="p-4">
          <p className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-text/60">
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
            <Button size="sm" onClick={saveWa} loading={waSaving}>
              Save
            </Button>
            {waSaved && <span className="text-xs font-semibold text-ok">Saved · সেভ হয়েছে</span>}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-text/55">
            Prefilled when someone taps a WhatsApp number. Empty resets to &ldquo;{DEFAULT_WA_MESSAGE}&rdquo;. ·
            কেউ নম্বরে ট্যাপ করলে এই মেসেজ আগে থেকে লেখা থাকবে।
          </p>
        </Card>
      )}

      {/* Toolbar */}
      {!showRegistration && (
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-text/60">
          <span className="font-semibold">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort entries"
            className={selectClass}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <div className="relative ml-auto w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, area..."
            aria-label="Search entries"
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>
      )}

      {/* Create form */}
      {showForm && (
        <Card className="p-4 sm:p-6">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Name"
                required
                value={form.name}
                onChange={set("name")}
                placeholder="Full name"
                autoFocus
              />
              <Field
                label="WhatsApp"
                required
                value={form.whatsapp}
                onChange={set("whatsapp")}
                placeholder="01XXXXXXXXX"
                inputMode="tel"
              />
              <Field
                type="date"
                label="Date of birth"
                required
                value={form.dateOfBirth}
                onChange={set("dateOfBirth")}
              />
              <Field
                label="Occupation"
                required
                value={form.occupation}
                onChange={set("occupation")}
                placeholder="Student / Job / Business"
              />
              <SelectField
                label="HSK level"
                required
                value={form.hskLevel ?? ""}
                onChange={set("hskLevel")}
              >
                <option value="">Select your HSK level...</option>
                {HSK_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </SelectField>
            </div>
            <Field
              label="Address"
              required
              value={form.address}
              onChange={set("address")}
              placeholder="Village / Area, District"
            />
            <TextArea
              label="Describe yourself"
              required
              value={form.details}
              onChange={set("details")}
              placeholder="Describe yourself — why do you want to learn Chinese? What is your goal? Anything else about you..."
            />
            <div className="flex items-center justify-end gap-2 border-t border-text/10 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setForm(emptyForm);
                  if (!showRegistration) setShowForm(false);
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" loading={saving}>
                Save details
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Registration success */}
      {showRegistration && registered && (
        <Card className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-ok-surface text-ok">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="text-lg font-semibold text-text">
            You&apos;re registered! · রেজিস্ট্রেশন সম্পন্ন হয়েছে
          </p>
          <p className="max-w-md text-sm leading-relaxed text-text/60">
            Your details have been added to the paid members list. Classes and homework are marked by
            the admin. · আপনার তথ্য পেইড মেম্বার লিস্টে যোগ হয়েছে।
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setRegistered(false);
                setShowForm(true);
                setError("");
              }}
            >
              Register another · আরেকজন যোগ করুন
            </Button>
            <ButtonLink href="/paid" variant="secondary" size="sm">
              Back to paid members
            </ButtonLink>
          </div>
        </Card>
      )}

      {/* List — hidden on the registration page */}
      {!showRegistration && (loading ? (
        <LoadingBlock label="Loading members" />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-7 w-7" aria-hidden="true" />}
          title="No members yet"
          description="Contact the admin to be added to the paid members list."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`No match for \u201c${query}\u201d`}
          description="Try a different name, number or area."
        />
      ) : (
        <div className="grid w-full gap-4 sm:grid-cols-2">
          {sorted.map((entry) => (
            <PaidCard
              key={entry._id}
              entry={entry}
              passcode={passcode}
              isAdmin={isAdmin}
              waMessage={waMessage}
              team={teamByMember.get(entry._id) ?? null}
              onUpdate={(updated) =>
                setEntries((prev) => prev.map((e) => (e._id === updated._id ? updated : e)))
              }
              onDelete={(id) => {
                setEntries((prev) => prev.filter((e) => e._id !== id));
                refreshTeams();
              }}
              onError={setError}
            />
          ))}
        </div>
      ))}

      {/* Teams — everyone sees who captains whom; managing is admin-only. */}
      {!showRegistration && (
        <PaidTeams
          entries={entries}
          teams={teams}
          isAdmin={isAdmin}
          passcode={passcode}
          onChanged={refreshTeams}
          onError={setError}
        />
      )}

      {/* Admin popup — first-load prompt to unlock admin mode with the passcode. */}
      {!showRegistration && showAdminModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Turn on admin mode"
        >
          <form
            onSubmit={submitAdmin}
            className="w-full max-w-sm rounded-2xl border border-text/10 bg-card p-6 shadow-2xl"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-text text-background">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-lg font-semibold text-text">Admin mode</h2>
            <p className="mt-1 text-sm leading-relaxed text-text/60">
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
              className={`${inputClass} mt-4`}
              autoFocus
            />
            {adminError && (
              <p role="alert" className="mt-2 text-xs font-semibold text-danger">
                {adminError}
              </p>
            )}
            <div className="mt-5 flex items-center justify-end gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={skipAdmin}>
                Skip
              </Button>
              <Button type="submit" size="sm">
                Turn on
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
