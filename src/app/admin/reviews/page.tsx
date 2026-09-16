"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, MessageSquareQuote, Pencil, RefreshCw, Star, Trash2, X } from "lucide-react";
import { AdminShell } from "@/features/academy";
import { useLanguage } from "@/i18n";
import {
  Button,
  Card,
  Dialog,
  Eyebrow,
  Field,
  IconButton,
  LoadingBlock,
  StatusPill,
  TextArea,
} from "@/components/ui";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

type Review = {
  _id: string;
  name: string;
  mobile: string;
  location: string;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: string;
};

export default function AdminReviewsPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [eName, setEName] = useState("");
  const [eMobile, setEMobile] = useState("");
  const [eLocation, setELocation] = useState("");
  const [eMessage, setEMessage] = useState("");
  const [eRating, setERating] = useState(5);
  const [eApproved, setEApproved] = useState(false);
  const [editBusy, setEditBusy] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/reviews?all=1", { cache: "no-store" }).then((r) => r.json());
      if (res.success && Array.isArray(res.reviews)) setReviews(res.reviews);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const setApproved = async (id: string, approved: boolean) => {
    setBusyId(id);
    try {
      await fetch(`/api/academy/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved, adminPasscode: ADMIN_PASSCODE }),
      });
      await fetchAll();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm(t("এই রিভিউটি মুছে ফেলবেন?", "Delete this review?"))) return;
    setBusyId(id);
    try {
      await fetch(`/api/academy/reviews/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPasscode: ADMIN_PASSCODE }),
      });
      await fetchAll();
    } finally {
      setBusyId(null);
    }
  };

  const openEdit = (r: Review) => {
    setEditing(r);
    setEName(r.name); setEMobile(r.mobile); setELocation(r.location);
    setEMessage(r.message); setERating(r.rating || 5); setEApproved(r.approved);
    setEditOpen(true);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setEditBusy(true);
    try {
      await fetch(`/api/academy/reviews/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: eName, mobile: eMobile, location: eLocation,
          message: eMessage, rating: eRating, approved: eApproved,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      setEditOpen(false);
      await fetchAll();
    } finally {
      setEditBusy(false);
    }
  };

  const visible = reviews.filter((r) =>
    filter === "all" ? true : filter === "approved" ? r.approved : !r.approved,
  );

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <AdminShell
      title={t("রিভিউ মডারেশন", "Review moderation")}
      crumb={t("রিভিউ", "Reviews")}
      seal="评"
      lede={t(
        "ব্যবহারকারীদের জমা দেওয়া রিভিউ অনুমোদন, এডিট বা মুছে ফেলুন।",
        "Approve, edit, or delete reviews submitted by users.",
      )}
      actions={
        <IconButton label={t("রিফ্রেশ", "Refresh")} size="sm" spinning={loading} onClick={fetchAll}>
          <RefreshCw className="h-4 w-4" />
        </IconButton>
      }
    >
      <div className="flex items-center gap-2">
        <Eyebrow seal="评" label={t("মোট রিভিউ", "Total reviews")} detail={`${reviews.length}`} />
        <span className="ml-auto text-xs font-medium text-warn">
          {t("অনুমোদনের অপেক্ষায়", "Awaiting approval")}: {pendingCount}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-text/15 bg-card text-text/70 hover:border-text/30"
            }`}
          >
            {f === "all" ? t("সব", "All") : f === "pending" ? t("অপেক্ষমাণ", "Pending") : t("অনুমোদিত", "Approved")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6">
          <LoadingBlock label={t("রিভিউ লোড হচ্ছে", "Loading reviews")} rows={3} />
        </div>
      ) : visible.length === 0 ? (
        <Card className="mt-6 p-10 text-center text-sm text-text/55">
          {t("কোনো রিভিউ নেই।", "No reviews here.")}
        </Card>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((r) => (
            <li key={r._id}>
              <Card className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-text">{r.name}</h3>
                      <StatusPill tone={r.approved ? "done" : "pending"}>
                        {r.approved ? t("অনুমোদিত", "Approved") : t("অপেক্ষমাণ", "Pending")}
                      </StatusPill>
                    </div>
                    <p className="mt-0.5 text-xs text-text/45">
                      {[r.location, r.mobile].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={n <= (r.rating || 0) ? "h-3.5 w-3.5 text-warn" : "h-3.5 w-3.5 text-text/15"}
                        fill={n <= (r.rating || 0) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-text/80">{r.message}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-text/10 pt-3">
                  {r.approved ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setApproved(r._id, false)}
                      disabled={busyId === r._id}
                    >
                      <X className="h-3.5 w-3.5" /> {t("অপ্রকাশিত করুন", "Unpublish")}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setApproved(r._id, true)}
                      disabled={busyId === r._id}
                    >
                      <Check className="h-3.5 w-3.5" /> {t("অনুমোদন করুন", "Approve")}
                    </Button>
                  )}
                  <IconButton label={t("এডিট", "Edit")} size="sm" onClick={() => openEdit(r)}>
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label={t("মুছুন", "Delete")}
                    size="sm"
                    disabled={busyId === r._id}
                    onClick={() => remove(r._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={t("রিভিউ এডিট", "Edit review")}
        size="md"
      >
        <form onSubmit={saveEdit} className="space-y-4">
          <Field label={t("নাম", "Name")} value={eName} onChange={(e) => setEName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("মোবাইল", "Mobile")} value={eMobile} onChange={(e) => setEMobile(e.target.value)} />
            <Field label={t("অবস্থান", "Location")} value={eLocation} onChange={(e) => setELocation(e.target.value)} />
          </div>
          <Field label={t("রেটিং", "Rating")} type="number" min={0} max={5} value={String(eRating)} onChange={(e) => setERating(Number(e.target.value))} />
          <TextArea label={t("রিভিউ", "Review")} value={eMessage} onChange={(e) => setEMessage(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-text/70">
            <input
              type="checkbox"
              checked={eApproved}
              onChange={(e) => setEApproved(e.target.checked)}
              className="h-4 w-4 rounded border-text/30"
            />
            {t("অনুমোদিত / প্রকাশিত", "Approved / published")}
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setEditOpen(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button type="submit" size="sm" loading={editBusy}>
              {t("সংরক্ষণ", "Save")}
            </Button>
          </div>
        </form>
      </Dialog>
    </AdminShell>
  );
}