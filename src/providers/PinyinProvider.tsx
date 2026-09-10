"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Global pinyin visibility. Pinyin shows by default; the user can hide it
 * (self-testing mode) from the Nav toggle. The choice persists in
 * localStorage and is applied by adding a `hide-pinyin` class on <html>,
 * which CSS turns into `[data-pinyin] { display: none }` site-wide.
 */

const STORAGE_KEY = "pinyin";

type PinyinContextType = {
  show: boolean;
  toggle: () => void;
};

const PinyinContext = createContext<PinyinContextType>({
  show: true,
  toggle: () => {},
});

export function PinyinProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        if (localStorage.getItem(STORAGE_KEY) === "hidden") setShow(false);
      } catch {
        /* ignore */
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("hide-pinyin", !show);
    try {
      localStorage.setItem(STORAGE_KEY, show ? "shown" : "hidden");
    } catch {
      /* ignore */
    }
  }, [show, hydrated]);

  const toggle = () => setShow((v) => !v);

  return (
    <PinyinContext.Provider value={{ show, toggle }}>
      {children}
    </PinyinContext.Provider>
  );
}

export const usePinyin = () => useContext(PinyinContext);
