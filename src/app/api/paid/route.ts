import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PaidEntry from "@/features/paid/models/PaidEntry";
import { normalizePaidInput, serializePaidEntry } from "@/features/paid/lib";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const entries = await PaidEntry.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(entries.map((entry) => serializePaidEntry(entry)), {
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const input = normalizePaidInput(await req.json());
    const required: { key: keyof typeof input; label: string }[] = [
      { key: "name", label: "Name" },
      { key: "whatsapp", label: "WhatsApp" },
      { key: "dateOfBirth", label: "Date of birth" },
      { key: "occupation", label: "Occupation" },
      { key: "hskLevel", label: "HSK level" },
      { key: "address", label: "Address" },
      { key: "details", label: "Describe yourself" },
    ];
    const missing = required.filter(({ key }) => !String(input[key] ?? "").trim()).map((f) => f.label);
    if (missing.length > 0) {
      return NextResponse.json({ error: `Please fill in: ${missing.join(", ")}.` }, { status: 400 });
    }

    await connectDB();
    const created = await PaidEntry.create(input);
    return NextResponse.json(serializePaidEntry(created.toObject()), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
