"use client";

import { useState } from "react";
import {
  Phone,
  MapPin,
  CalendarDays,
  FileText,
  Pencil,
  Trash2,
  Save,
  X,
  GraduationCap,
  BookCheck,
  ChevronDown,
  Crown,
  Users,
} from "lucide-react";
import type { MarksKind, PaidEntry, PaidInput, PaidMemberTeam } from "../types";
import {
  CLASS_SLOTS,
  HOMEWORK_SLOTS,
  HSK_LEVELS,
  LABEL_SIZES,
  LABEL_OFFSETS,
  labelName,
  normalizeMarks,
  whatsappLink,
} from "../lib";
import { updatePaid, deletePaid } from "../server/paid";
import { Button, ProgressBar } from "@/components/ui";

interface Props {
  entry: PaidEntry;
  passcode: string;
  isAdmin: boolean;
  /** Admin-set greeting prefilled on a WhatsApp tap. */
  waMessage: string;
  /** The team this member belongs to, if any. */
  team?: PaidMemberTeam | null;
  onUpdate: (updated: PaidEntry) => void;
  onDelete: (id: string) => void;
  onError: (msg: string) => void;
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
  "w-full rounded-xl border border-text/15 bg-card px-3.5 py-2.5 text-sm text-text transition-colors placeholder:text-text/40 focus:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text";

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
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 shrink-0 text-text/40">{icon}</span>
      <span className="text-text/70">
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
    const onClass = "border-transparent bg-text text-background";
    const onHw = "border-transparent bg-ok text-background";
    const off = "border-text/15 bg-card text-text/45 hover:border-text/40 hover:text-text";
    return (
      <button
        key={index}
        type="button"
        disabled={!isAdmin || busy}
        onClick={() => onToggle(kind, index)}
        aria-pressed={on}
        aria-label={`${kind} · ${labelName(label)} ${lesson} ${on ? "present" : "absent"}`}
        title={isAdmin ? `Toggle ${kind} · ${labelName(label)} ${lesson}` : "Admin passcode required"}
        className={`h-7 w-7 rounded-lg border text-[11px] font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text ${
          on ? (kind === "class" ? onClass : onHw) : off
        } ${!isAdmin ? "cursor-default" : "cursor-pointer"} ${busy ? "opacity-50" : ""}`}
      >
        {lesson}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2.5">
      {LABEL_SIZES.map((size, li) => {
        const offset = LABEL_OFFSETS[li];
        const label = li + 1;
        let done = 0;
        for (let k = 0; k < size; k++) if (marks[offset + k]) done++;
        return (
          <div key={label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
              <span className="text-text/60">{labelName(label)}</span>
              <span className="font-mono tabular-nums text-text/40">
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
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-text/[0.04]"
      >
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-text/60">
          <span className="text-text/40">{icon}</span> {label}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="font-mono text-xs font-bold tabular-nums text-text">
            {done}/{total}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-text/40 transition-transform ${open ? "" : "-rotate-90"}`}
            aria-hidden="true"
          />
        </span>
      </button>
      {open && (
        <div className="mt-2 px-0.5">
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
  waMessage,
  team,
  onUpdate,
  onDelete,
  onError,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showHomework, setShowHomework] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [form, setForm] = useState<PaidInput>(toInput(entry));
  const [formClass, setFormClass] = useState<boolean[]>(() => normalizeMarks(entry.classMarks, CLASS_SLOTS));
  const [formHomework, setFormHomework] = useState<boolean[]>(() => normalizeMarks(entry.homeworkMarks, HOMEWORK_SLOTS));

  const classMarks = entry.classMarks ?? [];
  const homeworkMarks = entry.homeworkMarks ?? [];

  // A lesson counts as complete once both its class and homework are marked,
  // so the single bar reads as progress through all 48 lessons.
  const lessonsDone = classMarks.reduce(
    (n, done, i) => n + (done && homeworkMarks[i] ? 1 : 0),
    0
  );

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

  const link = entry.whatsapp ? whatsappLink(entry.whatsapp, waMessage) : null;
  const isLongDetails = (entry.details?.length ?? 0) > 220 || (entry.details?.split("\n").length ?? 0) > 4;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-text/10 bg-card p-5 transition-colors hover:border-text/25">
      {isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-text">Name *</span>
              <input className={inputClass} value={form.name} onChange={set("name")} placeholder="Full name" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-text">WhatsApp</span>
              <input className={inputClass} value={form.whatsapp} onChange={set("whatsapp")} placeholder="01XXXXXXXXX" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-text">Date of birth</span>
              <input type="date" className={inputClass} value={form.dateOfBirth} onChange={set("dateOfBirth")} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-text">Occupation</span>
              <input className={inputClass} value={form.occupation} onChange={set("occupation")} placeholder="Student / Job / Business" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-text">HSK level</span>
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
            <span className="text-[13px] font-semibold text-text">Address</span>
            <input className={inputClass} value={form.address} onChange={set("address")} placeholder="Village / Area, District" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-text">Describe yourself</span>
            <textarea
              className={`${inputClass} min-h-[96px] resize-y`}
              value={form.details}
              onChange={set("details")}
              placeholder="Why you want to learn Chinese, what is your goal, etc."
            />
          </label>

          {isAdmin && (
            <div className="flex flex-col gap-2 rounded-xl border border-text/10 bg-text/[0.02] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text/60">
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

          <div className="flex items-center justify-end gap-2 border-t border-text/10 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(false)}
              disabled={loading}
              iconLeft={<X className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              loading={loading}
              iconLeft={<Save className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-3 rounded-lg text-left transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
          >
            <h3 className="text-base font-semibold text-text">{entry.name}</h3>
            <span className="flex shrink-0 items-center gap-1.5">
              {team?.isCaptain && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  <Crown className="h-3 w-3" aria-hidden="true" /> Captain
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 text-text/40 transition-transform ${open ? "" : "-rotate-90"}`}
                aria-hidden="true"
              />
            </span>
          </button>

          {/* Team membership — who captains whom. Visible even when collapsed. */}
          {team && (
            <p className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-text/60">
              {team.isCaptain ? (
                <>
                  <Crown className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>
                    Team: <span className="font-semibold text-text/75">{team.teamName || "Team"}</span>
                  </span>
                </>
              ) : (
                <>
                  <Users className="h-3.5 w-3.5 text-text/40" aria-hidden="true" />
                  <span>
                    Team: <span className="font-semibold text-text/75">{team.teamName || "Team"}</span> · Captain:{" "}
                    <span className="font-semibold text-text/75">{team.captainName}</span>
                  </span>
                </>
              )}
            </p>
          )}

          {/* Overall progress across the 48 lessons — a lesson counts once its
              class and homework are both marked. Stays visible when collapsed. */}
          <div className="flex items-center gap-3">
            <ProgressBar value={lessonsDone} max={CLASS_SLOTS} label="Course progress" />
            <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-text/60">
              {lessonsDone}/{CLASS_SLOTS}
            </span>
          </div>

          {open && (
            <>
          {/* Collapsible class / homework grids. Admin taps a number to mark it
              present; anything left untoggled stays absent. */}
          <div className="flex flex-col gap-1 rounded-xl border border-text/10 bg-card p-2">
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
            {isAdmin && entry.dateOfBirth && (
              <Detail icon={<CalendarDays className="h-4 w-4" />} label="Date of birth" value={entry.dateOfBirth} />
            )}
            {entry.whatsapp && (
              <Detail icon={<Phone className="h-4 w-4" />} label="WhatsApp">
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-text underline decoration-text/30 underline-offset-2 transition-colors hover:decoration-text"
                  >
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
          </div>

          {entry.details && (
            <div className="flex items-start gap-2.5 border-t border-text/10 pt-4 text-sm">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-text/40" aria-hidden="true" />
              <div className="flex flex-col gap-1.5">
                <span className="whitespace-pre-wrap break-words text-text/70">
                  <span className="sr-only">Describe yourself: </span>
                  <span className={!isExpanded && isLongDetails ? "line-clamp-4" : ""}>{entry.details}</span>
                </span>
                {isLongDetails && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded((v) => !v)}
                    className="self-start text-xs font-semibold text-text underline decoration-text/30 underline-offset-2 transition-colors hover:decoration-text"
                  >
                    {isExpanded ? "Show less" : "Show more..."}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-text/10 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={startEdit}
              disabled={loading}
              iconLeft={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              iconLeft={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Delete
            </Button>
          </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
