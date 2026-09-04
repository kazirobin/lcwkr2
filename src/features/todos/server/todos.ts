import { TodoItem } from "../types";

export async function listTodos(): Promise<TodoItem[]> {
  const res = await fetch("/api/todos", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function createTodo(title: string): Promise<TodoItem> {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create note");
  return data;
}

export async function updateTodo(
  id: string,
  updates: { title?: string; title2?: string; studentsName?: string; completed?: boolean },
  passcode?: string
): Promise<TodoItem> {
  const res = await fetch(`/api/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...updates, passcode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update note");
  return data;
}

export async function deleteTodo(id: string, passcode: string): Promise<void> {
  const res = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passcode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete note");
}