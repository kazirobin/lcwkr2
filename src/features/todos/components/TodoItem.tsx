"use client";

import { useState } from "react";
import { TodoItem } from "../types";
import { updateTodo, deleteTodo } from "../server/todos";

interface Props {
  todo: TodoItem;
  passcode: string;
  onUpdate: (updated: TodoItem) => void;
  onDelete: (id: string) => void;
  onError: (msg: string) => void;
}

export default function TodoItemComponent({
  todo,
  passcode,
  onUpdate,
  onDelete,
  onError,
}: Props) {
  const [title, setTitle] = useState(todo.title);
  const [title2, setTitle2] = useState(todo.title2 || "");
  const [studentsName, setStudentsName] = useState(todo.studentsName || "");
  const [completed, setCompleted] = useState(todo.completed);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Collapse/Expand state
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      onError("");
      const updated = await updateTodo(
        todo._id,
        { title, title2, studentsName, completed },
        passcode
      );
      onUpdate(updated);
      setIsEditing(false);
    } catch (err: any) {
      onError(err.message || "Failed to update note.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    try {
      setLoading(true);
      onError("");
      await deleteTodo(todo._id, passcode);
      onDelete(todo._id);
    } catch (err: any) {
      onError(err.message || "Admin passcode required to delete.");
    } finally {
      setLoading(false);
    }
  };

  // Check if text is long enough to warrant collapsing (e.g., more than 120 characters or has line breaks)
  const isLongText = todo.title.length > 120 || todo.title.split("\n").length > 3;

  return (
    <div className="bg-card border border-border hover:border-primary/50 rounded-lg p-4 flex flex-col justify-between gap-3 shadow-sm transition">
      <div className="flex flex-col gap-3">
        {/* Admin-only Fields (Side by side when editing) */}
        {isEditing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-border">
            <div>
              <label className="text-[10px] text-primary font-semibold uppercase">
                Title 2 (Admin Only)
              </label>
              <input
                type="text"
                value={title2}
                onChange={(e) => setTitle2(e.target.value)}
                placeholder="Secondary detail"
                className="w-full bg-background border border-border px-2 py-1 rounded text-xs text-text mt-0.5 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-[10px] text-primary font-semibold uppercase">
                Student Name (Admin Only)
              </label>
              <input
                type="text"
                value={studentsName}
                onChange={(e) => setStudentsName(e.target.value)}
                placeholder="Student name"
                className="w-full bg-background border border-border px-2 py-1 rounded text-xs text-text mt-0.5 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* Display Admin Fields Side by Side if they exist and not editing */}
        {!isEditing && (todo.title2 || todo.studentsName) && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted pb-2 border-b border-border">
            {todo.title2 && (
              <span>
                <strong className="text-text">Detail:</strong> {todo.title2}
              </span>
            )}
            {todo.studentsName && (
              <span>
                <strong className="text-text">Student:</strong> {todo.studentsName}
              </span>
            )}
          </div>
        )}

        {/* Main Note Text with Collapse / Expand Logic */}
        {isEditing ? (
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background border border-border px-2 py-1 rounded text-sm text-text w-full focus:outline-none focus:border-primary resize-y min-h-[80px]"
          />
        ) : (
          <div className="flex flex-col gap-1">
            <span
              className={`text-sm font-medium whitespace-pre-wrap break-words ${
                completed ? "line-through text-muted" : "text-text"
              } ${!isExpanded && isLongText ? "line-clamp-3" : ""}`}
            >
              {todo.title}
            </span>

            {/* Show More / Show Less Button */}
            {isLongText && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-primary hover:underline self-start font-medium mt-1 focus:outline-none"
              >
                {isExpanded ? "Show Less" : "Show More..."}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
        <input
          type="checkbox"
          checked={completed}
          onChange={async (e) => {
            const val = e.target.checked;
            setCompleted(val);
            try {
              const updated = await updateTodo(
                todo._id,
                { completed: val },
                passcode
              );
              onUpdate(updated);
            } catch (err: any) {
              onError(err.message);
            }
          }}
          className="w-4 h-4 accent-primary rounded bg-background border-border cursor-pointer"
        />

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:opacity-90 px-3 py-1 rounded text-xs font-semibold"
            >
              Done
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-muted hover:text-text px-2 py-1 rounded text-xs font-medium transition"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="text-danger hover:opacity-80 px-2 py-1 rounded text-xs font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}