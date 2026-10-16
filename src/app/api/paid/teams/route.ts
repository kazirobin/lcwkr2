import { NextResponse } from "next/server";
import { isAdminPasscode } from "@/lib/admin-guard";
import { createPaidTeam, listPaidTeams } from "@/features/paid/server/paid-teams";

export const dynamic = "force-dynamic";

// GET /api/paid/teams — every team, resolved to captain and member names.
// Public: students may see who is a captain and who is under them.
export async function GET() {
  try {
    return NextResponse.json(await listPaidTeams());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load teams";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!isAdminPasscode((body as { passcode?: unknown }).passcode)) {
      return NextResponse.json(
        { error: "Invalid admin passcode. Only admin can manage teams." },
        { status: 403 }
      );
    }
    const result = await createPaidTeam(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.team, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
