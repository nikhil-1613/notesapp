import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import cloudinary from "cloudinary";
import { JwtPayload } from "jsonwebtoken";

// 🔥 Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  await connect();

  try {
    console.log("🚀 Incoming Image Upload Request");

    // Authenticate User
    const token = (await cookies()).get("token");
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Extract noteId from query params
    const noteId = new URL(req.url).searchParams.get("noteId");
    if (!noteId) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    // Convert request body to a buffer
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ folder: "notesapp" }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    const cloudinaryUrl = (uploadResponse as any).secure_url;
    console.log("📂 Uploaded to Cloudinary:", cloudinaryUrl);

    // Update note with Cloudinary image URL
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { imageUrl: cloudinaryUrl },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Image uploaded successfully", url: cloudinaryUrl, note: updatedNote },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//  import { NextRequest, NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig";
// import Note from "@/models/noteModel";
// import { verifyToken } from "@/lib/jwt";
// import { JwtPayload } from "jsonwebtoken";
// import { cookies } from "next/headers";
// import fs from "fs";
// import path from "path";

// // Ensure "uploads" directory exists
// const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");
// if (!fs.existsSync(UPLOADS_DIR)) {
//   fs.mkdirSync(UPLOADS_DIR, { recursive: true });
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req: NextRequest) {
//   await connect();

//   try {
//     console.log("🚀 Incoming Image Upload Request");

//     // Authenticate User
//     const token = (await cookies()).get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 });
//     }

//     const decoded = verifyToken(token.value) as JwtPayload;
//     if (!decoded || !decoded.userId) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     // Extract noteId from query params
//     const noteId = new URL(req.url).searchParams.get("noteId");
//     if (!noteId) {
//       return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
//     }

//     // Convert request body to a buffer
//     const data = await req.arrayBuffer();
//     const buffer = Buffer.from(data);

//     // Generate a unique filename
//     const filename = `${Date.now()}-image.png`;
//     const filePath = path.join(UPLOADS_DIR, filename);

//     // Save file to disk
//     fs.writeFileSync(filePath, buffer);
//     console.log("📂 File Saved:", filePath);

//     // Generate public URL
//     const imageUrl = `/uploads/${filename}`;

//     // ✅ Update note in database
//     const updatedNote = await Note.findByIdAndUpdate(
//       noteId,
//       { $set: { imageUrl } }, // ✅ Ensure this is updating
//       { new: true }
//     );

//     if (!updatedNote) {
//       return NextResponse.json({ error: "Note not found" }, { status: 404 });
//     }

//     // console.log(" Note Updated:", updatedNote);

//     return NextResponse.json(
//       { message: "Image uploaded successfully", url: imageUrl, note: updatedNote },
//       { status: 200 }
//     );
//   } catch (error) {
//     // console.error(" Error uploading image:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }