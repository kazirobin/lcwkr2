"use client";

import { TodoItem as TodoType } from "@/features/todos/types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: TodoType[];
  loading: boolean;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, loading, onToggle, onDelete }: TodoListProps) {
  if (loading) {
    return <p className="text-center text-slate-400 text-sm py-4">Loading tasks...</p>;
  }

  if (todos.length === 0) {
    return <p className="text-center text-slate-400 text-sm py-4">No tasks yet. Create one!</p>;
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}