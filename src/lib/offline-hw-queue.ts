/**
 * Offline HW submission queue using IndexedDB.
 * Persists submissions when offline; syncs automatically when online.
 */
const DB_NAME = "lcwkr-offline";
const STORE = "hw-submissions";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export type HWSubmission = {
  id?: number;
  /** e.g. /api/hw/hsk1/lesson/1 */
  endpoint: string;
  /** The JSON body that would be POSTed */
  payload: unknown;
  /** Timestamp when queued */
  createdAt: number;
  /** Number of retry attempts */
  attempts: number;
  /** Last error message if failed */
  lastError?: string;
  /** Current status */
  status: "pending" | "syncing" | "completed" | "failed";
};

export async function queueHWSubmission(
  endpoint: string,
  payload: unknown,
): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const record: Omit<HWSubmission, "id"> = {
      endpoint,
      payload,
      createdAt: Date.now(),
      attempts: 0,
      status: "pending",
    };
    const addReq = store.add(record);
    addReq.onsuccess = () => resolve(addReq.result as number);
    addReq.onerror = () => reject(addReq.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getPendingSubmissions(): Promise<HWSubmission[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const idx = store.index("status");
    const req = idx.getAll("pending");
    req.onsuccess = () => {
      resolve(req.result as HWSubmission[]);
      db.close();
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getAllSubmissions(): Promise<HWSubmission[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => {
      resolve(req.result as HWSubmission[]);
      db.close();
    };
    req.onerror = () => reject(req.error);
  });
}

export async function updateSubmission(
  id: number,
  patch: Partial<HWSubmission>,
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const record = getReq.result as HWSubmission;
      if (!record) { db.close(); reject(new Error("Not found")); return; }
      Object.assign(record, patch);
      const putReq = store.put(record);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
    tx.oncomplete = () => db.close();
  });
}

export async function clearCompleted(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const idx = store.index("status");
    const req = idx.getAllKeys("completed");
    req.onsuccess = () => {
      for (const key of req.result) store.delete(key);
      resolve();
    };
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

/** Total pending count for UI badge */
export async function pendingCount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const idx = store.index("status");
    const req = idx.count("pending");
    req.onsuccess = () => { resolve(req.result); db.close(); };
    req.onerror = () => reject(req.error);
  });
}

/** Sync all pending submissions */
export async function syncPendingSubmissions(
  onProgress?: (done: number, total: number) => void,
): Promise<{ synced: number; failed: number }> {
  const pending = await getPendingSubmissions();
  if (pending.length === 0) return { synced: 0, failed: 0 };

  let synced = 0, failed = 0;
  for (const sub of pending) {
    try {
      await updateSubmission(sub.id!, { status: "syncing", attempts: sub.attempts + 1 });
      const res = await fetch(sub.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.payload),
      });
      if (res.ok) {
        await updateSubmission(sub.id!, { status: "completed" });
        synced++;
      } else {
        const err = await res.text().catch(() => "server error");
        await updateSubmission(sub.id!, { status: "failed", lastError: err });
        failed++;
      }
    } catch (e) {
      await updateSubmission(sub.id!, {
        status: "failed",
        lastError: e instanceof Error ? e.message : "network error",
      });
      failed++;
    }
    onProgress?.(synced + failed, pending.length);
  }
  return { synced, failed };
}

/** Auto-sync when online (call on `online` event) */
let syncInProgress = false;
export async function autoSyncIfOnline(): Promise<void> {
  if (syncInProgress || !navigator.onLine) return;
  syncInProgress = true;
  try {
    await syncPendingSubmissions();
  } finally {
    syncInProgress = false;
  }
}

/** Listen for online event */
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    setTimeout(autoSyncIfOnline, 1000); // small delay for network to settle
  });
}
