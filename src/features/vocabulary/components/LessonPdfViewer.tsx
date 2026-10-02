// src/features/vocabulary/components/LessonPdfViewer.tsx
//
// The lesson book, read in place. A button opens the lesson PDF in a
// full-screen reader; the homework page opens a workbook in the same reader.
// Built on pdf.js, imported dynamically so the ~0.5 MB engine only downloads
// when a book is actually opened. If it cannot start, the raw file is still one
// click away in a new tab.
//
// Built for a phone first, because that is where books get read. Three things
// that decides everything else:
//
//   • **Gestures are anchored.** Every zoom holds the point under your finger
//     still, so the word you are reading is the word you keep reading.
//   • **Zoom previews while it re-renders.** A pinch asks the worker for a
//     freshly rasterised page, which takes a moment on a large scan. The old
//     pixels are scaled up immediately and the sharp page swaps in underneath,
//     so the gesture feels instant and never ends on a blurry page.
//   • **Turning a page is deliberate.** A light brush of the finger scrolls
//     nothing and changes nothing; a page turn needs a real, mostly-horizontal
//     throw. A short drag that ends in a flick is treated as a fling to scroll.

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";
import { useLanguage } from "@/i18n";
import { localizeNumber, vocabularyCopy } from "../i18n";
import { lessonPdfUrl } from "../pdf";
import PageSheet from "../pdf-reader/PageSheet";
import Magnifier from "../pdf-reader/Magnifier";
import Toolbar from "../pdf-reader/Toolbar";
import DictionaryPopup from "../pdf-reader/DictionaryPopup";
import { READER_COPY } from "../pdf-reader/copy";
import { MARK_COLOR_BY_ID, READER_THEMES } from "../pdf-reader/types";
import type { PageMark } from "../pdf-reader/annotations";
import {
  clearAllMarks,
  isMeaningfulDrag,
  loadMarks,
  newMarkId,
  saveMarks,
} from "../pdf-reader/annotations";
import { pageHasText, speakableText, useSpeak } from "../pdf-reader/useSpeak";
import { useReaderPrefs } from "../pdf-reader/useReaderPrefs";

/** Copied out of node_modules by scripts/copy-pdf-worker.mjs. */
const WORKER_SRC = "/pdfjs/pdf.worker.min.mjs";
const MIN_SCALE = 0.2;
const MAX_SCALE = 6;
const ZOOM_STEP = 1.25;
const PAGE_PADDING = 28;
/**
 * A page turn needs real intent. Sixty pixels was short enough that a careless
 * sideways brush turned the page, which on a workbook is how you lose your
 * place; a turn now needs a longer, clearly horizontal throw.
 */
const SWIPE_DISTANCE = 96;
/** ...and it has to be that much more sideways than up-and-down. */
const SWIPE_SLOP = 1.3;
/** A quick flick is a fling to scroll, not an intention to turn the page. */
const SWIPE_MAX_MS = 420;
/** A double tap zooms *to* — a page that fills the screen is not readable. */
const READ_SCALE = 1.9;
const DOUBLE_TAP_MS = 340;
const DOUBLE_TAP_DISTANCE = 44;
const HINT_SHOW_MS = 1400;
const HINT_HIDE_MS = 6200;
const HINT_KEY = "lcwkr_pdf_reader_hint_v2";
/** How long a page change takes to cross-fade, in ms. Matches the CSS below. */
const TURN_MS = 190;

type FitMode = "width" | "page" | null;
type Status = "loading" | "ready" | "error";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** pdf.js 6 asks for the ES2025 `Uint8Array.prototype.toHex`. */
function ensureUint8ArrayHex() {
  const proto = Uint8Array.prototype as unknown as {
    toHex?: () => string;
    toBase64?: () => string;
  };
  if (typeof proto.toHex !== "function") {
    proto.toHex = function toHex(this: Uint8Array) {
      let out = "";
      for (const byte of this) out += byte.toString(16).padStart(2, "0");
      return out;
    };
  }
  if (typeof proto.toBase64 !== "function") {
    proto.toBase64 = function toBase64(this: Uint8Array) {
      let binary = "";
      for (const byte of this) binary += String.fromCharCode(byte);
      return btoa(binary);
    };
  }
}

interface Size {
  w: number;
  h: number;
}

export function LessonPdfViewer({
  level,
  lesson,
  title,
  onClose,
  url: urlOverride,
  kind = "lesson",
}: {
  level: number;
  lesson: number;
  title: string;
  onClose: () => void;
  /** Read this file instead of the level's lesson book. Used for the workbooks. */
  url?: string | null;
  /** Which book is being read — only the wording differs. */
  kind?: "lesson" | "workbook";
}) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];
  const copy = READER_COPY[language === "bn" ? "bn" : "en"];
  const url = urlOverride || lessonPdfUrl(level, lesson) || "";
  const bookKey = url.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "book";

  const [status, setStatus] = useState<Status>("loading");
  const [numPages, setNumPages] = useState(0);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [userRotation, setUserRotation] = useState(0);
  /** Every book opens at its printed size. */
  const [fit, setFit] = useState<FitMode>(null);
  /** The zoom the reader layered on top of fit, as a multiple of it. */
  const [zoomMul, setZoomMul] = useState(1);
  /** Zoom lock: the size to hold steady no matter what the box does. */
  const [lockedAbs, setLockedAbs] = useState<number | null>(null);
  const [box, setBox] = useState<Size>({ w: 0, h: 0 });
  const [pageSizes, setPageSizes] = useState<Record<number, Size>>({});
  const [isFull, setIsFull] = useState(false);
  const [showHint, setShowHint] = useState(false);
  /** Bumped on every page change so the sheets can cross-fade. */
  const [turn, setTurn] = useState(0);
  const [areaRect, setAreaRect] = useState<{ page: number; rect: { x: number; y: number; w: number; h: number } } | null>(null);
  const [areaOn, setAreaOn] = useState(false);
  const [loupe, setLoupe] = useState<{
    center: { x: number; y: number };
    screen: { x: number; y: number };
    source: HTMLCanvasElement | null;
  } | null>(null);
  const [noteDraft, setNoteDraft] = useState<{ page: number; x: number; y: number } | null>(null);
  const [noteText, setNoteText] = useState("");
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hits, setHits] = useState<{ page: number; at: number }[]>([]);
  const [hitIndex, setHitIndex] = useState(0);
  const [searchMessage, setSearchMessage] = useState("");
  const [textPages, setTextPages] = useState<Set<number>>(new Set());
  const [marks, setMarks] = useState<Record<number, PageMark[]>>({});

  const { prefs, update } = useReaderPrefs();
  const { speak, stop, speaking, supported: canSpeak } = useSpeak();

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  /** The laid-out position of each sheet, so scroll mode can find its pages. */
  const sheetRefs = useRef(new Map<number, HTMLDivElement>());
  const pageRef = useRef(1);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const loadingRef = useRef<PDFDocumentLoadingTask | null>(null);
  const textCacheRef = useRef<Map<number, { chars: number; text: string }>>(new Map());

  const scaleRef = useRef(1);
  const readingRef = useRef(1);
  const fitScaleRef = useRef(1);
  const pointersRef = useRef(new Map<number, { x: number; y: number; at: number }>());
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const dragRef = useRef<{ x: number; y: number; at: number; panning: boolean } | null>(null);
  const lastTapRef = useRef({ at: 0, x: 0, y: 0 });

  const theme = READER_THEMES[prefs.theme];
  const layout = prefs.layout;
  const tool = areaOn ? "area" : prefs.tool;
  const isDrawingTool = tool === "ink" || tool === "highlight" || tool === "underline" || tool === "note";

  /* Gestures fire between renders, long after the render that built the handler
     went away, so they read the live settings from here. */
  const prefsRef = useRef(prefs);
  useEffect(() => {
    prefsRef.current = prefs;
  }, [prefs]);

  /* ── the size the book is drawn at ──
     Two pure inputs: the size "fit" asks for, and the zoom the reader layered on
     top. Nothing copies one into the other in an effect, so the page can never
     render at a size that disagrees with what the toolbar says. */
  const fitScale = useMemo(() => {
    const base = pageSizes[page];
    if (fit === null || !base || !box.w || !box.h) return 1;
    const byWidth = (box.w - PAGE_PADDING) / base.w || 1;
    const byHeight = (box.h - PAGE_PADDING) / base.h || 1;
    return clamp(fit === "width" ? byWidth : Math.min(byWidth, byHeight), MIN_SCALE, MAX_SCALE);
  }, [pageSizes, page, box.w, box.h, fit]);

  const resolvedScale = lockedAbs ?? clamp(fitScale * zoomMul, MIN_SCALE, MAX_SCALE);

  /* Gestures read the live values from here, so the callbacks stay free of
     render-time dependencies. */
  const pendingZoomRef = useRef<{ anchor: { x: number; y: number }; k: number } | null>(null);
  useEffect(() => {
    scaleRef.current = resolvedScale;
    fitScaleRef.current = fitScale;
    pageRef.current = page;
  }, [resolvedScale, fitScale, page]);

  /* ── open the book ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        ensureUint8ArrayHex();
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = WORKER_SRC;
        const loading = pdfjs.getDocument({ url });
        loadingRef.current = loading;
        const doc = await loading.promise;
        if (cancelled) {
          void loading.destroy();
          return;
        }
        docRef.current = doc;
        setDoc(doc);
        setNumPages(doc.numPages);
        setStatus("ready");

        /* One pass over every page's size. Cheap — no rasterising — and it is
           what lets scroll mode reserve the right amount of room for a page it
           has not drawn yet. */
        const sizes: Record<number, Size> = {};
        for (let n = 1; n <= doc.numPages; n += 1) {
          const p = await doc.getPage(n);
          const v = p.getViewport({ scale: 1, rotation: (((p.rotate % 360) + 360) % 360) });
          sizes[n] = { w: v.width, h: v.height };
          p.cleanup();
        }
        if (!cancelled) setPageSizes(sizes);
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    /* Only the browser-side resources are released here. React state is left
       alone: setting it while the tree is going away is the kind of update it
       rightly complains about, and a different book means a new reader anyway. */
    return () => {
      cancelled = true;
      const loading = loadingRef.current;
      loadingRef.current = null;
      docRef.current = null;
      if (loading) void loading.destroy();
    };
  }, [url]);

  /* ── this book's marks ──
     Read out of local storage rather than down from props, so the load happens
     after the render that switched books rather than during it. */
  useEffect(() => {
    queueMicrotask(() => setMarks(loadMarks(bookKey)));
  }, [bookKey]);

  const writeMarks = useCallback(
    (next: Record<number, PageMark[]>) => {
      setMarks(next);
      saveMarks(bookKey, next);
    },
    [bookKey],
  );

  /* ── turn the page ── */
  const goTo = useCallback(
    (next: number, silent = false) => {
      const wanted = clamp(next, 1, numPages || 1);
      setPage((current) => {
        if (wanted === current) return current;
        if (!silent) setTurn((t) => t + 1);
        return wanted;
      });
      /* In scroll mode the page number is a place in the column, so going to a
         page means going to it. */
      if (layout === "single") scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      else if (layout === "continuous") {
        sheetRefs.current.get(wanted)?.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    },
    [numPages, layout],
  );

  /* ── zoom, anchored ── */
  const zoomTo = useCallback((next: number, anchor?: { x: number; y: number }) => {
    const stage = stageRef.current;
    const from = scaleRef.current;
    const to = clamp(next, MIN_SCALE, MAX_SCALE);
    if (Math.abs(to - from) < 0.0005) return;

    /* The fit stays the base and the reader's zoom rides on top of it, so
       "fit width" and then pinching closer both keep working. */
    setZoomMul(to / (fitScaleRef.current || 1));
    if (prefsRef.current.zoomLock) setLockedAbs(to);

    if (!stage || !anchor) return;
    /* Grow the pixels that are already on screen while the sharper page is being
       prepared, so the finger never waits on a render. The scroll is put right
       once the real page has been laid out. */
    const node = scrollRef.current;
    const rect = node?.getBoundingClientRect();
    const ax = anchor.x - (rect?.left ?? 0);
    const ay = anchor.y - (rect?.top ?? 0);
    stage.style.transformOrigin = `${ax}px ${ay}px`;
    stage.style.transform = `scale(${to / from})`;
    pendingZoomRef.current = { anchor, k: to / from };
  }, []);

  /**
   * The sharp page has landed: drop the blurry stand-in and move the scroll so
   * the point that was under the finger is still under it.
   */
  useEffect(() => {
    const stage = stageRef.current;
    const node = scrollRef.current;
    if (!stage) return;
    const pending = pendingZoomRef.current;
    stage.style.transform = "none";
    pendingZoomRef.current = null;
    if (!pending || !node) return;

    const nodeRect = node.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    /* Where the stage's own corner sits in the scrollable content. */
    const left = stageRect.left - nodeRect.left + node.scrollLeft;
    const top = stageRect.top - nodeRect.top + node.scrollTop;
    /* The anchor's position inside the stage, in content pixels. */
    const ax = node.scrollLeft + (pending.anchor.x - nodeRect.left) - left;
    const ay = node.scrollTop + (pending.anchor.y - nodeRect.top) - top;
    node.scrollLeft = left + ax * pending.k - (pending.anchor.x - nodeRect.left);
    node.scrollTop = top + ay * pending.k - (pending.anchor.y - nodeRect.top);
  }, [resolvedScale, page, turn]);

  const zoomBy = useCallback((factor: number) => zoomTo(scaleRef.current * factor), [zoomTo]);

  /** Picking a fit starts the reader's zoom over, and lets the book resize again. */
  const chooseFit = useCallback(
    (mode: FitMode) => {
      setFit(mode);
      setZoomMul(1);
      setLockedAbs(null);
      update("zoomLock", false);
    },
    [update],
  );

  /** Freezing the size on turn one, so a new page does not quietly resize it. */
  const toggleZoomLock = useCallback(() => {
    const on = !prefsRef.current.zoomLock;
    update("zoomLock", on);
    setLockedAbs(on ? scaleRef.current : null);
  }, [update]);

  /**
   * A double tap flips between "the size you were reading" and "readable size".
   *
   * Works anywhere on the page, including while zoomed in — an earlier version
   * only fired when the page fitted the screen, so once you had zoomed in the
   * one gesture that gets you back out stopped responding.
   */
  const toggleReadZoom = useCallback(
    (anchor: { x: number; y: number }) => {
      const from = scaleRef.current;
      if (from > READ_SCALE - 0.05) {
        zoomTo(readingRef.current, anchor);
      } else {
        readingRef.current = from;
        zoomTo(READ_SCALE, anchor);
      }
    },
    [zoomTo],
  );

  const rotate = useCallback(() => setUserRotation((v) => (v + 90) % 360), []);

  const toggleFullscreen = useCallback(() => {
    const node = rootRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void node.requestFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFull(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const measure = () => setBox({ w: node.clientWidth, h: node.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [status]);

  /* Rotation changes every page's aspect, so the measured sizes are stale. */
  useEffect(() => {
    const doc = docRef.current;
    if (!doc || !numPages) return;
    let cancelled = false;
    (async () => {
      const sizes: Record<number, Size> = {};
      for (let n = 1; n <= numPages; n += 1) {
        const p = await doc.getPage(n);
        const base = p.rotate % 360;
        const v = p.getViewport({ scale: 1, rotation: (base + userRotation) % 360 });
        /* The viewport is already the size the page is drawn at, rotation and
           all. Swapping it here as well transposed every rotated page, which
           made the sheet 797px wide for a 585px page and stretched the canvas
           sideways inside it. */
        sizes[n] = { w: v.width, h: v.height };
        p.cleanup();
      }
      if (!cancelled) setPageSizes(sizes);
    })();
    return () => {
      cancelled = true;
    };
  }, [numPages, userRotation]);

  /* In scroll mode there is no turn to announce, so the page number follows
   whichever sheet the reader has scrolled to. */
  useEffect(() => {
    const node = scrollRef.current;
    if (layout !== "continuous" || !node) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const middle = node.getBoundingClientRect().top + node.clientHeight / 2;
      let best = 0;
      let closest = Infinity;
      sheetRefs.current.forEach((el, n) => {
        const r = el.getBoundingClientRect();
        /* The sheet covering the middle of the view wins; otherwise the one whose
           edge is nearest to it. */
        const distance =
          r.top <= middle && r.bottom >= middle
            ? 0
            : Math.min(Math.abs(r.top - middle), Math.abs(r.bottom - middle));
        if (distance < closest) {
          closest = distance;
          best = n;
        }
      });
      if (best && best !== pageRef.current) setPage(best);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    node.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [layout, resolvedScale, numPages]);

  /* ── which pages to draw ── */
  const visiblePages = useMemo(() => {
    if (!numPages) return [1];
    if (layout === "continuous") return Array.from({ length: numPages }, (_, i) => i + 1);
    if (layout === "twoPage") {
      /* Facing pages start on an odd sheet so the spread opens like a book. */
      const first = page % 2 === 1 ? page : Math.max(1, page - 1);
      return [first, first + 1].filter((n) => n <= numPages);
    }
    return [page];
  }, [layout, page, numPages]);

  const sheets = visiblePages.map((n) => {
    const base = pageSizes[n] ?? { w: 595, h: 842 };
    return { n, w: base.w * resolvedScale, h: base.h * resolvedScale };
  });

  /* ── area zoom ── */
  const commitArea = useCallback(
    (p: number, rect: { x: number; y: number; w: number; h: number }) => {
      setAreaRect(null);
      /* The box arrives in fractions of the page, so measure it as a drag. */
      if (!isMeaningfulDrag(0, 0, rect.w, rect.h)) return;
      const sheet = sheets.find((s) => s.n === p);
      if (!sheet) return;
      /* How far we can come in and still hold the whole dragged box on screen. */
      const byWidth = (box.w - PAGE_PADDING) / (Math.abs(rect.w) * sheet.w);
      const byHeight = (box.h - PAGE_PADDING) / (Math.abs(rect.h) * sheet.h);
      const wanted = clamp(Math.min(byWidth, byHeight) * resolvedScale, MIN_SCALE, MAX_SCALE);
      const anchor = areaRect
        ? { x: areaRect.rect.x * sheet.w + (areaRect.rect.w * sheet.w) / 2, y: areaRect.rect.y * sheet.h + (areaRect.rect.h * sheet.h) / 2 }
        : undefined;
      if (p !== page) goTo(p);
      zoomTo(wanted, anchor);
    },
    [sheets, box.w, box.h, resolvedScale, page, areaRect, goTo, zoomTo],
  );

  /* ── marks ── */
  const addMark = useCallback(
    (p: number, mark: PageMark) => {
      const next = { ...marks, [p]: [...(marks[p] ?? []), { ...mark, id: newMarkId() }] };
      writeMarks(next);
    },
    [marks, writeMarks],
  );

  const removeMark = useCallback(
    (p: number, id: string) => {
      writeMarks({ ...marks, [p]: (marks[p] ?? []).filter((m) => m.id !== id) });
    },
    [marks, writeMarks],
  );

  const clearEveryMark = useCallback(() => {
    clearAllMarks(bookKey);
    setMarks({});
  }, [bookKey]);

  /* ── search ── */
  const runSearch = useCallback(
    async (query: string) => {
      const doc = docRef.current;
      if (!doc || !query.trim()) {
        setHits([]);
        setSearchMessage("");
        return;
      }
      const needle = query.trim().toLowerCase();
      const found: { page: number; at: number }[] = [];
      for (let n = 1; n <= doc.numPages; n += 1) {
        let entry = textCacheRef.current.get(n);
        if (!entry) {
          try {
            const p = await doc.getPage(n);
            const tc = await p.getTextContent();
            const chars = tc.items.reduce(
              (sum, item) => sum + (("str" in item && item.str) || "").trim().length,
              0,
            );
            entry = { chars, text: tc.items.map((i) => ("str" in i ? i.str : "")).join("") };
            textCacheRef.current.set(n, entry);
            p.cleanup();
          } catch {
            entry = { chars: 0, text: "" };
            textCacheRef.current.set(n, entry);
          }
        }
        let from = entry.text.toLowerCase().indexOf(needle);
        while (from !== -1) {
          found.push({ page: n, at: found.filter((f) => f.page === n).length });
          from = entry.text.toLowerCase().indexOf(needle, from + needle.length);
        }
      }
      if (found.length === 0) {
        const anyText = [...textCacheRef.current.values()].some((e) => pageHasText(e.chars));
        setHits([]);
        setHitIndex(0);
        setSearchMessage(anyText ? copy.searchNone : copy.searchScanned);
        return;
      }
      setHits(found);
      setHitIndex(0);
      setSearchMessage("");
      goTo(found[0].page);
    },
    [goTo, copy],
  );

  const stepHit = useCallback(
    (delta: number) => {
      if (hits.length === 0) return;
      const next = (hitIndex + delta + hits.length) % hits.length;
      setHitIndex(next);
      goTo(hits[next].page);
    },
    [hits, hitIndex, goTo],
  );

  const readPageAloud = useCallback(async () => {
    const doc = docRef.current;
    if (!doc) return;
    let entry = textCacheRef.current.get(page);
    if (!entry) {
      const p = await doc.getPage(page);
      const tc = await p.getTextContent();
      entry = {
        chars: tc.items.reduce((s, i) => s + (("str" in i && i.str) || "").trim().length, 0),
        text: tc.items.map((i) => ("str" in i ? i.str : "")).join(""),
      };
      textCacheRef.current.set(page, entry);
      p.cleanup();
    }
    const words = entry.text
      .split(/\s+/)
      .map((w) => (w.match(/[\u4e00-\u9fff]/) ? w : ""))
      .filter(Boolean)
      .join(" ");
    speak(speakableText([{ str: words || entry.text }]));
  }, [page, speak]);

  const noteTextStats = useCallback((n: number, chars: number) => {
    if (!pageHasText(chars)) return;
    setTextPages((prev) => (prev.has(n) ? prev : new Set(prev).add(n)));
  }, []);

  const bookHasText = textPages.size > 0;

  /* ── wheel / trackpad pinch ──
     A mouse notch is ~100 pixels of delta, and exp(-100 * 0.01) is ×2.7, so the
     old coefficient turned one notch into a leap. The exponent here is a tenth
     of that: a notch is about a fifth more, a trackpad pinch creeps. Events are
     gathered into one step per frame so a fast wheel does not queue a render
     for every increment, which is what made it stutter. */
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    let frame = 0;
    let gathered = 0;
    let at = { x: 0, y: 0 };
    const flush = () => {
      frame = 0;
      const delta = clamp(gathered, -240, 240);
      gathered = 0;
      if (!delta) return;
      zoomTo(scaleRef.current * Math.exp(-delta * 0.0013), at);
    };
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1;
      gathered += event.deltaY * unit;
      at = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(flush);
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      node.removeEventListener("wheel", onWheel);
    };
  }, [zoomTo]);

  /* ── touch ── */
  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isDrawingTool) return;
      const node = scrollRef.current;
      const stage = stageRef.current;
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY, at: performance.now() });
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        /* capture is a nicety, not a requirement */
      }

      if (pointersRef.current.size >= 2) {
        const [a, b] = [...pointersRef.current.values()];
        pinchRef.current = {
          dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
          scale: scaleRef.current,
        };
        dragRef.current = null;
        setShowHint(false);
        return;
      }

      const fits = !node || !stage || stage.offsetWidth <= node.clientWidth + 1;
      dragRef.current = {
        x: event.clientX,
        y: event.clientY,
        at: performance.now(),
        /* A page that fits has nothing to pan, so a sideways drag turns the
           page. A zoomed page is panned instead, or the drag would fight the
           scroll position. */
        panning: !fits,
      };
    },
    [isDrawingTool],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (isDrawingTool) return;
      if (!pointersRef.current.has(event.pointerId)) return;
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
        at: performance.now(),
      });

      /* The loupe magnifies the page under the pointer, so on a facing spread it has
         to be that page's own canvas rather than whichever one happens to be
         first in the DOM. */
      if (prefs.magnifier && pointersRef.current.size === 1) {
        let canvas: HTMLCanvasElement | null = null;
        for (const sheet of sheetRefs.current.values()) {
          const rect = sheet.getBoundingClientRect();
          const inside =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;
          if (!inside) continue;
          const found = sheet.querySelector("canvas");
          if (found instanceof HTMLCanvasElement) canvas = found;
          break;
        }
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          setLoupe({
            center: { x: event.clientX - rect.left, y: event.clientY - rect.top },
            screen: { x: event.clientX, y: event.clientY },
            source: canvas,
          });
        }
      }

      const pinch = pinchRef.current;
      if (pinch && pointersRef.current.size >= 2) {
        const [a, b] = [...pointersRef.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        zoomTo(pinch.scale * (dist / pinch.dist), { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
        return;
      }

      const drag = dragRef.current;
      const node = scrollRef.current;
      if (!drag || !node) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;

      if (drag.panning) {
        node.scrollLeft -= dx;
        return;
      }
      /* Follow the finger so the turn feels physical. On the element, not in
         state, so a drag costs no renders. */
      const stage = stageRef.current;
      if (stage) {
        const travelling = Math.abs(dx) > Math.abs(dy) * SWIPE_SLOP;
        stage.style.transition = "none";
        stage.style.transform = travelling ? `translate3d(${dx * 0.5}px, 0, 0)` : "none";
      }
    },
    [isDrawingTool, prefs.magnifier, zoomTo],
  );

  const endPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
      if (isDrawingTool) return;
      pointersRef.current.delete(event.pointerId);
      if (pointersRef.current.size < 2) pinchRef.current = null;

      const drag = dragRef.current;
      if (!drag || pointersRef.current.size > 0) return;
      dragRef.current = null;

      const stage = stageRef.current;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      const elapsed = performance.now() - drag.at;

      /* A tap — and the only chance to double tap. Checked before anything
         else and without caring whether the page was zoomed, so the gesture
         works wherever the finger lands. */
      if (!cancelled && Math.abs(dx) < 12 && Math.abs(dy) < 12) {
        const now = performance.now();
        const last = lastTapRef.current;
        const isDouble =
          now - last.at < DOUBLE_TAP_MS &&
          Math.hypot(event.clientX - last.x, event.clientY - last.y) < DOUBLE_TAP_DISTANCE;
        if (isDouble) {
          lastTapRef.current = { at: 0, x: 0, y: 0 };
          setShowHint(false);
          toggleReadZoom({ x: event.clientX, y: event.clientY });
        } else {
          lastTapRef.current = { at: now, x: event.clientX, y: event.clientY };
        }
        if (stage) stage.style.transform = "none";
        return;
      }

      if (stage) stage.style.transition = `transform ${TURN_MS}ms ease-out`;
      if (cancelled) {
        if (stage) stage.style.transform = "none";
        return;
      }

      /* A page turn needs a long, clearly sideways, unhurried drag. A short
         quick flick is how you scroll, not how you turn, and treating those
         the same is what made the reader feel like it was running away. */
      const sideways = Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * SWIPE_SLOP;
      if (sideways && elapsed > SWIPE_MAX_MS && drag.panning === false) {
        goTo(page + (dx < 0 ? 1 : -1));
      }
      if (stage) stage.style.transform = "none";
    },
    [isDrawingTool, toggleReadZoom, goTo, page],
  );

  /* Marking a note: prompt, then pin it to the page. */
  const saveNote = useCallback(() => {
    if (!noteDraft) return;
    const text = noteText.trim();
    addMark(noteDraft.page, { kind: "note", id: "", x: noteDraft.x, y: noteDraft.y, text });
    setNoteDraft(null);
    setNoteText("");
  }, [noteDraft, noteText, addMark]);

  /* ── keyboard ── */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
          event.preventDefault();
          goTo(page + 1);
          break;
        case " ":
          event.preventDefault();
          goTo(page + 1);
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          goTo(page - 1);
          break;
        case "+":
        case "=":
          event.preventDefault();
          zoomBy(ZOOM_STEP);
          break;
        case "-":
          event.preventDefault();
          zoomBy(1 / ZOOM_STEP);
          break;
        case "0":
          event.preventDefault();
          chooseFit("width");
          break;
        case "f":
        case "F":
          event.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (noteDraft) {
            setNoteDraft(null);
            break;
          }
          if (areaOn) {
            setAreaOn(false);
            break;
          }
          if (!document.fullscreenElement) onClose();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, goTo, zoomBy, chooseFit, toggleFullscreen, onClose, update, noteDraft, areaOn]);

  /* The book is the whole screen while it is open. */
  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  useEffect(() => () => stop(), [stop]);

  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(HINT_KEY);
    } catch {
      /* private mode */
    }
    if (seen) return;
    const show = window.setTimeout(() => setShowHint(true), HINT_SHOW_MS);
    const hide = window.setTimeout(() => setShowHint(false), HINT_HIDE_MS);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      /* ignore */
    }
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  if (typeof document === "undefined") return null;

  const pageLabel = c.pdfPageOf(String(page), String(numPages || 1));
  const zoomPercent = Math.round(resolvedScale * 100);

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[80] flex flex-col text-white"
      style={{ background: theme.backdrop }}
    >
      {/* title bar */}
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-2 py-2 sm:gap-3 sm:px-4">
        <BarButton label={copy.back} onClick={onClose}>
          <ArrowLeft aria-hidden="true" className="size-4" />
        </BarButton>
        <FileText aria-hidden="true" className="hidden size-4 shrink-0 text-white/60 sm:block" />
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{title}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={copy.openNewTab}
          aria-label={copy.openNewTab}
          className="flex size-8 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
        >
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
        <a
          href={url}
          download
          title={copy.download}
          aria-label={copy.download}
          className="flex size-8 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
        >
          <Download aria-hidden="true" className="size-4" />
        </a>
        <BarButton label={copy.close} onClick={onClose}>
          <X aria-hidden="true" className="size-4" />
        </BarButton>
      </div>

      {/* the pages */}
      <div
        ref={scrollRef}
        style={{ touchAction: isDrawingTool ? "none" : "pan-y" }}
        className="relative flex-1 overflow-auto overscroll-contain"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endPointer(event, false)}
        onPointerCancel={(event) => endPointer(event, true)}
        onPointerLeave={() => setLoupe(null)}
        onDragStart={(event) => {
          /* Dragging across the selectable text layer makes the browser start a
             native text drag, which fires pointercancel and throws the page-turn
             gesture away halfway. Refusing the drag keeps the gesture ours; the
             selection the reader made is untouched. */
          event.preventDefault();
        }}
      >
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-white/70">
            <Loader2 aria-hidden="true" className="size-5 animate-spin" />
            {kind === "workbook" ? c.pdfLoadingWorkbook : c.pdfLoading}
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white/70">
            <p>{kind === "workbook" ? c.pdfErrorWorkbook : c.pdfError}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
            >
              {c.pdfOpenNewTab}
            </a>
          </div>
        )}

        <div className="flex min-h-full justify-center p-7">
          <div
            ref={stageRef}
            className="flex flex-col items-center gap-6 will-change-transform"
          >
            <div
              key={turn}
              className={
                (layout === "continuous"
                  ? "pdf-page-enter flex flex-col items-center gap-6"
                  : "pdf-page-enter flex items-start justify-center gap-4")
              }
              style={{ ["--pdf-turn" as string]: `${TURN_MS}ms` }}
            >
              {sheets.map((sheet) => (
                <div
                  key={sheet.n}
                  ref={(node) => {
                    if (node) sheetRefs.current.set(sheet.n, node);
                    else sheetRefs.current.delete(sheet.n);
                  }}
                  className="relative"
                  style={{ boxShadow: `0 18px 48px ${theme.shadow}` }}
                >
                  <PageSheet
                    doc={doc!}
                    pageNumber={sheet.n}
                    cssWidth={sheet.w}
                    cssHeight={sheet.h}
                    scale={resolvedScale}
                    userRotation={userRotation}
                    theme={prefs.theme}
                    filter={theme.filter}
                    textColor={theme.textColor}
                    selectionColor={theme.selectionColor}
                    tool={tool}
                    marks={marks[sheet.n] ?? []}
                    markColor={MARK_COLOR_BY_ID[prefs.markColor]}
                    inkColor={MARK_COLOR_BY_ID[prefs.inkColor]}
                    onTextStats={noteTextStats}
                    onAddMark={addMark}
                    onAreaDrag={areaOn ? (p, rect) => setAreaRect({ page: p, rect }) : undefined}
                    onAreaDone={areaOn ? commitArea : undefined}
                    onNoteRequest={(p, at) => {
                      setNoteDraft({ page: p, x: at.x, y: at.y });
                      setNoteText("");
                    }}
                    onSelectionChange={(p, text) => {
                      if (!text) {
                        setSelection(null);
                        return;
                      }
                      const sel = window.getSelection();
                      const rect = sel?.getRangeAt(0).getBoundingClientRect();
                      setSelection({
                        text,
                        x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
                        y: rect ? rect.top : 120,
                      });
                    }}
                    lazy={layout === "continuous"}
                  />
                  {/* page number under the sheet in multi-page layouts */}
                  {layout !== "single" && (
                    <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/45">
                      {sheet.n}
                    </p>
                  )}
                  {/* the box the reader is dragging for an area zoom */}
                  {areaOn && areaRect?.page === sheet.n && (
                    <div
                      className="pointer-events-none absolute border-2 border-sky-400 bg-sky-400/15"
                      style={{
                        left: `${areaRect.rect.x * 100}%`,
                        top: `${areaRect.rect.y * 100}%`,
                        width: `${areaRect.rect.w * 100}%`,
                        height: `${areaRect.rect.h * 100}%`,
                      }}
                    />
                  )}
                  {/* marks carry a delete target so a wrong highlight can go */}
                  {tool === "none" &&
                    (marks[sheet.n] ?? []).map((mark) =>
                      mark.kind === "note" ? (
                        <button
                          key={mark.id}
                          type="button"
                          onClick={() => removeMark(sheet.n, mark.id)}
                          title={mark.text || copy.toolNote}
                          className="absolute flex size-7 -translate-x-1/2 -translate-y-full items-center justify-center rounded-tl-lg rounded-tr-lg rounded-br-lg bg-amber-400 text-[11px] font-bold text-amber-950 shadow"
                          style={{ left: `${mark.x * 100}%`, top: `${mark.y * 100}%` }}
                        >
                          {mark.text ? mark.text.slice(0, 2) : "•"}
                        </button>
                      ) : null,
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {showHint && status === "ready" && (
          <p className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-fit max-w-[90%] rounded-full bg-black/70 px-4 py-2 text-center text-xs leading-relaxed text-white/90 backdrop-blur">
            {c.pdfHint}
          </p>
        )}

        {/* the note prompt */}
        {noteDraft && (
          <div className="absolute inset-x-0 bottom-4 z-[97] mx-auto w-fit max-w-[92%] rounded-2xl border border-white/15 bg-[#1b1815]/97 p-3 shadow-2xl">
            <label className="block text-[11px] font-bold uppercase tracking-wide text-white/55">
              {copy.notePrompt}
            </label>
            <input
              autoFocus
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveNote();
                if (e.key === "Escape") setNoteDraft(null);
              }}
              className="mt-1.5 w-64 max-w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={saveNote}
                className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-black"
              >
                {copy.noteSave}
              </button>
              <button
                type="button"
                onClick={() => setNoteDraft(null)}
                className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold text-white/85"
              >
                {copy.noteCancel}
              </button>
            </div>
          </div>
        )}
      </div>

      <Magnifier
        source={loupe?.source ?? null}
        center={loupe?.center ?? { x: 0, y: 0 }}
        screen={loupe?.screen ?? { x: 0, y: 0 }}
        size={148}
        factor={2.4}
        visible={Boolean(loupe && prefs.magnifier && !isDrawingTool && typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches)}
      />

      {selection && tool === "none" && (
        <DictionaryPopup
          selection={selection.text}
          language={language === "bn" ? "bn" : "en"}
          c={copy}
          screen={{ x: selection.x, y: selection.y }}
          onDismiss={() => setSelection(null)}
          onSpeak={(text) => speak(text)}
        />
      )}

      <Toolbar
        c={copy}
        language={language === "bn" ? "bn" : "en"}
        page={page}
        numPages={numPages}
        zoomPercent={zoomPercent}
        fit={fit}
        theme={prefs.theme}
        layout={layout}
        tool={prefs.tool}
        markColor={prefs.markColor}
        inkColor={prefs.inkColor}
        magnifier={prefs.magnifier}
        zoomLock={prefs.zoomLock}
        areaZoom={areaOn}
        isFull={isFull}
        speaking={speaking}
        canSpeak={canSpeak}
        bookHasText={bookHasText}
        searching={searching}
        searchQuery={searchQuery}
        searchHits={hits.length}
        searchAt={hitIndex}
        searchMessage={searchMessage}
        onPage={(n) => goTo(n)}
        onZoomPercent={(pct) => zoomTo(pct / 100)}
        onZoomStep={(f) => zoomBy(f)}
        onFit={chooseFit}
        onTheme={(t) => update("theme", t)}
        onLayout={(l) => update("layout", l)}
        onTool={(t) => update("tool", t)}
        onMarkColor={(col) => update("markColor", col)}
        onInkColor={(col) => update("inkColor", col)}
        onToggleMagnifier={() => update("magnifier", !prefs.magnifier)}
        onToggleZoomLock={toggleZoomLock}
        onToggleArea={() => setAreaOn((v) => !v)}
        onRotate={rotate}
        onClearMarks={clearEveryMark}
        onToggleSpeak={() => {
          if (speaking) {
            stop();
            return;
          }
          void readPageAloud();
        }}
        onFullscreen={toggleFullscreen}
        onSearchOpen={() => {
          setSearching(true);
          void runSearch(searchQuery);
        }}
        onSearchQuery={(q) => {
          setSearchQuery(q);
          void runSearch(q);
        }}
        onSearchStep={stepHit}
        onSearchClose={() => {
          setSearching(false);
          setSearchQuery("");
          setHits([]);
          setSearchMessage("");
        }}
      />

      <span className="sr-only" aria-live="polite">
        {pageLabel}
      </span>

      <style>{`@keyframes pdf-page-in { from { opacity: 0.25; } to { opacity: 1; } } @keyframes pdf-turn { from { opacity: 0.4; } to { opacity: 1; } }`}</style>
    </div>,
    document.body,
  );
}

function BarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
    >
      {children}
    </button>
  );
}

/** The lesson-book button, with its reader. Renders nothing if there is no book. */
export function LessonPdfButton({
  level,
  lesson,
  className,
  variant = "pill",
  url: urlOverride,
  kind = "lesson",
}: {
  level: number;
  lesson: number;
  className?: string;
  variant?: "pill" | "ghost";
  /** Read this file instead of the level's lesson book. Used for the workbooks. */
  url?: string | null;
  /** Which book this button opens — decides the wording on the button. */
  kind?: "lesson" | "workbook";
}) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const url = urlOverride || lessonPdfUrl(level, lesson);

  useEffect(() => {
    if (open) return;
    triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  if (!url) return null;

  const isWorkbook = kind === "workbook";
  const title = `HSK ${localizeNumber(level, language)} · ${c.lesson} ${localizeNumber(lesson, language)}`;
  const shell =
    variant === "pill"
      ? "inline-flex items-center gap-2 rounded-full border border-text/15 px-3.5 py-1.5 text-[13px] font-medium text-text/70 transition-colors hover:border-text/30 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
      : "inline-flex items-center gap-1.5 rounded-sm text-[13px] text-text/55 underline decoration-text/20 underline-offset-4 transition-colors hover:text-text hover:decoration-text/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        title={isWorkbook ? c.pdfOpenWorkbook : c.pdfOpenLesson}
        className={className ?? shell}
      >
        <FileText aria-hidden="true" className="size-3.5" />
        {isWorkbook ? c.workbookPdf : c.lessonPdf}
      </button>

      {open && (
        <LessonPdfViewer
          level={level}
          lesson={lesson}
          title={title}
          onClose={() => setOpen(false)}
          url={url}
          kind={kind}
        />
      )}
    </>
  );
}
