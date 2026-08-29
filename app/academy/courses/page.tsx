import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { academyData } from "@/data/academy"; // 👈 লোকাল ডাটা
import CourseCard from "@/components/academy/CourseCard"; // যদি আপনার কম্পোনেন্ট থাকে

export default function CoursesListPage() {
  const { courses } = academyData;

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-secondary" /> Academy Courses
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div key={course.courseId} className="p-5 border border-text/10 bg-text/5 rounded-2xl">
               <h3 className="font-bold text-lg">{course.courseName}</h3>
               <p className="text-xs font-mono text-secondary mt-1">{course.courseId}</p>
               <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded mt-2 inline-block">
                 Status: {course.status}
               </span>
               <Link href={`/academy/courses/${course.courseId}`} className="block text-xs mt-4 underline text-text/60 hover:text-text">
                 View Details
               </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}