import { NextResponse } from "next/server";
import { verifyTelegramInitData, parseTelegramUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { initData } = await req.json();
        
        if (!initData || !verifyTelegramInitData(initData)) {
            return NextResponse.json({ error: "Xavfsizlik tekshiruvidan o'tmadi" }, { status: 401 });
        }
        
        const telegramUser = parseTelegramUser(initData);
        
        if (!telegramUser) {
            return NextResponse.json({ error: "Foydalanuvchi ma'lumotlari topilmadi" }, { status: 400 });
        }
        
        const telegramIdBigInt = BigInt(telegramUser.id);
        
        let user = await prisma.user.findUnique({
            where: { telegramId: telegramIdBigInt },
        });
        
        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId: telegramIdBigInt,
                    firstName: telegramUser.first_name,
                    lastName: telegramUser.last_name || null,
                    username: telegramUser.username || null,
                    avatarUrl: telegramUser.avatar_url || null,
                },
            });
        }
        
        // Xavfsiz konvertatsiya: agar telegramId null bo'lsa, bo'sh string qaytaradi
        const safeUser = {
            ...user,
            id: user.id.toString(),
            telegramId: user.telegramId ? user.telegramId.toString() : "",
        };
        
        return NextResponse.json({ success: true, user: safeUser });
    } catch (error) {
        console.error("Auth xatosi:", error);
        return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
    }
}