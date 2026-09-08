import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, telegramId, first_name, last_name, username, phone, avatar_url } = body;
        
        const targetId = telegramId || id;
        
        if (!targetId) {
            return NextResponse.json({ success: false, error: "Telegram ID topilmadi" }, { status: 400 });
        }
        
        const telegramIdBigInt = BigInt(targetId);
        
        const user = await prisma.user.upsert({
            where: { telegramId: telegramIdBigInt },
            update: {
                firstName: first_name !== undefined ? first_name : undefined,
                lastName: last_name !== undefined ? last_name : undefined,
                username: username !== undefined ? username : undefined,
                phone: phone !== undefined ? phone : undefined,
            },
            create: {
                telegramId: telegramIdBigInt,
                firstName: first_name || "Mijoz",
                lastName: last_name || null,
                username: username || null,
                phone: phone || null,
            },
        });
        
        return NextResponse.json({
            success: true,
            user: {
                id: user.id.toString(),
                telegramId: user.telegramId ? user.telegramId.toString() : targetId.toString(),
                first_name: user.firstName,
                last_name: user.lastName,
                username: user.username,
                phone: user.phone,
                avatar_url: avatar_url || "", // <-- body'dan kelgan avatar_url ishlatildi
            },
        });
    } catch (error) {
        console.error("AUTH ROUTE ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}