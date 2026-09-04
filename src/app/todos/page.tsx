import TodoApp from "@/features/todos/components/TodoApp";

export const metadata = {
  title: "Keep Notes | Task Manager",
  description: "Google Keep inspired task and student manager",
};

export default function TodosPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 p-6 flex justify-center">
      <TodoApp />
    </div>
  );
}