import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/noteModel";
import { verifyToken } from "@/lib/jwt";
import { connect } from "@/dbConfig/dbConfig";
import { JwtPayload } from "jsonwebtoken";

// POST - Add a new text note
export async function POST(req: NextRequest) {
  await connect();

  try {
    const token = req.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { title, content, favorite } = await req.json();
    const userId = decoded.userId;

    const newNote = new Note({
      userId,
      title,
      content,
      favorite: favorite || false,
    });

    await newNote.save();

    return NextResponse.json({ message: "Note created successfully", note: newNote }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET - Fetch all notes
export async function GET(req: NextRequest) {
  await connect();

  try {
    const token = req.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.userId;
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE - Delete a note
export async function DELETE(req: NextRequest) {
  await connect();

  try {
    const token = req.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { id } = await req.json();
    await Note.findByIdAndDelete(id);

    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Rename a note
export async function PUT(req: NextRequest) {
  await connect();

  try {
    const token = req.cookies.get("token");
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { id, title, content, favorite } = await req.json();

    // Prepare the update object based on which fields are provided
    const updateFields: { title?: string; content?: string; favorite?: boolean } = {};
    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (favorite !== undefined) updateFields.favorite = favorite;

    const updatedNote = await Note.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note updated successfully", note: updatedNote }, { status: 200 });
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

// // POST - Add a new text note
// export async function POST(req: NextRequest) {
//   await connect();

//   try {
//     // Extract the JWT token from the request cookies
//     const token = req.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 });
//     }

//     // Verify the JWT token and extract userId
//     const decoded = verifyToken(token.value) as JwtPayload;
//     if (!decoded || !decoded.userId) {
//       return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//     }

//     // Get the fields from the request body (excluding audio for now)
//     const { title, content, favorite } = await req.json();
//     const userId = decoded.userId;

//     // Create a new note
//     const newNote = new Note({
//       userId,
//       title,
//       content,
//       favorite: favorite || false, // Optional field, defaults to false
//     });

//     // Save the note to the database
//     await newNote.save();

//     return NextResponse.json({ message: "Note created successfully", note: newNote }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function GET(req: NextRequest) {
//   await connect();

//   try {
//     // Extract JWT token from cookies
//     const token = req.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 });
//     }

//     // Verify the JWT token
//     const decoded = verifyToken(token.value) as JwtPayload;
//     if (!decoded || !decoded.userId) {
//       return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//     }

//     const userId = decoded.userId;

//     // Fetch all notes for the authenticated user
//     const notes = await Note.find({ userId }).sort({ createdAt: -1 });

//     return NextResponse.json({ notes }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

