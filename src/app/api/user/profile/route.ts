import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            telegramId, 
            firstName, 
            lastName, 
            first_name, 
            last_name, 
            phone, 
            avatar_url, 
            avatarUrl 
        } = body;
        
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
        
        // Frontend'dan camelCase yoki snake_case kelishiga moslash
        const resolvedFirstName = firstName ?? first_name;
        const resolvedLastName = lastName ?? last_name;
        
        const updatedUser = await prisma.user.update({
            where: { telegramId: telegramIdBigInt },
            data: {
                ...(resolvedFirstName !== undefined && { firstName: resolvedFirstName }),
                ...(resolvedLastName !== undefined && { lastName: resolvedLastName }),
                ...(phone !== undefined && { phone }),
            },
        });
        
        const avatar = avatar_url || avatarUrl || "";
        
        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id.toString(),
                telegramId: updatedUser.telegramId ? updatedUser.telegramId.toString() : telegramIdBigInt.toString(),
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
        
        if (error?.code === "P2025") {
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