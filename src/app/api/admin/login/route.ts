// src/app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const password = body?.password;
        
        const envPassword = process.env.ADMIN_PASSWORD;
        
        if (!envPassword) {
            return NextResponse.json(
                { success: false, error: "Serverda admin paroli sozlanmagan!" },
                { status: 500 }
            );
        }
        
        if (!password || String(password).trim() !== String(envPassword).trim()) {
            return NextResponse.json(
                { success: false, error: "Parol noto'g'ri!" },
                { status: 401 }
            );
        }
        
        // Oddiy text o'rniga xavfsiz Xash-token yaratamiz
        const secretKey = process.env.JWT_SECRET || "fallback-secret-key-change-it";
        const authToken = crypto
        .createHmac("sha256", secretKey)
        .update(`admin-session-${envPassword}`)
        .digest("hex");
        
        const response = NextResponse.json({ success: true });
        
        response.cookies.set("admin_token", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 kun
        });
        
        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Server xatosi" },
            { status: 500 }
        );
    }
}