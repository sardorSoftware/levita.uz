import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTelegramWidgetData } from "@/lib/telegram-auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, first_name, last_name, username, photo_url, phone, hash } = body;
        
        if (!id) {
            return NextResponse.json({ success: false, error: "Telegram ID topilmadi" }, { status: 400 });
        }
        
        if (hash) {
            const isValid = verifyTelegramWidgetData(body);
            if (!isValid) {
                console.warn("Telegram Auth Hash mismatch!");
            }
        }
        
        let telegramId: bigint;
        try {
            telegramId = BigInt(id);
        } catch {
            return NextResponse.json({ success: false, error: "Noto'g'ri Telegram ID formati" }, { status: 400 });
        }
        
        const user = await prisma.user.upsert({
            where: { telegramId },
            update: {
                firstName: first_name || "Mijoz",
                lastName: last_name || null,
                username: username || null,
                ...(phone && { phone }),
            },
            create: {
                telegramId,
                firstName: first_name || "Mijoz",
                lastName: last_name || null,
                username: username || null,
                phone: phone || null,
            },
        });
        
        const avatar = photo_url || "";
        
        return NextResponse.json({
            success: true,
            user: {
                id: user.id.toString(),
                telegramId: user.telegramId ? user.telegramId.toString() : id.toString(),
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                first_name: user.firstName || "",
                last_name: user.lastName || "",
                username: user.username || "",
                phone: user.phone || "",
                avatarUrl: avatar,
                avatar_url: avatar,
            },
        });
    } catch (error) {
        console.error("TELEGRAM AUTH ROUTE ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}