import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCloudinaryClient, isCloudinaryConfigured } from "@/lib/cloudinary";

const UPLOAD_FOLDER = "aurelle/products";

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 503 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const cloudinary = getCloudinaryClient();

  // Signed upload: the client uploads the file directly to Cloudinary using
  // this signature, so the API secret never leaves the server and the file
  // never round-trips through our own server.
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: UPLOAD_FOLDER },
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: UPLOAD_FOLDER,
  });
}
