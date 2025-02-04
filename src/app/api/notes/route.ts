import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/noteModel";
import { verifyToken } from "@/lib/jwt";  // Assuming you have a JWT verification function
import { connect } from "@/dbConfig/dbConfig";
import { JwtPayload } from "jsonwebtoken";

// POST - Add a new text note
export async function POST(req: NextRequest) {
  await connect();

  try {
    // Extract the JWT token from the request cookies
    const token = req.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Verify the JWT token and extract userId
    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Get the fields from the request body (excluding audio for now)
    const { title, content, favorite } = await req.json();
    const userId = decoded.userId;

    // Create a new note
    const newNote = new Note({
      userId,
      title,
      content,
      favorite: favorite || false, // Optional field, defaults to false
    });

    // Save the note to the database
    await newNote.save();

    return NextResponse.json({ message: "Note created successfully", note: newNote }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connect();

  try {
    // Extract JWT token from cookies
    const token = req.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Verify the JWT token
    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.userId;

    // Fetch all notes for the authenticated user
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import Note from "@/models/noteModel";
// import { verifyToken } from "@/lib/jwt";  // Assuming you have a JWT verification function
// import { connect } from "@/dbConfig/dbConfig";
// import { JwtPayload } from "jsonwebtoken";

// // POST - Add a new note
// export async function POST(req: NextRequest) {
//     await connect();

//     try {
//         // Extract the JWT token from the request cookies
//         const token = req.cookies.get("token");

//         if (!token) {
//             return NextResponse.json({ error: "Authentication required" }, { status: 401 });
//         }

//         // Verify the JWT token and extract userId
//         const decoded = verifyToken(token.value) as JwtPayload;  // Assumes verifyToken is a function that decodes the JWT
//         if (!decoded || !decoded.userId) {
//             return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//         }

//         const { title, content, isAudio, audioUrl, favorite } = await req.json();
//         const userId = decoded.userId;  // Get userId from decoded JWT

//         // Create a new note
//         const newNote = new Note({
//             userId,
//             title,
//             content,
//             isAudio: isAudio || false,
//             audioUrl: audioUrl || null,
//             favorite: favorite || false,
//         });

//         // Save the note to the database
//         await newNote.save();

//         return NextResponse.json({ message: "Note created successfully", note: newNote }, { status: 201 });
//     } catch (error) {
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

// // GET - Display all notes for a user
// export async function GET(req: NextRequest) {
//     await connect();

//     try {
//         // Extract the JWT token from the request cookies
//         const token = req.cookies.get("token");

//         if (!token) {
//             return NextResponse.json({ error: "Authentication required" }, { status: 401 });
//         }

//         // Verify the JWT token and extract userId
//         const decoded = verifyToken(token.value) as JwtPayload;
//         if (!decoded || !decoded.userId) {
//             return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//         }

//         const userId = decoded.userId;  // Get userId from decoded JWT

//         // Fetch the notes for the given userId
//         const notes = await Note.find({ userId });

//         if (notes.length === 0) {
//             return NextResponse.json({ message: "No notes found" }, { status: 404 });
//         }

//         return NextResponse.json({ notes }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
