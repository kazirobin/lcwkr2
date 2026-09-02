"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useLanguage } from "@/i18n";

// Icon-swap toggle for the header. Shares the pill shape, token colours and
// focus-ring idiom of the other nav actions (language switch, hamburger).
export default function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const label =
    language === "bn"
      ? isDark
        ? "লাইট মোডে যান"
        : "ডার্ক মোডে যান"
      : isDark
        ? "Switch to light mode"
        : "Switch to dark mode";

  // Before mount the resolved theme is unknown — render the pill at its final
  // size so the header doesn't shift, but inert and unlabelled.
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-text/15"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-text/15 text-text/70 transition-colors hover:bg-secondary/7 hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text cursor-pointer"
      aria-label={label}
      title={label}
    >
      <span className="relative block h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
