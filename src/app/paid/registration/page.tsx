import type { Metadata } from "next";
import PaidApp from "@/features/paid/components/PaidApp";

export const metadata: Metadata = {
  title: "Paid Registration",
  description: "Register as a paid member and add your details.",
};

export default function PaidRegistrationPage() {
  return (
    <div className="flex min-h-screen justify-center bg-background p-4 text-text sm:p-6 md:p-8">
      <div className="w-full max-w-5xl">
        <PaidApp showRegistration={true} />
      </div>
    </div>
  );
}
