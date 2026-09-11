"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  X,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { AdminShell } from "@/features/academy";

interface Donation {
  _id: string;
  name: string;
  phone: string;
  location: string;
  trxId: string;
  amount: number;
}

export default function AdminDonationsPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    trxId: "",
    amount: 200,
  });

  // donation goal (site setting)
  const [target, setTarget] = useState<string>("5000");
  const [targetLoading, setTargetLoading] = useState(true);
  const [targetSaving, setTargetSaving] = useState(false);
  const [targetMsg, setTargetMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const fetchTarget = useCallback(async () => {
    try {
      const res = await fetch("/api/donations/target", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && typeof data.target === "number") setTarget(String(data.target));
    } catch {
      /* fall back to default */
    } finally {
      setTargetLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchTarget());
  }, [fetchTarget]);

  const saveTarget = async () => {
    const value = Number(target);
    if (!Number.isFinite(value) || value <= 0) {
      setTargetMsg({ ok: false, text: "Target must be a positive number." });
      return;
    }
    setTargetSaving(true);
    setTargetMsg(null);
    try {
      const res = await fetch("/api/donations/target", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: value, adminPasscode: process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTarget(String(data.target));
        setTargetMsg({ ok: true, text: "Target updated — the donate page shows the new goal instantly." });
      } else {
        setTargetMsg({ ok: false, text: data.error || "Failed to update target." });
      }
    } catch {
      setTargetMsg({ ok: false, text: "Network error while saving." });
    } finally {
      setTargetSaving(false);
    }
  };

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/donations", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && Array.isArray(data.donations)) {
        setDonations(data.donations);
      } else {
        setDonations([]);
        setApiError(data.error || "Failed to load donations");
      }
    } catch (err) {
      console.error("Failed to load donations:", err);
      setApiError("Network error or server unreachable");
      setDonations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchDonations());
  }, [fetchDonations]);

  const totalAmount = Array.isArray(donations)
    ? donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
    : 0;

  const targetNum = Number(target) || 0;

  const handleResetForm = () => {
    setEditingId(null);
    setFormData({ name: "", phone: "", location: "", trxId: "", amount: 200 });
  };

  const handleEditClick = (donor: Donation) => {
    setEditingId(donor._id);
    setFormData({
      name: donor.name,
      phone: donor.phone,
      location: donor.location,
      trxId: donor.trxId,
      amount: donor.amount,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch("/api/donations", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        handleResetForm();
        await fetchDonations();
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert("Invalid record ID");
      return;
    }

    if (!confirm("Are you sure you want to delete this donation record?")) return;

    try {
      const res = await fetch(`/api/donations?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setDonations((prev) => prev.filter((d) => d._id !== id));
      } else {
        alert(data.error || "Failed to delete record");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting record");
    }
  };

  return (
    <AdminShell
      title={t("অনুদান ব্যবস্থাপনা", "Donation records")}
      crumb={t("অনুদান", "Donations")}
      seal="捐"
      lede={t(
        "অনুদান পরিচালনা করুন, বিকাশ TrxID ট্র্যাক করুন ও দাতার তথ্য হালনাগাদ করুন।",
        "Manage donations, track bKash TrxIDs, and update contributor details."
      )}
    >
      <div className="space-y-8">
        {/* Goal progress + stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "মোট সংগৃহীত / Total raised", value: `৳${totalAmount.toLocaleString()}`, tone: "text-ok" },
            { label: "টার্গেট / Target", value: `৳${targetNum.toLocaleString()}`, tone: "text-primary" },
            {
              label: "অগ্রগতি / Progress",
              value: `${targetNum > 0 ? Math.min(100, Math.round((totalAmount / targetNum) * 100)) : 0}%`,
              tone: "text-primary",
            },
            {
              label: "টার্গেট পূরণ / Filled",
              value: `${targetNum > 0 ? Math.floor(totalAmount / targetNum) : 0} বার`,
              tone: "text-ok",
            },
            {
              label: "চলতি রাউন্ডে বাকি / Left",
              value:
                totalAmount > 0 && targetNum > 0 && totalAmount % targetNum === 0
                  ? "পূরণ! 🎉"
                  : `৳${(targetNum > 0 ? targetNum - (totalAmount % targetNum) : 0).toLocaleString()}`,
              tone: "text-warn",
            },
          ].map((tile) => (
            <div key={tile.label} className="rounded-2xl border border-text/10 bg-card p-4 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text/50">
                {tile.label}
              </p>
              <p className={`mt-1.5 font-mono text-lg font-bold tabular-nums ${tile.tone}`}>
                {tile.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-text/10 bg-card/60 p-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-text/10">
            <div
              className="h-full rounded-full bg-secondary transition-all duration-700 ease-out"
              style={{
                width: `${targetNum > 0 ? Math.min(100, Math.round((totalAmount / targetNum) * 100)) : 0}%`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-text/50">
            {donations.length} {t("টি রেকর্ড", "records")}
          </p>
        </div>

        {/* Donation goal editor */}
        <div className="p-6 rounded-3xl border border-primary/25 bg-primary/[0.05] space-y-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Donation Target (Goal)
          </h2>
          <p className="text-xs text-text/55">
            The goal shown on the public donate page progress bar. Changes go live immediately.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text/50">৳</span>
              <input
                type="number"
                min={1}
                value={target}
                disabled={targetLoading || targetSaving}
                onChange={(e) => {
                  setTarget(e.target.value);
                  setTargetMsg(null);
                }}
                className="w-44 rounded-xl border border-text/15 bg-card pl-8 pr-3.5 py-2.5 text-sm font-mono tabular-nums text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text disabled:opacity-60"
                aria-label="Donation target amount"
              />
            </div>
            <button
              type="button"
              onClick={saveTarget}
              disabled={targetLoading || targetSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-text px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-55"
            >
              {targetSaving ? "Saving..." : "Save target"}
            </button>
            {targetMsg && (
              <span className={`text-xs font-medium ${targetMsg.ok ? "text-ok" : "text-danger"}`} role="status">
                {targetMsg.text}
              </span>
            )}
          </div>
        </div>

        {/* Input / Edit Form */}
        <div className="p-6 rounded-3xl bg-text/5 border border-text/10 space-y-4 shadow-sm">
          <h2 className="text-base font-bold flex items-center gap-2">
            {editingId ? (
              <Pencil className="w-4 h-4 text-amber-500" />
            ) : (
              <Plus className="w-4 h-4 text-emerald-500" />
            )}
            {editingId ? "Edit Donor Details" : "Manually Add New Donation"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3"
          >
            <input
              type="text"
              required
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-background border border-text/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-secondary"
            />
            <input
              type="text"
              required
              placeholder="Phone (01XXXXXXXXX)"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="bg-background border border-text/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-secondary"
            />
            <input
              type="text"
              required
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="bg-background border border-text/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-secondary"
            />
            <input
              type="text"
              required
              placeholder="bKash TrxID"
              value={formData.trxId}
              onChange={(e) =>
                setFormData({ ...formData, trxId: e.target.value })
              }
              className="bg-background border border-text/10 rounded-xl px-3 py-2 text-sm uppercase outline-none focus:border-secondary"
            />
            <input
              type="number"
              required
              placeholder="Amount (Tk)"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              className="bg-background border border-text/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-secondary"
            />

            <div className="sm:col-span-2 md:col-span-5 flex gap-2 justify-end mt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 border border-text/10 rounded-xl text-xs font-bold hover:bg-text/5 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-secondary hover:opacity-90 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                {editingId ? "Update Donor" : "Save Record"}
              </button>
            </div>
          </form>
        </div>

        {/* Data Table */}
        <div className="bg-text/5 border border-text/10 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-secondary" />
              <p className="text-xs text-text/50">Fetching donation logs...</p>
            </div>
          ) : apiError ? (
            <div className="p-8 text-center text-sm text-danger space-y-2">
              <p>{apiError}</p>
              <button
                onClick={fetchDonations}
                className="text-xs underline text-text/60 hover:text-text"
              >
                Try refreshing
              </button>
            </div>
          ) : donations.length === 0 ? (
            <div className="p-8 text-center text-sm text-text/50">
              No donor records available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-text/5 text-xs text-text/60 border-b border-text/10 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="p-4">Donor Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">TrxID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/5">
                  {donations.map((donor) => (
                    <tr
                      key={donor._id || donor.trxId}
                      className="hover:bg-text/[0.02] transition"
                    >
                      <td className="p-4 font-semibold">{donor.name}</td>
                      <td className="p-4 text-xs font-mono text-text/70 flex items-center gap-1.5 pt-5">
                        <Phone className="w-3.5 h-3.5 text-text/40" />
                        {donor.phone}
                      </td>
                      <td className="p-4 text-xs text-text/70">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-text/40" />
                          {donor.location}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono font-bold text-secondary">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 opacity-60" />
                          {donor.trxId}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-bold text-emerald-600">
                        ৳{donor.amount}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => handleEditClick(donor)}
                            className="p-1.5 border border-text/10 rounded-lg hover:bg-text/10 text-amber-500 transition"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(donor._id)}
                            className="p-1.5 border border-text/10 rounded-lg hover:bg-rose-500/10 text-rose-500 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}