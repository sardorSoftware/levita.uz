// src/app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const envPassword = process.env.ADMIN_PASSWORD || "12345678";
        
        if (password !== envPassword) {
            return NextResponse.json(
                { success: false, error: "Parol noto'g'ri!" },
                { status: 401 }
            );
        }
        
        const response = NextResponse.json({ success: true });
        
        response.cookies.set("admin_token", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 kun
        });
        
        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server xatosi" }, { status: 500 });
    }
}