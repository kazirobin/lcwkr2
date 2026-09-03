import { NextResponse } from "next/server";
import {
  getAllDonations,
  createDonation,
  updateDonation,
  deleteDonation,
} from "@/features/marketing/server/donations";

// ১. GET: সব ডোনেশন ফেচ
export async function GET() {
  try {
    const donations = await getAllDonations();
    return NextResponse.json({ success: true, donations }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch donations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ২. POST: নতুন ডোনেশন তৈরি
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, location, trxId, amount } = body;

    if (!name || !phone || !trxId) {
      return NextResponse.json(
        { error: "Name, Phone and TrxID are required." },
        { status: 400 }
      );
    }

    const data = await createDonation({ name, phone, location, trxId, amount });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create donation";
    const status = message.includes("already been submitted") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// ৩. PUT: ডোনেশন আপডেট
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, phone, location, trxId, amount } = body;

    if (!id) {
      return NextResponse.json({ error: "Donation ID is required." }, { status: 400 });
    }

    const data = await updateDonation(id, { name, phone, location, trxId, amount });
    return NextResponse.json({ success: true, message: "Updated successfully", data }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update donation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ৪. DELETE: ডোনেশন মুছে ফেলা
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Donation ID is required." }, { status: 400 });
    }

    await deleteDonation(id);
    return NextResponse.json({ success: true, message: "Deleted successfully." }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete donation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}