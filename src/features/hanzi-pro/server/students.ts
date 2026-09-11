// Hanzi Pro challenge — server-side student registry (MongoDB).

import mongoose, { Schema, Document, Model } from "mongoose";
import connectDB from "@/lib/db";

export interface IHanziProStudent extends Document {
  name: string;
  phone: string;
  location: string;
  trxId: string;
  amount: number;
  learnedCount: number;
  status: "Pending" | "Active";
  createdAt: Date;
  updatedAt: Date;
}

const HanziProStudentSchema = new Schema<IHanziProStudent>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    trxId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    amount: { type: Number, default: 200 },
    learnedCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Active"], default: "Pending" },
  },
  { timestamps: true },
);

export const HanziProStudentModel: Model<IHanziProStudent> =
  mongoose.models.HanziProStudent ||
  mongoose.model<IHanziProStudent>("HanziProStudent", HanziProStudentSchema);

/* ══ Class-log sessions ══════════════════════════════════ */

export interface IHanziProSessionEntry {
  studentId: string;
  name: string;
  learnedCount: number;
  updatedAt: Date;
}

export interface IHanziProSession extends Document {
  date: string;
  open: boolean;
  merged: boolean;
  entries: IHanziProSessionEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const HanziProSessionSchema = new Schema<IHanziProSession>(
  {
    date: { type: String, required: true },
    open: { type: Boolean, default: true },
    merged: { type: Boolean, default: false },
    entries: [
      {
        studentId: { type: String, required: true },
        name: { type: String, default: "" },
        learnedCount: { type: Number, default: 0 },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const HanziProSessionModel: Model<IHanziProSession> =
  mongoose.models.HanziProSession ||
  mongoose.model<IHanziProSession>("HanziProSession", HanziProSessionSchema);

export async function getAllHanziProStudents() {
  await connectDB();
  const docs = await HanziProStudentModel.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export async function createHanziProStudent(data: {
  name: string;
  phone: string;
  location?: string;
  trxId: string;
  amount?: number;
}) {
  await connectDB();
  const trxId = data.trxId.trim().toUpperCase();

  const existing = await HanziProStudentModel.findOne({ trxId });
  if (existing) {
    throw new Error("This TrxID has already been submitted.");
  }

  const created = await HanziProStudentModel.create({
    name: data.name.trim(),
    phone: data.phone.trim(),
    location: (data.location ?? "").trim(),
    trxId,
    amount: data.amount ?? 200,
  });
  return { ...created.toObject(), _id: created._id.toString() };
}

export async function updateHanziProStudent(
  id: string,
  patch: { learnedCount?: number; status?: "Pending" | "Active"; name?: string; phone?: string },
) {
  await connectDB();
  const updated = await HanziProStudentModel.findByIdAndUpdate(
    id,
    { $set: patch },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Student not found.");
  return { ...updated, _id: updated._id.toString() };
}

export async function deleteHanziProStudent(id: string) {
  await connectDB();
  const deleted = await HanziProStudentModel.findByIdAndDelete(id);
  if (!deleted) throw new Error("Student not found.");
  return true;
}

/* ══ Session workflow ════════════════════════════════════ */

export async function getAllHanziProSessions() {
  await connectDB();
  const docs = await HanziProSessionModel.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

/** Admin opens a log session (only one open at a time). */
export async function openHanziProSession(date: string) {
  await connectDB();
  const open = await HanziProSessionModel.findOne({ open: true });
  if (open) throw new Error("A session is already open. Close it first.");
  const created = await HanziProSessionModel.create({ date, open: true, merged: false, entries: [] });
  return { ...created.toObject(), _id: created._id.toString() };
}

/** Student submits (or updates) their learned count in the open session. */
export async function submitHanziProEntry(sessionId: string, studentId: string, learnedCount: number) {
  await connectDB();
  const session = await HanziProSessionModel.findById(sessionId);
  if (!session) throw new Error("Session not found.");
  if (!session.open) throw new Error("The class log is closed right now.");

  const student = await HanziProStudentModel.findById(studentId);
  if (!student || student.status !== "Active") {
    throw new Error("Only approved (Active) students can submit.");
  }

  const value = Math.max(0, Math.floor(learnedCount));
  const entry = session.entries.find((e) => e.studentId === studentId);
  if (entry) {
    entry.learnedCount = value;
    entry.updatedAt = new Date();
  } else {
    session.entries.push({ studentId, name: student.name, learnedCount: value, updatedAt: new Date() });
  }
  session.markModified("entries");
  await session.save();
  return { ...session.toObject(), _id: session._id.toString() };
}

/** Batch submit: many students at once (public — only while the session is open). */
export async function submitHanziProEntries(
  sessionId: string,
  entries: { studentId: string; learnedCount: number }[],
) {
  await connectDB();
  const session = await HanziProSessionModel.findById(sessionId);
  if (!session) throw new Error("Session not found.");
  if (!session.open) throw new Error("The class log is closed right now.");

  let saved = 0;
  for (const e of entries) {
    const student = await HanziProStudentModel.findById(e.studentId);
    if (!student || student.status !== "Active") continue;

    const value = Math.max(0, Math.floor(e.learnedCount || 0));
    const existing = session.entries.find((x) => x.studentId === e.studentId);
    if (existing) {
      existing.learnedCount = value;
      existing.updatedAt = new Date();
    } else {
      session.entries.push({
        studentId: e.studentId,
        name: student.name,
        learnedCount: value,
        updatedAt: new Date(),
      });
    }
    saved++;
  }
  session.markModified("entries");
  await session.save();
  return { ...session.toObject(), _id: session._id.toString(), saved };
}

/** Recompute every student's learnedCount from merged sessions. */
async function recomputeLearnedCounts() {
  const merged = await HanziProSessionModel.find({ merged: true }).lean();
  const best = new Map<string, number>();
  for (const s of merged) {
    for (const e of s.entries ?? []) {
      const prev = best.get(String(e.studentId)) ?? 0;
      best.set(String(e.studentId), Math.max(prev, Number(e.learnedCount) || 0));
    }
  }
  const students = await HanziProStudentModel.find({});
  for (const st of students) {
    const target = best.get(String(st._id)) ?? 0;
    if (st.learnedCount !== target) {
      st.learnedCount = target;
      await st.save();
    }
  }
}

/** Admin closes the session — entries merge into each student's count. */
export async function closeHanziProSession(sessionId: string) {
  await connectDB();
  const session = await HanziProSessionModel.findById(sessionId);
  if (!session) throw new Error("Session not found.");
  session.open = false;
  session.merged = true;
  await session.save();
  await recomputeLearnedCounts();
  return { ...session.toObject(), _id: session._id.toString() };
}

/** Admin reopens a closed session for corrections. */
export async function reopenHanziProSession(sessionId: string) {
  await connectDB();
  const session = await HanziProSessionModel.findById(sessionId);
  if (!session) throw new Error("Session not found.");
  session.open = true;
  await session.save();
  return { ...session.toObject(), _id: session._id.toString() };
}

/** Admin edits one entry's count inside a session. */
export async function updateHanziProSessionEntry(sessionId: string, studentId: string, learnedCount: number) {
  await connectDB();
  const session = await HanziProSessionModel.findById(sessionId);
  if (!session) throw new Error("Session not found.");
  const entry = session.entries.find((e) => e.studentId === studentId);
  if (!entry) throw new Error("Entry not found.");
  entry.learnedCount = Math.max(0, Math.floor(learnedCount));
  entry.updatedAt = new Date();
  session.markModified("entries");
  await session.save();
  if (session.merged) await recomputeLearnedCounts();
  return { ...session.toObject(), _id: session._id.toString() };
}

/** Admin removes one entry from a session. */
export async function removeHanziProSessionEntry(sessionId: string, studentId: string) {
  await connectDB();
  const session = await HanziProSessionModel.findById(sessionId);
  if (!session) throw new Error("Session not found.");
  session.entries = session.entries.filter((e) => e.studentId !== studentId);
  session.markModified("entries");
  await session.save();
  if (session.merged) await recomputeLearnedCounts();
  return { ...session.toObject(), _id: session._id.toString() };
}

/** Admin deletes a session entirely (counts recomputed). */
export async function deleteHanziProSession(sessionId: string) {
  await connectDB();
  await HanziProSessionModel.findByIdAndDelete(sessionId);
  await recomputeLearnedCounts();
  return true;
}
