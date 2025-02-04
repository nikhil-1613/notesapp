
import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/noteModel";
import { verifyToken } from "@/lib/jwt";  // Assuming you have a JWT verification function
import { connect } from "@/dbConfig/dbConfig";
import { JwtPayload } from "jsonwebtoken";

// POST - Add a new audio note
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

    // Get the fields from the request body (we no longer need "title")
    const { transcript } = await req.json();
    const userId = decoded.userId;

    // Validate required fields
    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    // Create a new note (audio note)
    const newNote = new Note({
      userId,
      content: transcript,  // Store the transcript as content
         // Mark this note as audio
                 // Save the audio URL if provided
// Optional field, defaults to false
    });

    // Save the note to the database
    await newNote.save();

    return NextResponse.json({ message: "Audio note created successfully", note: newNote }, { status: 201 });
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

// // POST - Add a new audio note
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

//     // Get the fields from the request body
//     const { title, transcript, audioUrl, favorite } = await req.json();
//     const userId = decoded.userId;

//     // Validate required fields
//     if (!title || !transcript) {
//       return NextResponse.json({ error: "Title and transcript are required" }, { status: 400 });
//     }

//     // Create a new note (audio note)
//     const newNote = new Note({
//       userId,
//       title,
//       content: transcript,
//       isAudio: true,  // Mark as audio note
//       audioUrl,       // Save the audio URL if provided
//       favorite: favorite || false,  // Optional field, defaults to false
//     });

//     // Save the note to the database
//     await newNote.save();

//     return NextResponse.json({ message: "Audio note created successfully", note: newNote }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// // import { NextRequest, NextResponse } from "next/server";
// // import Note from "@/models/noteModel";
// // import { verifyToken } from "@/lib/jwt";  // Assuming you have a JWT verification function
// // import { connect } from "@/dbConfig/dbConfig";
// // import { JwtPayload } from "jsonwebtoken";

// // // POST - Add a new audio note
// // export async function POST(req: NextRequest) {
// //   await connect();

// //   try {
// //     // Extract the JWT token from the request cookies
// //     const token = req.cookies.get("token");
// //     if (!token) {
// //       return NextResponse.json({ error: "Authentication required" }, { status: 401 });
// //     }

// //     // Verify the JWT token and extract userId
// //     const decoded = verifyToken(token.value) as JwtPayload;
// //     if (!decoded || !decoded.userId) {
// //       return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
// //     }

// //     // Get the fields from the request body
// //     const { title, transcript, audioUrl, favorite } = await req.json();
// //     const userId = decoded.userId;

// //     // Validate required fields
// //     if (!title || !transcript) {
// //       return NextResponse.json({ error: "Title and transcript are required" }, { status: 400 });
// //     }

// //     // Create a new note (audio note)
// //     const newNote = new Note({
// //       userId,
// //       title,
// //       content: transcript,
// //       isAudio: true,  // Mark as audio note
// //       audioUrl,       // Save the audio URL if provided
// //       favorite: favorite || false,  // Optional field, defaults to false
// //     });

// //     // Save the note to the database
// //     await newNote.save();

// //     return NextResponse.json({ message: "Audio note created successfully", note: newNote }, { status: 201 });
// //   } catch (error) {
// //     console.error(error);
// //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //   }
// // }
