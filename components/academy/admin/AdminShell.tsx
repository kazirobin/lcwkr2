"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Breadcrumb,
  Button,
  Eyebrow,
  Field,
  IconButton,
  PageHeader,
  SectionHanzi,
  useConfirm,
} from "@/components/academy/ui";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";
const PIN_KEY = "academy_admin_pin";
const UNLOCK_KEY = "academy_admin_unlocked";

/**
 * Shared gate + chrome for every /academy/admin page. NOTE: the passcode check
 * is still client-side only — real server-enforced auth is a separate,
 * deferred piece of work. This unifies the previously inconsistent gating
 * (the dashboard had one, the sub-pages had none) and the visual shell.
 */
export function AdminShell({
  title,
  crumb,
  seal,
  lede,
  actions,
  children,
}: {
  title: string;
  crumb: string;
  seal: string;
  lede?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PIN_KEY);
      if (saved && saved.trim() === ADMIN_PASSCODE.trim()) {
        setAuthed(true);
        sessionStorage.setItem(UNLOCK_KEY, "true");
      }
    } catch {
      /* storage unavailable */
    }
    setChecking(false);
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_PASSCODE.trim()) {
      try {
        localStorage.setItem(PIN_KEY, pin.trim());
        sessionStorage.setItem(UNLOCK_KEY, "true");
      } catch {
        /* ignore */
      }
      setAuthed(true);
    } else {
      setError(t("ভুল পাসকোড।", "Incorrect passcode."));
    }
  };

  const logout = async () => {
    const ok = await confirm({
      title: t("লগ আউট করবেন?", "Log out?"),
      message: t("সংরক্ষিত পাসকোড মুছে যাবে।", "The saved passcode will be cleared."),
      confirmLabel: t("লগ আউট", "Log out"),
    });
    if (!ok) return;
    try {
      localStorage.removeItem(PIN_KEY);
      sessionStorage.removeItem(UNLOCK_KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
    setPin("");
  };

  if (checking) {
    return (
      <div className="mx-auto max-w-md px-4 pt-40 text-center" role="status" aria-live="polite">
        <p className="text-sm text-text/50">{t("যাচাই করা হচ্ছে…", "Verifying access…")}</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="relative isolate mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pt-28 pb-20">
        <SectionHanzi char={seal} className="-top-6 right-0 text-[13rem]" />
        <Eyebrow seal="门" label={t("স্টাফ প্রবেশ", "Staff access")} />
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-text">
          {t("অ্যাডমিন কনসোল", "Admin console")}
        </h1>
        <p className="mt-2 text-sm text-text/60">
          {t("চালিয়ে যেতে অ্যাডমিন পাসকোড দিন।", "Enter the admin passcode to continue.")}
        </p>
        <form onSubmit={login} className="mt-6 space-y-4 rounded-2xl border border-text/10 bg-card p-6">
          <Field
            type="password"
            label={t("অ্যাডমিন পাসকোড", "Admin passcode")}
            autoFocus
            value={pin}
            error={error}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            className="text-center tracking-widest"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => router.push("/academy")}
            >
              {t("বাতিল", "Cancel")}
            </Button>
            <Button type="submit" className="flex-1">
              {t("আনলক", "Unlock")}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="relative isolate mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char={seal} className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("অ্যাডমিন", "Admin"), href: "/academy/admin" },
          { label: crumb },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={
          <Eyebrow
            seal={seal}
            label={t("অ্যাডমিন", "Admin")}
            detail={
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {t("যাচাইকৃত", "verified")}
              </span>
            }
          />
        }
        title={title}
        lede={lede}
        actions={
          <>
            {actions}
            <IconButton label={t("লগ আউট", "Log out")} size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </IconButton>
          </>
        }
      />

      <div className="mt-10">{children}</div>
    </div>
  );
}
