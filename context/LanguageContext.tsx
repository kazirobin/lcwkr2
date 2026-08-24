"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { Language } from "../types/language";
import { translations } from "@/data/index";

type ContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.bn;
};

const LanguageContext = createContext<ContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      if (saved === "bn" || saved === "en") return saved;
    }
    return "bn";
  });

  useEffect(() => {
    localStorage.setItem("language", language);

    document.documentElement.classList.remove("font-en", "font-bn");
    document.documentElement.classList.add(
      language === "bn" ? "font-bn" : "font-en",
    );
  }, [language]);

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
