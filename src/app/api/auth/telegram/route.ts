import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTelegramWidgetData, verifyTelegramInitData, parseTelegramUser } from "@/lib/telegram-auth";

interface TargetUser {
    id: number | string;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    phone?: string;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let targetUser: TargetUser | null = null;
        
        // 1. Mini App initData orqali tekshirish
        if (body.initData) {
            if (verifyTelegramInitData(body.initData)) {
                const parsed = parseTelegramUser(body.initData) as any;
                if (parsed && parsed.id) {
                    targetUser = {
                        id: parsed.id,
                        first_name: parsed.first_name || parsed.firstName || "Mijoz",
                        last_name: parsed.last_name || parsed.lastName || undefined,
                        username: parsed.username || undefined,
                        photo_url: parsed.photo_url || parsed.avatar_url || parsed.avatarUrl || "",
                        phone: parsed.phone || undefined,
                    };
                }
            } else {
                return NextResponse.json({ success: false, error: "InitData noto'g'ri yoki muddati o'tgan" }, { status: 401 });
            }
        } 
        // 2. Telegram Widget orqali kelgan ma'lumotlarni tekshirish
        else if (body.hash && body.id) {
            const isValidWidget = verifyTelegramWidgetData(body);
            if (!isValidWidget) {
                return NextResponse.json({ success: false, error: "Avtorizatsiya ma'lumotlari haqiqiy emas!" }, { status: 401 });
            }
            targetUser = {
                id: body.id,
                first_name: body.first_name || "Mijoz",
                last_name: body.last_name || undefined,
                username: body.username || undefined,
                photo_url: body.photo_url || body.avatar_url || "",
                phone: body.phone || undefined,
            };
        }
        
        if (!targetUser || !targetUser.id) {
            return NextResponse.json({ success: false, error: "Telegram autentifikatsiya ma'lumotlari topilmadi" }, { status: 400 });
        }
        
        let telegramIdBigInt: bigint;
        try {
            telegramIdBigInt = BigInt(targetUser.id);
        } catch {
            return NextResponse.json({ success: false, error: "Noto'g'ri Telegram ID formati" }, { status: 400 });
        }
        
        // 3. Bazada mavjudligini tekshirish va yangilash (Upsert)
        const user = await prisma.user.upsert({
            where: { telegramId: telegramIdBigInt },
            update: {
                firstName: targetUser.first_name || "Mijoz",
                lastName: targetUser.last_name || null,
                username: targetUser.username || null,
                ...(targetUser.phone && { phone: targetUser.phone }),
            },
            create: {
                telegramId: telegramIdBigInt,
                firstName: targetUser.first_name || "Mijoz",
                lastName: targetUser.last_name || null,
                username: targetUser.username || null,
                phone: targetUser.phone || null,
            },
        });
        
        const avatar = targetUser.photo_url || "";
        
        // 4. Frontend uchun barcha formatdagi kalitlarni birdek qaytarish
        return NextResponse.json({
            success: true,
            user: {
                id: user.id.toString(),
                // Xatolik to'g'rilandi: agar user.telegramId null bo'lsa, telegramIdBigInt ishlatiladi
                telegramId: user.telegramId ? user.telegramId.toString() : telegramIdBigInt.toString(),
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