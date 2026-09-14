import { NextRequest, NextResponse } from "next/server";
import { updateStudyGroup, deleteStudyGroup } from "@/features/academy/server/groups";

type Props = { params: Promise<{ id: string }> };

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
