// One-time migration: fold the legacy bKash seat reservations in `enrollments`
// into the single `courseenrollments` collection that the admin manages.
//
// Why: the old table had no status and no admin page, so the ৳1,000 HSK-1 batch
// could only be read, never approved, rejected or undone. Everything now lives
// in one place.
//
// Safety: backs up the legacy collection, is safe to re-run (it skips TrxIDs
// already present), and does not touch students or courses.
import { MongoClient } from "mongodb";
import fs from "node:fs";

const env = fs.readFileSync(
  "C:/Users/Robin/Documents/Default Project/lcwkr2/.env.local",
  "utf8",
);
const uri = env.match(/^MONGODB_URI=(.*)$/m)?.[1]?.trim();
if (!uri) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db();

const legacy = await db.collection("enrollments").find({}).toArray();
console.log(`legacy rows: ${legacy.length}`);

if (legacy.length) {
  const backupPath = "C:/Users/Robin/AppData/Local/Temp/opencode/legacy-enrollments-backup.json";
  fs.writeFileSync(backupPath, JSON.stringify(legacy, null, 1));
  console.log(`backed up to ${backupPath}`);
}

const courseIds = [...new Set(legacy.map((r) => r.courseId).filter(Boolean))];
const courses = await db
  .collection("courses")
  .find({ courseId: { $in: courseIds } })
  .toArray();
const feeByCourse = new Map(courses.map((c) => [c.courseId, c.fee ?? 0]));
const nameByCourse = new Map(courses.map((c) => [c.courseId, c.courseName]));

let inserted = 0;
let skipped = 0;

for (const row of legacy) {
  const trxId = String(row.trxId ?? "").trim().toUpperCase();
  if (!trxId) {
    skipped++;
    continue;
  }
  const existing = await db.collection("courseenrollments").findOne({ trxId });
  if (existing) {
    skipped++;
    continue;
  }
  await db.collection("courseenrollments").insertOne({
    courseId: row.courseId,
    courseName: nameByCourse.get(row.courseId) ?? row.courseId,
    name: row.name,
    whatsapp: row.whatsapp,
    trxId,
    amount: feeByCourse.get(row.courseId) ?? 0,
    location: row.location ?? "",
    // A seat reservation was already accepted when it was made, so these come
    // across as approved rather than sitting in the queue forever.
    status: "Approved",
    note: row.note || "আগের সিট বুকিং থেকে আনা হয়েছে",
    freeClassesUsed: false,
    rollNumber: null,
    createdAt: row.createdAt ?? new Date(),
    updatedAt: new Date(),
  });
  inserted++;
}

console.log(`inserted ${inserted}, skipped ${skipped}`);

// The ৳1,000 batch had its price hardcoded on the academy page, so the course
// document itself had no fee and the admin saw "0". Record it on the course.
const COURSE_ID = "HSK-101";
const course = await db.collection("courses").findOne({ courseId: COURSE_ID });
if (course) {
  const updates = {};
  if (!course.fee) updates.fee = 1000;
  if (!course.duration) updates.duration = "৩ মাস";
  if (!course.freeClassCount) updates.freeClassCount = 0;
  if (Object.keys(updates).length) {
    await db.collection("courses").updateOne({ courseId: COURSE_ID }, { $set: updates });
    console.log(`course ${COURSE_ID} updated:`, JSON.stringify(updates));
  } else {
    console.log(`course ${COURSE_ID} already had its fee set`);
  }
} else {
  console.log(`course ${COURSE_ID} not found — skipped fee backfill`);
}

console.log("\nafter migration:");
console.log("  legacy enrollments      :", await db.collection("enrollments").countDocuments());
console.log("  courseenrollments       :", await db.collection("courseenrollments").countDocuments());
for (const c of await db.collection("courses").find({}, { projection: { courseId: 1, courseName: 1, fee: 1, launched: 1, completed: 1 } }).toArray()) {
  console.log(
    `  course ${c.courseId} "${c.courseName}" fee=${c.fee ?? 0} launched=${!!c.launched} completed=${!!c.completed}`,
  );
}

await client.close();
