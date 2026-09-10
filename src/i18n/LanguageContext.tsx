"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { Language } from "./types";
import { translations } from "@/i18n/translations";

type ContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.bn;
};

const LanguageContext = createContext<ContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start from the default so the server HTML and the client's
  // first render match. The saved preference is applied right after
  // mount — reading localStorage in the state initializer caused a
  // hydration mismatch in the Nav (server: "bn", client: saved value).
  const [language, setLanguage] = useState<Language>("bn");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("language");
      if (saved === "bn" || saved === "en") setLanguage(saved);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("language", language);

    document.documentElement.lang = language;
    document.documentElement.classList.remove("font-en", "font-bn");
    document.documentElement.classList.add(
      language === "bn" ? "font-bn" : "font-en",
    );
  }, [language, hydrated]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) throw new Error("useLanguage must be inside LanguageProvider");

  return context;
};
