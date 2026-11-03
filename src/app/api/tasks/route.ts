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

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 }).lean();
    
    const formatted = tasks.map((task) => ({
      _id: task._id.toString(),
      userId: task.userId.toString(),
      title: task.title,
      description: task.description,
      labels: task.labels,
      photo: task.photo,
      completed: task.completed,
      createdAt: task.createdAt?.toISOString(),
      updatedAt: task.updatedAt?.toISOString(),
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, labels, photo } = await req.json();
    
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await connectDB();
    const newTask = await Task.create({
      userId,
      title: title.trim(),
      description: description?.trim() || "",
      labels: Array.isArray(labels) ? labels : [],
      photo: photo || null,
      completed: false,
    });

    return NextResponse.json(
      {
        _id: newTask._id.toString(),
        userId: newTask.userId.toString(),
        title: newTask.title,
        description: newTask.description,
        labels: newTask.labels,
        photo: newTask.photo,
        completed: newTask.completed,
        createdAt: newTask.createdAt?.toISOString(),
        updatedAt: newTask.updatedAt?.toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}