"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";

/** Nav account entry — Login link, or avatar link to /account when logged in. */
export default function AccountButton({ onNavigate }: { onNavigate?: () => void }) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const { student, checking } = useAccount();

  if (checking) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text/30"
      >
        <UserRound className="h-4 w-4" />
      </span>
    );
  }

  if (!student) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-text/15 px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-text/30 hover:bg-text/5"
      >
        <UserRound className="h-4 w-4" aria-hidden="true" />
        {t("লগইন", "Login")}
      </Link>
    );
  }

  const initial = (student.nameEnglish.trim()[0] ?? "•").toUpperCase();
  return (
    <Link
      href="/account"
      onClick={onNavigate}
      title={student.nameEnglish}
      aria-label={t("আমার অ্যাকাউন্ট", "My account")}
      className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-background transition-transform hover:-translate-y-0.5"
    >
      {initial}
      {student.isPro && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px]"
        >
          ★
        </span>
      )}
    </Link>
  );
}
