import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // O'zingdagi prisma import yo'lini tekshirib qo'y

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, address, items, total, userId } = body;
        
        // Ma'lumotlar kelganini tekshirish
        if (!phone || !items || items.length === 0) {
            return NextResponse.json(
                { error: "Telefon raqam va mahsulotlar bo'lishi shart!" },
                { status: 400 }
            );
        }
        
        // Prisma orqali Order va uning OrderItem'larini bir vaqtning o'zida yaratish
        const newOrder = await prisma.order.create({
            data: {
                name: name || "Noma'lum",
                phone: phone,
                address: address || "Ko'rsatilmagan",
                total: Number(total),
                userId: userId || null, // Agar user logan bo'lsa ulanadi
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id || item.productId, // Mahsulot ID si
                        quantity: Number(item.quantity || 1),
                        price: Number(item.price || 0),
                    })),
                },
            },
            include: {
                items: true, // Javobda itemlar ham qaytishi uchun
            },
        });
        
        return NextResponse.json({ success: true, order: newOrder }, { status: 200 });
    } catch (error: any) {
        console.error("Order API Error:", error);
        return NextResponse.json(
            { error: error.message || "Serverda xatolik yuz berdi" },
            { status: 500 }
        );
    }
}