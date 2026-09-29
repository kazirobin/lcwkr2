// src/features/vocabulary/components/LessonPdfViewer.tsx
//
// The lesson book, read in place. A button opens the lesson PDF in a
// full-screen reader: zoom, page turns, fit-width / fit-page, rotate and full
// screen, with the usual keyboard shortcuts. Built on pdf.js, which is
// imported dynamically so the ~0.5 MB engine only downloads when a book is
// actually opened. If it cannot start, the raw file is still one click away
// in a new tab.
//
// Built for a phone first, because that is where books get read: swipe left or
// right to turn the page, pinch or double-tap to zoom, and a back arrow that
// puts you exactly where you were. Every gesture is anchored, so the thing you
// are looking at is the thing that stays still.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCw,
  X,
} from "lucide-react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { useLanguage } from "@/i18n";
import { localizeNumber, vocabularyCopy } from "../i18n";
import { lessonPdfUrl } from "../pdf";

/** Copied out of node_modules by scripts/copy-pdf-worker.mjs. */
const WORKER_SRC = "/pdfjs/pdf.worker.min.mjs";
const MIN_SCALE = 0.2;
const MAX_SCALE = 6;
const ZOOM_STEP = 1.25;
/** Breathing room between the page and the edges of the scroll box. */
const PAGE_PADDING = 28;
/** How far a drag travels before it counts as a page turn. */
const SWIPE_DISTANCE = 56;
/** ...and it has to be that much more sideways than up-and-down. */
const SWIPE_SLOP = 1.4;
/** What a double tap zooms *to* — a page that fills the screen is not readable. */
const READ_SCALE = 2.2;
const DOUBLE_TAP_MS = 320;
const DOUBLE_TAP_DISTANCE = 32;
const HINT_SHOW_MS = 1400;
const HINT_HIDE_MS = 6200;
const HINT_KEY = "lcwkr_pdf_reader_hint";

type ViewMode = "width" | "page" | "custom";
type Status = "loading" | "ready" | "error";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * pdf.js 6 asks for the ES2025 `Uint8Array.prototype.toHex`. Browsers that
 * predate it (and Node) would throw inside the worker, so add it if missing.
 */
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

/** A square tool button that never loses its hit area. */
function Tool({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex size-8 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export function LessonPdfViewer({
  level,
  lesson,
  title,
  onClose,
}: {
  level: number;
  lesson: number;
  title: string;
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];
  const url = lessonPdfUrl(level, lesson) ?? "";

  const [status, setStatus] = useState<Status>("loading");
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  // Extra rotation the reader has asked for on top of whatever the file itself
  // asks for. Starts at 0 so every book opens the way its author intended.
  const [userRotation, setUserRotation] = useState(0);
  // Every book opens at its printed size — scale 1 is 100% of the PDF, so a
  // character is drawn at the size the author set. Fit-width and fit-page stay
  // available from the toolbar for the times a screen is too narrow for that.
  const [mode, setMode] = useState<ViewMode>("custom");
  const [custom, setCustom] = useState(1);
  const [scale, setScale] = useState(1);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [isFull, setIsFull] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** The page, wrapped so a swipe can slide it without a re-render. */
  const sheetRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const loadingRef = useRef<PDFDocumentLoadingTask | null>(null);
  const taskRef = useRef<RenderTask | null>(null);
  const taskIdRef = useRef(0);

  /* Live mirrors of what is on screen. Gestures run outside React's render,
     so they need the drawn size without waiting for the next state. */
  const scaleRef = useRef(1);
  /** The scale a double tap should return to; see `toggleReadZoom`. */
  const readingRef = useRef(1);
  const fitsRef = useRef(true);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const dragRef = useRef<{ x: number; y: number; panning: boolean } | null>(null);
  const lastTapRef = useRef({ at: 0, x: 0, y: 0 });

  /* open the book — the modal mounts fresh each time, so state starts clean */
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
        setNumPages(doc.numPages);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      taskIdRef.current += 1;
      taskRef.current?.cancel();
      taskRef.current = null;
      docRef.current = null;
      const loading = loadingRef.current;
      loadingRef.current = null;
      if (loading) void loading.destroy();
    };
  }, [url]);

  /* keep the page inside the book */
  const goTo = useCallback(
    (next: number) => {
      setPage((current) => {
        const wanted = clamp(next, 1, numPages || 1);
        return wanted === current ? current : wanted;
      });
      scrollRef.current?.scrollTo({ top: 0 });
    },
    [numPages],
  );

  /**
   * Zoom to an exact size, holding `anchor` (a client point) still.
   *
   * The scroll offsets are corrected in the same breath as the new scale, so
   * the word under your finger is the word under your finger afterwards. Doing
   * it in a state updater instead would be a side effect in render, and the
   * correction would land a frame late — which is exactly the wobble that
   * makes pinch-zoom feel cheap.
   */
  const zoomTo = useCallback((next: number, anchor?: { x: number; y: number }) => {
    const node = scrollRef.current;
    const canvas = canvasRef.current;
    const from = scaleRef.current;
    const to = clamp(next, MIN_SCALE, MAX_SCALE);
    if (Math.abs(to - from) < 0.0005) return;

    setMode("custom");
    setCustom(to);

    if (!node || !canvas || !anchor) return;
    const rect = node.getBoundingClientRect();
    const ax = anchor.x - rect.left;
    const ay = anchor.y - rect.top;
    const k = to / from;
    const px = node.scrollLeft + ax;
    const py = node.scrollTop + ay;
    node.scrollLeft = canvas.offsetLeft + (px - canvas.offsetLeft) * k - ax;
    node.scrollTop = canvas.offsetTop + (py - canvas.offsetTop) * k - ay;
  }, []);

  const zoomBy = useCallback(
    (factor: number) => {
      zoomTo(scaleRef.current * factor);
    },
    [zoomTo],
  );

  const zoomToWidth = useCallback(() => setMode("width"), []);
  const zoomToPage = useCallback(() => setMode("page"), []);

  /* A double tap flips between "the size you were reading" and "readable
     size". The remembered size is whichever scale the reader is *not* currently
     at, so this works from 100%, from fit-width and from fit-page alike rather
     than assuming the book opened fit-to-width. */
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

  const rotate = useCallback(() => {
    setUserRotation((value) => (value + 90) % 360);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const node = rootRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void node.requestFullscreen().catch(() => {});
    }
  }, []);

  /* follow the browser's own full screen state, so Esc stays truthful */
  useEffect(() => {
    const onChange = () => setIsFull(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* measure the reading area so fit-width and fit-page have something to fit */
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const measure = () => setBox({ w: node.clientWidth, h: node.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [status]);

  /* draw the current page */
  useEffect(() => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (status !== "ready" || !doc || !canvas) return;

    const id = ++taskIdRef.current;
    let disposed = false;

    (async () => {
      try {
        const pdfPage = await doc.getPage(page);
        if (disposed || id !== taskIdRef.current) return;

        // pdf.js uses `page.rotate` as the default viewport rotation, and any
        // rotation we pass replaces it rather than adding to it. So the book's
        // own rotation is the base and the reader's button is layered on top.
        const rotation = (((pdfPage.rotate % 360) + 360) % 360 + userRotation) % 360;

        const base = pdfPage.getViewport({ scale: 1, rotation });
        const fitWidth = (box.w - PAGE_PADDING) / base.width || 1;
        const fitPage =
          Math.min((box.w - PAGE_PADDING) / base.width, (box.h - PAGE_PADDING) / base.height) || 1;
        const wanted = clamp(
          mode === "width" ? fitWidth : mode === "page" ? fitPage : custom,
          MIN_SCALE,
          MAX_SCALE,
        );

        /* Gesture maths reads this straight away, so set it before the render
           rather than in the setState below. */
        scaleRef.current = wanted;

        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = pdfPage.getViewport({ scale: wanted * ratio, rotation });

        taskRef.current?.cancel();
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${viewport.width / ratio}px`;
        canvas.style.height = `${viewport.height / ratio}px`;

        const node = scrollRef.current;
        fitsRef.current = !node || canvas.offsetWidth <= node.clientWidth + 1;

        const task = pdfPage.render({ canvas, viewport });
        taskRef.current = task;
        await task.promise;
        if (!disposed && id === taskIdRef.current) setScale(wanted);
        pdfPage.cleanup();
      } catch {
        /* a cancelled render is the normal path when zooming fast */
      }
    })();

    return () => {
      disposed = true;
    };
  }, [status, page, userRotation, mode, custom, box.w, box.h]);

  /* ── wheel and trackpad pinch zoom ──
   * React's onWheel is passive, so preventDefault there is a no-op and the
   * page zooms as well as the book. A native listener is the only way to take
   * the gesture. A plain wheel is left alone: it still scrolls. */
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      /* Trackpad pinch and ctrl+wheel both arrive as ctrlKey. */
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const delta = clamp(event.deltaY, -100, 100);
      zoomTo(scaleRef.current * Math.exp(-delta * 0.01), {
        x: event.clientX,
        y: event.clientY,
      });
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [zoomTo]);

  /* ── touch: pinch to zoom, swipe to turn, double tap to read ── */
  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const node = scrollRef.current;
    const canvas = canvasRef.current;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);

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

    /* A page that fits has nothing to pan, so a sideways drag is a page turn.
       A zoomed page is panned instead — otherwise the drag would fight the
       scroll position. */
    const fits = !node || !canvas || canvas.offsetWidth <= node.clientWidth + 1;
    dragRef.current = { x: event.clientX, y: event.clientY, panning: !fits };
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    const pinch = pinchRef.current;
    if (pinch && pointersRef.current.size >= 2) {
      const [a, b] = [...pointersRef.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      zoomTo(pinch.scale * (dist / pinch.dist), {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
      });
      return;
    }

    const drag = dragRef.current;
    const node = scrollRef.current;
    if (!drag || !node) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;

    if (drag.panning) {
      /* Sideways scrolling is ours: touch-action is pan-y so the browser only
         ever takes the vertical axis. */
      node.scrollLeft -= dx;
      return;
    }

    /* Follow the finger. Applied to the wrapper rather than to state, so a drag
       costs no renders and stays glued to the touch. */
    const sheet = sheetRef.current;
    if (sheet) {
      const travelling = Math.abs(dx) > Math.abs(dy) * SWIPE_SLOP;
      sheet.style.transition = "none";
      sheet.style.transform = travelling ? `translate3d(${dx * 0.55}px, 0, 0)` : "none";
    }
  }, [zoomTo]);

  const endPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
      pointersRef.current.delete(event.pointerId);
      if (pointersRef.current.size < 2) pinchRef.current = null;

      const drag = dragRef.current;
      if (!drag || pointersRef.current.size > 0) return;
      dragRef.current = null;

      const sheet = sheetRef.current;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;

      /* A tap, not a drag: either a double tap to zoom, or nothing at all. */
      if (!cancelled && Math.abs(dx) < 10 && Math.abs(dy) < 10 && !drag.panning) {
        const now = performance.now();
        const last = lastTapRef.current;
        const isDouble =
          now - last.at < DOUBLE_TAP_MS &&
          Math.hypot(event.clientX - last.x, event.clientY - last.y) < DOUBLE_TAP_DISTANCE;
        if (isDouble) {
          lastTapRef.current = { at: 0, x: 0, y: 0 };
          setShowHint(false);
          toggleReadZoom({ x: event.clientX, y: event.clientY });
          return;
        }
        lastTapRef.current = { at: now, x: event.clientX, y: event.clientY };
        return;
      }

      if (sheet) sheet.style.transition = "transform 160ms ease-out";
      if (cancelled) {
        if (sheet) sheet.style.transform = "none";
        return;
      }

      const sideways = Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * SWIPE_SLOP;
      if (sideways) {
        /* Swipe left → forward, swipe right → back, the way every reader does. */
        goTo(page + (dx < 0 ? 1 : -1));
      }
      if (sheet) sheet.style.transform = "none";
    },
    [goTo, page, toggleReadZoom],
  );

  /* keyboard: page turns, zoom, fit, full screen, back */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
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
          zoomToWidth();
          break;
        case "f":
        case "F":
          event.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (!document.fullscreenElement) onClose();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, goTo, zoomBy, zoomToWidth, toggleFullscreen, onClose]);

  /* The book is the whole screen while it is open. The scrollbar's width is
     given back as padding, or the page underneath visibly jumps sideways the
     moment the reader opens and again when it closes. */
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

  /* One short nudge, once per browser, then never again. */
  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(HINT_KEY);
    } catch {
      /* private mode: show it every time rather than crash */
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

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[80] flex flex-col bg-[#14110e] text-white"
    >
      {/* title bar */}
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-2 py-2 sm:gap-3 sm:px-4">
        <Tool label={c.pdfBack} onClick={onClose}>
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Tool>
        <FileText aria-hidden="true" className="hidden size-4 shrink-0 text-white/60 sm:block" />
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{title}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={c.pdfOpenNewTab}
          aria-label={c.pdfOpenNewTab}
          className="flex size-8 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
        >
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
        <a
          href={url}
          download
          title={c.pdfDownload}
          aria-label={c.pdfDownload}
          className="flex size-8 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
        >
          <Download aria-hidden="true" className="size-4" />
        </a>
        <Tool label={c.pdfClose} onClick={onClose}>
          <X aria-hidden="true" className="size-4" />
        </Tool>
      </div>

      {/* the page */}
      <div
        ref={scrollRef}
        /* `pan-y` leaves vertical scrolling to the browser and hands the
           horizontal axis to us, which is what makes a swipe a page turn and a
           pinch our own zoom instead of the browser's. */
        style={{ touchAction: "pan-y" }}
        className="relative flex-1 select-none overflow-auto overscroll-contain bg-[#1c1815]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endPointer(event, false)}
        onPointerCancel={(event) => endPointer(event, true)}
        onDoubleClick={(event) => {
          event.preventDefault();
          toggleReadZoom({ x: event.clientX, y: event.clientY });
        }}
      >
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-white/70">
            <Loader2 aria-hidden="true" className="size-5 animate-spin" />
            {c.pdfLoading}
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white/70">
            <p>{c.pdfError}</p>
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

        <div className="flex min-h-full items-center justify-center p-7">
          <div ref={sheetRef} className="bg-white shadow-2xl">
            <canvas
              ref={canvasRef}
              className={`block ${status === "ready" ? "" : "hidden"}`}
            />
          </div>
        </div>

        {showHint && status === "ready" && (
          <p className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-fit max-w-[90%] rounded-full bg-black/70 px-4 py-2 text-center text-xs leading-relaxed text-white/90 backdrop-blur">
            {c.pdfHint}
          </p>
        )}
      </div>

      {/* controls */}
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-white/10 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-1">
          <Tool label={c.pdfPrev} onClick={() => goTo(page - 1)} disabled={page <= 1}>
            <ChevronLeft aria-hidden="true" className="size-4" />
          </Tool>
          <label className="flex items-center gap-1.5 text-xs text-white/70">
            <span className="sr-only sm:not-sr-only">{c.pdfPage}</span>
            <input
              type="number"
              min={1}
              max={Math.max(numPages, 1)}
              value={page}
              onChange={(event) => goTo(Number(event.target.value))}
              className="h-8 w-12 rounded-md border border-white/15 bg-white/5 px-2 text-center font-mono text-xs tabular-nums text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            />
            <span aria-live="polite" className="font-mono tabular-nums">
              / {numPages || "–"}
            </span>
          </label>
          <Tool label={c.pdfNext} onClick={() => goTo(page + 1)} disabled={page >= numPages}>
            <ChevronRight aria-hidden="true" className="size-4" />
          </Tool>
        </div>

        <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-white/12 sm:block" />

        <div className="flex items-center gap-1">
          <Tool label={c.pdfZoomOut} onClick={() => zoomBy(1 / ZOOM_STEP)}>
            <Minus aria-hidden="true" className="size-4" />
          </Tool>
          <span className="min-w-12 text-center font-mono text-xs tabular-nums text-white/75">
            {status === "ready" ? `${Math.round(scale * 100)}%` : "–"}
          </span>
          <Tool label={c.pdfZoomIn} onClick={() => zoomBy(ZOOM_STEP)}>
            <Plus aria-hidden="true" className="size-4" />
          </Tool>
        </div>

        <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-white/12 sm:block" />

        <div className="flex items-center gap-1">
          <Tool label={c.pdfFitWidth} onClick={zoomToWidth}>
            <span aria-hidden="true" className="font-mono text-[11px] font-bold">
              ↔
            </span>
          </Tool>
          <Tool label={c.pdfFitPage} onClick={zoomToPage}>
            <span aria-hidden="true" className="font-mono text-[11px] font-bold">
              ⤢
            </span>
          </Tool>
          <Tool label={c.pdfRotate} onClick={rotate}>
            <RotateCw aria-hidden="true" className="size-4" />
          </Tool>
          <Tool label={isFull ? c.pdfExitFullscreen : c.pdfFullscreen} onClick={toggleFullscreen}>
            {isFull ? (
              <Minimize2 aria-hidden="true" className="size-4" />
            ) : (
              <Maximize2 aria-hidden="true" className="size-4" />
            )}
          </Tool>
        </div>

        <span className="sr-only" aria-live="polite">
          {pageLabel}
        </span>
      </div>
    </div>,
    document.body,
  );
}

/** The lesson-book button, with its reader. Renders nothing if there is no book. */
export function LessonPdfButton({
  level,
  lesson,
  className,
  variant = "pill",
}: {
  level: number;
  lesson: number;
  className?: string;
  variant?: "pill" | "ghost";
}) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const url = lessonPdfUrl(level, lesson);

  /* Closing the reader puts the caret back on the button that opened it, so the
     next one is a single keypress away instead of a hunt for the cursor. */
  useEffect(() => {
    if (open) return;
    triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  if (!url) return null;

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
        title={c.pdfOpenLesson}
        className={className ?? shell}
      >
        <FileText aria-hidden="true" className="size-3.5" />
        {c.lessonPdf}
      </button>

      {open && (
        <LessonPdfViewer
          level={level}
          lesson={lesson}
          title={title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
