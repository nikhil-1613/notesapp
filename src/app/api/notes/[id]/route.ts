import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"; // Adjust this based on your actual path
import Note from "@/models/noteModel"; // Adjust based on your model
import { verifyToken } from "@/lib/jwt"; // Adjust based on your utils
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

// The context parameter now correctly contains the `params`
export async function PUT(req: Request, context: { params: { id: string } }) {
  await connect();

  try {
    // Access cookies using cookies API in Next.js 13
    const cookieStore = cookies();
    const token = (await cookieStore).get("token"); // Access cookies
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Get note data from request body
    const { title, content, favorite } = await req.json();

    // Wait for params to be resolved before accessing it
    const { id: noteId } = await context.params; // Explicitly await params to access id

    if (!noteId) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    // Find and update the note
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, favorite },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note updated successfully", note: updatedNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig"; // Adjust this based on your actual path
// import Note from "@/models/noteModel"; // Adjust based on your model
// import { verifyToken } from "@/lib/jwt"; // Adjust based on your utils
// import { JwtPayload } from "jsonwebtoken";
// import { cookies } from "next/headers";
// // The context parameter now correctly contains the `params`
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   await connect();

//   try {

//     const cookieStore = cookies();
//     const token = (await cookieStore).get("token"); // Access cookies
//     if (!token) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 });
//     }

//     const decoded = verifyToken(token.value) as JwtPayload;
//     if (!decoded || !decoded.userId) {
//       return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//     }

//     // Get note data from request body
//     const { title, content, favorite } = await req.json();
//     const noteId = params.id; // Correctly accessing the dynamic `id` from params

//     // Find and update the note
//     const updatedNote = await Note.findByIdAndUpdate(
//       noteId,
//       { title, content, favorite },
//       { new: true }
//     );

//     if (!updatedNote) {
//       return NextResponse.json({ error: "Note not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Note updated successfully", note: updatedNote }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
