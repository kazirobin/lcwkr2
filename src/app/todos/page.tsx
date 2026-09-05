import TodoApp from "@/features/todos/components/TodoApp";

export const metadata = {
  title: "Keep Notes | Task Manager",
  description: "Google Keep inspired task and student manager",
};

export default function TodosPage() {
  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-6 md:p-8 flex justify-center">
      <div className="w-full max-w-5xl">
        <TodoApp />
      </div>
    </div>
  );
}