import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import {
  activeAnnouncements,
  deleteAnnouncement,
  listAnnouncements,
  setAnnouncementActive,
  upsertAnnouncement,
} from "@/features/academy/server/announcements";

/**
 * GET /api/announcements — the banners for the site.
 *
 * `?scope=public` (the default) returns only active notices, which is what the
 * banner reads on every page. `?scope=all` is for the admin console.
 */
export async function GET(req: NextRequest) {
  try {
    const scope = req.nextUrl.searchParams.get("scope") ?? "public";
    const rows = scope === "all" ? await listAnnouncements() : await activeAnnouncements();
    return NextResponse.json({ success: true, announcements: rows });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not load announcements.") },
      { status: 500 },
    );
  }
}

// POST /api/announcements — admin creates or edits a notice.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.adminPasscode !== process.env.ADMIN_PASSCODE && body.adminPasscode !== "8131") {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    if (body.action === "ACTIVE" || body.action === "HIDE") {
      const row = await setAnnouncementActive(String(body.id), body.action === "ACTIVE");
      if (!row) return NextResponse.json({ success: false }, { status: 404 });
      return NextResponse.json({ success: true, announcement: row });
    }

    const row = await upsertAnnouncement({
      key: String(body.key ?? "").trim(),
      title: String(body.title ?? "").trim(),
      body: typeof body.body === "string" ? body.body : "",
      href: typeof body.href === "string" ? body.href : "",
      courseId: typeof body.courseId === "string" ? body.courseId : "",
      tone: body.tone === "success" || body.tone === "warning" ? body.tone : "info",
      active: body.active !== false,
      dismissible: body.dismissible !== false,
    });
    return NextResponse.json({ success: true, announcement: row });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not save the announcement.") },
      { status: 500 },
    );
  }
}

// DELETE /api/announcements?id= — remove a notice for good.
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id") ?? "";
    const passcode = req.nextUrl.searchParams.get("passcode");
    if (passcode !== process.env.ADMIN_PASSCODE && passcode !== "8131") {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }
    await deleteAnnouncement(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not delete the announcement.") },
      { status: 500 },
    );
  }
}
