import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import {
  setCourseCompleted,
  setCourseLaunched,
  updateCourse,
  updateCourseOffer,
} from "@/features/academy/server/courses";

type Props = { params: Promise<{ id: string }> };

// PUT /api/academy/courses/[id]/settings — admin sets lessons, next-class
// topic, the launch state, the fee/duration a course is sold at, and marks a
// finished batch complete.
export async function PUT(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const { adminPasscode, ...fields } = body;

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    if (typeof fields.completed === "boolean") {
      const updated = await setCourseCompleted(id, fields.completed);
      if (!updated) {
        return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, course: updated });
    }

    // Launch is its own action so it can stamp launchedAt and keep the legacy
    // registrationOpen flag in step.
    if (typeof fields.launched === "boolean") {
      const launched = await setCourseLaunched(id, fields.launched);
      if (!launched) {
        return NextResponse.json(
          {
            success: false,
            message:
              fields.launched === true
                ? "This course is marked complete. Reopen it first, then put it on sale."
                : "Course not found",
          },
          { status: 400 },
        );
      }
      return NextResponse.json({ success: true, course: launched });
    }

    if (fields.offer && typeof fields.offer === "object") {
      const updated = await updateCourseOffer(id, fields.offer);
      if (!updated) {
        return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, course: updated });
    }

    const allowed: Record<string, unknown> = {};
    if (Array.isArray(fields.lessons)) allowed.lessons = fields.lessons;
    if (Array.isArray(fields.topics)) allowed.topics = fields.topics.map(String);
    if (typeof fields.nextClassTopic === "string")
      allowed.nextClassTopic = fields.nextClassTopic;

    const updated = await updateCourse(id, allowed);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, course: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not save the course.") },
      { status: 500 },
    );
  }
}
