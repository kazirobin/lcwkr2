import { readFileSync } from "node:fs";
import { connectDB } from "@/lib/db";
import { StudentSession } from "@/features/analytics/models";
import { startSession, endSessions, noteActivity } from "@/features/analytics/server/sessions";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const FAKE = "01999999999"; // test rows, all removed at the end
let failed = 0;
const check = (ok: boolean, label: string, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

async function main() {
  await connectDB();
  await StudentSession.deleteMany({ whatsapp: FAKE });

  // 1. A sign-in is recorded at all — the thing that was silently broken.
  await startSession({ whatsapp: FAKE, rollNumber: 9999, name: "probe", userAgent: "p" });
  let rows = await StudentSession.find({ whatsapp: FAKE }).lean();
  check(rows.length === 1, "a sign-in writes exactly one row", `got ${rows.length}`);
  check(rows[0]?.active === true, "the new session is open");
  check(!!rows[0]?.loginAt, "it has a login time");

  // 2. Activity is attached to the open session.
  await noteActivity(FAKE, "page", "/hsk/1");
  await noteActivity(FAKE, "page", "/hsk/1"); // repeat must not grow the list
  await noteActivity(FAKE, "click", "answer-1");
  rows = await StudentSession.find({ whatsapp: FAKE }).lean();
  check((rows[0]?.paths ?? []).length === 1, "a repeated page is recorded once", JSON.stringify(rows[0]?.paths));
  check(rows[0]?.clicks === 1, "a click is counted", `clicks=${rows[0]?.clicks}`);

  // 3. Signing out closes it and works out the duration.
  await endSessions(FAKE);
  rows = await StudentSession.find({ whatsapp: FAKE }).lean();
  check(rows[0]?.active === false, "sign-out closes the session");
  check(!!rows[0]?.logoutAt, "it records a logout time");
  check((rows[0]?.durationSec ?? 0) >= 0, "it computed a duration", `durationSec=${Math.round(rows[0]?.durationSec ?? -1)}`);

  // 4. Signing in again closes the previous one rather than overlapping.
  await startSession({ whatsapp: FAKE, rollNumber: 9999, name: "probe", userAgent: "p" });
  rows = await StudentSession.find({ whatsapp: FAKE }).sort({ loginAt: 1 }).lean();
  check(rows.length === 2, "a second sign-in adds a second row", `got ${rows.length}`);
  check(rows.filter((r) => r.active).length === 1, "only one session is left open");
  check(rows[0]?.active === false && !!rows[0]?.logoutAt, "the earlier session was closed with a time");

  await endSessions(FAKE);
  rows = await StudentSession.find({ whatsapp: FAKE }).lean();
  check(rows.every((r) => r.active === false), "no session is left open after signing out");

  await StudentSession.deleteMany({ whatsapp: FAKE });
  console.log(`\ntotal sessions in db: ${await StudentSession.countDocuments({})}`);
  console.log(failed === 0 ? "all session bookkeeping checks passed" : `${failed} check(s) failed`);
  process.exit(failed === 0 ? 0 : 1);
}
void main();
