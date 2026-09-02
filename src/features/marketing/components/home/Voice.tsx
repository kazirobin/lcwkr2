"use client";

import { useCallback, useRef, useState } from "react";
import {
  ChevronDown,
  Clock,
  FileText,
  Headphones,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLanguage } from "@/i18n";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Voice() {
  const { t } = useLanguage();

  const v = t.voice;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }, []);

  const seek = useCallback((value: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = value;
    setCurrent(value);
  }, []);

  const toggleMute = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }, []);

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="relative mx-auto max-w-3xl px-6">
        <div className="relative">
          {/* gradient glow shadow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-6 -bottom-10 top-8 rounded-[2.5rem] bg-linear-to-br from-primary/45 via-primary/20 to-secondary/30 opacity-70 blur-2xl"
          />

          <div className="relative overflow-hidden rounded-4xl border border-primary/10 bg-background p-6 shadow-[0_16px_50px_-16px_hsl(var(--primary)/0.35)] md:p-9">
            {/* dotted corner texture */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 bg-[radial-gradient(hsl(var(--primary)/0.25)_1.5px,transparent_1.5px)] bg-size-[12px_12px] mask-[radial-gradient(closest-side,black,transparent)]"
            />

            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {v.badge}
            </span>

            <div className="mt-5 flex items-start gap-4 md:gap-5">
              <div className="shrink-0 rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 p-4 md:p-5">
                <Headphones
                  className="h-7 w-7 text-primary md:h-8 md:w-8"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-2xl font-black leading-tight text-text md:text-3xl">
                  {v.title}
                </h2>

                <p className="mt-2 leading-7 text-text/70">{v.description}</p>
              </div>
            </div>

            <div className="mt-7 rounded-2xl bg-primary/5 p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold text-text/55">
                <span className="inline-flex items-center gap-1.5">
                  <Volume2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  {v.playerLabel}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                  {v.duration}
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-full border border-primary/10 bg-background p-2 shadow-[0_6px_20px_-8px_hsl(var(--primary)/0.3)] md:gap-4">
                <button
                  type="button"
                  onClick={toggle}
                  aria-pressed={playing}
                  aria-label={playing ? v.pauseLabel : v.playLabel}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-background transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {playing ? (
                    <Pause className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Play
                      className="h-5 w-5 translate-x-px fill-current"
                      aria-hidden="true"
                    />
                  )}
                </button>

                <span className="shrink-0 text-sm font-medium tabular-nums text-text/70">
                  {formatTime(current)} / {formatTime(duration)}
                </span>

                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={current}
                  onChange={(e) => seek(Number(e.target.value))}
                  aria-label={v.seekLabel}
                  aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--primary) / 0.2) ${progress}%)`,
                  }}
                />

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-pressed={muted}
                  aria-label={muted ? v.unmuteLabel : v.muteLabel}
                  className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text/60 transition hover:bg-primary/10 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {muted ? (
                    <VolumeX className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              <audio
                ref={audioRef}
                preload="none"
                aria-label={v.playerLabel}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
                onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              >
                <source src="/assets/audio/voice.mp3" type="audio/mpeg" />
                <source src="/assets/audio/voice.m4a" type="audio/mp4" />
              </audio>
            </div>

            <details className="group mt-4 rounded-2xl border border-primary/15 bg-background">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-text transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                </span>

                <span className="flex-1">{v.transcriptToggle}</span>

                <ChevronDown
                  className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>

              <div className="whitespace-pre-line border-t border-primary/10 px-4 py-3.5 text-sm leading-7 text-text/70">
                {v.transcript}
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
