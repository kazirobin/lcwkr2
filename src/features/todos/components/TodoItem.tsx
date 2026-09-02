"use client";

import { TodoItem as TodoType } from "@/features/todos/types";

interface TodoItemProps {
  todo: TodoType;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-700 hover:border-slate-600 transition">
      <label className="flex items-center gap-3 cursor-pointer flex-1 mr-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id, todo.completed)}
          className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
        />
        <span className={`text-sm select-none ${todo.completed ? "line-through text-slate-400" : "text-slate-100"}`}>
          {todo.title}
        </span>
      </label>
      <button
        onClick={() => onDelete(todo._id)}
        aria-label={`Delete task ${todo.title}`}
        className="text-slate-400 hover:text-red-400 text-sm p-1 rounded transition cursor-pointer"
      >
        ✕
      </button>
    </li>
  );
}