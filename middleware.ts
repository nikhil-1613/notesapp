import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token || !verifyToken(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
}

// Apply to protected routes
export const config = {
    matcher: ["/api/notes/:path*"], // Protects all /api/notes routes
}; 