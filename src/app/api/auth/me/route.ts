import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const telegramIdStr = searchParams.get("telegramId");
        
        // Agar telegramId kelmasa yoki bo'sh bo'lsa, 400 emas, oddiygina success: false qaytaramiz
        if (!telegramIdStr || telegramIdStr === "undefined" || telegramIdStr === "null") {
            return NextResponse.json({ success: false, error: "Telegram ID topilmadi" }, { status: 200 });
        }
        
        const telegramId = BigInt(telegramIdStr);
        
        const user = await prisma.user.findUnique({
            where: { telegramId },
        });
        
        if (!user) {
            return NextResponse.json({ success: false, error: "Foydalanuvchi topilmadi" }, { status: 200 });
        }
        
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                telegramId: user.telegramId ? user.telegramId.toString() : telegramIdStr,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error("AUTH ME ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}