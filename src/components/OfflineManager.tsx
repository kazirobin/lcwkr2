"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CloudDownload, CheckCircle2, WifiOff, X } from "lucide-react";
import { useLanguage } from "@/i18n";
import { Button, Dialog, Field } from "@/components/ui";
import { isValidProPassword } from "@/features/chinese-words/data/pro-passwords";

const LS = {
  seen: "lcwkr_offline_seen_v2",
  pro: "lcwkr_offline_pro_v2",
  downloaded: "lcwkr_offline_downloaded_v2",
  pillHidden: "lcwkr_offline_pill_hidden_v2",
  savedCount: "lcwkr_offline_saved_v2",
  updatedAt: "lcwkr_offline_updated_v2",
};

const REFRESH_INTERVAL_MS = 20 * 60 * 1000;

type View = "welcome" | "unlock" | "progress" | "done" | null;

/* Non-standard PWA install event (Chrome/Edge/Android). */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function OfflineManager() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const store = (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  };
  const load = (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  /* Hydration-safe client-only detection: server + first render snapshot
   * returns false, client immediately snaps to the real value. */
  const supported = useSyncExternalStore(
    () => () => {},
    () => typeof window !== "undefined" && "serviceWorker" in navigator,
    () => false,
  );

  const [view, setView] = useState<View>(null);
  const [pro, setPro] = useState(() => load(LS.pro) === "1");
  const [downloaded, setDownloaded] = useState(() => load(LS.downloaded) === "1");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => load(LS.seen) === "1");
  const [pillHidden, setPillHidden] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [savedPages, setSavedPages] = useState<number | null>(() => {
    const n = Number(load(LS.savedCount));
    return Number.isFinite(n) && n > 0 ? n : null;
  });
  const [savedMB, setSavedMB] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(() => {
    const n = Number(load(LS.updatedAt));
    return Number.isFinite(n) && n > 0 ? n : null;
  });
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === "undefined" || navigator.onLine,
  );
  const installEvtRef = useRef<BeforeInstallPromptEvent | null>(null);
  const alertTimerRef = useRef(false);
  const seenRef = useRef(seen);
  useEffect(() => { seenRef.current = seen; }, [seen]);

  const downloadRef = useRef({ active: false, cancelled: false });

  const sendToSW = useCallback(async (message: unknown) => {
    try {
      const reg = await navigator.serviceWorker.ready;
      reg.active?.postMessage(message);
    } catch {
      /* not controlled */
    }
  }, []);

  /* ── refresh (silent background auto-update when online) ── */
  const silentRefresh = useCallback(() => {
    if (!navigator.onLine) return;
    sendToSW({ type: "REFRESH" });
  }, [sendToSW]);

  useEffect(() => {
    if (!supported) return;

     const init = async () => {
       /* ServiceWorkerRegistrar handles registration in both dev and prod.
        * This init block stays for parity — SW is registered by the
        * ServiceWorkerRegistrar component mounted above.
        * NOTE: pillHidden is intentionally NOT restored here — the pill
        * (offline indicator + download button) must show on every page
        * refresh. Dismiss (X) hides it only for the current session. */
       try {
         await navigator.serviceWorker.register("/sw.js");
       } catch {
         /* register failed — site still works online */
       }
     };
    init();

    const onMessage = (event: MessageEvent) => {
      const msg = event.data || {};
      if (msg.type === "PROGRESS") {
        setProgress({ done: msg.done ?? 0, total: msg.total ?? 0 });
      }
      if (msg.type === "STATUS") {
        const n = typeof msg.downloaded === "number" ? msg.downloaded : null;
        setSavedPages(n);
        if (n !== null) store(LS.savedCount, String(n));
      }
      if (msg.type === "DOWNLOAD_DONE") {
        store(LS.downloaded, "1");
        const now = Date.now();
        store(LS.updatedAt, String(now));
        setUpdatedAt(now);
        setDownloaded(true);
        setView("done");
        downloadRef.current.active = false;
        setDownloading(false);
        setFeedback(null);
        // Ask the SW how many pages are cached + measure storage used.
        void sendToSW({ type: "STATUS" });
        if (typeof navigator !== "undefined" && navigator.storage?.estimate) {
          navigator.storage
            .estimate()
            .then(({ usage }) =>
              setSavedMB(
                typeof usage === "number" ? (usage / 1048576).toFixed(1) : null,
              ),
            )
            .catch(() => setSavedMB(null));
        }
      }
    };
    navigator.serviceWorker.addEventListener("message", onMessage);

    window.addEventListener("online", silentRefresh);

    return () => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
      window.removeEventListener("online", silentRefresh);
    };
  }, [supported, sendToSW, silentRefresh]);

  /* On-line → keep the offline copy fresh every 20 minutes (Pro only). */
  useEffect(() => {
    if (!pro || !downloaded) return;
    const id = window.setInterval(silentRefresh, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [pro, downloaded, silentRefresh]);

  /* PWA install prompt: capture beforeinstallprompt so we can show our own
   * "Install app" button; hide it once the app is installed. */
  useEffect(() => {
    if (!supported) return;
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      installEvtRef.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    const onInstalled = () => {
      installEvtRef.current = null;
      setCanInstall(false);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [supported]);

  /* Live online/offline connectivity for the pill indicator. */
  useEffect(() => {
    if (!supported) return;
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [supported]);

  const promptInstall = useCallback(async () => {
    const evt = installEvtRef.current;
    if (!evt) return;
    try {
      await evt.prompt();
      await evt.userChoice;
    } catch {
      /* dismissed — keep the button for later */
    } finally {
      installEvtRef.current = null;
      setCanInstall(false);
    }
  }, []);

  /* First open: show a transient offline alert for exactly 10 s,
   * then auto-dismiss. In dev the flag is not persisted so the alert
   * appears on every reload (easy to test). In production it is a
   * once-per-user prompt. Fires exactly once per mount. */
  useEffect(() => {
    if (!supported || alertTimerRef.current) return;
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev || !seenRef.current) {
      if (!isDev) store(LS.seen, "1");
      setSeen(true);
      seenRef.current = true;
      alertTimerRef.current = true;
      const t0 = window.setTimeout(() => setAlertVisible(true), 800);
      const t1 = window.setTimeout(() => setAlertVisible(false), 800 + 10_000);
      return () => {
        window.clearTimeout(t0);
        window.clearTimeout(t1);
      };
    }
  }, [supported]);

  const openDialog = () => {
    setOpen(true);
    if (pro && downloaded) {
      setView("done");
    } else if (pro && !downloaded) {
      setView("welcome");
    } else {
      setView("welcome");
    }
  };

  const closeDialog = () => setOpen(false);

  const dismissPill = () => {
    store(LS.pillHidden, "1");
    setPillHidden(true);
  };

  /* Skip → partial offline (browsed pages stay cached by the SW). */
  const skip = () => {
    closeDialog();
  };

  /* Ask for the Pro code; on success start the full download. */
  const verifyCode = async () => {
    if (!code.trim() || verifying) return;
    setVerifying(true);
    setFeedback(null);
    const unlockLocally = () => {
      store(LS.pro, "1");
      setPro(true);
      downloadRef.current.cancelled = false;
      setView("progress");
      void beginDownload();
    };
    // 1) Local list first (pro-passwords.ts) — works fully offline, no fetch.
    if (isValidProPassword(code)) {
      setVerifying(false);
      unlockLocally();
      return;
    }
    // 2) Server fallback (covers server-only PRO_CODE env).
    try {
      const res = await fetch("/api/offline/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback(data.error ?? t("কোডটি সঠিক নয়", "Code is not correct"));
        return;
      }
      unlockLocally();
    } catch {
      setFeedback(t("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।", "Something went wrong. Try again."));
    } finally {
      setVerifying(false);
    }
  };

  const beginDownload = async () => {
    if (busy || downloadRef.current.active) return;
    setBusy(true);
    downloadRef.current.active = true;
    setDownloading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/offline/routes", { cache: "no-store" });
      const data = await res.json();
      const routes: string[] = [...(data.pages ?? []), ...(data.api ?? [])];
      if (routes.length === 0) {
        setFeedback(t("ডাউনলোড করার মতো কিছু নেই", "Nothing to download"));
        downloadRef.current.active = false;
        setDownloading(false);
        setView("welcome");
        return;
      }
      setProgress({ done: 0, total: routes.length });
      await sendToSW({ type: "DOWNLOAD", routes });
    } catch {
      setFeedback(t("ডাউনলোড শুরু করা যায়নি", "Could not start download"));
      downloadRef.current.active = false;
      setDownloading(false);
    } finally {
      setBusy(false);
    }
  };

  /* Update system: re-fetch the route manifest (picks up newly added
   * pages/content) and re-download everything with progress. SW fetches
   * with cache:"reload", so changed pages are refreshed too. */
  const checkForUpdates = async () => {
    setFeedback(null);
    setView("progress");
    await beginDownload();
  };

  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleString(language === "bn" ? "bn-BD" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  if (!supported) return null;

  const percent =
    progress.total > 0 ? Math.min(100, Math.round((progress.done / progress.total) * 100)) : 0;

  return (
    <>
      {/* ── transient 10 s offline alert (first load only) ── */}
      {alertVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-4 z-40 flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-2xl border border-text/10 bg-card p-4 pr-3 shadow-2xl shadow-black/10 sm:max-w-sm"
        >
          <CloudDownload className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-snug text-text">
              {t("অফলাইনে পড়ুন", "Read offline")}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-text/60">
              {t(
                "একটি কোড দিয়ে পুরো সাইট ডাউনলোড করে ইন্টারনেট ছাড়াই পড়তে পারবেন। নিচের বাটনে ক্লিক করুন।",
                "Get the whole site on your device — tap the button below to learn how.",
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAlertVisible(false)}
            aria-label={t("বন্ধ করুন", "Dismiss")}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text/40 transition-colors hover:bg-text/10 hover:text-text"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* floating status pill, bottom-left (donation badge sits bottom-right) */}
      {!pillHidden && (
        <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1 rounded-2xl border border-text/10 bg-card/95 py-1 pl-3 pr-1 text-xs font-semibold text-text shadow-xl shadow-black/10 backdrop-blur">
          {pro && downloaded ? (
            <>
              <button
                type="button"
                onClick={openDialog}
                aria-label={t("অফলাইন প্রস্তুত — বিস্তারিত দেখুন", "Offline ready — view details")}
                title={t("অফলাইন প্রস্তুত — বিস্তারিত দেখুন", "Offline ready — view details")}
                className="flex items-center gap-2 py-1.5 pr-1 transition-colors hover:opacity-80"
              >
                <span
                  aria-hidden="true"
                  title={isOnline ? "online" : "offline"}
                  className={`h-2 w-2 shrink-0 rounded-full ring-2 ${
                    isOnline ? "bg-emerald-500 ring-emerald-500/25" : "bg-warn ring-warn/25"
                  }`}
                />
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                <span>{t("অফলাইন প্রস্তুত", "Offline ready")}</span>
                {savedPages !== null && (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-emerald-500">
                    {savedPages}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={dismissPill}
                aria-label={t("বন্ধ করুন", "Hide")}
                className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-text/40 transition-colors hover:bg-text/5 hover:text-text"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={openDialog}
                aria-label={t("অফলাইন অবস্থা", "Offline status")}
                className="flex items-center gap-2 py-1 transition-colors hover:opacity-80"
              >
                <span
                  aria-hidden="true"
                  title={isOnline ? "online" : "offline"}
                  className={`h-2 w-2 shrink-0 rounded-full ring-2 ${
                    isOnline ? "bg-emerald-500 ring-emerald-500/25" : "bg-warn ring-warn/25"
                  }`}
                />
                {downloading || (pro && !downloaded && percent > 0) ? (
                  <>
                    <CloudDownload className="h-4 w-4 animate-pulse text-primary" aria-hidden="true" />
                    <span className="tabular-nums">
                      {t("ডাউনলোড", "Download")} {percent}%
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-text/50" aria-hidden="true" />
                    {isOnline
                      ? t("অফলাইন সেটআপ", "Offline setup")
                      : t("অফলাইন", "Offline")}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={dismissPill}
                aria-label={t("বন্ধ করুন", "Hide")}
                className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-text/40 transition-colors hover:bg-text/5 hover:text-text"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}

      {/* ── welcome / first-open confirmation ── */}
      <Dialog
        open={open && view === "welcome"}
        onClose={closeDialog}
        title={t("অফলাইন মোড", "Offline mode")}
        description={t(
          "এই অ্যাপটি ইন্টারনেট ছাড়াও চলতে পারে। পুরো সাইট আপনার ডিভাইসে অফলাইনে সেভ করে নিন।",
          "This app works without internet. Save the whole site to your device and browse anywhere.",
        )}
        footer={
          <>
            <Button variant="ghost" onClick={skip}>
              {t("বাদ দিন", "Not now")}
            </Button>
            <Button onClick={() => setView("unlock")}>
              {t("প্রো কোড দিয়ে ডাউনলোড", "Download with Pro code")}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-text/70">
          {t(
            "অফলাইন মোডে পুরো সাইট ডাউনলোড হয়ে গেলে আপনি যেকোনো সময়, যেকোনো জায়গায় অ্যাপের মতো করে পড়তে পারবেন — ক্লাস রেকর্ডিং, লেসন, শব্দভান্ডার সবকিছু।",
            "Once downloaded, every lesson, recording and vocabulary stays on your device — read it anywhere, anytime, exactly like a native app.",
          )}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text/50">
          {t(
            "প্রো কোড ছাড়াও অ্যাপ ব্যবহার করা যায় — মোবাইল ডেটা ছাড়া শুধু যে পেজগুলো খুলেছেন সেগুলো অফলাইনে দেখা যাবে।",
            "You can also use the app without a Pro code — pages you have already visited stay available offline.",
          )}
        </p>
        {canInstall && (
          <Button variant="secondary" onClick={promptInstall} className="mt-4 w-full">
            📲 {t("অ্যাপ ইনস্টল করুন", "Install app")}
          </Button>
        )}
      </Dialog>

      {/* ── Pro code entry ── */}
      <Dialog
        open={open && view === "unlock"}
        onClose={closeDialog}
        title={t("প্রো কোড", "Pro code")}
        description={t(
          "প্রো কোড লিখুন — পুরো সাইট ডাউনলোড হবে।",
          "Enter your Pro code to download the full site.",
        )}
        footer={
          <>
            <Button variant="ghost" onClick={() => setView("welcome")}>
              {t("পেছনে", "Back")}
            </Button>
            <Button loading={verifying} onClick={verifyCode}>
              {t("যাচাই করুন", "Verify")}
            </Button>
          </>
        }
      >
        <Field
          label={t("প্রো কোড", "Pro code")}
          required
          hint={t("কোড প্রাপ্তির জন্য রবিন স্যারের সাথে যোগাযোগ করুন।", "Ask Robin Sir for a code.")}
        >
          <input
            className="w-full rounded-lg border border-text/15 bg-card px-3 py-2 text-sm text-text outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") verifyCode();
            }}
            placeholder="XXXXXX"
          />
        </Field>
        {feedback && (
          <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
            {feedback}
          </p>
        )}
      </Dialog>

      {/* ── download progress 1% → 100% ── */}
      <Dialog
        open={open && view === "progress"}
        onClose={() => setOpen(false)}
        size="sm"
        title={t("সাইট ডাউনলোড হচ্ছে", "Downloading site")}
        description={t(
          "একবারি ডাউনলোড — তারপর সব offline-এ কাজ করবে।",
          "One-time download — then everything works offline.",
        )}
      >
        <div className="space-y-3">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-text/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-[width] duration-300"
              style={{ width: `${Math.max(1, percent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-medium tabular-nums text-text/60">
            <span>
              {t("অগ্রগতি", "Progress")}: {Math.max(1, percent)}%
            </span>
            <span>
              {progress.done}/{progress.total}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-text/40">
            {t(
              "অনুগ্রহ করে পেজটি খোলা রাখুন। ডাউনলোড ব্যাকগ্রাউন্ডে চলছে…",
              "Please keep this page open. Download continues in the background…",
            )}
          </p>
          {feedback && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
              {feedback}
            </p>
          )}
        </div>
      </Dialog>

       {/* ── done ── */}
      <Dialog
        open={open && view === "done"}
        onClose={closeDialog}
        title={t("অফলাইন প্রস্তুত", "Offline ready")}
        description={t(
          "একবারি ডাউনলোড — তারপর সব offline-এ কাজ করবে।",
          "One-time download — then everything works offline.",
        )}
        footer={
          <>
            <Button variant="ghost" onClick={checkForUpdates}>
              🔄 {t("আপডেট চেক", "Check for updates")}
            </Button>
            <Button onClick={closeDialog}>{t("চমৎকার!", "Great!")}</Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          {(savedPages !== null || savedMB !== null) && (
            <p className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-emerald-500">
              {savedPages !== null ? `${savedPages} ${t("পেজ", "pages")}` : ""}
              {savedPages !== null && savedMB !== null ? " · " : ""}
              {savedMB !== null ? `${savedMB} MB` : ""}
            </p>
          )}
          {updatedLabel && (
            <p className="text-[11px] text-text/40">
              {t("সর্বশেষ আপডেট", "Last updated")}: {updatedLabel}
            </p>
          )}
          {canInstall && (
            <Button variant="secondary" onClick={promptInstall} className="w-full">
              📲 {t("অ্যাপ ইনস্টল করুন", "Install app")}
            </Button>
          )}
          <p className="max-w-sm text-sm leading-relaxed text-text/70">
            {t(
              "এখন থেকে ইন্টারনেট ছাড়াই সব পেজ খুলতে পারবেন। নতুন কনটেন্ট যোগ হলে উপরের আপডেট বাটনে ডেটা রিফ্রেশ করে নিন — অনলাইনে থাকলে অ্যাপ নিজে থেকেও নতুন ডেটা আপডেট করে নেবে।",
              "Now every page works without internet. When new content is added, refresh with the update button above — when online, the app also silently refreshes itself.",
            )}
          </p>
        </div>
      </Dialog>
    </>
  );
}