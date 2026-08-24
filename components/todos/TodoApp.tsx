"use client";

import { useEffect, useState } from "react";
import { TodoItem as TodoType } from "@/types/todo";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setTodos(data);
    } catch (err) {
      console.error("Failed to load todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (title: string) => {
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (res.ok) {
        const created = await res.json();
        setTodos((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    setTodos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !completed } : t))
    );

    try {
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
    } catch (err) {
      console.error("Failed to toggle todo:", err);
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setTodos((prev) => prev.filter((t) => t._id !== id));

    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete todo:", err);
      fetchTodos();
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-400">Task Manager</h1>
      <TodoForm onAdd={handleAddTodo} />
      <TodoList
        todos={todos}
        loading={loading}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
}