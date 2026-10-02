// src/features/vocabulary/pdf-reader/useReaderPrefs.ts
"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { MarkColorId, PageLayout, ReaderTheme, ReaderTool } from "./types";
import { MARK_DEFAULT_COLOR } from "./annotations";

/**
 * Reader settings a person expects to keep between books: the theme their eyes
 * want, whether the page turns or scrolls, whether the magnifier is on. All of
 * it is a single key so the reader reopens exactly as they left it, in any
 * book, rather than making them set the theme again on every lesson.
 */
const PREFS_KEY = "lcwkr_pdf_prefs_v1";

interface Prefs {
  theme: ReaderTheme;
  layout: PageLayout;
  tool: ReaderTool;
  magnifier: boolean;
  zoomLock: boolean;
  inkColor: MarkColorId;
  markColor: MarkColorId;
  /** Reader width in percent, e.g. 125. */
  zoom: number;
}

const DEFAULTS: Prefs = {
  theme: "sepia",
  layout: "single",
  tool: "none",
  magnifier: false,
  zoomLock: false,
  inkColor: MARK_DEFAULT_COLOR.ink,
  markColor: MARK_DEFAULT_COLOR.highlight,
  zoom: 100,
};

const THEMES: ReaderTheme[] = ["light", "sepia", "dark", "night"];
const LAYOUTS: PageLayout[] = ["single", "continuous", "twoPage"];
const TOOLS: ReaderTool[] = ["none", "pan", "ink", "highlight", "underline", "note", "area"];

function read(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULTS;
    const p = JSON.parse(raw) as Partial<Prefs>;
    return {
      theme: THEMES.includes(p.theme as ReaderTheme) ? (p.theme as ReaderTheme) : DEFAULTS.theme,
      layout: LAYOUTS.includes(p.layout as PageLayout) ? (p.layout as PageLayout) : DEFAULTS.layout,
      tool: TOOLS.includes(p.tool as ReaderTool) ? (p.tool as ReaderTool) : DEFAULTS.tool,
      magnifier: typeof p.magnifier === "boolean" ? p.magnifier : DEFAULTS.magnifier,
      zoomLock: typeof p.zoomLock === "boolean" ? p.zoomLock : DEFAULTS.zoomLock,
      inkColor: p.inkColor ?? DEFAULTS.inkColor,
      markColor: p.markColor ?? DEFAULTS.markColor,
      zoom:
        typeof p.zoom === "number" && p.zoom >= 20 && p.zoom <= 600 ? p.zoom : DEFAULTS.zoom,
    };
  } catch {
    return DEFAULTS;
  }
}

/* The stored settings are a store, not local state: they survive a reload and
   are shared by every book on screen. Keeping them in a module-level store means
   the reader can paint its first frame with the reader's own theme instead of
   flashing the default and then correcting itself. */
let cached: Prefs | null = null;
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getSnapshot(): Prefs {
  cached ??= read();
  return cached;
}

function getServerSnapshot(): Prefs {
  return DEFAULTS;
}

export function useReaderPrefs() {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    // Read-modify-write in one go so two quick toggles cannot race each other
    // back to the same stale object.
    const next = { ...(cached ?? DEFAULTS), [key]: value };
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {
      /* private mode: the setting just will not outlive the session */
    }
    cached = next;
    listeners.forEach((l) => l());
  }, []);

  return { prefs, update };
}
