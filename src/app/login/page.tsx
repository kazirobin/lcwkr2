"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import { Button, Card, Field } from "@/components/ui";

export default function LoginPage() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const router = useRouter();
  const { student, login } = useAccount();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (student) {
    router.replace("/account");
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password || busy) return;
    setBusy(true);
    setError(null);
    const result = await login(phone.trim(), password);
    setBusy(false);
    if (result.ok) router.push("/account");
    else setError(result.error);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <Card className="p-6 sm:p-8">
        <p className="text-center text-3xl">🔑</p>
        <h1 className="mt-2 text-center text-2xl font-bold text-text">
          {t("শিক্ষার্থী লগইন", "Student login")}
        </h1>
        <p className="mt-1 text-center text-xs text-text/55">
          {t(
            "ভর্তির মোবাইল নম্বর + পাসওয়ার্ড দিন। প্রথমবার ডিফল্ট পাসওয়ার্ড: lcwkr2026",
            "Admission mobile number + password. First time? Default password: lcwkr2026"
          )}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label={t("মোবাইল নম্বর", "Mobile number")} required>
            <input
              type="tel"
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-lg border border-text/15 bg-card px-3 py-2.5 font-mono text-sm text-text outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
            />
          </Field>
          <Field label={t("পাসওয়ার্ড", "Password")} required>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-text/15 bg-card px-3 py-2.5 text-sm text-text outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
            />
          </Field>
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
              {error}
            </p>
          )}
          <Button type="submit" loading={busy} className="w-full">
            {t("লগইন", "Login")}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-text/55">
          {t("অ্যাকাউন্ট নেই?", "No account?")}{" "}
          <Link href="/register" className="font-semibold text-secondary hover:underline">
            {t("রেজিস্ট্রেশন করুন (৳৫০০)", "Register (৳500)")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
