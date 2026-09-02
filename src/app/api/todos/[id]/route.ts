import { NextResponse } from "next/server";
import { updateTodo, deleteTodo } from "@/features/todos/server/todos";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { completed, title } = await req.json();

    const updatedTodo = await updateTodo(id, { completed, title });

    if (!updatedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/todos/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedTodo = await deleteTodo(id);

    if (!deletedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/todos/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete todo" }, { status: 500 });
  }
}
