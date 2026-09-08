import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTelegramInitData, parseTelegramUser } from "@/lib/telegram-auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const telegramIdStr = searchParams.get("telegramId");
        
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
                id: user.id.toString(),
                telegramId: user.telegramId ? user.telegramId.toString() : telegramIdStr,
                first_name: user.firstName,
                last_name: user.lastName,
                username: user.username,
                phone: user.phone,
                avatar_url: "", 
            },
        });
    } catch (error) {
        console.error("AUTH ME GET ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { initData, telegramId: bodyTelegramId, first_name, last_name, username, avatar_url } = body;
        
        let telegramUser: { id: string | number; first_name?: string; last_name?: string; username?: string; avatar_url?: string } | null = null;

        // 1. Agar initData kelgan bo'lsa, xavfsizlik tekshiruvidan o'tkazamiz
        if (initData) {
            const isValid = verifyTelegramInitData(initData);
            if (isValid) {
                telegramUser = parseTelegramUser(initData);
            }
        } 
        
        // 2. Agar initData bo'lmasa yoki lokal testda bo'lsangiz, tana (body) orqali yuborilgan ma'lumotni ham qabul qilamiz (Fallback)
        if (!telegramUser && bodyTelegramId) {
            telegramUser = {
                id: bodyTelegramId,
                first_name: first_name || "Mijoz",
                last_name: last_name || null,
                username: username || null,
                avatar_url: avatar_url || "",
            };
        }

        // Agar umuman ma'lumot topilmasa, 401 o'rniga 200 bilan success: false qaytaramiz (Konsolda qizil 401 xatosi chiqmaydi)
        if (!telegramUser || !telegramUser.id) {
            return NextResponse.json({ success: false, error: "Tizimga kirilmagan yoki ma'lumot topilmadi" }, { status: 200 });
        }
        
        const telegramIdBigInt = BigInt(telegramUser.id);
        
        const user = await prisma.user.upsert({
            where: { telegramId: telegramIdBigInt },
            update: {
                firstName: telegramUser.first_name || "Mijoz",
                lastName: telegramUser.last_name || null,
                username: telegramUser.username || null,
            },
            create: {
                telegramId: telegramIdBigInt,
                firstName: telegramUser.first_name || "Mijoz",
                lastName: telegramUser.last_name || null,
                username: telegramUser.username || null,
            },
        });
        
        return NextResponse.json({
            success: true,
            user: {
                id: user.id.toString(),
                telegramId: user.telegramId ? user.telegramId.toString() : "",
                first_name: user.firstName,
                last_name: user.lastName,
                username: user.username,
                phone: user.phone,
                avatar_url: telegramUser.avatar_url || "",
            },
        });
    } catch (error) {
        console.error("AUTH ME POST ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}