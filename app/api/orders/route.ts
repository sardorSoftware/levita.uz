import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Buyurtmalarni olish (Admin panel uchun)
export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Buyurtmalarni olishda xatolik" }, { status: 500 });
    }
}

// Telegram botdan kelgan buyurtmani saqlash uchun
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerName, phone, telegramId, items, totalPrice } = body;
        
        const newOrder = await prisma.order.create({
            data: {
                customerName,
                phone,
                telegramId,
                items,
                totalPrice,
                status: "NEW",
            },
        });
        
        return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Buyurtma saqlanmadi" }, { status: 500 });
    }
}

// Buyurtma statusini o'zgartirish (PATCH)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;
        
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
        });
        
        return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Statusni yangilash imkonsiz" }, { status: 500 });
    }
}