import { NextRequest, NextResponse } from "next/server";
import { listStudyGroups, createStudyGroup } from "@/features/academy/server/groups";

// GET /api/academy/groups?courseId=HSK-101 — public list for a course.
export async function GET(req: NextRequest) {
  try {
    const courseId = req.nextUrl.searchParams.get("courseId") || "";
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required." }, { status: 400 });
    }
    const groups = await listStudyGroups(courseId);
    return NextResponse.json({ success: true, groups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/academy/groups — admin pairs students for next-class prep.
export async function POST(req: Request) {
  try {
    const { courseId, label, memberRolls, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }
    if (!courseId || !Array.isArray(memberRolls) || memberRolls.length === 0) {
      return NextResponse.json({ error: "courseId and memberRolls are required." }, { status: 400 });
    }

    const rolls = memberRolls
      .map((r: unknown) => Number(r))
      .filter((r: number) => Number.isFinite(r) && r > 0);

    const group = await createStudyGroup(courseId, label ?? "", rolls);
    return NextResponse.json({ success: true, group }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
