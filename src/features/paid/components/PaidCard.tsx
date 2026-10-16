"use client";

import { useState } from "react";
import {
  Phone,
  MapPin,
  Briefcase,
  CalendarDays,
  FileText,
  Pencil,
  Trash2,
  Save,
  X,
  GraduationCap,
  BookCheck,
  ChevronDown,
} from "lucide-react";
import type { MarksKind, PaidEntry, PaidInput } from "../types";
import { CLASS_SLOTS, HOMEWORK_SLOTS, HSK_LEVELS, LABEL_SIZES, LABEL_OFFSETS, labelName, normalizeMarks } from "../lib";
import { updatePaid, deletePaid } from "../server/paid";

interface Props {
  entry: PaidEntry;
  passcode: string;
  isAdmin: boolean;
  onUpdate: (updated: PaidEntry) => void;
  onDelete: (id: string) => void;
  onError: (msg: string) => void;
}

function waLink(whatsapp: string): string | null {
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const intl = digits.startsWith("0") ? `88${digits}` : digits;
  return `https://wa.me/${intl}`;
}

function toInput(entry: PaidEntry): PaidInput {
  return {
    name: entry.name,
    whatsapp: entry.whatsapp ?? "",
    address: entry.address ?? "",
    occupation: entry.occupation ?? "",
    dateOfBirth: entry.dateOfBirth ?? "",
    details: entry.details ?? "",
    hskLevel: entry.hskLevel ?? "",
  };
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-text focus:border-primary focus:outline-none";

function Detail({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  if (!value && !children) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 shrink-0 text-muted">{icon}</span>
      <span className="text-muted">
        <span className="sr-only">{label}: </span>
        {children ?? value}
      </span>
    </div>
  );
}

function MarksGrid({
  kind,
  marks,
  isAdmin,
  busyKey,
  onToggle,
}: {
  kind: MarksKind;
  marks: boolean[];
  isAdmin: boolean;
  busyKey: string | null;
  onToggle: (kind: MarksKind, index: number) => void;
}) {
  // One group per HSK label (15 / 15 / 18 lessons). Cells show the lesson
  // number *within the label*; the flat index drives the marks array.
  const button = (index: number, lesson: number, label: number) => {
    const on = Boolean(marks[index]);
    const key = `${kind}-${index}`;
    const busy = busyKey === key;
    const onClass = "border-transparent bg-primary text-primary-foreground";
    const onHw = "border-transparent bg-ok text-background";
    const off = "border-text/15 bg-background text-text/45 hover:border-primary/40 hover:text-text";
    return (
      <button
        key={index}
        type="button"
        disabled={!isAdmin || busy}
        onClick={() => onToggle(kind, index)}
        aria-pressed={on}
        aria-label={`${kind} · ${labelName(label)} ${lesson} ${on ? "present" : "absent"}`}
        title={isAdmin ? `Toggle ${kind} · ${labelName(label)} ${lesson}` : "Admin passcode required"}
        className={`h-7 w-7 rounded-md border text-[11px] font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text ${
          on ? (kind === "class" ? onClass : onHw) : off
        } ${!isAdmin ? "cursor-default" : "cursor-pointer"} ${busy ? "opacity-50" : ""}`}
      >
        {lesson}
      </button>
    );
  };

  const headerTone = (label: number) =>
    label === 1 ? "text-primary" : label === 2 ? "text-ok" : "text-muted";

  return (
    <div className="flex flex-col gap-2">
      {LABEL_SIZES.map((size, li) => {
        const offset = LABEL_OFFSETS[li];
        const label = li + 1;
        let done = 0;
        for (let k = 0; k < size; k++) if (marks[offset + k]) done++;
        return (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5 text-[10px] font-semibold uppercase tracking-wide">
              <span className={headerTone(label)}>{labelName(label)}</span>
              <span className="font-mono tabular-nums text-muted">
                {done}/{size}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: size }, (_, k) => {
                const index = offset + k;
                return button(index, k + 1, label);
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MarksSection({
  kind,
  label,
  icon,
  open,
  onToggleOpen,
  marks,
  isAdmin,
  busyKey,
  onToggle,
}: {
  kind: MarksKind;
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onToggleOpen: () => void;
  marks: boolean[];
  isAdmin: boolean;
  busyKey: string | null;
  onToggle: (kind: MarksKind, index: number) => void;
}) {
  const total = kind === "class" ? CLASS_SLOTS : HOMEWORK_SLOTS;
  const done = marks.filter(Boolean).length;
  const tone = kind === "class" ? "text-primary" : "text-ok";
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-md px-1 py-1 text-left transition hover:bg-border/30"
      >
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide ${tone}`}>
          {icon} {label}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold tabular-nums text-text">
            {done}/{total}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted transition-transform ${open ? "" : "-rotate-90"}`}
            aria-hidden="true"
          />
        </span>
      </button>
      {open && (
        <div className="mt-1.5">
          <MarksGrid kind={kind} marks={marks} isAdmin={isAdmin} busyKey={busyKey} onToggle={onToggle} />
        </div>
      )}
    </div>
  );
}

export default function PaidCard({
  entry,
  passcode,
  isAdmin,
  onUpdate,
  onDelete,
  onError,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showHomework, setShowHomework] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [form, setForm] = useState<PaidInput>(toInput(entry));
  const [formClass, setFormClass] = useState<boolean[]>(() => normalizeMarks(entry.classMarks, CLASS_SLOTS));
  const [formHomework, setFormHomework] = useState<boolean[]>(() => normalizeMarks(entry.homeworkMarks, HOMEWORK_SLOTS));

  const classMarks = entry.classMarks ?? [];
  const homeworkMarks = entry.homeworkMarks ?? [];

  const set = (key: keyof PaidInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const startEdit = () => {
    setForm(toInput(entry));
    setFormClass(normalizeMarks(entry.classMarks, CLASS_SLOTS));
    setFormHomework(normalizeMarks(entry.homeworkMarks, HOMEWORK_SLOTS));
    setIsEditing(true);
  };

  // In the edit form the grids edit local state; nothing is saved until Save.
  const setLocalMark = (kind: MarksKind, index: number) => {
    if (kind === "class") {
      setFormClass((arr) => arr.map((v, i) => (i === index ? !v : v)));
    } else {
      setFormHomework((arr) => arr.map((v, i) => (i === index ? !v : v)));
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      onError("Name is required.");
      return;
    }
    try {
      setLoading(true);
      onError("");
      const updated = await updatePaid(entry._id, form, {
        // Admin can adjust the class/homework grids right here, together with
        // the rest of the record.
        marks: isAdmin ? { classMarks: formClass, homeworkMarks: formHomework } : undefined,
        passcode,
      });
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update entry.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMark = async (kind: MarksKind, index: number) => {
    if (!isAdmin) return;
    const total = kind === "class" ? CLASS_SLOTS : HOMEWORK_SLOTS;
    const base = kind === "class" ? classMarks : homeworkMarks;
    const next = Array.from({ length: total }, (_, i) => Boolean(base[i]));
    next[index] = !next[index];

    const key = `${kind}-${index}`;
    const optimistic: PaidEntry =
      kind === "class"
        ? { ...entry, classMarks: next, classesDone: next.filter(Boolean).length }
        : { ...entry, homeworkMarks: next, homeworkDone: next.filter(Boolean).length };

    setBusyKey(key);
    onUpdate(optimistic);
    try {
      const updated = await updatePaid(entry._id, toInput(entry), {
        marks: kind === "class" ? { classMarks: next } : { homeworkMarks: next },
        passcode,
      });
      onUpdate(updated);
    } catch (err) {
      onUpdate(entry);
      onError(err instanceof Error ? err.message : "Failed to update attendance.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${entry.name}"? This cannot be undone.`)) return;
    try {
      setLoading(true);
      onError("");
      await deletePaid(entry._id, passcode);
      onDelete(entry._id);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Admin passcode required to delete.");
    } finally {
      setLoading(false);
    }
  };

  const link = entry.whatsapp ? waLink(entry.whatsapp) : null;
  const isLongDetails = (entry.details?.length ?? 0) > 220 || (entry.details?.split("\n").length ?? 0) > 4;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition hover:border-primary/40">
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-primary">Name *</span>
              <input className={inputClass} value={form.name} onChange={set("name")} placeholder="Full name" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-primary">WhatsApp</span>
              <input className={inputClass} value={form.whatsapp} onChange={set("whatsapp")} placeholder="01XXXXXXXXX" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-primary">Date of birth</span>
              <input type="date" className={inputClass} value={form.dateOfBirth} onChange={set("dateOfBirth")} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-primary">Occupation</span>
              <input className={inputClass} value={form.occupation} onChange={set("occupation")} placeholder="Student / Job / Business" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-primary">HSK level</span>
              <select className={inputClass} value={form.hskLevel ?? ""} onChange={set("hskLevel")}>
                <option value="">Not set</option>
                {HSK_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase text-primary">Address</span>
            <input className={inputClass} value={form.address} onChange={set("address")} placeholder="Village / Area, District" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase text-primary">Describe yourself</span>
            <textarea
              className={`${inputClass} min-h-[96px] resize-y`}
              value={form.details}
              onChange={set("details")}
              placeholder="Why you want to learn Chinese, what is your goal, etc."
            />
          </label>

          {isAdmin && (
            <div className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/[0.04] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                Admin · Classes &amp; Homework
              </p>
              <MarksSection
                kind="class"
                label="Classes"
                icon={<GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />}
                open={showClasses}
                onToggleOpen={() => setShowClasses((v) => !v)}
                marks={formClass}
                isAdmin={isAdmin}
                busyKey={null}
                onToggle={setLocalMark}
              />
              <MarksSection
                kind="homework"
                label="Homework"
                icon={<BookCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                open={showHomework}
                onToggleOpen={() => setShowHomework((v) => !v)}
                marks={formHomework}
                isAdmin={isAdmin}
                busyKey={null}
                onToggle={setLocalMark}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-border/50"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" /> {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <h3 className="text-base font-semibold text-text">{entry.name}</h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {entry.hskLevel && (
                <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  {entry.hskLevel}
                </span>
              )}
              {entry.occupation && (
                <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted">
                  {entry.occupation}
                </span>
              )}
            </div>
          </div>

          {/* Collapsible class / homework grids. Admin taps a number to mark it
              present; anything left untoggled stays absent. */}
          <div className="flex flex-col gap-1 rounded-lg border border-border bg-background p-2">
            <MarksSection
              kind="class"
              label="Classes"
              icon={<GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />}
              open={showClasses}
              onToggleOpen={() => setShowClasses((v) => !v)}
              marks={classMarks}
              isAdmin={isAdmin}
              busyKey={busyKey}
              onToggle={toggleMark}
            />
            <MarksSection
              kind="homework"
              label="Homework"
              icon={<BookCheck className="h-3.5 w-3.5" aria-hidden="true" />}
              open={showHomework}
              onToggleOpen={() => setShowHomework((v) => !v)}
              marks={homeworkMarks}
              isAdmin={isAdmin}
              busyKey={busyKey}
              onToggle={toggleMark}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            {entry.dateOfBirth && (
              <Detail icon={<CalendarDays className="h-4 w-4" />} label="Date of birth" value={entry.dateOfBirth} />
            )}
            {entry.whatsapp && (
              <Detail icon={<Phone className="h-4 w-4" />} label="WhatsApp">
                {link ? (
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {entry.whatsapp}
                  </a>
                ) : (
                  entry.whatsapp
                )}
              </Detail>
            )}
            {entry.address && (
              <Detail icon={<MapPin className="h-4 w-4" />} label="Address" value={entry.address} />
            )}
            {entry.occupation && (
              <Detail icon={<Briefcase className="h-4 w-4" />} label="Occupation" value={entry.occupation} />
            )}
          </div>

          {entry.details && (
            <div className="flex items-start gap-2 border-t border-border pt-3 text-sm">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <span className="whitespace-pre-wrap break-words text-text">
                  <span className="sr-only">Describe yourself: </span>
                  <span className={!isExpanded && isLongDetails ? "line-clamp-4" : ""}>{entry.details}</span>
                </span>
                {isLongDetails && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded((v) => !v)}
                    className="self-start text-xs font-medium text-primary hover:underline"
                  >
                    {isExpanded ? "Show less" : "Show more..."}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-1 border-t border-border pt-3">
            <button
              type="button"
              onClick={startEdit}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-border/50 hover:text-text"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-medium text-danger transition hover:opacity-80"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
