import mongoose, { Schema, model, models } from "mongoose";

export interface IReviewDoc {
  name: string;
  mobile: string;
  location: string;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDoc>(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, default: "" },
    location: { type: String, default: "" },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0 },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Review = models.Review || model<IReviewDoc>("Review", ReviewSchema);
export default Review;