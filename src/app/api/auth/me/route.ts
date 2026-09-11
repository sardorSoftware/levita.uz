import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTelegramInitData, parseTelegramUser } from "@/lib/telegram-auth";

// GET: Eskicha ko'rinishdagi query so'rovlar uchun
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const telegramIdStr = searchParams.get("telegramId");
        
        if (!telegramIdStr || telegramIdStr === "undefined" || telegramIdStr === "null") {
            return NextResponse.json({ success: false, error: "Telegram ID topilmadi" }, { status: 200 });
        }
        
        let telegramId: bigint;
        try {
            telegramId = BigInt(telegramIdStr);
        } catch {
            return NextResponse.json({ success: false, error: "Noto'g'ri Telegram ID formati" }, { status: 400 });
        }
        
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
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                first_name: user.firstName || "",
                last_name: user.lastName || "",
                username: user.username || "",
                phone: user.phone || "",
                avatarUrl: "",
                avatar_url: "",
            },
        });
    } catch (error) {
        console.error("AUTH ME GET ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}

// POST: Telegram WebApp initData orqali to'liq xavfsiz autentifikatsiya
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { initData } = body;
        
        if (!initData) {
            return NextResponse.json({ success: false, error: "InitData topilmadi" }, { status: 200 });
        }
        
        // 1. XAVFSIZLIK: Telegram initData haqiqiyligini serverda tekshirish
        const isValid = verifyTelegramInitData(initData);
        if (!isValid) {
            return NextResponse.json(
                { success: false, error: "Autentifikatsiyadan o'tmadi (Soxta initData)" },
                { status: 401 }
            );
        }
        
        // 2. Foydalanuvchi ma'lumotlarini shifrlangan datadan ajratib olish
        const telegramUser = parseTelegramUser(initData);
        if (!telegramUser || !telegramUser.id) {
            return NextResponse.json({ success: false, error: "Telegram foydalanuvchisi topilmadi" }, { status: 200 });
        }
        
        let telegramIdBigInt: bigint;
        try {
            telegramIdBigInt = BigInt(telegramUser.id);
        } catch {
            return NextResponse.json({ success: false, error: "Noto'g'ri Telegram ID formati" }, { status: 400 });
        }
        
        // 3. Bazada mavjudligini tekshirish, yo'q bo'lsa yaratish (Upsert)
        const user = await prisma.user.upsert({
            where: { telegramId: telegramIdBigInt },
            update: {
                firstName: telegramUser.first_name || undefined,
                lastName: telegramUser.last_name || undefined,
                username: telegramUser.username || undefined,
            },
            create: {
                telegramId: telegramIdBigInt,
                firstName: telegramUser.first_name || "Mijoz",
                lastName: telegramUser.last_name || null,
                username: telegramUser.username || null,
            },
        });
        
        // TypeScript xatosini oldini olish uchun explicitly `any` qilib olamiz
        const tUser = telegramUser as any;
        const finalAvatar = tUser.avatar_url || tUser.photo_url || tUser.photoUrl || "";
        
        // 4. Frontend uchun barcha formatdagi kalitlarni birdek qaytarish
        return NextResponse.json({
            success: true,
            user: {
                id: user.id.toString(),
                telegramId: user.telegramId ? user.telegramId.toString() : telegramIdBigInt.toString(),
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                first_name: user.firstName || "",
                last_name: user.lastName || "",
                username: user.username || "",
                phone: user.phone || "",
                avatarUrl: finalAvatar,
                avatar_url: finalAvatar,
            },
        });
    } catch (error) {
        console.error("AUTH ME POST ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}