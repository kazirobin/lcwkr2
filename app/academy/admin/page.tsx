"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  UserCheck, 
  BookOpenCheck, 
  Layers, 
  MessageSquare, 
  ArrowLeft, 
  RefreshCw, 
  DownloadCloud,
  ArrowRight,
  LogOut,
  Loader2,
  Languages
} from "lucide-react";

const ADMIN_SECRET_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const [stats, setStats] = useState({
    pendingStudents: 0,
    approvedStudents: 0,
    pendingClasses: 0,
    courses: 0,
    chineseWords: 0,
  });
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // MongoDB থেকে পরিসংখ্যান লোড
  const fetchStats = async () => {
    setLoading(true);
    try {
      const [pendingStuRes, approvedStuRes, logRes, crsRes, wordsRes] = await Promise.all([
        fetch("/api/academy/students?status=Pending", { cache: "no-store" }),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }),
        fetch("/api/academy/classes/pending", { cache: "no-store" }),
        fetch("/api/academy/courses", { cache: "no-store" }),
        fetch("/api/chinese-words", { cache: "no-store" }),
      ]);

      const [pStu, aStu, logs, crs, words] = await Promise.all([
        pendingStuRes.json(),
        approvedStuRes.json(),
        logRes.json(),
        crsRes.json(),
        wordsRes.json(),
      ]);

      setStats({
        pendingStudents: pStu.students?.length || 0,
        approvedStudents: aStu.students?.length || 0,
        pendingClasses: logs.pendingClasses?.length || 0,
        courses: crs.courses?.length || 0,
        chineseWords: words.data?.length || 0,
      });
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // ১. পেজ লোড হলেই localStorage থেকে পাসকোড রিড করে Auto Login করা
  useEffect(() => {
    const savedPin = localStorage.getItem("academy_admin_pin");
    if (savedPin && savedPin.trim() === ADMIN_SECRET_PASSCODE.trim()) {
      setIsAuthenticated(true);
      sessionStorage.setItem("academy_admin_unlocked", "true");
      fetchStats();
    }
    setCheckingAuth(false);
  }, []);

  // ২. ম্যানুয়াল লগইন এবং localStorage-এ সংরক্ষণ
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_SECRET_PASSCODE.trim()) {
      localStorage.setItem("academy_admin_pin", passcode.trim());
      sessionStorage.setItem("academy_admin_unlocked", "true");
      setIsAuthenticated(true);
      fetchStats();
    } else {
      alert("Invalid Admin Passcode!");
    }
  };

  // ৩. লগআউট হ্যান্ডলার (localStorage ক্লিয়ার করা)
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out from Admin Console?")) {
      localStorage.removeItem("academy_admin_pin");
      sessionStorage.removeItem("academy_admin_unlocked");
      setIsAuthenticated(false);
      setPasscode("");
    }
  };

  const handleSyncToFile = async () => {
    const savedPin = localStorage.getItem("academy_admin_pin") || passcode;
    if (!confirm("Overwrite local .ts files with MongoDB live data?")) return;
    setSyncing(true);
    try {
      const res = await fetch(`/api/academy/sync-to-file?pin=${savedPin}`);
      const data = await res.json();
      if (data.success) {
        alert("✅ Synced Successfully!");
      } else {
        alert(data.message || "Sync failed");
      }
    } catch (err) {
      alert("Failed to sync database.");
    } finally {
      setSyncing(false);
    }
  };

  // অথেন্টিকেশন চেক চলাকালীন লোডার
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-mono text-text/50">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  // পাসকোড ফর্ম
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-6 bg-text/5 border border-text/10 rounded-3xl space-y-4 text-center shadow-xl">
          <ShieldCheck className="w-12 h-12 text-secondary mx-auto" />
          <h2 className="text-xl font-bold">Admin Portal Login</h2>
          <p className="text-xs text-text/50">PIN will be saved locally for auto-login.</p>
          <input
            type="password"
            autoFocus
            placeholder="Enter Admin PIN"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-background border border-text/10 rounded-xl p-3 text-center text-sm font-mono tracking-widest focus:outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/academy")}
              className="flex-1 py-2.5 bg-text/5 border border-text/10 rounded-xl text-sm font-bold cursor-pointer hover:bg-text/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-sm shadow-md cursor-pointer transition-all"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    );
  }

  const adminModules = [
    {
      title: "Pending Admissions",
      desc: "Review, approve or reject student registration requests",
      count: stats.pendingStudents,
      icon: UserCheck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      link: "/academy/admin/admissions",
    },
    {
      title: "WhatsApp & Course Track",
      desc: "Verify group join status, transfer courses, or remove students",
      count: stats.approvedStudents,
      icon: MessageSquare,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      link: "/academy/admin/students",
    },
    {
      title: "Class Logs Approval",
      desc: "Review and approve daily attendance sessions submitted by teachers",
      count: stats.pendingClasses,
      icon: BookOpenCheck,
      color: "text-secondary",
      bg: "bg-secondary/10",
      link: "/academy/admin/class-logs",
    },
    {
      title: "Manage Course Tracks",
      desc: "Create new courses, edit batch schedules, and delete class history",
      count: stats.courses,
      icon: Layers,
      color: "text-primary",
      bg: "bg-primary/10",
      link: "/academy/admin/courses",
    },
    {
      title: "Chinese Core Words",
      desc: "Add, edit, or remove core characters and build vocabulary families",
      count: stats.chineseWords,
      icon: Languages,
      color: "text-red-500",
      bg: "bg-red-500/10",
      link: "/academy/admin/chinese-words",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8 space-y-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-text/10 pb-5">
          <div>
            <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1 mb-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-secondary" /> Academy Admin Console
            </h1>
            <span className="text-[11px] font-mono text-emerald-500 font-semibold">● Auto-Logged In (MongoDB Live)</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncToFile}
              disabled={syncing}
              className="px-3.5 py-2 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 transition-all"
            >
              <DownloadCloud className={`w-3.5 h-3.5 ${syncing ? "animate-bounce" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync DB to Local .ts"}</span>
            </button>

            <button
              onClick={fetchStats}
              className="p-2 bg-text/5 hover:bg-text/10 border border-text/10 rounded-xl text-xs cursor-pointer transition-colors"
              title="Refresh Live Metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 rounded-xl text-xs cursor-pointer transition-all"
              title="Log Out & Clear Saved PIN"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modular Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminModules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.link}
                href={m.link}
                className="p-6 rounded-3xl bg-text/5 border border-text/10 hover:border-text/20 hover:bg-text/[0.07] transition-all flex flex-col justify-between space-y-4 group shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-2xl ${m.bg} ${m.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-background border border-text/10">
                    {m.count} Records
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-text/50 mt-1">{m.desc}</p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-primary pt-2 border-t border-text/10">
                  <span>Open Control Panel</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}