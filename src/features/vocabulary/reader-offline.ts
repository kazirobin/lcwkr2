/**
 * Warming the lesson-book reader for offline use.
 *
 * The reader keeps pdf.js in a lazy chunk so an ordinary visitor never pays for
 * the engine — right online, wrong offline. That chunk's filename is a build
 * hash, so the service worker's offline manifest cannot list it, and a Pro user
 * who downloads the whole site but only opens a book on the train would get
 * "the book could not be opened here" with no way to fix it.
 *
 * So the download warms it on purpose: importing the module pulls the chunk
 * over the network and the worker's stale-while-revalidate handler keeps it,
 * and the worker script is fetched the same way for the same reason.
 */
export async function warmLessonReader(): Promise<void> {
  const engine = import("pdfjs-dist").catch(() => undefined);
  const worker = fetch("/pdfjs/pdf.worker.min.mjs").catch(() => undefined);
  await Promise.all([engine, worker]);
}
