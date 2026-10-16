import PaidApp from "@/features/paid/components/PaidApp";

export const metadata = {
  title: "Paid Members",
  description: "Paid members' full details — everyone can see. New members register at /paid/registration.",
};

export default function PaidPage() {
  return (
    <div className="flex min-h-screen justify-center bg-background p-4 text-text sm:p-6 md:p-8">
      <div className="w-full max-w-5xl">
        <PaidApp />
      </div>
    </div>
  );
}
