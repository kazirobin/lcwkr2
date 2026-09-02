import { NextResponse } from "next/server";
import { seedCoreWords } from "@/features/chinese-words/server/seed";

export async function POST() {
  try {
    const { count, result } = await seedCoreWords();

    return NextResponse.json({
      success: true,
      message: `${count} core words processed successfully!`,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to seed data" },
      { status: 500 }
    );
  }
}
