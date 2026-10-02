// src/features/vocabulary/pdf-reader/Toolbar.tsx
"use client";

import { useState } from "react";
import {
  BookOpen,
  Columns2,
  Crop,
  Eraser,
  Highlighter,
  Lock,
  Maximize2,
  MessageSquarePlus,
  Minus,
  MousePointer2,
  Plus,
  RotateCw,
  Search,
  SearchX,
  SlidersHorizontal,
  Square,
  StickyNote,
  Underline,
  Unlock,
  Volume2,
  VolumeX,
  ZoomIn,
} from "lucide-react";
import type { ReaderCopy } from "./copy";
import { MARK_COLORS, READER_THEMES, READER_THEME_ORDER } from "./types";
import type { MarkColorId, PageLayout, ReaderTheme, ReaderTool } from "./types";

/**
 * The controls. A bottom bar for the four things done on every page — turn,
 * zoom, fit — and a panel for everything else.
 *
 * The split is not decoration. Fifteen tools laid out in one row on a phone is
 * fifteen targets too small to hit, so the bar keeps only what is used
 * constantly and the rest waits one tap away, labelled with words rather than
 * left as icons a new student has to guess at.
 */

export interface ToolbarProps {
  c: ReaderCopy;
  language: "bn" | "en";
  page: number;
  numPages: number;
  zoomPercent: number;
  /** Which fit mode is active, if any. */
  fit: "width" | "page" | null;
  theme: ReaderTheme;
  layout: PageLayout;
  tool: ReaderTool;
  markColor: MarkColorId;
  inkColor: MarkColorId;
  magnifier: boolean;
  zoomLock: boolean;
  areaZoom: boolean;
  isFull: boolean;
  speaking: boolean;
  canSpeak: boolean;
  bookHasText: boolean;
  searching: boolean;
  searchQuery: string;
  searchHits: number;
  searchAt: number;
  searchMessage: string;

  onPage: (n: number) => void;
  onZoomPercent: (pct: number) => void;
  onZoomStep: (factor: number) => void;
  onFit: (mode: "width" | "page") => void;
  onTheme: (t: ReaderTheme) => void;
  onLayout: (l: PageLayout) => void;
  onTool: (t: ReaderTool) => void;
  onMarkColor: (c: MarkColorId) => void;
  onInkColor: (c: MarkColorId) => void;
  onToggleMagnifier: () => void;
  onToggleZoomLock: () => void;
  onToggleArea: () => void;
  onRotate: () => void;
  onClearMarks: () => void;
  onToggleSpeak: () => void;
  onFullscreen: () => void;
  onSearchOpen: () => void;
  onSearchQuery: (q: string) => void;
  onSearchStep: (delta: number) => void;
  onSearchClose: () => void;
}

function IconButton({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
      className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:pointer-events-none disabled:opacity-30 ${
        active
          ? "bg-white/20 text-white"
          : "text-white/80 hover:bg-white/15 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ${
        active
          ? "border-white/70 bg-white/20 text-white"
          : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function Toolbar(props: ToolbarProps) {
  const { c } = props;
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const toolList: { id: ReaderTool; label: string; icon: React.ReactNode }[] = [
    { id: "none", label: c.toolNone, icon: <MousePointer2 aria-hidden="true" className="size-3.5" /> },
    { id: "ink", label: c.toolInk, icon: <Underline aria-hidden="true" className="size-3.5" /> },
    {
      id: "highlight",
      label: c.toolHighlight,
      icon: <Highlighter aria-hidden="true" className="size-3.5" />,
    },
    {
      id: "underline",
      label: c.toolUnderline,
      icon: <span aria-hidden="true" className="text-[11px] font-bold">
        U
      </span>,
    },
    { id: "note", label: c.toolNote, icon: <StickyNote aria-hidden="true" className="size-3.5" /> },
  ];

  return (
    <div className="shrink-0 border-t border-white/10 bg-[#14110e]">
      {/* search strip */}
      {props.searching && (
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2">
          <Search aria-hidden="true" className="size-4 shrink-0 text-white/50" />
          <input
            autoFocus
            type="search"
            value={props.searchQuery}
            placeholder={c.searchPlaceholder}
            aria-label={c.search}
            onChange={(e) => props.onSearchQuery(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          />
          <span className="font-mono text-[11px] tabular-nums text-white/60">
            {props.searchHits > 0 ? `${props.searchAt + 1}/${props.searchHits}` : ""}
          </span>
          <IconButton label={c.searchPrev} onClick={() => props.onSearchStep(-1)} disabled={props.searchHits === 0}>
            <Minus aria-hidden="true" className="size-4" />
          </IconButton>
          <IconButton label={c.searchNext} onClick={() => props.onSearchStep(1)} disabled={props.searchHits === 0}>
            <Plus aria-hidden="true" className="size-4" />
          </IconButton>
          <IconButton label={c.close} onClick={props.onSearchClose}>
            <SearchX aria-hidden="true" className="size-4" />
          </IconButton>
          {props.searchMessage && (
            <p className="w-full text-[11px] leading-relaxed text-amber-200/90">{props.searchMessage}</p>
          )}
        </div>
      )}

      {/* the panel */}
      {open && (
        <div className="max-h-[46vh] space-y-3 overflow-y-auto border-b border-white/10 px-3 py-3">
          {/* theme */}
          <Row label={c.theme}>
            {READER_THEME_ORDER.map((id) => (
              <Chip key={id} label={READER_THEMES[id].label[props.language]} active={props.theme === id} onClick={() => props.onTheme(id)}>
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full border border-white/30"
                  style={{ background: READER_THEMES[id].backdrop }}
                />
                {READER_THEMES[id].label[props.language]}
              </Chip>
            ))}
          </Row>

          {/* layout */}
          <Row label={c.layout}>
            <Chip label={c.single} active={props.layout === "single"} onClick={() => props.onLayout("single")}>
              <Square aria-hidden="true" className="size-3.5" />
              {c.single}
            </Chip>
            <Chip label={c.continuous} active={props.layout === "continuous"} onClick={() => props.onLayout("continuous")}>
              <BookOpen aria-hidden="true" className="size-3.5" />
              {c.continuous}
            </Chip>
            <Chip label={c.twoPage} active={props.layout === "twoPage"} onClick={() => props.onLayout("twoPage")}>
              <Columns2 aria-hidden="true" className="size-3.5" />
              {c.twoPage}
            </Chip>
          </Row>

          {/* markup tools */}
          <Row label={c.tools}>
            {toolList.map((t) => (
              <Chip key={t.id} label={t.label} active={props.tool === t.id} onClick={() => props.onTool(t.id)}>
                {t.icon}
                {t.label}
              </Chip>
            ))}
          </Row>

          {/* colours — the pen and the highlighter are chosen independently */}
          <Row label={c.markColour}>
            {MARK_COLORS.map((col) => {
              const forInk = props.tool === "ink";
              const current = forInk ? props.inkColor : props.markColor;
              return (
                <button
                  key={col.id}
                  type="button"
                  title={c.markColourNames[col.id]}
                  aria-label={c.markColourNames[col.id]}
                  aria-pressed={current === col.id}
                  onClick={() => (forInk ? props.onInkColor(col.id) : props.onMarkColor(col.id))}
                  className={`size-7 rounded-full border-2 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 ${
                    current === col.id ? "scale-110 border-white" : "border-white/25"
                  }`}
                  style={{ background: col.value }}
                />
              );
            })}
          </Row>

          {/* switches */}
          <Row label=" ">
            <Chip
              label={props.zoomLock ? c.zoomLockOn : c.zoomLock}
              active={props.zoomLock}
              onClick={props.onToggleZoomLock}
            >
              {props.zoomLock ? (
                <Lock aria-hidden="true" className="size-3.5" />
              ) : (
                <Unlock aria-hidden="true" className="size-3.5" />
              )}
              {props.zoomLock ? c.zoomLockOn : c.zoomLock}
            </Chip>
            <Chip label={c.areaZoom} active={props.areaZoom} onClick={props.onToggleArea}>
              <Crop aria-hidden="true" className="size-3.5" />
              {c.areaZoom}
            </Chip>
            <Chip label={c.magnifier} active={props.magnifier} onClick={props.onToggleMagnifier}>
              <ZoomIn aria-hidden="true" className="size-3.5" />
              {c.magnifier}
            </Chip>
            <Chip label={c.rotate} onClick={props.onRotate}>
              <RotateCw aria-hidden="true" className="size-3.5" />
              {c.rotate}
            </Chip>
            <Chip
              label={c.readAloud}
              active={props.speaking}
              onClick={props.onToggleSpeak}
            >
              {props.speaking ? (
                <VolumeX aria-hidden="true" className="size-3.5" />
              ) : (
                <Volume2 aria-hidden="true" className="size-3.5" />
              )}
              {props.speaking ? c.stopReading : c.readAloud}
            </Chip>
            <Chip
              label={c.search}
              active={props.searching}
              onClick={props.onSearchOpen}
            >
              <Search aria-hidden="true" className="size-3.5" />
              {c.search}
            </Chip>
            <Chip
              label={c.clearMarks}
              onClick={() => {
                if (confirmClear) {
                  props.onClearMarks();
                  setConfirmClear(false);
                } else {
                  setConfirmClear(true);
                }
              }}
            >
              <Eraser aria-hidden="true" className="size-3.5" />
              {confirmClear ? c.clearMarksConfirm : c.clearMarks}
            </Chip>
            <Chip label={props.isFull ? c.exitFullscreen : c.fullscreen} onClick={props.onFullscreen}>
              <Maximize2 aria-hidden="true" className="size-3.5" />
              {props.isFull ? c.exitFullscreen : c.fullscreen}
            </Chip>
          </Row>

          {!props.bookHasText && (
            <p className="text-[11px] leading-relaxed text-amber-200/80">{c.noTextInBook}</p>
          )}
        </div>
      )}

      {/* the bar */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-1">
          <IconButton label={c.page} onClick={() => props.onPage(1)} disabled={props.page <= 1}>
            <span aria-hidden="true" className="text-[10px] font-bold">
              «
            </span>
          </IconButton>
          <label className="flex items-center gap-1.5 text-xs text-white/70">
            <span className="sr-only sm:not-sr-only">{c.page}</span>
            <input
              id="pdf-page-no"
              aria-label={c.page}
              type="number"
              min={1}
              max={Math.max(props.numPages, 1)}
              value={props.page}
              onChange={(e) => props.onPage(Number(e.target.value))}
              className="h-9 w-12 rounded-lg border border-white/15 bg-white/5 px-2 text-center font-mono text-xs tabular-nums text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            />
            <span aria-live="polite" className="font-mono tabular-nums">
              / {props.numPages || "–"}
            </span>
          </label>
        </div>

        <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-white/12 sm:block" />

        <div className="flex items-center gap-1">
          <IconButton label={c.zoomOut} onClick={() => props.onZoomStep(1 / 1.25)}>
            <Minus aria-hidden="true" className="size-4" />
          </IconButton>
          {/* a real percentage box: 175% is not something a step button offers */}
          <label className="sr-only" htmlFor="pdf-zoom-pct">
            {c.zoomTo}
          </label>
          <input
            id="pdf-zoom-pct"
            type="number"
            min={20}
            max={600}
            step={5}
            value={props.numPages ? Math.round(props.zoomPercent) : ""}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n) && n > 0) props.onZoomPercent(n);
            }}
            className="h-9 w-16 rounded-lg border border-white/15 bg-white/5 px-2 text-center font-mono text-xs tabular-nums text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          />
          <IconButton label={c.zoomIn} onClick={() => props.onZoomStep(1.25)}>
            <Plus aria-hidden="true" className="size-4" />
          </IconButton>
        </div>

        <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-white/12 sm:block" />

        <div className="flex items-center gap-1">
          <Chip label={c.fitWidth} active={props.fit === "width"} onClick={() => props.onFit("width")}>
            <span aria-hidden="true" className="font-mono text-[11px] font-bold">
              ↔
            </span>
          </Chip>
          <Chip label={c.fitPage} active={props.fit === "page"} onClick={() => props.onFit("page")}>
            <span aria-hidden="true" className="font-mono text-[11px] font-bold">
              ⤢
            </span>
          </Chip>
          <IconButton label={open ? c.fewer : c.more} onClick={() => setOpen((v) => !v)} active={open}>
            {open ? (
              <SlidersHorizontal aria-hidden="true" className="size-4" />
            ) : (
              <MessageSquarePlus aria-hidden="true" className="size-4" />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {label.trim() ? (
        <span className="mr-1 w-full text-[10px] font-bold uppercase tracking-wide text-white/45 sm:w-auto">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}
