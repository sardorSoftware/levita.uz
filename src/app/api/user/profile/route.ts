import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { telegramId, firstName, lastName, phone, avatar_url, avatarUrl } = body;
        
        // Validatsiya
        if (!telegramId || telegramId === "undefined" || telegramId === "null") {
            return NextResponse.json(
                { success: false, error: "Telegram ID topilmadi" },
                { status: 400 }
            );
        }
        
        let telegramIdBigInt: bigint;
        try {
            telegramIdBigInt = BigInt(telegramId);
        } catch {
            return NextResponse.json(
                { success: false, error: "Noto'g'ri Telegram ID formati" },
                { status: 400 }
            );
        }
        
        // Bazada mavjud bo'lsa yangilash, bo'lmasa yaratish (Upsert) yoki to'g'ridan-to'g'ri update
        const updatedUser = await prisma.user.update({
            where: { telegramId: telegramIdBigInt },
            data: {
                ...(firstName !== undefined && { firstName }),
                ...(lastName !== undefined && { lastName }),
                ...(phone !== undefined && { phone }),
            },
        });
        
        const avatar = avatar_url || avatarUrl || "";
        
        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                telegramId: updatedUser.telegramId?.toString() || telegramId.toString(),
                firstName: updatedUser.firstName || "",
                lastName: updatedUser.lastName || "",
                first_name: updatedUser.firstName || "",
                last_name: updatedUser.lastName || "",
                username: updatedUser.username || "",
                phone: updatedUser.phone || "",
                avatar_url: avatar,
                avatarUrl: avatar,
            },
        });
    } catch (error: any) {
        console.error("PROFILE UPDATE ERROR:", error);
        
        // Prisma record topilmaganda beradigan xatolik (P2025)
        if (error.code === "P2025") {
            return NextResponse.json(
                { success: false, error: "Foydalanuvchi topilmadi" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { success: false, error: "Ma'lumotlarni yangilashda xatolik yuz berdi" },
            { status: 500 }
        );
    }
}