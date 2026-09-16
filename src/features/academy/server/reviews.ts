// Site reviews — anyone can submit; an admin approves before they go public.
import { connectDB } from "@/lib/db";
import { Review } from "@/features/academy/models";

export type ReviewInput = {
  name: string;
  mobile?: string;
  location?: string;
  message: string;
  rating?: number;
};

export async function createReview(input: ReviewInput) {
  await connectDB();
  const created = await Review.create({
    name: input.name.trim(),
    mobile: (input.mobile ?? "").trim(),
    location: (input.location ?? "").trim(),
    message: input.message.trim(),
    rating: Number(input.rating ?? 0),
    approved: false,
  });
  return { ...created.toObject(), _id: created._id.toString() };
}

export async function listApprovedReviews() {
  await connectDB();
  const docs = await Review.find({ approved: true }).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export async function listAllReviews() {
  await connectDB();
  const docs = await Review.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export async function updateReview(
  id: string,
  patch: Partial<ReviewInput> & { approved?: boolean },
) {
  await connectDB();
  const updated = await Review.findByIdAndUpdate(
    id,
    {
      ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
      ...(patch.mobile !== undefined ? { mobile: patch.mobile.trim() } : {}),
      ...(patch.location !== undefined ? { location: patch.location.trim() } : {}),
      ...(patch.message !== undefined ? { message: patch.message.trim() } : {}),
      ...(patch.rating !== undefined ? { rating: Number(patch.rating) } : {}),
      ...(patch.approved !== undefined ? { approved: patch.approved } : {}),
    },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Review not found.");
  return { ...updated, _id: updated._id.toString() };
}

export async function deleteReview(id: string) {
  await connectDB();
  await Review.findByIdAndDelete(id);
  return true;
}