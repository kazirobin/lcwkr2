import mongoose, { Schema, model, models } from "mongoose";

export interface IStudyGroupDoc {
  courseId: string;
  label: string;
  memberRolls: number[];
  createdByRoll?: number;
  createdAt: Date;
}

const StudyGroupSchema = new Schema<IStudyGroupDoc>(
  {
    courseId: { type: String, required: true, index: true },
    label: { type: String, default: "" },
    memberRolls: { type: [Number], default: [] },
    createdByRoll: { type: Number },
  },
  { timestamps: true },
);

export const StudyGroup =
  models.StudyGroup || model<IStudyGroupDoc>("StudyGroup", StudyGroupSchema);
export default StudyGroup;
