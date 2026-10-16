import type { Metadata } from "next";
import PaidApp from "@/features/paid/components/PaidApp";

export const metadata: Metadata = {
  title: "Paid Registration",
  description: "Register as a paid member and add your details.",
};

export default function PaidRegistrationPage() {
  return (
    <div className="relative isolate mx-auto max-w-5xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
      <PaidApp showRegistration={true} />
    </div>
  );
}
