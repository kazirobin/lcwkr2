import TodoApp from "@/components/todos/TodoApp";

export const metadata = {
  title: "Todos | Task Manager",
  description: "Manage your tasks efficiently",
};

export default function TodosPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <TodoApp />
    </div>
  );
}