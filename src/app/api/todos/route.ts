import { NextResponse } from "next/server";
import { listTodos, createTodo } from "@/features/todos/server/todos";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const todos = await listTodos();
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
    const newTodo = await createTodo(title);
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/todos error:", error);
    return NextResponse.json({ error: error.message || "Failed to create todo" }, { status: 500 });
  }
}
