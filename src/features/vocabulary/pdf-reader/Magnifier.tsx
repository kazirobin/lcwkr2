// src/features/vocabulary/pdf-reader/Magnifier.tsx
"use client";

import { useEffect, useRef } from "react";

/**
 * A magnifying glass that follows the pointer without zooming the page.
 *
 * Distinct from area zoom on purpose. Area zoom re-renders the page at a new
 * scale, which costs a worker round-trip and moves the text out from under the
 * reader — right for "take me closer", wrong for "let me read this one word".
 * The loupe only copies pixels that are already drawn, so it is instant, costs
 * nothing, and leaves the page exactly where it was.
 */

export interface MagnifierProps {
  /** The page canvas being sampled. Null until the page has rasterised. */
  source: HTMLCanvasElement | null;
  /** Pointer position in CSS pixels, relative to the page canvas. */
  center: { x: number; y: number };
  /** Diameter on screen. */
  size: number;
  /** How much bigger the sampled region looks. */
  factor: number;
  /** Where to sit the glass, in viewport coordinates. */
  screen: { x: number; y: number };
  /** True on a touch device, where a loupe is in the way and useless. */
  visible: boolean;
}

export default function Magnifier({
  source,
  center,
  size,
  factor,
  screen,
  visible,
}: MagnifierProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !visible) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !source || source.width < 2) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    /* Sample width in the source's own pixels: the CSS region the glass covers,
       multiplied by how far we are magnifying it. */
    const rect = source.getBoundingClientRect();
    if (rect.width < 2) return;
    const sourceScale = source.width / rect.width;
    const region = size / factor;
    const cx = center.x * sourceScale;
    const cy = center.y * sourceScale;
    const half = (region * sourceScale) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      source,
      cx - half,
      cy - half,
      half * 2,
      half * 2,
      0,
      0,
      size,
      size,
    );
    ctx.restore();

    /* A rim, so the glass reads as an object sitting above the page rather
       than a hole cut into it. */
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [source, center.x, center.y, size, factor, visible]);

  if (!visible) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed z-[95] rounded-full shadow-2xl"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${screen.x - size / 2}px`,
        top: `${screen.y - size - 18}px`,
      }}
    />
  );
}
