import { redirect } from "next/navigation";

/**
 * /admin/admissions — folded into /admin/registrations.
 *
 * This page listed students whose `registrationStatus` was "Pending". But
 * approving a ৳500 registration already creates the student as Approved, so in
 * normal use this queue is always empty and the screen is a second place to
 * look for something that is decided elsewhere. The intake review lives in one
 * place now.
 */
export default function AdminAdmissionsPage() {
  redirect("/admin/registrations");
}
