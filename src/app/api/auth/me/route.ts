import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { verifyToken } from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";

export async function GET(req: NextRequest) {
    await connect();

    try {
        // Get token from cookies
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify token and get user ID
        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Find user in DB
        const user = await User.findById((decoded as JwtPayload).userId).select("-password"); // Exclude password
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return user details
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
