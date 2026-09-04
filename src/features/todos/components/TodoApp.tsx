"use client";

import { useState, useEffect, useRef } from "react";
import { TodoItem } from "../types";
import { listTodos, createTodo } from "../server/todos";
import TodoItemComponent from "./TodoItem";

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listTodos()
      .then(setTodos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTitle(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      setError("");
      const created = await createTodo(newTitle);
      setTodos([created, ...todos]);
      setNewTitle("");
      setIsExpanded(false);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (err: any) {
      setError(err.message || "Failed to create note.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#202124] border border-[#5f6368] rounded-lg px-4 py-3 shadow-md">
        <span className="text-xl font-semibold text-amber-400 tracking-wide">Keep Notes</span>
        <input
          type="password"
          placeholder="Admin Passcode (For Delete & Admin fields)..."
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="bg-[#171717] border border-[#5f6368] text-xs text-slate-200 px-3 py-1.5 rounded-md focus:outline-none focus:border-amber-400 w-72"
        />
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* Create Note Box (No Password Required) */}
      <form
        onSubmit={handleCreate}
        className="bg-[#202124] border border-[#5f6368] rounded-lg shadow-lg p-3 transition-all flex flex-col gap-2"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Take a note..."
          value={newTitle}
          onFocus={() => setIsExpanded(true)}
          onChange={handleInput}
          className="bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none px-2 py-1 resize-none overflow-hidden"
        />
        {isExpanded && (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3c4043]">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-xs text-slate-300 hover:bg-[#3c4043] px-3 py-1.5 rounded font-medium"
            >
              Close
            </button>
            <button
              type="submit"
              className="text-xs bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded font-semibold transition"
            >
              Save Note
            </button>
          </div>
        )}
      </form>

      {/* Notes Grid */}
      {loading ? (
        <p className="text-center text-slate-500 text-sm py-8">Loading notes...</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-slate-500 text-sm py-8">No notes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {todos.map((todo) => (
            <TodoItemComponent
              key={todo._id}
              todo={todo}
              passcode={passcode}
              onUpdate={(updated) =>
                setTodos(todos.map((t) => (t._id === updated._id ? updated : t)))
              }
              onDelete={(id) => setTodos(todos.filter((t) => t._id !== id))}
              onError={(msg) => setError(msg)}
            />
          ))}
        </div>
      )}
    </div>
  );
}