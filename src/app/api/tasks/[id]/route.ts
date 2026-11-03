import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/features/todos/models/Task";
import Student from "@/features/academy/models/Student";

export const dynamic = "force-dynamic";

async function getUserIdFromRequest(req: Request): Promise<string | null> {
  const phone = req.headers.get("x-user-phone");
  if (!phone) return null;
  
  await connectDB();
  const student = await Student.findOne({ whatsapp: phone }).lean();
  return student ? student._id.toString() : null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, description, labels, photo, completed } = await req.json();

    await connectDB();
    const task = await Task.findOne({ _id: id, userId });
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (labels !== undefined) task.labels = Array.isArray(labels) ? labels : [];
    if (photo !== undefined) task.photo = photo;
    if (completed !== undefined) task.completed = completed;

    await task.save();

    return NextResponse.json(
      {
        _id: task._id.toString(),
        userId: task.userId.toString(),
        title: task.title,
        description: task.description,
        labels: task.labels,
        photo: task.photo,
        completed: task.completed,
        createdAt: task.createdAt?.toISOString(),
        updatedAt: task.updatedAt?.toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();
    const task = await Task.findOneAndDelete({ _id: id, userId });
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}