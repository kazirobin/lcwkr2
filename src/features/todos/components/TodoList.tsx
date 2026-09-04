"use client";

import { TodoItem as TodoType } from "@/features/todos/types";
import TodoItemComponent from "./TodoItem";

interface TodoListProps {
  todos: TodoType[];
  loading: boolean;
  passcode: string;
  onUpdate: (updated: TodoType) => void;
  onDelete: (id: string) => void;
  onError: (msg: string) => void;
}

export default function TodoList({
  todos,
  loading,
  passcode,
  onUpdate,
  onDelete,
  onError,
}: TodoListProps) {
  if (loading) {
    return <p className="text-center text-slate-400 text-sm py-4">Loading notes...</p>;
  }

  if (todos.length === 0) {
    return <p className="text-center text-slate-400 text-sm py-4">No notes yet. Create one!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {todos.map((todo) => (
        <TodoItemComponent
          key={todo._id}
          todo={todo}
          passcode={passcode}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onError={onError}
        />
      ))}
    </div>
  );
}