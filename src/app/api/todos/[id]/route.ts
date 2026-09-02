import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Todo from "@/features/todos/models";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { completed, title } = await req.json();
    await connectDB();

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        ...(completed !== undefined && { completed }),
        ...(title !== undefined && { title: title.trim() }),
      },
      { new: true }
    );

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
    await connectDB();

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/todos/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete todo" }, { status: 500 });
  }
}