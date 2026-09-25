import { NextResponse } from "next/server";
import { getBuiltinDialogue, getBuiltinDialogueSource } from "@/features/hw/data/dialogues";

// GET /api/hw/dialogue?level=1&lesson=2 → built-in listening script.
// Source: HSK-1 everyday scripts, else the lesson's textbook dialogue.
// Responses are cached by the SW api handler, so they work offline
// after the first online visit.
export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const level = Number(params.get("level"));
    const lesson = Number(params.get("lesson"));
    if (!Number.isFinite(level) || level < 1 || !Number.isFinite(lesson) || lesson < 1) {
      return NextResponse.json({ success: false, error: "Invalid level/lesson." }, { status: 400 });
    }
    const lines = getBuiltinDialogue(level, lesson);
    if (!lines) {
      return NextResponse.json({ success: true, lines: [], source: null });
    }
    return NextResponse.json({
      success: true,
      lines,
      source: getBuiltinDialogueSource(level, lesson),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
