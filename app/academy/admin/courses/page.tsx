"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Layers, PlusCircle, Edit3, Trash2, RefreshCw, X } from "lucide-react";

const ADMIN_SECRET_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    targetLevel: "HSK 1",
    status: "Coming Soon",
    startDate: "",
    nextBatchRegistrationDate: "",
    totalLessons: 15,
    totalClassesPlanned: 24,
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/courses", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setCourses(data.courses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/academy/courses/${formData.courseId}` : "/api/academy/courses";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        fetchCourses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm(`Delete course ${id}?`)) return;
    try {
      const res = await fetch(`/api/academy/courses/${id}`, { method: "DELETE" });
      if (res.ok) fetchCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteClass = async (courseId: string, classId: string) => {
    if (!confirm(`Delete ${classId} from ${courseId}?`)) return;
    try {
      const res = await fetch("/api/academy/classes/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, classId, adminPasscode: ADMIN_SECRET_PASSCODE }),
      });
      if (res.ok) fetchCourses();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8 space-y-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/academy/admin" className="text-xs text-text/50 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  courseId: "",
                  courseName: "",
                  targetLevel: "HSK 1",
                  status: "Coming Soon",
                  startDate: "",
                  nextBatchRegistrationDate: "",
                  totalLessons: 15,
                  totalClassesPlanned: 24,
                });
                setShowModal(true);
              }}
              className="px-3 py-1.5 bg-primary text-background font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Course
            </button>
            <button onClick={fetchCourses} className="p-1.5 bg-text/5 border border-text/10 rounded-xl">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary" /> Manage Courses & Live Cohorts ({courses.length})
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course.courseId} className="p-5 rounded-3xl bg-text/5 border border-text/10 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-secondary mr-2">{course.courseId}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-text/5 border border-text/10">{course.status}</span>
                    <h3 className="font-bold text-base mt-1">{course.courseName}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setFormData(course);
                        setShowModal(true);
                      }}
                      className="p-1.5 text-text/60"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCourse(course.courseId)} className="p-1.5 text-secondary">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Classes Sub-list */}
              <div className="space-y-1.5 pt-2 border-t border-text/10">
                <span className="text-[10px] font-mono text-text/50 uppercase">Classes Done ({course.classes?.length || 0}):</span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {(course.classes || []).map((cls: any) => (
                    <div key={cls.classId} className="p-2 rounded-xl bg-background border border-text/10 flex justify-between items-center text-[11px]">
                      <span className="truncate">{cls.classId} - {cls.contentCovered?.summary}</span>
                      <button onClick={() => handleDeleteClass(course.courseId, cls.classId)} className="text-secondary p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-background border border-text/10 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-text/10 pb-3">
              <h3 className="text-lg font-bold">{isEditing ? "Edit Course" : "Add Course"}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4 text-text/40" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                disabled={isEditing}
                placeholder="Course ID (e.g. HSK-101)"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full bg-text/5 border border-text/10 rounded-xl p-2.5 text-xs font-mono"
              />
              <input
                type="text"
                required
                placeholder="Course Name"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                className="w-full bg-text/5 border border-text/10 rounded-xl p-2.5 text-xs"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-background border border-text/10 rounded-xl p-2.5 text-xs font-bold"
              >
                <option value="Coming Soon">Coming Soon</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-text/5 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-secondary text-white font-bold rounded-xl text-xs">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}