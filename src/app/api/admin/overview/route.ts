import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { messageOf } from "@/lib/api-error";
import { Course, CourseEnrollment, ProSubscription, Student } from "@/features/academy/models";
import { ProTrial, StudentSession } from "@/features/analytics/models";

/**
 * GET /api/admin/overview — every number the admin chrome needs, in one request.
 *
 * The quick-access bar used to fire eight separate fetches on every /admin page,
 * and each one counted by pulling a whole collection into memory and taking
 * `Array.length` of it. On a school with a few hundred students that is several
 * hundred documents transferred to render a row of pills.
 *
 * These are counts only — no names, no phone numbers — so there is nothing
 * personal in the response and nothing to gate.
 */
export async function GET() {
  try {
    await connectDB();

    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const now = new Date();

    const [
      totalStudents,
      pendingStudents,
      approvedStudents,
      courses,
      pendingEnrollments,
      approvedEnrollments,
      pendingPro,
      proStudents,
      activeTrials,
      loginsToday,
      onlineNow,
      everLoggedIn,
    ] = await Promise.all([
      Student.countDocuments({}),
      Student.countDocuments({ registrationStatus: "Pending" }),
      Student.countDocuments({ registrationStatus: "Approved" }),
      Course.countDocuments({}),
      CourseEnrollment.countDocuments({ status: "Pending" }),
      CourseEnrollment.countDocuments({ status: "Approved" }),
      ProSubscription.countDocuments({ status: "Pending" }),
      // `isPro` is the flag the admin actually flips, and it is what the site
      // checks. The subscription row is the paper trail; this is the switch.
      Student.countDocuments({ isPro: true }),
      ProTrial.countDocuments({ expiresAt: { $gt: now }, revokedAt: null }),
      StudentSession.countDocuments({ loginAt: { $gte: midnight } }),
      StudentSession.countDocuments({ active: true }),
      StudentSession.distinct("whatsapp", { whatsapp: { $nin: ["", null] } }).then(
        (d) => d.length,
      ),
    ]);

    return NextResponse.json({
      success: true,
      counts: {
        totalStudents,
        pendingStudents,
        approvedStudents,
        courses,
        pendingEnrollments,
        approvedEnrollments,
        pendingPro,
        // One number for "can open the paid content": whoever has the switch
        // turned on, plus whoever is inside a live preview. Two half-truths on
        // one badge would be worse than the one number the admin acts on.
        proMembers: proStudents + activeTrials,
        proStudents,
        activeTrials,
        loginsToday,
        onlineNow,
        everLoggedIn,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not load the admin overview.") },
      { status: 500 },
    );
  }
}
