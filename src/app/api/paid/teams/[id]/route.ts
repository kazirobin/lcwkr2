import { NextResponse } from "next/server";
import { isAdminPasscode } from "@/lib/admin-guard";
import { deletePaidTeam, updatePaidTeam } from "@/features/paid/server/paid-teams";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!isAdminPasscode((body as { passcode?: unknown }).passcode)) {
      return NextResponse.json(
        { error: "Invalid admin passcode. Only admin can manage teams." },
        { status: 403 }
      );
    }
    const result = await updatePaidTeam(id, body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.team, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { passcode } = await req.json();
    if (!isAdminPasscode(passcode)) {
      return NextResponse.json(
        { error: "Invalid admin passcode. Only admin can delete a team." },
        { status: 403 }
      );
    }
    const result = await deletePaidTeam(id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
