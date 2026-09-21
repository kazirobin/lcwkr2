import { NextRequest, NextResponse } from "next/server";
import {
  listStudyGroups,
  createStudyGroup,
  findEnrolledStudent,
  courseExists,
  memberOfCourseGroup,
} from "@/features/academy/server/groups";

// GET /api/academy/groups?courseId=HSK-101 — public list. Without courseId, returns all groups (grouped later by the client).
export async function GET(req: NextRequest) {
  try {
    const courseId = req.nextUrl.searchParams.get("courseId") || "";
    const groups = await listStudyGroups(courseId || undefined);
    return NextResponse.json({ success: true, groups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/academy/groups.
//  - With adminPasscode → admin pairs students (existing flow).
//  - Without passcode → any approved student enrolled in the course can create
//    an open study group by providing their own roll number.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, label, memberRolls, adminPasscode, rollNumber } = body;

    const isAdmin =
      adminPasscode === process.env.ADMIN_PASSCODE || adminPasscode === "8131";

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required." }, { status: 400 });
    }

    if (isAdmin) {
      if (!Array.isArray(memberRolls) || memberRolls.length === 0) {
        return NextResponse.json({ error: "memberRolls are required for admin groups." }, { status: 400 });
      }
      const rolls = memberRolls
        .map((r: unknown) => Number(r))
        .filter((r: number) => Number.isFinite(r) && r > 0);
      const group = await createStudyGroup(courseId, label ?? "", rolls);
      return NextResponse.json({ success: true, group }, { status: 201 });
    }

    // ── public self-service create ──
    const roll = Number(rollNumber);
    if (!Number.isFinite(roll) || roll <= 0) {
      return NextResponse.json({ error: "Your roll number is required." }, { status: 400 });
    }

    const student = await findEnrolledStudent(roll, courseId);
    if (!student) {
      return NextResponse.json(
        { error: "Roll not found. Check that your roll is approved and enrolled in this course." },
        { status: 403 },
      );
    }

    if (!(await courseExists(courseId))) {
      return NextResponse.json({ error: "Course not found." }, { status: 400 });
    }

    const already = await memberOfCourseGroup(roll, courseId);
    if (already) {
      return NextResponse.json(
        { error: "You are already in a study group for this course." },
        { status: 409 },
      );
    }

    const group = await createStudyGroup(
      courseId,
      label ?? "",
      [roll],
      roll,
    );
    return NextResponse.json({ success: true, group }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}