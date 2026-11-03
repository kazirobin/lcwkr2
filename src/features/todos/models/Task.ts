import mongoose, { Schema, model, models } from "mongoose";

export interface ITaskDoc {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  labels: string[];
  photo: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITaskDoc>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, default: "", maxlength: 1000 },
    labels: { type: [String], default: [] },
    photo: { type: String, default: null },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Task = models.Task || model<ITaskDoc>("Task", TaskSchema);
export default Task;