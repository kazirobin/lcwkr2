import { redirect } from "next/navigation";

/**
 * /admin/enrollments — folded into /admin/courses.
 *
 * Approving, rejecting and deleting a course enrollment is a question about one
 * course, so it is answered on that course's own page. Adding a student
 * directly — cash payment, or an older batch — moved there too, so the whole
 * enrollment story for a course is a single dialog. This URL keeps working for
 * any bookmark, and sends the admin where the work now is.
 */
export default function AdminEnrollmentsPage() {
  redirect("/admin/courses");
}
