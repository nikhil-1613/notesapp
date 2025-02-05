import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"; // Adjust this based on your actual path
import Note from "@/models/noteModel"; // Adjust based on your model
import { verifyToken } from "@/lib/jwt"; // Adjust based on your utils
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

// The context parameter now correctly contains the `params`
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connect(); // Ensure database connection

  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = await (await cookieStore).get("token");

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Parse request body
    const { title, content, favorite, imageUrl } = await req.json();

    // 🔹 Await context.params to resolve the asynchronous object
    const { id: noteId } = await context.params;

    if (!noteId) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    console.log("🔄 Updating Note ID:", noteId);
    console.log("🖼️ New Image URL:", imageUrl);

    // Find and update the note (ENSURE IMAGE IS UPDATED)
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { $set: { title, content, favorite, imageUrl } }, // Explicitly setting `imageUrl`
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    console.log("✅ Updated Note:", updatedNote);

    return NextResponse.json({ message: "✅ Note updated successfully", note: updatedNote }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating note:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Await to resolve params before accessing
    const { id } = await context.params;
    
    await connect(); // Ensure database connection

    // Authenticate the user (check token from cookies)
    const token = await (await cookies()).get("token");
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token.value);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Proceed with deleting the note
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting note:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   const { id } = params;

//   try {
//     await connect();

//     // Authenticate the user (check token from cookies)
//     const token = (await cookies()).get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 });
//     }

//     const decoded = verifyToken(token.value);
//     if (!decoded) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 403 });
//     }

//     // Proceed with deleting the note
//     const note = await Note.findByIdAndDelete(id);
//     if (!note) {
//       return NextResponse.json({ error: "Note not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// Define the GET handler with async params
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connect(); // Ensure database connection

  try {
    // 🔹 Correctly access `params.id` and resolve the Promise
    const { id } = await context.params; 
    console.log("🔄 Fetching Note:", id);

    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching note:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// export async function GET(req: NextRequest, context: { params: { id: string } }) {
//   await connect(); // Ensure database connection

//   try {
//     // 🔹 Correctly access `params.id`
//     const { id } = await context.params;
//     console.log("🔄 Fetching Note:", id);

//     const note = await Note.findById(id);
//     if (!note) {
//       return NextResponse.json({ error: "Note not found" }, { status: 404 });
//     }

//     return NextResponse.json(note, { status: 200 });
//   } catch (error) {
//     console.error("❌ Error fetching note:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
