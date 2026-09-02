import connectToDatabase from "@/lib/db";
import ChineseWord from "@/features/chinese-words/models";

export async function listWords() {
  await connectToDatabase();
  return ChineseWord.find({}).sort({ hskLevel: 1, createdAt: -1 }).lean();
}

export async function createWord(body: unknown) {
  await connectToDatabase();
  return ChineseWord.create(body as Record<string, unknown>);
}

export async function updateWord(body: Record<string, unknown>) {
  await connectToDatabase();
  const { _id, ...updateData } = body;
  return ChineseWord.findByIdAndUpdate(_id as string, updateData, { new: true });
}

export async function deleteWord(id: string | null) {
  await connectToDatabase();
  return ChineseWord.findByIdAndDelete(id);
}
