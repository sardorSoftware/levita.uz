import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        // 1. Next.js 15 va 14 versiyalariga birdek mos keladigan params ishlovchisi
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        if (!id) {
            return NextResponse.json(
                { success: false, error: "Buyurtma ID topilmadi" },
                { status: 400 }
            );
        }
        
        const body = await request.json();
        const { status } = body;
        
        if (!status) {
            return NextResponse.json(
                { success: false, error: "Status ko'rsatilmadi" },
                { status: 400 }
            );
        }
        
        // 2. Prisma orqali statusni bazada yangilash
        const updatedOrder = await prisma.order.update({
            where: { id }, // Agar ID bazada Integer bo'lsa: { id: Number(id) }
            data: { status },
        });
        
        // 3. BigInt turlarini JSON.stringify uchun String ga o'girish (xatolik bermasligi uchun)
        const serializedOrder = JSON.parse(
            JSON.stringify(updatedOrder, (_, value) =>
                typeof value === "bigint" ? value.toString() : value
        )
    );
    
    return NextResponse.json({
        success: true,
        order: serializedOrder,
        updatedOrder: serializedOrder,
    });
} catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json(
        { success: false, error: "Serverda statusni yangilashda xatolik bo'ldi" },
        { status: 500 }
    );
}
}