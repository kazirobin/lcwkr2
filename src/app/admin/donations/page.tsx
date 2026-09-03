"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  HeartHandshake,
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

interface Donation {
  _id: string;
  name: string;
  phone: string;
  location: string;
  trxId: string;
  amount: number;
}

export default function AdminDonationsPage() {
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
    fetchDonations();
  }, [fetchDonations]);

  const totalAmount = Array.isArray(donations)
    ? donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
    : 0;

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
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-text/10 pb-5">
          <div>
            <Link
              href="/admin"
              className="text-xs text-text/50 hover:underline flex items-center gap-1 mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Console
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-secondary" /> Manage Donors & Contributions
            </h1>
          </div>
          <div className="flex gap-3">
            <div className="text-xs font-mono bg-text/5 border border-text/10 px-4 py-2 rounded-xl">
              Total Raised:{" "}
              <span className="font-bold text-emerald-500">
                ৳{totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="text-xs font-mono bg-text/5 border border-text/10 px-4 py-2 rounded-xl">
              Records:{" "}
              <span className="font-bold text-secondary">
                {donations.length}
              </span>
            </div>
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
    </div>
  );
}