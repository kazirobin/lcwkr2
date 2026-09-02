import connectDB from "@/lib/db";
import Todo from "@/features/todos/models";

export async function listTodos() {
  await connectDB();
  return Todo.find({}).sort({ createdAt: -1 });
}

export async function createTodo(title: string) {
  await connectDB();
  return Todo.create({ title: title.trim() });
}

export async function updateTodo(
  id: string,
  patch: { completed?: boolean; title?: string },
) {
  await connectDB();
  return Todo.findByIdAndUpdate(
    id,
    {
      ...(patch.completed !== undefined && { completed: patch.completed }),
      ...(patch.title !== undefined && { title: patch.title.trim() }),
    },
    { new: true },
  );
}

export async function deleteTodo(id: string) {
  await connectDB();
  return Todo.findByIdAndDelete(id);
}
