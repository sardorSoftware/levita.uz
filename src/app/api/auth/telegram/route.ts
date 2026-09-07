import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTelegramWidgetData } from "@/lib/telegram-auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { telegramData } = body;
        
        if (!telegramData || !verifyTelegramWidgetData(telegramData)) {
            return NextResponse.json({ error: "Xavfsizlik tekshiruvi muvaffaqiyatsiz yakunlandi" }, { status: 401 });
        }
        
        const telegramId = BigInt(telegramData.id);
        const firstName = telegramData.first_name || "Mijoz";
        const username = telegramData.username || null;
        
        // Bazadan telegramId bo'yicha izlash yoki yaratish
        let user = await prisma.user.findFirst({
            where: { telegramId },
        });
        
        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId,
                    firstName,
                    // agar schema-da username bo'lsa
                },
            });
        }
        
        // Seans cookie tayyorlash
        const response = NextResponse.json({ success: true, user: { ...user, telegramId: user.telegramId?.toString() } });
        
        response.cookies.set("user_session", JSON.stringify({
            id: user.id,
            telegramId: user.telegramId?.toString(),
            firstName: user.firstName,
            phone: user.phone
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 kun
            path: "/"
        });
        
        return response;
    } catch (error: any) {
        console.error("TELEGRAM AUTH ERROR:", error);
        return NextResponse.json({ error: error.message || "Tizimga kirishda xatolik" }, { status: 500 });
    }
}