"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardEdit,
  Info,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { isSubAdminPasscode } from "@/features/academy/subAdminPasswords";
import { Button, Dialog, Field } from "@/components/ui";

type NavItem = {
  key: string;
  label: [string, string]; // [bn, en]
  href: string;
  icon: typeof Info;
  match: (path: string) => boolean;
};

const UNLOCK_KEY = "academy_admin_unlocked";

export function AcademyQuickNav() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [adminOn, setAdminOn] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    setAdminOn(sessionStorage.getItem(UNLOCK_KEY) === "true");
  }, []);

  const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

  const submitPin = (e: React.FormEvent) => {
    e.preventDefault();
    const v = pin.trim();
    if (v === ADMIN_SECRET_PIN.trim() || isSubAdminPasscode(v)) {
      sessionStorage.setItem(UNLOCK_KEY, "true");
      setAdminOn(true);
      setPinOpen(false);
      setPin("");
      // pages read the flag on mount → refresh so the current page syncs
      window.location.reload();
    } else {
      setPinError(t("ভুল পাসকোড।", "Incorrect passcode."));
    }
  };

  const turnOff = () => {
    sessionStorage.setItem(UNLOCK_KEY, "false");
    setAdminOn(false);
    window.location.reload();
  };

  const items: NavItem[] = [
    {
      key: "info",
      label: ["তথ্য", "Information"],
      href: "/academy",
      icon: Info,
      match: (p) => p === "/academy",
    },
    {
      key: "courses",
      label: ["কোর্স", "Courses"],
      href: "/academy/courses",
      icon: BookOpen,
      match: (p) => p.startsWith("/academy/courses"),
    },
    {
      key: "students",
      label: ["শিক্ষার্থী", "Students"],
      href: "/academy/students",
      icon: Users,
      match: (p) => p.startsWith("/academy/students"),
    },
    {
      key: "registration",
      label: ["ভর্তি", "Registration"],
      href: "/academy/admission",
      icon: ClipboardEdit,
      match: (p) => p.startsWith("/academy/admission"),
    },
  ];

  return (
    <nav
      aria-label={t("একাডেমি দ্রুত সংযোগ", "Academy quick access")}
      className="sticky top-16 z-30 -mx-4 px-4 sm:top-20 sm:mx-0 sm:px-0"
    >
      <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-text/10 bg-card/85 p-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.match(pathname);
          return (
            <Link
              key={it.key}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                active
                  ? "bg-text text-background"
                  : "text-text/70 hover:bg-text/5 hover:text-text"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t(it.label[0], it.label[1])}
            </Link>
          );
        })}

        <span aria-hidden="true" className="mx-0.5 hidden h-5 w-px shrink-0 bg-text/15 sm:block" />

        <button
          type="button"
          aria-pressed={adminOn}
          onClick={() => (adminOn ? turnOff() : setPinOpen(true))}
          className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
            adminOn
              ? "border-ok bg-ok/10 text-ok hover:bg-ok/20"
              : "border-text/20 text-text/70 hover:border-text/40 hover:text-text"
          }`}
        >
          {adminOn ? (
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Lock className="h-4 w-4" aria-hidden="true" />
          )}
          {adminOn
            ? t("অ্যাডমিন মোড চালু", "Admin ON")
            : t("অ্যাডমিন মোড", "Admin")}
        </button>
      </div>

      <Dialog
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        title={t("অ্যাডমিন মোড চালু করুন", "Turn on admin mode")}
        description={t(
          "অ্যাডমিন বা সাব-অ্যাডমিন পাসকোড দিন। চালু করলে সব একাডেমি পেজে সুবিধা খুলে যাবে।",
          "Enter the admin or sub-admin passcode. This unlocks staff controls on every academy page.",
        )}
        size="sm"
      >
        <form onSubmit={submitPin} className="space-y-4">
          <Field
            type="password"
            label={t("পাসকোড", "Passcode")}
            autoFocus
            value={pin}
            error={pinError}
            onChange={(e) => { setPin(e.target.value); setPinError(""); }}
            className="text-center tracking-widest"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setPinOpen(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button type="submit" size="sm">{t("চালু করুন", "Turn on")}</Button>
          </div>
        </form>
      </Dialog>
    </nav>
  );
}