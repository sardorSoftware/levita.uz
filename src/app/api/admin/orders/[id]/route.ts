import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = await params;
        const rawId = resolvedParams?.id;
        
        if (!rawId) {
            return NextResponse.json(
                { success: false, error: "Buyurtma ID si kiritilmagan" },
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
        
        // 1. ID raqam (Int) yoki matn (UUID/CUID) ekanligini avtomashina aniqlash
        const parsedId = !isNaN(Number(rawId)) ? Number(rawId) : rawId;
        
        const updatedOrder = await prisma.order.update({
            where: { id: parsedId as any },
            data: { status },
            include: {
                items: true,
            },
        });
        
        // 2. BigInt xatolarini oldini olish uchun xavfsiz JSON o'girish
        const serializedOrder = JSON.parse(
            JSON.stringify(updatedOrder, (_, value) =>
                typeof value === "bigint" ? value.toString() : value
        )
    );
    
    return NextResponse.json({
        success: true,
        order: serializedOrder,
    });
} catch (error: any) {
    console.error("Order status update error:", error);
    
    // 3. Agar ID bazada topilmasa (Prisma P2025 xatoligi)
    if (error.code === "P2025") {
        return NextResponse.json(
            { success: false, error: "Bunday ID dagi buyurtma topilmadi" },
            { status: 404 }
        );
    }
    
    return NextResponse.json(
        { success: false, error: "Serverda statusni yangilashda xatolik yuz berdi" },
        { status: 500 }
    );
}
}