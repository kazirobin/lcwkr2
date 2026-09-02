import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Todo from "@/features/todos/models/Todo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    return NextResponse.json(todos, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/todos error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    await connectDB();
    const newTodo = await Todo.create({ title: title.trim() });
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/todos error:", error);
    return NextResponse.json({ error: error.message || "Failed to create todo" }, { status: 500 });
  }
}