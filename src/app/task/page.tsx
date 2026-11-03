"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth/context";
import Image from "next/image";

type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  labels: string[];
  photo: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  completed: boolean;
};

function cleanLabels(values: string[]): string[] {
  const seen = new Set<string>();
  return values
    .map((v) => v.trim())
    .filter((v) => v && !seen.has(v.toLowerCase()) && seen.add(v.toLowerCase()))
    .slice(0, 12);
}

function parseLabels(value: string): string[] {
  return cleanLabels(value.split(","));
}

async function uploadPhoto(file: File, phone: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "x-user-phone": phone },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Upload failed");
  }

  const data = await res.json();
  return data.url;
}

interface TaskListProps {
  todos: Task[];
  editingId: string | null;
  editTitle: string;
  editDescription: string;
  editLabels: string;
  editPhoto: string | null;
  language: string;
  t: (bn: string, en: string) => string;
  onToggleComplete: (id: string) => void;
  onStartEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: number) => void;
  onCancelEdit: () => void;
  onSaveEdit: (task: Task) => void;
  handlePhotoChange: (file: File | null, setter: (data: string | null) => void, fileSetter: (f: File | null) => void) => void;
  setEditPhoto: (data: string | null) => void;
  setEditPhotoFile: (f: File | null) => void;
}

interface TaskItemProps {
  todo: Task;
  editingId: string | null;
  editTitle: string;
  editDescription: string;
  editLabels: string;
  editPhoto: string | null;
  language: string;
  t: (bn: string, en: string) => string;
  onToggleComplete: (id: string) => void;
  onStartEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: number) => void;
  onCancelEdit: () => void;
  onSaveEdit: (task: Task) => void;
  handlePhotoChange: (file: File | null, setter: (data: string | null) => void, fileSetter: (f: File | null) => void) => void;
  setEditPhoto: (data: string | null) => void;
  setEditPhotoFile: (f: File | null) => void;
}

function TaskItem({
  todo,
  editingId,
  editTitle,
  editDescription,
  editLabels,
  editPhoto,
  language,
  t,
  onToggleComplete,
  onStartEdit,
  onDelete,
  onMove,
  onCancelEdit,
  onSaveEdit,
  handlePhotoChange,
  setEditPhoto,
  setEditPhotoFile,
}: TaskItemProps) {
  const isEditing = editingId === todo.id;

  if (isEditing) {
    return (
      <article
        key={todo.id}
        className={`flex items-start gap-3 p-4 border border-[#e9edf4] rounded-xl bg-white shadow-sm ${todo.completed ? "bg-[#fbfcfe]" : ""}`}
        data-id={todo.id}
        draggable
      >
        <input
          type="checkbox"
          className="w-5 h-5 mt-0.5 flex-shrink-0 accent-indigo-600 border-[#c5cedb] rounded cursor-pointer"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          aria-label={t(
            todo.completed ? "Mark active" : "Mark complete",
            todo.completed ? "Mark active" : "Mark complete",
          )}
        />
        <div className="flex-1 min-w-0">
          <div className="space-y-3 w-full">
            <input
              type="text"
              maxLength={180}
              value={editTitle}
              onChange={(e) => {}}
              placeholder="Task title"
              className="w-full border border-[#e1e6ef] bg-[#fbfcfe] text-[#172033] rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
              autoFocus
            />
            <textarea
              maxLength={1000}
              rows={2}
              value={editDescription}
              onChange={(e) => {}}
              placeholder="Description (optional)"
              className="w-full border border-[#e1e6ef] bg-[#fbfcfe] text-[#172033] rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition resize-y"
            />
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1 flex items-center gap-1">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null, setEditPhoto, setEditPhotoFile)}
                className="w-full border border-[#e1e6ef] bg-[#fbfcfe] text-[#172033] rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
              />
              {editPhoto && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={editPhoto} alt="Preview" className="w-28 h-20 object-cover border border-[#e8edf4] rounded-lg" />
                  <button
                    type="button"
                    onClick={() => { setEditPhoto(null); setEditPhotoFile(null); }}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Remove photo
                  </button>
                </div>
              )}
            </div>
            <input
              type="text"
              maxLength={240}
              value={editLabels}
              onChange={(e) => {}}
              placeholder="Labels separated by commas"
              className="w-full border border-[#e1e6ef] bg-[#fbfcfe] text-[#172033] rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-3 py-2 text-sm font-bold rounded-lg bg-[#f1f3f9] text-[#475569] hover:bg-[#e1e6ef] transition"
              >
                {t("Cancel", "Cancel")}
              </button>
              <button
                type="button"
                onClick={() => onSaveEdit(todo)}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                {t("Save changes", "Save changes")}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <button
            onClick={onCancelEdit}
            className="w-8 h-8 grid place-items-center rounded-lg text-[#788599] hover:bg-[#f1f4f9] hover:text-[#334155] transition"
            aria-label={t("Cancel", "Cancel")}
            title={t("Cancel", "Cancel")}
          >
            ×
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      key={todo.id}
      className={`flex items-start gap-3 p-4 border border-[#e9edf4] rounded-xl bg-white shadow-sm ${todo.completed ? "bg-[#fbfcfe]" : ""}`}
      data-id={todo.id}
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", todo.id); }}
      onDragOver={(e) => { if (!e.currentTarget.classList.contains("task-card")) return; e.preventDefault(); }}
      onDrop={(e) => {}}
      onDragEnd={() => {}}
    >
      <input
        type="checkbox"
        className="w-5 h-5 mt-0.5 flex-shrink-0 accent-indigo-600 border-[#c5cedb] rounded cursor-pointer"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id)}
        aria-label={t(
          todo.completed ? "Mark active" : "Mark complete",
          todo.completed ? "Mark active" : "Mark complete",
        )}
      />
      <div className="flex-1 min-w-0">
        <h2 className={`font-bold text-base leading-snug break-words ${todo.completed ? "text-[#9aa4b3] line-through" : "text-[#172033]"}`}>
          {todo.title}
        </h2>
        {todo.description && (
          <p className="mt-1 text-sm text-[#69778b] whitespace-pre-wrap break-words">
            {todo.description}
          </p>
        )}
        {todo.photo && (
          <img
            src={todo.photo}
            alt={`Photo attached to ${todo.title}`}
            className="mt-3 max-w-full max-h-[260px] object-contain border border-[#e8edf4] rounded-xl"
            loading="lazy"
          />
        )}
        {todo.labels.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {todo.labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-[#f0f2ff] text-indigo-700"
              >
                {label}
              </span>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-[#9aa4b3] text-right tabular-nums">
          {todo.createdAt
            ? new Date(todo.createdAt).toLocaleString(language === "bn" ? "bn-BD" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
            : t("Creation time not recorded", "Creation time not recorded")}
        </p>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={() => onStartEdit(todo)}
          className="w-8 h-8 grid place-items-center rounded-lg text-[#788599] hover:bg-[#f1f4f9] hover:text-[#334155] transition"
          aria-label={t("Edit task", "Edit task")}
          title={t("Edit task", "Edit task")}
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="w-8 h-8 grid place-items-center rounded-lg text-[#788599] hover:bg-[#fff1f1] hover:text-[#dc5252] transition"
          aria-label={t("Delete task", "Delete task")}
          title={t("Delete task", "Delete task")}
        >
          ×
        </button>
        <div className="flex flex-col gap-1 sm:hidden">
          <button
            onClick={() => onMove(todo.id, -1)}
            className="w-8 h-8 grid place-items-center rounded-lg text-[#788599] hover:bg-[#f1f4f9] hover:text-[#334155] transition"
            aria-label={t("Move up", "Move up")}
            title={t("Move up", "Move up")}
          >
            ↑
          </button>
          <button
            onClick={() => onMove(todo.id, 1)}
            className="w-8 h-8 grid place-items-center rounded-lg text-[#788599] hover:bg-[#f1f4f9] hover:text-[#334155] transition"
            aria-label={t("Move down", "Move down")}
            title={t("Move down", "Move down")}
          >
            ↓
          </button>
        </div>
      </div>
    </article>
  );
}

function TaskList({
  todos,
  editingId,
  editTitle,
  editDescription,
  editLabels,
  editPhoto,
  language,
  t,
  onToggleComplete,
  onStartEdit,
  onDelete,
  onMove,
  onCancelEdit,
  onSaveEdit,
  handlePhotoChange,
  setEditPhoto,
  setEditPhotoFile,
}: TaskListProps) {
  return (
    <>
      {todos.map((todo) => (
        <TaskItem
          key={todo.id}
          todo={todo}
          editingId={editingId}
          editTitle={editTitle}
          editDescription={editDescription}
          editLabels={editLabels}
          editPhoto={editPhoto}
          language={language}
          t={t}
          onToggleComplete={onToggleComplete}
          onStartEdit={onStartEdit}
          onDelete={onDelete}
          onMove={onMove}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          handlePhotoChange={handlePhotoChange}
          setEditPhoto={setEditPhoto}
          setEditPhotoFile={setEditPhotoFile}
        />
      ))}
    </>
  );
}

export default function TaskPage() {
  const { language } = useLanguage();
  const { student, checking } = useAccount();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [todos, setTodos] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [labelFilter, setLabelFilter] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLabels, setEditLabels] = useState("");
  const [editPhoto, setEditPhoto] = useState<string | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const phone = student?.whatsapp || null;

  const apiHeaders: Record<string, string> = phone ? { "x-user-phone": phone } : {};

  const fetchTasks = useCallback(async () => {
    if (!phone) return;
    setLoading(true);
    setLoadProgress(0);
    setError(null);

    const progressInterval = setInterval(() => {
      setLoadProgress((prev) => Math.min(prev + Math.random() * 15, 90));
    }, 100);

    try {
      const res = await fetch("/api/tasks", { headers: apiHeaders });
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();
      setTodos(data);
      setLoadProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setLoading(false);
        setLoadProgress(0);
      }, 300);
    }
  }, [phone, apiHeaders]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handlePhotoChange = useCallback(async (file: File | null, setter: (data: string | null) => void, fileSetter: (f: File | null) => void) => {
    if (!file) {
      setter(null);
      fileSetter(null);
      return;
    }
    if (!phone) {
      alert("Please sign in to upload photos");
      return;
    }
    try {
      const url = await uploadPhoto(file, phone);
      setter(url);
      fileSetter(file);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    }
  }, [phone]);

  const addTask = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !phone) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...apiHeaders },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          labels: parseLabels(labels),
          photo: pendingPhoto,
        }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const newTask = await res.json();
      setTodos((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
      setLabels("");
      setPendingPhoto(null);
      setPhotoFile(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create task");
    }
  }, [title, description, labels, pendingPhoto, photoFile, phone, apiHeaders]);

  const toggleComplete = useCallback(async (id: string) => {
    const task = todos.find((t) => t.id === id);
    if (!task) return;
    
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...apiHeaders },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update task");
    }
  }, [todos, apiHeaders]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: apiHeaders,
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete task");
    }
  }, [apiHeaders]);

  const startEdit = useCallback((task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditLabels(task.labels.join(", "));
    setEditPhoto(task.photo);
    setEditPhotoFile(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditLabels("");
    setEditPhoto(null);
    setEditPhotoFile(null);
  }, []);

  const saveEdit = useCallback(async (task: Task) => {
    if (!editTitle.trim()) return;

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...apiHeaders },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          labels: parseLabels(editLabels),
          photo: editPhoto,
        }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      cancelEdit();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update task");
    }
  }, [editTitle, editDescription, editLabels, editPhoto, apiHeaders, cancelEdit]);

  const moveTask = useCallback((id: string, direction: number) => {
    setTodos((prev) => {
      const index = prev.findIndex((t) => t.id === id);
      const next = index + direction;
      if (index < 0 || next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!draggedId) return;
    e.preventDefault();
    const target = (e.target as HTMLElement).closest(".task-card") as HTMLElement | null;
    document.querySelectorAll(".drag-over").forEach((el) => el.classList.remove("drag-over"));
    if (target && target.dataset.id !== draggedId) target.classList.add("drag-over");
  }, [draggedId]);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    e.preventDefault();
    setTodos((prev) => {
      const from = prev.findIndex((t) => t.id === draggedId);
      const to = prev.findIndex((t) => t.id === targetId);
      if (from < 0 || to < 0) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
    setDraggedId(null);
    document.querySelectorAll(".drag-over").forEach((el) => el.classList.remove("drag-over"));
  }, [draggedId]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    document.querySelectorAll(".dragging, .drag-over").forEach((el) => el.classList.remove("dragging", "drag-over"));
  }, []);

  const filteredTodos = todos.filter((todo) => {
    const statusMatch =
      filter === "all" ||
      (filter === "active" && !todo.completed) ||
      (filter === "completed" && todo.completed);
    const labelMatch = labelFilter === "all" || todo.labels.includes(labelFilter);
    return statusMatch && labelMatch;
  });

  const allLabels = [...new Set(todos.flatMap((t) => t.labels))].sort((a, b) =>
    a.localeCompare(b),
  );

  const remaining = todos.filter((t) => !t.completed).length;
  const completed = todos.length - remaining;

  if (checking) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-text/60">Loading...</div>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] py-8 px-4">
        <div className="fixed top-0 left-0 right-0 h-1.5 bg-indigo-600/20 z-50">
          <div
            className="h-full bg-indigo-600 transition-all duration-200 ease-out"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-lg font-medium text-[#172033]">Loading tasks...</p>
              <p className="text-sm text-[#718096] mt-2">{Math.round(loadProgress)}%</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!phone) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-[#edf0f5] rounded-2xl shadow-[0_10px_35px_rgba(25,39,70,0.07)] p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#172033] mb-2">{t("Sign in to use Tasks", "Sign in to use Tasks")}</h2>
            <p className="text-[#718096] mb-6">{t("Your tasks are saved to your account and synced across devices.", "Your tasks are saved to your account and synced across devices.")}</p>
            <a href="/account" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-3 shadow-[0_4px_10px_rgba(79,70,229,0.15)] transition">
              {t("Go to Account", "Go to Account")}
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 grid place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-bold text-xl shadow-lg">
              ✓
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#172033]">My Tasks</h1>
              <p className="text-sm text-[#718096]">Plan clearly. Get things done.</p>
            </div>
          </div>
          <time className="text-sm text-[#718096] hidden sm:block" dateTime={new Date().toISOString()}>
            {new Date().toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </time>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
            {error}
            <button onClick={fetchTasks} className="ml-2 underline hover:no-underline">Retry</button>
          </div>
        )}

        <section className="bg-white border border-[#edf0f5] rounded-2xl shadow-[0_10px_35px_rgba(25,39,70,0.07)] p-5 mb-5">
          <p className="text-xs font-bold text-[#475569] mb-3">＋ Create a task</p>
          <form onSubmit={addTask} className="space-y-3">
            <div>
              <label htmlFor="todoInput" className="block text-xs font-semibold text-[#64748b] mb-1">
                Task title
              </label>
              <input
                id="todoInput"
                type="text"
                placeholder="What needs to get done?"
                maxLength={180}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[#e1e6ef] bg-[#fbfcfe] text-[#172033] rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="todoDescription" className="block text-xs font-semibold text-[#64748b] mb-1">
                Description
              </label>
              <textarea
                id="todoDescription"
                placeholder="Add some details (optional)"
                maxLength={1000}
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-[#e1e6ef] bg-[#fbfcfe] text-[#172033] rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1 flex items-center gap-1">
                Photo
                <span className="font-normal text-[#9aa4b3]">(optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null, setPendingPhoto, setPhotoFile)}
                className="w-full border border-[#e1e6ef] bg-[#fbfcfe] text-[#172033] rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
              />
              {pendingPhoto && (
                <div className="mt-2">
                  <img src={pendingPhoto} alt="Preview" className="w-28 h-20 object-cover border border-[#e8edf4] rounded-lg" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1 flex items-center gap-1">
                Labels
                <span className="font-normal text-[#9aa4b3]">(separate with commas)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Work, Study, Important"
                maxLength={240}
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                className="w-full border border-[#e1e6ef] bg-[#fbfcfe] text-[#172033] rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl px-5 py-3 shadow-[0_4px_10px_rgba(79,70,229,0.15)] transition"
            >
              ＋ Add task
            </button>
          </form>
        </section>

        <div className="flex items-center justify-between gap-3 mb-3 px-1">
          <strong className="text-sm text-[#172033]">
            {remaining} {remaining === 1 ? "task" : "tasks"} left
          </strong>
          <span className="text-sm text-[#718096]">{completed} completed</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
          <div className="flex gap-2 p-1 bg-[#e9edf5] rounded-xl" role="group" aria-label="Filter tasks">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f as "all" | "active" | "completed")}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition ${
                  filter === f
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-[#64748b] hover:text-[#3730a3]"
                }`}
                aria-pressed={filter === f}
              >
                {t(
                  f === "all" ? "All" : f === "active" ? "Active" : "Done",
                  f === "all" ? "All" : f === "active" ? "Active" : "Done",
                )}
              </button>
            ))}
          </div>
          <select
            value={labelFilter}
            onChange={(e) => setLabelFilter(e.target.value)}
            className="w-full sm:w-48 border border-[#e1e6ef] bg-white text-[#475569] rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none"
            aria-label="Filter by label"
          >
            <option value="all">{t("All labels", "All labels")}</option>
            {allLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <section id="todoList" aria-live="polite" className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="bg-white/66 border border-dashed border-[#d9e0eb] rounded-xl p-8 text-center">
              <span className="block text-4xl mb-2">✦</span>
              <strong className="text-[#8491a3]">{todos.length ? "No matching tasks" : "Nothing on your list yet"}</strong>
              <p className="text-sm text-[#8491a3] mt-2">
                {todos.length ? "Try another filter or add a new task." : "Add a task above to get started."}
              </p>
            </div>
          ) : (
            <TaskList
              todos={filteredTodos}
              editingId={editingId}
              editTitle={editTitle}
              editDescription={editDescription}
              editLabels={editLabels}
              editPhoto={editPhoto}
              language={language}
              t={t}
              onToggleComplete={toggleComplete}
              onStartEdit={startEdit}
              onDelete={deleteTask}
              onMove={moveTask}
              onCancelEdit={cancelEdit}
              onSaveEdit={saveEdit}
              handlePhotoChange={handlePhotoChange}
              setEditPhoto={setEditPhoto}
              setEditPhotoFile={setEditPhotoFile}
            />
          )}
        </section>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-6 pt-4 px-1">
          <p className="text-xs text-[#9aa4b3]">
            {t("Your tasks are saved to your account and synced across devices.", "Your tasks are saved to your account and synced across devices.")}
          </p>
          {completed > 0 && (
            <button
              onClick={() => {
                if (confirm(t("Delete all completed tasks?", "Delete all completed tasks?"))) {
                  todos.filter(t => t.completed).forEach(t => deleteTask(t.id));
                }
              }}
              className="text-sm font-semibold text-[#8a96a8] hover:text-[#dc5252] transition py-2"
            >
              {t("Clear completed", "Clear completed")}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}