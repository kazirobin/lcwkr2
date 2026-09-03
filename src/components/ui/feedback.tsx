"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check, Info, TriangleAlert, X } from "lucide-react";
import type { ReactNode } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

/* ══ Toasts ══════════════════════════════════════════════ */

type ToastTone = "success" | "error" | "info";
type Toast = { id: number; tone: ToastTone; message: string };

const ToastCtx = createContext<{
  toast: (message: string, tone?: ToastTone) => void;
} | null>(null);

const toneIcon: Record<ToastTone, ReactNode> = {
  success: <Check className="h-4 w-4 text-ok" strokeWidth={3} aria-hidden="true" />,
  error: <TriangleAlert className="h-4 w-4 text-danger" aria-hidden="true" />,
  info: <Info className="h-4 w-4 text-text/60" aria-hidden="true" />,
};

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  const seq = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = ++seq.current;
    setToasts((t) => [...t, { id, tone, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div
            className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4"
            aria-live="polite"
            role="status"
          >
            {toasts.map((t) => (
              <div
                key={t.id}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border border-text/10 bg-card px-4 py-3 text-sm text-text shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
              >
                <span className="mt-0.5 shrink-0">{toneIcon[t.tone]}</span>
                <span className="flex-1 leading-snug">{t.message}</span>
                <button
                  type="button"
                  onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
                  aria-label="Dismiss"
                  className="-mr-1 -mt-0.5 rounded p-1 text-text/40 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <AcademyProviders>");
  return ctx.toast;
}

/* ══ Confirm dialog ══════════════════════════════════════ */

type ConfirmOpts = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

const ConfirmCtx = createContext<((opts: ConfirmOpts) => Promise<boolean>) | null>(null);

function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmOpts | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOpts) => {
    setState(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = (v: boolean) => {
    resolver.current?.(v);
    resolver.current = null;
    setState(null);
  };

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      <Dialog
        open={state !== null}
        onClose={() => settle(false)}
        title={state?.title ?? ""}
        description={state?.message}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => settle(false)}>
              {state?.cancelLabel ?? "Cancel"}
            </Button>
            <Button
              variant={state?.destructive ? "danger" : "primary"}
              size="sm"
              onClick={() => settle(true)}
            >
              {state?.confirmLabel ?? "Confirm"}
            </Button>
          </>
        }
      >
        <span className="sr-only">{state?.message}</span>
      </Dialog>
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) throw new Error("useConfirm must be used inside <AcademyProviders>");
  return ctx;
}

/* ══ Combined ════════════════════════════════════════════ */

export function AcademyProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </ToastProvider>
  );
}