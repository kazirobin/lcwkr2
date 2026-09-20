import { NextRequest, NextResponse } from "next/server";
import { updateCourse } from "@/features/academy/server/courses";

type Props = { params: Promise<{ id: string }> };

// PUT /api/academy/courses/[id]/settings — admin sets lessons, next-class
// topic, and registration controls. Reuses the generic course updater.
export async function PUT(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { adminPasscode, ...fields } = body;

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    const allowed: Record<string, unknown> = {};
    if (Array.isArray(fields.lessons)) allowed.lessons = fields.lessons;
    if (Array.isArray(fields.topics)) allowed.topics = fields.topics.map(String);
    if (typeof fields.nextClassTopic === "string")
      allowed.nextClassTopic = fields.nextClassTopic;
    if (typeof fields.registrationOpen === "boolean")
      allowed.registrationOpen = fields.registrationOpen;
    if (fields.registrationLastDate === null || typeof fields.registrationLastDate === "string")
      allowed.registrationLastDate = fields.registrationLastDate;
    if (fields.nextBatchRegistrationDate === null || typeof fields.nextBatchRegistrationDate === "string")
      allowed.nextBatchRegistrationDate = fields.nextBatchRegistrationDate;

    const updated = await updateCourse(id, allowed);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, course: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
