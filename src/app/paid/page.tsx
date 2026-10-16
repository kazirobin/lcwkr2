import PaidApp from "@/features/paid/components/PaidApp";

export const metadata = {
  title: "Paid Members",
  description: "Paid members' full details — everyone can see. New members register at /paid/registration.",
};

export default function PaidPage() {
  return (
    <div className="relative isolate mx-auto max-w-5xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
      <PaidApp />
    </div>
  );
}
