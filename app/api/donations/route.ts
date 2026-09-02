import { NextResponse } from "next/server";
// TODO: আপনার প্রজেক্টের mongoClient বা db কানেকশন ইমপোর্ট করুন
// import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ১. সকল ডোনেশন ডেটা ফেচ (READ)
export async function GET() {
  try {
    // const client = await clientPromise;
    // const db = client.db("lcwkr");
    // const donations = await db.collection("donations").find({}).sort({ createdAt: -1 }).toArray();

    // মক রেসপন্স (ডাটাবেস কানেক্ট থাকলে ওপরের কোড ব্যবহার করুন)
    return NextResponse.json({ success: true, donations: [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}

// ২. নতুন ডোনেশন অ্যাড (CREATE)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, location, trxId, amount } = body;

    if (!name || !phone || !trxId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newDonation = {
      name,
      phone,
      location: location || "Bangladesh",
      trxId: trxId.toUpperCase(),
      amount: Number(amount) || 200,
      createdAt: new Date(),
    };

    // const client = await clientPromise;
    // const db = client.db("lcwkr");
    // const result = await db.collection("donations").insertOne(newDonation);

    return NextResponse.json({ success: true, data: newDonation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create donation" }, { status: 500 });
  }
}

// ৩. ডোনেশন আপডেট (UPDATE)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, phone, location, trxId, amount } = body;

    if (!id) {
      return NextResponse.json({ error: "Donation ID required" }, { status: 400 });
    }

    // const client = await clientPromise;
    // const db = client.db("lcwkr");
    // await db.collection("donations").updateOne(
    //   { _id: new ObjectId(id) },
    //   { $set: { name, phone, location, trxId: trxId.toUpperCase(), amount: Number(amount) } }
    // );

    return NextResponse.json({ success: true, message: "Updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update donation" }, { status: 500 });
  }
}

// ৪. ডোনেশন ডিলিট (DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Donation ID required" }, { status: 400 });
    }

    // const client = await clientPromise;
    // const db = client.db("lcwkr");
    // await db.collection("donations").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete donation" }, { status: 500 });
  }
}