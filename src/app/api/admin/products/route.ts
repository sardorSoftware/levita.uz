import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // image o'rniga images qabul qilamiz
        const { title, price, oldPrice, categoryId, images, stock, isUsed } = body;
        
        // Ma'lumotlarni bazaga saqlash
        const product = await prisma.product.create({
            data: {
                title,
                price: Number(price),
                oldPrice: oldPrice ? Number(oldPrice) : null,
                images: images || [], // Array ko'rinishidagi Base64 rasmlar
                inStock: Number(stock) > 0,
                isUsed: Boolean(isUsed),
                
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