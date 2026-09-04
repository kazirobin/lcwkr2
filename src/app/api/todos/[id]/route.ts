import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/features/todos/models/Todo";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { completed, title, title2, studentsName, passcode } = await req.json();

    await connectDB();

    const existingTodo = await Todo.findById(id);
    if (!existingTodo) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if user is attempting to modify admin-only fields (title2 or studentsName)
    const changingTitle2 = title2 !== undefined && title2 !== (existingTodo.title2 || "");
    const changingStudent = studentsName !== undefined && studentsName !== (existingTodo.studentsName || "");

    if ((changingTitle2 || changingStudent) && passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json(
        { error: "Admin passcode required to modify Title 2 or Students Name." },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (completed !== undefined) updateData.completed = completed;
    if (title !== undefined) updateData.title = title;

    // Only update admin fields if passcode matches
    if (passcode === process.env.ADMIN_PASSCODE) {
      if (title2 !== undefined) updateData.title2 = title2;
      if (studentsName !== undefined) updateData.studentsName = studentsName;
    }

    const updated = await Todo.findByIdAndUpdate(id, updateData, { new: true }).lean();

    return NextResponse.json(
      {
        _id: (updated as any)._id.toString(),
        title: (updated as any).title,
        title2: (updated as any).title2 || "",
        studentsName: (updated as any).studentsName || "",
        completed: !!(updated as any).completed,
        createdAt: (updated as any).createdAt?.toISOString(),
        updatedAt: (updated as any).updatedAt?.toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { passcode } = await req.json();

    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ error: "Invalid admin passcode. Only admin can delete." }, { status: 403 });
    }

    await connectDB();
    const deleted = await Todo.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}