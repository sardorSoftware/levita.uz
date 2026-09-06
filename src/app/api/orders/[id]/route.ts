import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = await Promise.resolve(params);
        const id = resolvedParams.id;
        
        const body = await request.json();
        const { status } = body;
        
        if (!status) {
            return NextResponse.json({ error: "Status ko'rsatilmagan" }, { status: 400 });
        }
        
        // include qo'shildi, shunda items bazadan birga keladi va TS xato bermaydi
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        
        return NextResponse.json({ success: true, updatedOrder });
    } catch (error) {
        console.error("Order status update error:", error);
        return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
    }
}