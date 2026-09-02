import { NextResponse } from "next/server";
import { seedAcademyFromStaticData } from "@/features/academy/server/sync";

export async function GET() {
  try {
    await seedAcademyFromStaticData();

    return NextResponse.json({
      success: true,
      message: "Database seeded with static data successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
