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

  return (
    <div className="bg-[#202124] border border-[#5f6368] hover:border-slate-300 rounded-lg p-4 flex flex-col justify-between gap-3 shadow-sm transition group">
      <div className="flex flex-col gap-3">
        {/* Admin-only Fields (at the top when editing) */}
        {isEditing && (
          <div className="flex flex-col gap-2 pb-2 border-b border-[#3c4043]">
            <div>
              <label className="text-[10px] text-amber-400 font-semibold uppercase">
                Title 2 (Admin Only)
              </label>
              <input
                type="text"
                value={title2}
                onChange={(e) => setTitle2(e.target.value)}
                placeholder="Secondary detail"
                className="w-full bg-[#171717] border border-[#5f6368] px-2 py-1 rounded text-xs text-slate-100 mt-0.5 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-amber-400 font-semibold uppercase">
                Student Name (Admin Only)
              </label>
              <input
                type="text"
                value={studentsName}
                onChange={(e) => setStudentsName(e.target.value)}
                placeholder="Student name"
                className="w-full bg-[#171717] border border-[#5f6368] px-2 py-1 rounded text-xs text-slate-100 mt-0.5 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* Display Admin Fields if they exist and not editing */}
        {!isEditing && (todo.title2 || todo.studentsName) && (
          <div className="flex flex-col text-xs text-slate-400 pb-2 border-b border-[#3c4043] gap-1">
            {todo.title2 && (
              <span>
                <strong className="text-slate-300">Detail:</strong> {todo.title2}
              </span>
            )}
            {todo.studentsName && (
              <span>
                <strong className="text-slate-300">Student:</strong> {todo.studentsName}
              </span>
            )}
          </div>
        )}

        {/* Main Note Text (Now placed at the bottom/last) */}
        {isEditing ? (
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#171717] border border-[#5f6368] px-2 py-1 rounded text-sm text-slate-100 w-full focus:outline-none focus:border-amber-400 resize-y min-h-[60px]"
          />
        ) : (
          <span
            className={`text-sm font-medium whitespace-pre-wrap break-words ${
              completed ? "line-through text-slate-500" : "text-slate-100"
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#3c4043]/50 mt-auto">
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
          className="w-4 h-4 accent-amber-500 rounded bg-[#171717] border-[#5f6368] cursor-pointer"
        />

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1 rounded text-xs font-semibold"
            >
              Done
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-400 hover:text-red-300 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}