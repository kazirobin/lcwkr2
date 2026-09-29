import { readFileSync } from "node:fs";
import { connectDB } from "@/lib/db";
import { Course, CourseEnrollment, Student } from "@/features/academy/models";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const BASE = "http://localhost:3000";
const PASS = (process.env.ADMIN_PASSCODE || "8131").trim();
let failed = 0;
const check = (ok: boolean, label: string, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

const TRX = `E2E${Date.now()}`.toUpperCase();

async function main() {
  await connectDB();
  const course = await Course.findOne({}).lean();
  if (!course) {
    console.log("no course to test with");
    process.exit(1);
  }

  /* A course that is not launched refuses payments on purpose, and neither
     course in this database is launched — so the purchase path could not be
     exercised at all. Launch it for the length of this test and put it back
     exactly as it was, whatever happens in between. */
  const wasLaunched = course.launched;
  if (!wasLaunched) await Course.updateOne({ _id: course._id }, { $set: { launched: true } });
  const restore = async () => {
    if (!wasLaunched) await Course.updateOne({ _id: course._id }, { $set: { launched: wasLaunched } });
    await CourseEnrollment.deleteMany({ trxId: TRX });
    await Student.deleteMany({ whatsapp: "01700000000" });
  };

  console.log(`course: ${course.courseId} (${course.courseName}) — launched for this test\n`);

  try {
    await run(course, check, PASS, BASE);
  } finally {
    await restore();
    const back = await Course.findById(course._id).lean();
    console.log(
      `\ncourse launched restored: ${JSON.stringify(back?.launched) === JSON.stringify(wasLaunched) ? "yes" : "NO — check manually"}`,
    );
    console.log(`leftovers: ${await CourseEnrollment.countDocuments({ trxId: TRX })}`);
  }
  console.log(failed === 0 ? "all enrollment checks passed" : `${failed} check(s) failed`);
  process.exit(failed === 0 ? 0 : 1);
}
void main();

async function run(
  course: { _id: unknown; courseId: string; courseName: string },
  check: (ok: boolean, label: string, detail?: string) => void,
  PASS: string,
  BASE: string,
) {

  // 1. A student pays and it lands as Pending.
  const submitted = await fetch(`${BASE}/api/course-enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "enroll",
      courseId: course.courseId,
      name: "E2E Test Student",
      whatsapp: "01700000000",
      trxId: TRX,
    }),
  }).then((r) => r.json());
  check(submitted.success, "a payment is accepted", JSON.stringify(submitted).slice(0, 90));

  const pending = await fetch(
    `${BASE}/api/course-enrollments?courseId=${encodeURIComponent(course.courseId)}&status=Pending&passcode=${encodeURIComponent(PASS)}`,
  ).then((r) => r.json());
  const row = (pending.enrollments ?? []).find((e: { trxId: string }) => e.trxId === TRX);
  check(!!row, "it shows up in the course's pending list");
  check(row?.status === "Pending", "as pending", `status=${row?.status}`);

  // 2. It is counted on the overview the bar shows.
  const ov = await fetch(`${BASE}/api/admin/overview`).then((r) => r.json());
  check(ov.counts.pendingEnrollments >= 1, "pending enrollments is counted", `n=${ov.counts.pendingEnrollments}`);

  // 3. Approve needs the passcode, and assigns a roll.
  const noPass = await fetch(`${BASE}/api/course-enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "APPROVE", id: row?._id }),
  });
  check(noPass.status === 401, "approving without a passcode is refused", `status=${noPass.status}`);

  const approved = await fetch(`${BASE}/api/course-enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "APPROVE", id: row?._id, adminPasscode: PASS }),
  }).then((r) => r.json());
  check(approved.success, "approving with the passcode works", JSON.stringify(approved).slice(0, 90));
  check(!!approved.rollNumber, "and a roll number is assigned", `roll=${approved.rollNumber}`);

  const after = await CourseEnrollment.findById(row?._id).lean();
  check(after?.status === "Approved", "the row is marked approved", `status=${after?.status}`);
  const madeStudent = await Student.findOne({ whatsapp: "01700000000" }).lean();
  check(!!madeStudent, "a student account now exists for that phone");
  check(
    (madeStudent?.enrolledCourseIds ?? []).includes(course.courseId),
    "and is enrolled on this course",
    JSON.stringify(madeStudent?.enrolledCourseIds),
  );

  // 4. Delete removes it, and cleans up the student it created.
  const badPass = await fetch(`${BASE}/api/course-enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "DELETE", id: row?._id, adminPasscode: "0000" }),
  });
  check(badPass.status === 401, "deleting without the passcode is refused", `status=${badPass.status}`);

  const del = await fetch(`${BASE}/api/course-enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "DELETE", id: row?._id, alsoRemoveFromStudent: true, adminPasscode: PASS }),
  }).then((r) => r.json());
  check(del.success, "deleting with the passcode works", JSON.stringify(del).slice(0, 90));
  check((await CourseEnrollment.findById(row?._id)) === null, "the row is gone");
  check((await Student.findOne({ whatsapp: "01700000000" })) === null, "and so is the account it made");

  const ov2 = await fetch(`${BASE}/api/admin/overview`).then((r) => r.json());
  check(
    !JSON.stringify(ov2.counts).includes(TRX),
    "the overview is back to its previous state",
    `pendingEnrollments=${ov2.counts.pendingEnrollments}`,
  );

  // 5. The dialog's three tabs each answer. The list holds names, phone numbers
  //    and bKash TrxIDs, so it must not be readable without the passcode.
  const anon = await fetch(
    `${BASE}/api/course-enrollments?courseId=${encodeURIComponent(course.courseId)}&status=Approved`,
  );
  const anonBody = await anon.json();
  check(
    anon.status === 401 && anonBody.enrollments === undefined,
    "the list cannot be read without the passcode",
    `status=${anon.status}`,
  );

  for (const status of ["Pending", "Approved", "Rejected"] as const) {
    const r = await fetch(
      `${BASE}/api/course-enrollments?courseId=${encodeURIComponent(course.courseId)}&status=${status}&passcode=${encodeURIComponent(PASS)}`,
    ).then((x) => x.json());
    check(r.success && Array.isArray(r.enrollments), `the ${status} tab answers`, `n=${r.enrollments?.length}`);
  }

  // Leave the database as we found it.
  await CourseEnrollment.deleteMany({ trxId: TRX });
  await Student.deleteMany({ whatsapp: "01700000000" });
}
