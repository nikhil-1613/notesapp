import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { generateToken } from "@/lib/jwt";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(req: NextRequest) {
    await connect();

    try {
        const { email, password } = await req.json();

        // Find user
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Generate JWT
        const token = generateToken(user._id);

        // Set HttpOnly cookie
        const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
        response.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 });

        return response;
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
