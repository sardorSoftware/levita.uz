import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= 1. ADMIN STATISTIKASI VA MA'LUMOTLARNI OLISH (GET) =================
export async function GET(req: Request) {
    try {
        // Jami mahsulotlar va buyurtmalar soni
        const totalProducts = await prisma.product.count();
        const totalOrders = await prisma.order.count();
        
        // Oxirgi buyurtmalar
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        
        // Jami tushumni hisoblash (Prisma modelidagi haqiqiy 'total' maydoni ishlatildi)
        const allOrders = await prisma.order.findMany();
        const totalRevenue = allOrders.reduce(
            (acc, order) => acc + (order.total || 0), 
            0
        );
        
        return NextResponse.json({
            success: true,
            stats: {
                totalProducts,
                totalOrders,
                totalRevenue,
            },
            orders,
        }, { status: 200 });
        
    } catch (error: unknown) {
        console.error("Admin GET Error:", error);
        return NextResponse.json({ success: false, error: "Server xatosi" }, { status: 500 });
    }
}

// ================= 2. BUYURTMA STATUSINI O'ZGARTIRISH (PATCH) =================
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { orderId, status } = body;
        
        if (!orderId || !status) {
            return NextResponse.json(
                { success: false, error: "Order ID va status kiritilishi shart!" },
                { status: 400 }
            );
        }
        
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
        
        return NextResponse.json({ success: true, data: updatedOrder }, { status: 200 });
        
    } catch (error: unknown) {
        console.error("Admin PATCH Error:", error);
        return NextResponse.json({ success: false, error: "Statusni o'zgartirishda xatolik" }, { status: 500 });
    }
}

// ================= 3. MAHSULOT YOKI BUYURTMANI O'CHIRISH (DELETE) =================
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const type = searchParams.get("type"); // 'product' yoki 'order'
        
        if (!id || !type) {
            return NextResponse.json(
                { success: false, error: "ID va turini ko'rsatish shart!" },
                { status: 400 }
            );
        }
        
        if (type === "product") {
            await prisma.product.delete({ where: { id } });
        } else if (type === "order") {
            await prisma.order.delete({ where: { id } });
        } else {
            return NextResponse.json({ success: false, error: "Noto'g'ri tur ko'rsatildi!" }, { status: 400 });
        }
        
        return NextResponse.json({ success: true, message: "Muvaffaqiyatli o'chirildi" }, { status: 200 });
        
    } catch (error: unknown) {
        console.error("Admin DELETE Error:", error);
        return NextResponse.json({ success: false, error: "O'chirishda xatolik yuz berdi" }, { status: 500 });
    }
}