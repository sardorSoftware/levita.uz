import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        if (!id) {
            return NextResponse.json({ error: "Kategoriya ID topilmadi" }, { status: 400 });
        }
        
        const body = await request.json();
        const { name, slug } = body;
        
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, slug },
        });
        
        return NextResponse.json({ success: true, updatedCategory });
    } catch (error: any) {
        console.error("PUT Error:", error);
        return NextResponse.json(
            { error: "Kategoriyani yangilashda xatolik yuz berdi." },
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
        
        if (!id) {
            return NextResponse.json({ error: "Kategoriya ID topilmadi" }, { status: 400 });
        }
        
        // Agar sizning Prisma schemangizda "Product" dagi bog'lanish nomi boshqacha bo'lsa (masalan category_id), 
        // pastdagi "categoryId" o'rniga o'shani yozing.
        const productsCount = await prisma.product.count({
            where: { categoryId: id },
        });
        
        if (productsCount > 0) {
            return NextResponse.json(
                { error: `Ushbu kategoriyada ${productsCount} ta mahsulot bor. Oldin ularni o'chiring.` },
                { status: 400 }
            );
        }
        
        await prisma.category.delete({
            where: { id },
        });
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE Error:", error);
        return NextResponse.json(
            { error: "Kategoriyani o'chirish imkonsiz. Tizimda xatolik." },
            { status: 500 }
        );
    }
}