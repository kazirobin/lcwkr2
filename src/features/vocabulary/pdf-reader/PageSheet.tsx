// src/features/vocabulary/pdf-reader/PageSheet.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { PageMark } from "./annotations";
import { MARK_COLOR_BY_ID } from "./types";
import type { ReaderTheme, ReaderTool } from "./types";

/**
 * One page of a book, in three stacked layers:
 *
 *   1. a canvas with the page drawn at the screen's own pixel density,
 *   2. pdf.js's text layer, invisible but selectable,
 *   3. a canvas holding whatever the reader has drawn or highlighted.
 *
 * Layer 1 is rasterised for the *device* pixel ratio, capped at 2. Without the
 * cap a modern phone would ask for 3× and the page would be drawn three times
 * larger than anything can show; with it, zooming in re-rasterises rather than
 * stretching, which is the difference between a page that stays legible and one
 * that turns to mush.
 */

const DPR_CAP = 2;

/** The rules pdf.js's text layer needs in order to be selectable and invisible.
    `-webkit-user-drag: none` stops the browser treating a sideways drag of the
    text as a native drag, which would cancel the reader's own page-turn
    gesture; selection itself still works. */
const TEXT_LAYER_CSS = `
.textLayer { position: absolute; inset: 0; overflow: hidden; opacity: 1; line-height: 1; text-size-adjust: none; forced-color-adjust: none; transform-origin: 0 0; }
.textLayer span, .textLayer br { color: transparent; position: absolute; white-space: pre; cursor: text; transform-origin: 0 0; -webkit-user-drag: none; }
`;

export interface PageSheetProps {
  doc: PDFDocumentProxy;
  pageNumber: number;
  /** Rendered CSS size of the page, supplied by the reader so pages can be laid out before they raster. */
  cssWidth: number;
  cssHeight: number;
  scale: number;
  /** Extra rotation the reader asked for, on top of whatever the file says. */
  userRotation: number;
  theme: ReaderTheme;
  filter: string;
  textColor: string;
  selectionColor: string;
  tool: ReaderTool;
  marks: PageMark[];
  markColor: string;
  inkColor: string;
  /** Text tools are pointless on a scanned page; this reports what the page has. */
  onTextStats?: (page: number, charCount: number) => void;
  onAddMark?: (page: number, mark: PageMark) => void;
  /** Fired while the reader drags out an area-zoom box, so it can show it. */
  onAreaDrag?: (page: number, rect: { x: number; y: number; w: number; h: number }) => void;
  /** Fired when the drag is let go, which is when the reader zooms to it. */
  onAreaDone?: (page: number, rect: { x: number; y: number; w: number; h: number }) => void;
  /** Fired when the reader taps with the note tool. */
  onNoteRequest?: (page: number, at: { x: number; y: number }) => void;
  onSelectionChange?: (page: number, text: string) => void;
  /**
   * Hold off rasterising until the page is nearly on screen. In scroll mode a
   * workbook is eighteen scanned pages; drawing all of them at once would spend
   * the reader's battery and memory on pages nobody is looking at.
   */
  lazy?: boolean;
}

interface Draft {
  points: { x: number; y: number }[];
}

export default function PageSheet({
  doc,
  pageNumber,
  cssWidth,
  cssHeight,
  scale,
  userRotation,
  filter,
  textColor,
  selectionColor,
  tool,
  marks,
  markColor,
  inkColor,
  onTextStats,
  onAddMark,
onAreaDrag,
  onAreaDone,
  onNoteRequest,
  onSelectionChange,
  lazy = false,
}: PageSheetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const textHostRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<Draft | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const drawingRef = useRef(false);
  /* The selected text takes the reader's mark colour, so what they picked looks
     like the pencil they are holding. */
  const layerCss = `${TEXT_LAYER_CSS}\n.textLayer ::selection { background: ${selectionColor}; }`;
  const [paintVersion, setPaintVersion] = useState(0);
  const canObserve = typeof IntersectionObserver !== "undefined";
  const [near, setNear] = useState(!lazy || !canObserve);

  /* Rasterise only what is close to the viewport. The generous margin means a
     flick of the scroll wheel is already painting by the time it lands. */
  useEffect(() => {
    if (!lazy || !canObserve) return;
    const node = sheetRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setNear(true);
      },
      { rootMargin: "700px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [lazy, canObserve]);

  const dpr = Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio || 1, DPR_CAP);
  const width = Math.max(1, Math.floor(cssWidth));
  const height = Math.max(1, Math.floor(cssHeight));

  /* ── the page itself ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width < 2 || height < 2 || !near) return;
    let disposed = false;
    let task: { cancel: () => void; promise: Promise<void> } | null = null;

    (async () => {
      try {
        const page = await doc.getPage(pageNumber);
        if (disposed) return;
        const rotation = (((page.rotate % 360) + 360) % 360 + userRotation) % 360;
        const viewport = page.getViewport({ scale: scale * dpr, rotation });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        task = page.render({ canvas, viewport });
        await task.promise;
        page.cleanup();
      } catch {
        /* a cancelled render is the normal path while zooming */
      }
    })();

    return () => {
      disposed = true;
      task?.cancel();
    };
  }, [doc, pageNumber, width, height, scale, userRotation, dpr, near]);

  /* ── the selectable text on top of it ──
     Skipped entirely when the reader is not asking for text: on a scanned page
     there is nothing to find, and building the layer would cost a worker
     round-trip per page for no result. */
  useEffect(() => {
    const host = textHostRef.current;
    if (!host) return;
    if (!near || tool === "ink" || tool === "highlight" || tool === "underline") {
      host.innerHTML = "";
      host.dataset.empty = "1";
      return;
    }
    let disposed = false;
    let layer: { render: () => Promise<unknown>; cancel: () => void } | null = null;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (disposed) return;
        const page = await doc.getPage(pageNumber);
        const textContent = await page.getTextContent();
        if (disposed) return;

        const chars = textContent.items.reduce(
          (n, item) => n + (("str" in item && item.str) || "").trim().length,
          0,
        );
        onTextStats?.(pageNumber, chars);

        if (chars <= 40) {
          host.innerHTML = "";
          host.dataset.empty = "1";
          return;
        }
        delete host.dataset.empty;

        const rotation = (((page.rotate % 360) + 360) % 360 + userRotation) % 360;
        const viewport = page.getViewport({ scale, rotation });
        host.style.width = `${width}px`;
        host.style.height = `${height}px`;
        host.replaceChildren();

        layer = new pdfjs.TextLayer({
          /* The text is already in hand, so hand the layer what it was fetched
             for rather than making it ask the page again. */
          textContentSource: textContent,
          container: host,
          viewport,
        });
        await layer.render();
        page.cleanup();
      } catch {
        /* a page without usable text is not an error worth showing */
      }
    })();

    return () => {
      disposed = true;
      layer?.cancel();
      host.replaceChildren();
    };
  }, [doc, pageNumber, width, height, scale, userRotation, tool, onTextStats, near]);

  /* ── the marks ──
     Redrawn whenever the page, the zoom, the rotation or the mark list
     changes. Drawing happens in the PDF's own normalised space via pdf.js's
     viewport matrix, so a highlight stays on its words at any zoom and turns
     with the page. */
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas || width < 2 || height < 2) return;
    let disposed = false;

    (async () => {
      try {
        const page = await doc.getPage(pageNumber);
        if (disposed) return;
        const rotation = (((page.rotate % 360) + 360) % 360 + userRotation) % 360;
        const base = page.getViewport({ scale: 1, rotation });
        const disp = page.getViewport({ scale, rotation });

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const [a, b, c, d, e, f] = disp.transform;
        const W = base.width;
        const H = base.height;
        /* Normalised (u,v) -> device pixels, in one matrix. */
        ctx.setTransform(a * W * dpr, b * W * dpr, c * H * dpr, d * H * dpr, e * dpr, f * dpr);
        const unitX = Math.hypot(a * W, b * W) * dpr || 1;

        for (const mark of [...marks]) drawMark(ctx, mark, unitX);

        const draft = draftRef.current;
        if (draft && draft.points.length > 1) {
          ctx.strokeStyle = inkColor;
          ctx.lineWidth = 3 / unitX;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          tracePath(ctx, draft.points);
        }
        if (startRef.current && tool === "area") {
          /* handled by the reader's own overlay box, not painted here */
        }
      } catch {
        /* nothing to draw onto */
      }
    })();

    return () => {
      disposed = true;
    };
  }, [doc, pageNumber, width, height, scale, userRotation, dpr, marks, inkColor, tool, paintVersion]);

  /* ── pointer: drawing marks, dragging an area to zoom, dropping a note ── */
  const toLocal = useCallback((event: React.PointerEvent): { x: number; y: number } | null => {
    const host = overlayRef.current;
    if (!host) return null;
    const rect = host.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return null;
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (tool === "none") return;
      const at = toLocal(event);
      if (!at) return;
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      drawingRef.current = true;
      startRef.current = at;

      if (tool === "note") {
        onNoteRequest?.(pageNumber, at);
        drawingRef.current = false;
        return;
      }
      draftRef.current = { points: [at] };
      setPaintVersion((v) => v + 1);
    },
    [tool, toLocal, pageNumber, onNoteRequest],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return;
      const at = toLocal(event);
      const start = startRef.current;
      if (!at || !start) return;
      event.stopPropagation();

      if (tool === "area") {
        onAreaDrag?.(pageNumber, {
          x: Math.min(start.x, at.x),
          y: Math.min(start.y, at.y),
          w: Math.abs(at.x - start.x),
          h: Math.abs(at.y - start.y),
        });
        return;
      }
      if (tool === "ink" && draftRef.current) {
        draftRef.current.points.push(at);
        setPaintVersion((v) => v + 1);
      }
    },
    [tool, toLocal, pageNumber, onAreaDrag],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return;
      const at = toLocal(event);
      const start = startRef.current;
      drawingRef.current = false;
      startRef.current = null;
      const draft = draftRef.current;
      draftRef.current = null;
      if (!at || !start) {
        setPaintVersion((v) => v + 1);
        return;
      }

      const x = Math.min(start.x, at.x);
      const y = Math.min(start.y, at.y);
      const w = Math.abs(at.x - start.x);
      const h = Math.abs(at.y - start.y);

      if (tool === "ink") {
        if (draft && draft.points.length > 1) {
          onAddMark?.(pageNumber, {
            kind: "ink",
            id: "",
            points: draft.points,
            color: inkColor,
            width: 3,
          });
        }
      } else if (tool === "highlight" || tool === "underline") {
        if (w > 0.01 || h > 0.006) {
          onAddMark?.(pageNumber, {
            kind: tool,
            id: "",
            x,
            y,
            w,
            h: tool === "underline" ? Math.max(h, 0.012) : Math.max(h, 0.02),
            color: markColor,
          });
        }
      } else if (tool === "area") {
        if (w > 0.02 && h > 0.02) {
          onAreaDone?.(pageNumber, { x, y, w, h });
        }
      }
      setPaintVersion((v) => v + 1);
    },
    [tool, toLocal, pageNumber, onAddMark, onAreaDone, inkColor, markColor],
  );

  /* A drag that ends outside the page must still finish cleanly. */
  useEffect(() => {
    const onUp = () => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      draftRef.current = null;
      startRef.current = null;
      setPaintVersion((v) => v + 1);
    };
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  /** Whether the sheet's own overlay should take the pointer instead of the page. */
  const drawing = tool !== "none" && tool !== "pan";

  return (
    <div
      ref={sheetRef}
      className="relative shrink-0 overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <style>{layerCss}</style>
      <canvas
        ref={canvasRef}
        className="block"
        style={{ width: `${width}px`, height: `${height}px`, filter }}
      />

      {/* The text sits here: transparent, selectable, and never in the way of
          the marks drawn on top of it. */}
      <div
        ref={textHostRef}
        className="textLayer"
        data-empty="1"
        style={{ color: textColor, userSelect: "text" }}
        onMouseUp={() => {
          const picked = window.getSelection()?.toString().trim() ?? "";
          onSelectionChange?.(pageNumber, picked);
        }}
      />

{/* Only a drawing tool needs the overlay to catch the pointer. With the
          read tools it must get out of the way, or it would swallow the text
          selection underneath it. */}
      <canvas
        ref={overlayRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="absolute inset-0"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          cursor: drawing ? "crosshair" : "default",
          touchAction: drawing ? "none" : undefined,
          pointerEvents: drawing ? "auto" : "none",
        }}
      />
    </div>
  );
}

function tracePath(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) {
  const first = points[0];
  if (!first) return;
  ctx.beginPath();
  ctx.moveTo(first.x, first.y);
  for (const p of points.slice(1)) ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

function drawMark(ctx: CanvasRenderingContext2D, mark: PageMark, unitX: number) {
  if (mark.kind === "ink") {
    ctx.strokeStyle = mark.color;
    ctx.lineWidth = mark.width / unitX;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    tracePath(ctx, mark.points);
    return;
  }
  if (mark.kind === "note") return;

  const color = mark.color || MARK_COLOR_BY_ID.yellow;
  if (mark.kind === "highlight") {
    /* Multiply would darken; a translucent fill is what a real highlighter
       does to whatever is underneath it. */
    ctx.globalAlpha = 0.32;
    ctx.fillStyle = color;
    ctx.fillRect(mark.x, mark.y, mark.w, mark.h);
    ctx.globalAlpha = 1;
    return;
  }
  /* Underline: a thin bar along the bottom edge of the dragged area. */
  ctx.fillStyle = color;
  ctx.fillRect(mark.x, mark.y + mark.h * 0.92, mark.w, Math.max(mark.h * 0.12, 0.008));
}
