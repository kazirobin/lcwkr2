import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITodo extends Document {
  title: string;
  title2?: string;
  studentsName?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    title2: {
      type: String,
      trim: true,
      default: "",
    },
    studentsName: {
      type: String,
      trim: true,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Todo: Model<ITodo> = mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);

export { Todo };
export default Todo;