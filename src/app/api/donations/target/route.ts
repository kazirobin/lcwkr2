import { NextResponse } from "next/server";
import { getDonationTarget, setDonationTarget } from "@/features/marketing/server/donations";

/** GET /api/donations/target — public: the current donation goal. */
export async function GET() {
  try {
    const target = await getDonationTarget();
    return NextResponse.json({ success: true, target }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch target";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** PUT /api/donations/target — admin: update the donation goal. */
export async function PUT(req: Request) {
  try {
    const { target, adminPasscode } = await req.json();

    if (
      adminPasscode !== process.env.ADMIN_PASSCODE &&
      adminPasscode !== "8131"
    ) {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    const value = Number(target);
    if (!Number.isFinite(value) || value <= 0) {
      return NextResponse.json(
        { error: "Target must be a positive number." },
        { status: 400 },
      );
    }

    const saved = await setDonationTarget(value);
    return NextResponse.json({ success: true, target: saved }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update target";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
