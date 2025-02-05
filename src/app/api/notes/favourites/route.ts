import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"; // Adjust path based on your project structure
import Note from "@/models/noteModel"; // Adjust path based on your project structure
import { verifyToken } from "@/lib/jwt"; // Adjust path based on your project structure
import { JwtPayload } from "jsonwebtoken"; // Assuming you're using jsonwebtoken

export async function GET(req: NextRequest) {
  await connect();

  try {
    // Get token from cookies
    const token = req.cookies.get("token");

    // Check if token exists
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Verify the token and decode it
    const decoded = verifyToken(token.value) as JwtPayload;

    // Ensure userId is decoded correctly
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.userId;

    // Fetch favorite notes from the database for the logged-in user
    const favoriteNotes = await Note.find({ userId, favorite: true });

    // Return the favorite notes
    return NextResponse.json({ notes: favoriteNotes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorite notes:", error);  // Added error logging
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig"; // Adjust path based on your project structure
// import Note from "@/models/noteModel"; // Adjust path based on your project structure
// import { verifyToken } from "@/lib/jwt"; // Adjust path based on your project structure
// import { JwtPayload } from "jsonwebtoken"; // Assuming you're using jsonwebtoken

// export async function GET(req: NextRequest) {
//   await connect();

//   try {
//     // Get token from cookies
//     const token = req.cookies.get("token");

//     // Check if token exists
//     if (!token) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 });
//     }

//     // Verify the token and decode it
//     const decoded = verifyToken(token.value) as JwtPayload;

//     // Ensure userId is decoded correctly
//     if (!decoded || !decoded.userId) {
//       return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//     }

//     const userId = decoded.userId;

//     // Fetch favorite notes from the database for the logged-in user
//     const favoriteNotes = await Note.find({ userId, favorite: true });

//     // Return the favorite notes
//     return NextResponse.json({ notes: favoriteNotes }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
