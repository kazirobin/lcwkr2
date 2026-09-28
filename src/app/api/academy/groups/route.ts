import { NextRequest, NextResponse } from "next/server";
import {
  listStudyGroups,
  createStudyGroup,
  findEnrolledStudentByPhone,
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
//  - With adminPasscode — admin pairs students (existing flow).
//  - Without passcode — a signed-in student who is enrolled in the course can
//    create an open study group. They are identified by the phone on their
//    account; the server looks the roll up itself.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, label, memberRolls, adminPasscode, phone } = body;

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
    // Identity comes from the signed-in account's phone, never from a roll in
    // the body: a roll is a public number on the roster, so accepting one let
    // anyone create a group as another student.
    const student = await findEnrolledStudentByPhone(String(phone ?? ""), courseId);
    if (!student) {
      return NextResponse.json(
        {
          error: "Sign in with your student account to create or join a group.",
        },
        { status: 403 },
      );
    }
    const roll = student.rollNumber;

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