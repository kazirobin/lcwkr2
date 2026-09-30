import { readFileSync } from "node:fs";
import { connectDB } from "@/lib/db";
import { Student } from "@/features/academy/models";
import { StudentSession } from "@/features/analytics/models";
import { startSession, endSessions } from "@/features/analytics/server/sessions";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const BASE = "http://localhost:3000";
let failed = 0;
const check = (ok: boolean, label: string, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

async function main() {
  await connectDB();
  const passcode = (process.env.ADMIN_PASSCODE || "8131").trim();

  // A real approved student, so the phone in the report is one the admin's
  // table will actually be holding.
  const student = await Student.findOne({ registrationStatus: "Approved" }).lean();
  if (!student?.whatsapp) {
    console.log("no approved student with a phone — cannot run this check");
    process.exit(1);
  }
  const phone = student.whatsapp;
  console.log(`using roll #${student.rollNumber} (${phone})\n`);

  await StudentSession.deleteMany({ whatsapp: phone });
  await startSession({ whatsapp: phone, rollNumber: student.rollNumber, name: student.nameEnglish, userAgent: "e2e" });

  // The overview numbers the quick-access bar shows.
  const ov = await fetch(`${BASE}/api/admin/overview`).then((r) => r.json());
  check(ov.success, "overview responds");
  check(ov.counts.onlineNow === 1, "online now counts the open session", `onlineNow=${ov.counts.onlineNow}`);

  /* These two are school-wide, so they can only be "at least one". Real students
     sign in during the day, and their sessions are left alone on purpose — the
     test must not need a quiet database to pass, and must not delete someone
     else's record to get one. What matters is that our own sign-in is among
     the ones counted. */
  check(ov.counts.loginsToday >= 1, "sign-ins today counts it", `loginsToday=${ov.counts.loginsToday}`);
  check(ov.counts.everLoggedIn >= 1, "ever signed in counts it", `everLoggedIn=${ov.counts.everLoggedIn}`);
  check(ov.counts.totalStudents > 0, "total students is a real number", `totalStudents=${ov.counts.totalStudents}`);

  // The per-student login report, with and without the passcode.
  const anon = await fetch(`${BASE}/api/academy/students/sessions`).then((r) => r.json());
  check(anon.restricted === true, "without a passcode the per-student report is restricted");
  check(Object.keys(anon.sessions ?? {}).length === 0, "and it leaks no phone keys");
  check(anon.totals?.onlineNow === 1, "but the school-wide total is still there", `onlineNow=${anon.totals?.onlineNow}`);

  const auth = await fetch(`${BASE}/api/academy/students/sessions?passcode=${encodeURIComponent(passcode)}`).then(
    (r) => r.json(),
  );
  check(auth.restricted === false, "with the passcode the report is open");
  const row = auth.sessions?.[phone];
  check(!!row, "the row is keyed by the phone the student list returns", `key=${phone}`);
  check(row?.logins === 1, "it counts the sign-in", `logins=${row?.logins}`);
  check(row?.onlineNow === true, "it shows the student as online now");

  // The students list has to hand over the phone, or the join above is void.
  const list = await fetch(
    `${BASE}/api/academy/students?status=Approved&include=contact&passcode=${encodeURIComponent(passcode)}`,
  ).then((r) => r.json());
  const listed = (list.students ?? []).find((s: { whatsapp: string }) => s.whatsapp === phone);
  check(!!listed, "the admin students list returns that same phone");

  // Sign out, and the report should follow.
  await endSessions(phone);
  const after = await fetch(`${BASE}/api/academy/students/sessions?passcode=${encodeURIComponent(passcode)}`).then(
    (r) => r.json(),
  );
  check(after.sessions?.[phone]?.onlineNow === false, "after signing out the student is no longer online");
  check(!!after.sessions?.[phone]?.lastLogoutAt, "and a logout time is recorded");
  const ov2 = await fetch(`${BASE}/api/admin/overview`).then((r) => r.json());
  check(ov2.counts.onlineNow === 0, "the overview's online count follows", `onlineNow=${ov2.counts.onlineNow}`);
  check(ov2.counts.everLoggedIn >= 1, "but they still count as ever signed in");

  // A never-signed-in student still gets a row, so the roll can be compared.
  const never = await Student.findOne({ registrationStatus: "Approved", whatsapp: { $nin: [phone, ""] } }).lean();
  if (never?.whatsapp) {
    const r2 = await fetch(`${BASE}/api/academy/students/sessions?passcode=${encodeURIComponent(passcode)}`).then(
      (r) => r.json(),
    );
    const blank = r2.sessions?.[never.whatsapp];
    check(!!blank, "a student who never signed in still has a row", `roll #${never.rollNumber}`);
    check(blank?.logins === 0, "with zero sign-ins", `logins=${blank?.logins}`);
  }

  await StudentSession.deleteMany({ whatsapp: phone });
  console.log(`\ncleaned up; sessions in db: ${await StudentSession.countDocuments({})}`);
  console.log(failed === 0 ? "all login-report checks passed" : `${failed} check(s) failed`);
  process.exit(failed === 0 ? 0 : 1);
}
void main();
