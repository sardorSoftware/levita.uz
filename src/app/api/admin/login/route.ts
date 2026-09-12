// src/app/api/admin/login/route.ts
import { NextResponse } from "next/server";

// Next.js build paytida env qiymatini qotirib qo'ymasligi uchun
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const password = body?.password;
        
        const envPassword = process.env.ADMIN_PASSWORD || "2233";
        
        // Probellarni tozalash va xavfsiz solishtirish
        if (!password || String(password).trim() !== String(envPassword).trim()) {
            return NextResponse.json(
                { success: false, error: "Parol noto'g'ri!" },
                { status: 401 }
            );
        }
        
        const response = NextResponse.json({ success: true });
        
        // Cookie o'rnatish
        response.cookies.set("admin_token", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", // Redirect jarayonida cookie yo'qolmasligi uchun
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