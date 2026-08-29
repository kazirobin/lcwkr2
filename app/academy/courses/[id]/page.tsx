import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers } from "lucide-react";
import { academyData } from "@/data/academy"; // 👈 লোকাল ডাটা

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailsPage({ params }: Props) {
  const { id } = await params;
  
  // 👈 API এর বদলে লোকাল এরে থেকে কোর্স খোঁজা
  const course = academyData.courses.find(c => c.courseId === id);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/academy/courses" className="text-xs text-text/60 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </Link>

        <div className="p-6 rounded-3xl bg-text/5 border border-text/10 space-y-4">
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
            {course.status}
          </span>
          <h1 className="text-2xl font-bold">{course.courseName}</h1>
          <p className="text-sm font-mono text-secondary">Course Code: {course.courseId}</p>
          
          <div className="flex gap-4 text-xs text-text/60 pt-2 border-t border-text/10">
            <p>Target: <b>{course.targetLevel}</b></p>
            <p>Lessons: <b>{course.totalLessons}</b></p>
            <p>Total Classes: <b>{course.totalClassesPlanned}</b></p>
          </div>
        </div>

        {/* ক্লাস হিস্টোরি */}
        <div className="space-y-3">
          <h3 className="font-bold flex items-center gap-2"><Layers className="w-4 h-4"/> Class Log History</h3>
          {course.classes?.length === 0 ? (
            <p className="text-xs text-text/40">No classes have been logged yet.</p>
          ) : (
            <div className="space-y-2">
              {course.classes?.map(cls => (
                <div key={cls.classId} className="p-4 rounded-xl border border-text/10 bg-background text-sm flex justify-between">
                  <div>
                    <p className="font-bold text-secondary text-xs">{cls.classId}</p>
                    <p className="mt-1">{cls.contentCovered?.summary}</p>
                  </div>
                  <div className="text-right text-xs text-text/50 font-mono">
                    <p>{cls.date}</p>
                    <p>{cls.presentStudents.length} Present</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}