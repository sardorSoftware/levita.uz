import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const phone = searchParams.get("phone");
        
        if (!phone) {
            return NextResponse.json({ success: false, error: "Telefon raqami kiritilmadi" }, { status: 400 });
        }
        
        const cleanPhone = phone.replace(/\D/g, "");
        
        const user = await prisma.user.findFirst({
            where: {
                phone: {
                    contains: cleanPhone,
                },
            },
        });
        
        if (!user) {
            return NextResponse.json({ success: false, error: "Foydalanuvchi topilmadi. Avval botdan ro'yxatdan o'ting." }, { status: 200 });
        }
        
        return NextResponse.json({
            success: true,
            user: {
                id: user.id.toString(),
                telegramId: user.telegramId ? user.telegramId.toString() : "",
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
        console.error("CHECK PHONE ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}