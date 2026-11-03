import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { connectDB } from "@/lib/db";
import Student from "@/features/academy/models/Student";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";
export const maxDuration = 30;

async function getUserIdFromRequest(req: Request): Promise<string | null> {
  const phone = req.headers.get("x-user-phone");
  if (!phone) return null;

  await connectDB();
  const student = await Student.findOne({ whatsapp: phone }).lean();
  return student ? student._id.toString() : null;
}

export async function POST(req: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary config missing:", { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret });
      return NextResponse.json({ error: "Server configuration error: Cloudinary not configured" }, { status: 500 });
    }

    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `lcwkr/tasks/${userId}`,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit", quality: "auto:good" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary upload_stream error:", error);
            reject(error || new Error("Upload failed"));
          } else {
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
          }
        },
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json(
      { url: uploadResult.secure_url, publicId: uploadResult.public_id },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}