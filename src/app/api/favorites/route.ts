import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

// Sevimlilarni olish
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        
        if (!userId) {
            return NextResponse.json({ error: "UserId topilmadi" }, { status: 400 });
        }
        
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: "desc" },
        });
        
        return NextResponse.json(favorites);
    } catch (error) {
        console.error("GET Favorites Error:", error);
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
    }
}

// Sevimlilarga qo'shish yoki o'chirish (Toggle)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, productId } = body;
        
        if (!userId || !productId) {
            return NextResponse.json({ error: "Ma'lumotlar yetishmayapti" }, { status: 400 });
        }
        
        // 1. User bazada borligini tekshiramiz, bo'lmasa faqat ID bilan yaratamiz
        let user = await prisma.user.findUnique({
            where: { id: userId },
        });
        
        if (!user) {
            try {
                user = await prisma.user.create({
                    data: {
                        id: userId, // Faqat mavjud bo'lgan ID maydoni beriladi
                    },
                });
            } catch (createError) {
                // Agar foydalanuvchi bir vaqtning o'zida boshqa joydan yaratilib ulgurgan bo'lsa
                user = await prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!user) throw createError;
            }
        }
        
        // 2. Sevimlilarni tekshirish va o'zgartirish (Toggle)
        const existing = await prisma.favorite.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        
        if (existing) {
            await prisma.favorite.delete({ where: { id: existing.id } });
            return NextResponse.json({ status: "removed" });
        } else {
            const favorite = await prisma.favorite.create({
                data: { userId, productId },
            });
            return NextResponse.json({ status: "added", favorite });
        }
    } catch (error) {
        console.error("POST Favorites Error:", error);
        return NextResponse.json({ error: "Server xatosi: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
    }
}