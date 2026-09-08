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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { initData, telegramId: bodyTelegramId, first_name, last_name, username, avatar_url } = body;
        
        let telegramUser: any = null;
        
        if (initData) {
            const isValid = verifyTelegramInitData(initData);
            if (isValid) {
                telegramUser = parseTelegramUser(initData);
            }
        }
        
        if (!telegramUser && bodyTelegramId && bodyTelegramId !== "undefined" && bodyTelegramId !== "null") {
            telegramUser = {
                id: bodyTelegramId,
                first_name: first_name || "Mijoz",
                last_name: last_name || null,
                username: username || null,
                avatar_url: avatar_url || "",
            };
        }
        
        if (!telegramUser || !telegramUser.id) {
            return NextResponse.json({ success: false, error: "Tizimga kirilmagan" }, { status: 200 });
        }
        
        let telegramIdBigInt: bigint;
        try {
            telegramIdBigInt = BigInt(telegramUser.id);
        } catch {
            return NextResponse.json({ success: false, error: "Noto'g'ri Telegram ID formati" }, { status: 400 });
        }
        
        const user = await prisma.user.upsert({
            where: { telegramId: telegramIdBigInt },
            update: {
                username: telegramUser.username || undefined,
            },
            create: {
                telegramId: telegramIdBigInt,
                firstName: telegramUser.first_name || "Mijoz",
                lastName: telegramUser.last_name || null,
                username: telegramUser.username || null,
            },
        });
        
        const finalAvatar = telegramUser.avatar_url || telegramUser.photo_url || avatar_url || "";
        
        return NextResponse.json({
            success: true,
            user: {
                id: user.id.toString(),
                telegramId: user.telegramId ? user.telegramId.toString() : telegramUser.id.toString(),
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