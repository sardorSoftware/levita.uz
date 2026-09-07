import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { telegramId, firstName, phone } = body;
        
        if (!telegramId) {
            return NextResponse.json({ success: false, error: "Telegram ID topilmadi" }, { status: 400 });
        }
        
        // Bazadagi foydalanuvchini topib yangilaymiz
        const updatedUser = await prisma.user.update({
            where: { telegramId: BigInt(telegramId) },
            data: {
                firstName: firstName || undefined,
                phone: phone || undefined,
            },
        });
        
        return NextResponse.json({
            success: true,
            user: {
                ...updatedUser,
                // Null xatoligining oldini olish uchun optional chaining (?.) va fallback ishlatamiz
                telegramId: updatedUser.telegramId ? updatedUser.telegramId.toString() : telegramId.toString(),
            },
        });
    } catch (error: any) {
        console.error("PROFILE UPDATE ERROR:", error);
        return NextResponse.json({ success: false, error: "Ma'lumotlarni yangilashda xatolik" }, { status: 500 });
    }
}