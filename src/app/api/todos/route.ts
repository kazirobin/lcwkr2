import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/features/todos/models/Todo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find({}).sort({ createdAt: -1 }).lean();
    const formatted = todos.map((todo: any) => ({
      _id: todo._id.toString(),
      title: todo.title,
      title2: todo.title2 || "",
      studentsName: todo.studentsName || "",
      completed: !!todo.completed,
      createdAt: todo.createdAt?.toISOString(),
      updatedAt: todo.updatedAt?.toISOString(),
    }));
    return NextResponse.json(formatted, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await connectDB();
    const newTodo = await Todo.create({ title, completed: false });
    
    return NextResponse.json(
      {
        _id: newTodo._id.toString(),
        title: newTodo.title,
        title2: newTodo.title2 || "",
        studentsName: newTodo.studentsName || "",
        completed: !!newTodo.completed,
        createdAt: newTodo.createdAt?.toISOString(),
        updatedAt: newTodo.updatedAt?.toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}