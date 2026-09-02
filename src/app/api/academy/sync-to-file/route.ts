import { NextResponse } from "next/server";
import { syncAcademyDataToFiles } from "@/features/academy/server/sync";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get("pin");

    // অ্যাডমিন সিকিউরিটি চেক
    if (pin !== "8131" && pin !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ success: false, message: "Unauthorized PIN" }, { status: 401 });
    }

    const counts = await syncAcademyDataToFiles();

    return NextResponse.json({
      success: true,
      message: "Successfully fetched from MongoDB and written to local .ts files!",
      counts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
