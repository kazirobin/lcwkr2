"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck, RefreshCw } from "lucide-react";

const ADMIN_SECRET_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

export default function PendingAdmissionsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/students?status=Pending", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setStudents(data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (rollNumber: number, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/academy/students/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, action, adminPasscode: ADMIN_SECRET_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) fetchPending();
      else alert(data.message || "Failed action");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/academy/admin" className="text-xs text-text/50 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <button onClick={fetchPending} className="p-1.5 bg-text/5 border border-text/10 rounded-xl">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-primary" /> Pending Student Admissions ({students.length})
        </h1>

        {students.length === 0 ? (
          <p className="text-xs text-text/40 p-8 border border-text/10 rounded-3xl text-center bg-text/[0.02]">
            No pending admissions in database.
          </p>
        ) : (
          <div className="border border-text/10 rounded-3xl overflow-hidden bg-text/[0.01]">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-text/5 border-b border-text/10 text-text/60">
                <tr>
                  <th className="p-3.5">Candidate Name</th>
                  <th className="p-3.5">WhatsApp Number</th>
                  <th className="p-3.5">Target Track</th>
                  <th className="p-3.5 text-right">Approve / Reject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-text/10">
                {students.map((s) => (
                  <tr key={s.rollNumber} className="hover:bg-text/5">
                    <td className="p-3.5 font-bold text-text">{s.nameEnglish}</td>
                    <td className="p-3.5 font-mono text-primary font-bold">{s.whatsapp}</td>
                    <td className="p-3.5 font-mono text-secondary font-bold">
                      {s.enrolledCourseId || s.enrolledCourseIds?.[0]}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleAction(s.rollNumber, "APPROVE")}
                        className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(s.rollNumber, "REJECT")}
                        className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl font-bold"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}