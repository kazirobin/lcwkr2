import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Global scope-এ ক্যাশ টাইপ ডিক্লেয়ারেশন (Next.js hot-reload এ কানেকশন ডুপ্লিকেশন রোধে)
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB(): Promise<Mongoose> {
  // ১. অলরেডি কানেক্টেড থাকলে এক্সিস্টিং কানেকশন রিটার্ন
  if (cached.conn) {
    return cached.conn;
  }

  // ২. পেন্ডিং প্রমিজ না থাকলে নতুন প্রমিজ তৈরি
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  // ৩. কানেকশন সেট এবং এরর হ্যান্ডলিং
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;