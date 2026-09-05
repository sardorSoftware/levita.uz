import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= BUYURTMALARNI OLISH (GET) =================
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ success: true, data: orders }, { status: 200 });
    } catch (error: unknown) {
        console.error("Orders GET Error:", error);
        return NextResponse.json({ success: false, error: "Buyurtmalarni olishda xatolik" }, { status: 500 });
    }
}

// ================= YANGI BUYURTMA QO'SHISH (POST) =================
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customerName, phone, address, telegramId, telegramUser, items, totalPrice, source } = body;
        
        // Majburiy maydonlarni tekshiramiz
        if (!customerName || !phone || !items || totalPrice === undefined) {
            return NextResponse.json(
                { success: false, error: "Ism, telefon raqami, mahsulotlar va umumiy summa kiritilishi shart!" },
                { status: 400 }
            );
        }
        
        // Bazaga buyurtma yaratamiz
        const newOrder = await prisma.order.create({
            data: {
                customerName,
                phone,
                address: address || null,
                telegramId: telegramId ? String(telegramId) : null,
                telegramUser: telegramUser || null,
                items, // JSON formatdagi mahsulotlar massivi
                totalPrice: Number(totalPrice),
                source: source || "WEBSITE",
                status: "NEW",
            },
        });
        
        return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
        
    } catch (error: unknown) {
        console.error("Order POST Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Buyurtma saqlashda xatolik yuz berdi";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}