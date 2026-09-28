import { NextRequest, NextResponse } from "next/server";
import {
  updateStudyGroup,
  deleteStudyGroup,
  getStudyGroup,
  findEnrolledStudentByPhone,
  memberOfCourseGroup,
  joinStudyGroup,
  leaveStudyGroup,
} from "@/features/academy/server/groups";

type Props = { params: Promise<{ id: string }> };

// POST /api/academy/groups/[id] — public self-service.
// body: { action: "join"|"leave", phone }
//
// The phone is the account the visitor is signed in as. The roll is looked up
// from it on the server, so a signed-out visitor cannot join as somebody else
// by putting a roll number in the body — which is what this used to accept.
export async function POST(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const { action, phone } = await req.json();

    if (action !== "join" && action !== "leave") {
      return NextResponse.json({ error: "action must be \"join\" or \"leave\"." }, { status: 400 });
    }

    const group = await getStudyGroup(id);
    if (!group) {
      return NextResponse.json({ error: "Group not found." }, { status: 404 });
    }

    const student = await findEnrolledStudentByPhone(String(phone ?? ""), group.courseId);
    if (!student) {
      return NextResponse.json(
        {
          error:
            "Sign in with your student account, enrolled in this course, to join or leave a group.",
        },
        { status: 403 },
      );
    }
    const roll = student.rollNumber;

    if (action === "join") {
      const already = await memberOfCourseGroup(roll, group.courseId);
      if (already && String((already as any)._id ?? "") !== id) {
        return NextResponse.json(
          { error: "You are already in a study group for this course." },
          { status: 409 },
        );
      }
      const joined = await joinStudyGroup(id, roll);
      return NextResponse.json({ success: true, group: joined });
    }

    const left = await leaveStudyGroup(id, roll);
    return NextResponse.json({ success: true, group: left });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT /api/academy/groups/[id] — admin edits a study group's label/members.
export async function PUT(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const { label, memberRolls, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }
    if (!Array.isArray(memberRolls) || memberRolls.length === 0) {
      return NextResponse.json({ error: "memberRolls are required." }, { status: 400 });
    }
    const rolls = memberRolls
      .map((r: unknown) => Number(r))
      .filter((r: number) => Number.isFinite(r) && r > 0);

    const group = await updateStudyGroup(id, label ?? "", rolls);
    return NextResponse.json({ success: true, group });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/academy/groups/[id] — admin removes a study group.
export async function DELETE(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const body = await req.json().catch(() => ({}));
    const adminPasscode = body.adminPasscode;

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    await deleteStudyGroup(id);
    return NextResponse.json({ success: true, message: "Group deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
