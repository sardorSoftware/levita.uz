import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
        });
        
        if (!product) {
            return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Fetch product error:", error);
        return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, price, oldPrice, categoryId, images, stock, isUsed } = body;
        
        const updatedProduct = await prisma.product.update({
            where: { id },
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
        
        return NextResponse.json({ success: true, product: updatedProduct });
    } catch (error: any) {
        console.error("Update product error:", error);
        return NextResponse.json(
            { error: error.message || "Yangilashda xatolik" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.product.delete({
            where: { id },
        });
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete product error:", error);
        return NextResponse.json({ error: "O'chirishda xatolik" }, { status: 500 });
    }
}