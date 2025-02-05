import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";
import { verifyToken } from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import multer from "multer";
import { promisify } from "util";
import fs from "fs";
import path from "path";

// Configure multer storage
const storage = multer.diskStorage({
  destination: "./public/uploads", // Ensure this folder exists in your project
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("image");
const uploadMiddleware = promisify(upload); // Convert multer to async/await

export async function POST(req: NextRequest) {
  await connect();

  try {
    const token = (await cookies()).get("token");
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Process file upload
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const noteId = formData.get("noteId") as string;

    if (!file || !noteId) {
      return NextResponse.json({ error: "Image and Note ID are required" }, { status: 400 });
    }

    // Save file to disk
    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", filename);
    await fs.promises.writeFile(filePath, Buffer.from(buffer));

    // Save image URL to database
    const imageUrl = `/uploads/${filename}`;
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { imageUrl },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image uploaded successfully", url: imageUrl, note: updatedNote }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
