"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  MessageSquare, 
  RefreshCw, 
  XCircle, 
  CheckCircle2, 
  ArrowRightLeft, 
  Trash2,
  X 
} from "lucide-react";

const ADMIN_SECRET_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

export default function AdminStudentsControlPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupFilter, setGroupFilter] = useState<"all" | "joined" | "pending">("all");

  const [changingStudent, setChangingStudent] = useState<any | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stuRes, crsRes] = await Promise.all([
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }),
        fetch("/api/academy/courses", { cache: "no-store" }),
      ]);
      const stuData = await stuRes.json();
      const crsData = await crsRes.json();

      if (stuData.success) setStudents(stuData.students || []);
      if (crsData.success) setCourses(crsData.courses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleGroup = async (rollNumber: number, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/academy/students/toggle-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber,
          isWhatsAppGroupJoined: !currentStatus,
          adminPasscode: ADMIN_SECRET_PASSCODE,
        }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changingStudent || !selectedCourseId) return;

    setUpdating(true);
    try {
      const res = await fetch("/api/academy/students/change-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: Number(changingStudent.rollNumber),
          newCourseId: selectedCourseId,
          adminPasscode: ADMIN_SECRET_PASSCODE,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Course updated!");
        setChangingStudent(null);
        fetchData();
      } else {
        alert(data.message || "Failed to update course");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (rollNumber: number, name: string) => {
    if (!confirm(`Permanently delete Roll #${rollNumber} (${name})?`)) return;
    try {
      const res = await fetch("/api/academy/students/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, action: "DELETE", adminPasscode: ADMIN_SECRET_PASSCODE }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (groupFilter === "pending") return !s.isWhatsAppGroupJoined;
      if (groupFilter === "joined") return s.isWhatsAppGroupJoined;
      return true;
    });
  }, [students, groupFilter]);

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8 space-y-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/admin" className="text-xs text-text/50 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <button onClick={fetchData} className="p-1.5 bg-text/5 border border-text/10 rounded-xl">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-500" /> Student Verification & Tracks ({students.length})
          </h1>

          <div className="flex gap-1.5 p-1 bg-text/5 border border-text/10 rounded-xl text-xs">
            <button onClick={() => setGroupFilter("all")} className={`px-3 py-1 rounded-lg font-bold ${groupFilter === "all" ? "bg-background shadow-sm" : ""}`}>
              All ({students.length})
            </button>
            <button onClick={() => setGroupFilter("pending")} className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 ${groupFilter === "pending" ? "bg-amber-500 text-white" : ""}`}>
              <XCircle className="w-3.5 h-3.5" /> Not in Group
            </button>
            <button onClick={() => setGroupFilter("joined")} className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 ${groupFilter === "joined" ? "bg-emerald-600 text-white" : ""}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Joined
            </button>
          </div>
        </div>

        <div className="border border-text/10 rounded-3xl overflow-hidden bg-text/[0.01]">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="bg-text/5 border-b border-text/10 text-text/60">
              <tr>
                <th className="p-3.5 w-16">Roll</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Course Track</th>
                <th className="p-3.5">WhatsApp</th>
                <th className="p-3.5 text-center">Group Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text/10">
              {filtered.map((s) => {
                const track = s.enrolledCourseId || s.enrolledCourseIds?.[0] || "HSK-101";
                return (
                  <tr key={s.rollNumber} className="hover:bg-text/5">
                    <td className="p-3.5 font-mono font-bold text-secondary">#{s.rollNumber}</td>
                    <td className="p-3.5 font-bold text-text">{s.nameEnglish}</td>
                    <td className="p-3.5">
                      <span className="font-mono px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
                        {track}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-primary font-bold">{s.whatsapp}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleGroup(s.rollNumber, s.isWhatsAppGroupJoined)}
                        className={`px-3 py-1.5 rounded-xl font-bold ${
                          s.isWhatsAppGroupJoined ? "bg-text/10 text-text/60" : "bg-emerald-600 text-white"
                        }`}
                      >
                        {s.isWhatsAppGroupJoined ? "Set as Not in Group" : "Mark as Joined"}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setChangingStudent(s);
                          setSelectedCourseId(track);
                        }}
                        className="p-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl"
                        title="Change Track"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.rollNumber, s.nameEnglish)}
                        className="p-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Transfer Modal */}
      {changingStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background border border-text/10 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-text/10 pb-3">
              <h3 className="font-bold text-sm">Transfer Course Track</h3>
              <button onClick={() => setChangingStudent(null)}><X className="w-4 h-4 text-text/40" /></button>
            </div>
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-text/5 border border-text/10 rounded-xl p-3 text-xs font-semibold"
              >
                {courses.map((c) => (
                  <option key={c.courseId} value={c.courseId}>{c.courseId} - {c.courseName}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => setChangingStudent(null)} className="flex-1 py-2 bg-text/5 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="flex-1 py-2 bg-primary text-background font-bold rounded-xl text-xs">
                  {updating ? "Saving..." : "Save Track"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}