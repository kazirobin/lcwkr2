"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Eye, EyeOff, Megaphone, Trash2 } from "lucide-react";
import { useLanguage } from "@/i18n";
import {
  Button,
  Card,
  EmptyState,
  Field,
  IconButton,
  LoadingBlock,
  SectionHanzi,
  SelectField,
  TextArea,
  useToast,
} from "@/components/ui";
import { AdminShell } from "@/features/academy/components/admin/AdminShell";

/**
 * Notices shown across the top of the site.
 *
 * Launching a course posts one automatically, so this page is mostly for
 * writing the rest — a new batch date, a free class weekend, a fee change — and
 * for hiding something that has served its purpose.
 */

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";
const WHATSAPP_NUMBER = "8801787881334";

type Row = {
  id: string;
  key: string;
  title: string;
  body: string;
  href: string;
  courseId?: string;
  tone: "info" | "success" | "warning";
  active: boolean;
  dismissible: boolean;
  createdAt: string;
};

const EMPTY = { key: "", title: "", body: "", href: "", tone: "info" as Row["tone"] };

export default function AdminAnnouncementsPage() {
  const { language } = useLanguage();
  const toast = useToast();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [rows, setRows] = useState<Row[] | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/announcements?scope=all", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setRows(data.announcements ?? []);
      else setRows([]);
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) void load();
    });
    return () => {
      alive = false;
    };
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: form.key.trim() || `manual-${Date.now()}`,
          title: form.title,
          body: form.body,
          href: form.href,
          tone: form.tone,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(data.error || t("সংরক্ষণ হয়নি।", "Save failed."), "error");
        return;
      }
      toast(t("ঘোষণা প্রকাশিত হয়েছে।", "Announcement published."), "success");
      setForm(EMPTY);
      void load();
    } catch {
      toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (row: Row) => {
    setBusy(row.id);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: row.active ? "HIDE" : "ACTIVE",
          id: row.id,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(data.error || t("কাজটি হয়নি।", "That did not work."), "error");
        return;
      }
      void load();
    } catch {
      toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (row: Row) => {
    setBusy(row.id);
    try {
      const res = await fetch(
        `/api/announcements?id=${encodeURIComponent(row.id)}&passcode=${encodeURIComponent(ADMIN_PASSCODE)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(data.error || t("মুছে ফেলা যায়নি।", "Could not delete it."), "error");
        return;
      }
      toast(t("ঘোষণা মুছে ফেলা হয়েছে।", "Announcement removed."), "success");
      void load();
    } catch {
      toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
    } finally {
      setBusy(null);
    }
  };

  /** Copy a row's text so it can be dropped into a WhatsApp group. */
  const share = async (row: Row) => {
    const text = `📢 *${row.title}*\n${row.body ? `\n${row.body}\n` : ""}\nhttps://lcwkr.vercel.app${row.href || "/"}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    try {
      await navigator.clipboard.writeText(text);
      toast(
        t("কপি হয়েছে — WhatsApp-এ পাঠিয়ে দিন।", "Copied — paste it into your group."),
        "success",
      );
    } catch {
      /* the WhatsApp window is enough */
    }
  };

  return (
    <AdminShell
      title={t("ঘোষণা", "Announcements")}
      crumb={t("ঘোষণা", "Announcements")}
      seal="报"
      lede={t(
        "সাইটের উপরে যে ব্যানার দেখাবে। কোর্স চালু করলে এখানে নিজে থেকেই একটি ব্যানার তৈরি হয়।",
        "The banner across the top of the site. Launching a course creates one here automatically.",
      )}
    >
      <SectionHanzi char="报" className="-top-16 right-4" />

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        {/* Existing notices */}
        <div>
          <h2 className="font-serif text-lg font-medium text-text">
            {t("প্রকাশিত ঘোষণা", "Published notices")}
          </h2>
          {rows === null ? (
            <div className="mt-4">
              <LoadingBlock label={t("তথ্য আসছে…", "Loading…")} />
            </div>
          ) : rows.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title={t("কোনো ঘোষণা নেই", "No notices yet")}
                description={t(
                  "একটি কোর্স চালু করলে এখানে ব্যানার তৈরি হবে।",
                  "Launch a course and a banner will appear here.",
                )}
                icon={<Megaphone className="size-5" />}
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {rows.map((row) => (
                <li key={row.id}>
                  <Card
                    className={`p-4 ${row.active ? "" : "opacity-60"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text">{row.title}</p>
                        {row.body && (
                          <p className="mt-0.5 text-[13px] leading-snug text-text/65">
                            {row.body}
                          </p>
                        )}
                        <p className="mt-1 font-mono text-[10px] text-text/40">
                          {row.key} ·{" "}
                          {new Date(row.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                          {row.courseId ? ` · ${row.courseId}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <IconButton
                          label={t("WhatsApp-এ পাঠান", "Share on WhatsApp")}
                          size="sm"
                          onClick={() => share(row)}
                        >
                          <Copy className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          label={row.active ? t("লুকান", "Hide") : t("দেখান", "Show")}
                          size="sm"
                          disabled={busy === row.id}
                          onClick={() => toggle(row)}
                        >
                          {row.active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </IconButton>
                        <IconButton
                          label={t("মুছুন", "Delete")}
                          size="sm"
                          disabled={busy === row.id}
                          onClick={() => remove(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                    <p className="mt-2 text-[10px] text-text/40">
                      {row.active
                        ? t("সবার পেজে দেখা যাচ্ছে", "Showing to everyone")
                        : t("লুকানো আছে", "Hidden")}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* New notice */}
        <form onSubmit={save} className="space-y-3">
          <h2 className="font-serif text-lg font-medium text-text">
            {t("নতুন ঘোষণা", "New notice")}
          </h2>
          <Field
            label={t("শিরোনাম", "Title")}
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextArea
            label={t("বিবরণ", "Details")}
            rows={3}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
          <Field
            label={t("লিংক (ঐচ্ছিক)", "Link (optional)")}
            value={form.href}
            onChange={(e) => setForm({ ...form, href: e.target.value })}
            placeholder="/academy#courses"
          />
          <SelectField
            label={t("ধরন", "Tone")}
            value={form.tone}
            onChange={(e) => setForm({ ...form, tone: e.target.value as Row["tone"] })}
          >
            <option value="success">{t("সবুজ — ভালো খবর", "Green — good news")}</option>
            <option value="info">{t("নীল — তথ্য", "Blue — information")}</option>
            <option value="warning">{t("লাল — জরুরি", "Red — urgent")}</option>
          </SelectField>
          <Button type="submit" size="sm" disabled={saving} className="w-full">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              {saving ? t("প্রকাশ হচ্ছে…", "Publishing…") : t("প্রকাশ করুন", "Publish")}
            </span>
          </Button>
          <p className="text-[11px] leading-relaxed text-text/50">
            {t(
              `ঘোষণা প্রকাশ করলে সাইটের উপরে সবার জন্য দেখাবে। WhatsApp নম্বর: ${WHATSAPP_NUMBER}`,
              `Publishing shows the banner to everyone. WhatsApp: ${WHATSAPP_NUMBER}`,
            )}
          </p>
        </form>
      </div>
    </AdminShell>
  );
}
