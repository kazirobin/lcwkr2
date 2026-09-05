"use client";

import { useState, useEffect, useRef } from "react";
import { TodoItem } from "../types";
import { listTodos, createTodo } from "../server/todos";
import TodoItemComponent from "./TodoItem";

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState<boolean>(true); // Ensure initial state is boolean
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listTodos()
      .then(setTodos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false)); // Properly set to false once fetched
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
    <div className="w-full flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3 shadow-md">
        <span className="text-xl font-semibold text-primary tracking-wide">Keep Notes</span>
        <input
          type="password"
          placeholder="Admin Passcode..."
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="bg-background border border-border text-xs text-text px-3 py-1.5 rounded-md focus:outline-none focus:border-primary w-56"
        />
      </div>

      {error && (
        <div className="bg-danger-surface border border-danger text-danger px-4 py-2 rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* Create Note Box */}
      <form
        onSubmit={handleCreate}
        className="bg-card border border-border rounded-lg shadow-lg p-3 transition-all flex flex-col gap-2"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Take a note..."
          value={newTitle}
          onFocus={() => setIsExpanded(true)}
          onChange={handleInput}
          className="bg-transparent text-text placeholder-muted text-sm focus:outline-none px-2 py-1 resize-none overflow-hidden"
        />
        {isExpanded && (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-xs text-muted hover:bg-border/50 px-3 py-1.5 rounded font-medium"
            >
              Close
            </button>
            <button
              type="submit"
              className="text-xs bg-primary text-primary-foreground hover:opacity-90 px-4 py-1.5 rounded font-semibold transition"
            >
              Save Note
            </button>
          </div>
        )}
      </form>

      {/* Notes Grid */}
      {/* Notes List (Stacked one by one vertically) */}
      {loading ? (
        <p className="text-center text-muted text-sm py-8">Loading notes...</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-muted text-sm py-8">No notes yet.</p>
      ) : (
        <div className="flex flex-col gap-3 max-w-xl mx-auto w-full">
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