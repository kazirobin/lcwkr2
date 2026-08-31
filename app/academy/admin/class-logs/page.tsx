"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpenCheck, RefreshCw } from "lucide-react";

const ADMIN_SECRET_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

export default function PendingClassLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/classes/pending", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setLogs(data.pendingClasses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAction = async (logId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/academy/classes/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, action, adminPasscode: ADMIN_SECRET_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) fetchLogs();
      else alert(data.message || "Failed to update");
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
          <button onClick={fetchLogs} className="p-1.5 bg-text/5 border border-text/10 rounded-xl">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6 text-secondary" /> Pending Teacher Class Logs ({logs.length})
        </h1>

        {logs.length === 0 ? (
          <p className="text-xs text-text/40 p-8 border border-text/10 rounded-3xl text-center bg-text/[0.02]">
            No pending class logs in database.
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log._id} className="p-4 rounded-2xl bg-text/5 border border-text/10 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-secondary">{log.courseId} • {log.classId}</span>
                  <p className="text-xs font-semibold">{log.contentCovered?.summary}</p>
                  <span className="text-[11px] text-text/50">{log.date} • {log.time}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(log._id, "APPROVE")} className="px-3 py-1.5 bg-emerald-500 text-white font-bold text-xs rounded-xl">
                    Approve
                  </button>
                  <button onClick={() => handleAction(log._id, "REJECT")} className="px-3 py-1.5 bg-secondary/10 text-secondary font-bold text-xs rounded-xl">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}