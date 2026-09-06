import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, price, oldPrice, categoryId, image, stock, isUsed } = body;
        
        // Ma'lumotlarni bazaga saqlash
        const product = await prisma.product.create({
            data: {
                title,
                price: Number(price),
                oldPrice: oldPrice ? Number(oldPrice) : null,
                image, // Drag & drop orqali kelgan Base64 rasm matni
                inStock: Number(stock) > 0,
                isUsed: Boolean(isUsed),
                
                // Kategoriya ID uchun (agar bazangizda ID raqam bo'lsa Number(categoryId) qilasiz):
                categoryId: categoryId && categoryId.trim() !== "" ? categoryId : undefined, 
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