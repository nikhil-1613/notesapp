import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { generateToken } from "@/lib/jwt";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(req: NextRequest) {
    await connect();

    try {
        const { email, password,userName } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Create new user
        const newUser = new User({ email, password,userName });
        await newUser.save();

        // Generate JWT
        const token = generateToken(newUser._id);

        // Set HttpOnly cookie
        const response = NextResponse.json({ message: "User registered successfully" }, { status: 201 });
        response.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 });

        return response;
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
