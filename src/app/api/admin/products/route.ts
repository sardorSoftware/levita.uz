import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, price, oldPrice, categoryId, images, stock, isUsed } = body;
        
        const product = await prisma.product.create({
            data: {
                title,
                price: Number(price),
                oldPrice: oldPrice ? Number(oldPrice) : null,
                images: images || [], 
                inStock: Number(stock) > 0, // Faqat bor yoki yo'qligini yozamiz
                isUsed: Boolean(isUsed),
                categoryId: categoryId && categoryId.trim() !== "" ? categoryId : null,
            },
        });
        
        return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (error: any) {
        console.error("Mahsulot qo'shish xatosi:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Serverda xatolik yuz berdi" },
            { status: 500 }
        );
    }
}