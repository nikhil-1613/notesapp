import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";
import { verifyToken } from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  await connect();

  try {
    const token = (await cookies()).get("token");
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const decoded = verifyToken(token.value) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = context.params; // Correct way to access params
    const { favorite } = await req.json();

    const updatedNote = await Note.findByIdAndUpdate(id, { favorite }, { new: true });

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Favorite status updated", note: updatedNote }, { status: 200 });
  } catch (error) {
    console.error("Error updating favorite status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig";
// import Note from "@/models/noteModel";
// import { verifyToken } from "@/lib/jwt";
// import { JwtPayload } from "jsonwebtoken";
// import { cookies } from "next/headers";

// // export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
// //   await connect();

// //   try {
// //     const token = (await cookies()).get("token");
// //     if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

// //     const decoded = verifyToken(token.value) as JwtPayload;
// //     if (!decoded || !decoded.userId) {
// //       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
// //     }

// //     const { id } = params;
// //     const { favorite } = await req.json();

// //     // Update the note's favorite status
// //     const updatedNote = await Note.findByIdAndUpdate(id, { favorite }, { new: true });

// //     if (!updatedNote) {
// //       return NextResponse.json({ error: "Note not found" }, { status: 404 });
// //     }

// //     return NextResponse.json({ message: "Favorite status updated", note: updatedNote }, { status: 200 });
// //   } catch (error) {
// //     console.error("Error updating favorite status:", error);
// //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //   }
// // }



