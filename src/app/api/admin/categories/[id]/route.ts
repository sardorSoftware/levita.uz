import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Kategoriyani tahrirlash (PUT)
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
        
        // Ma'lumotlar to'liqligini tekshirish
        if (!name || !slug) {
            return NextResponse.json({ error: "Nomi va slug kiritilishi shart" }, { status: 400 });
        }
        
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, slug },
        });
        
        return NextResponse.json({ success: true, category: updatedCategory }, { status: 200 });
    } catch (error: any) {
        console.error("PUT Error:", error);
        
        // Agar yangi kiritilgan slug boshqa kategoriya slugi bilan bir xil bo'lib qolsa (P2002)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Bu slug (havola) band, boshqasini tanlang" }, { status: 400 });
        }
        
        return NextResponse.json(
            { error: "Kategoriyani yangilashda xatolik yuz berdi." },
            { status: 500 }
        );
    }
}

// Kategoriyani o'chirish (DELETE)
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
                { error: `Ushbu kategoriyada ${productsCount} ta mahsulot bor. Oldin ularni o'chiring yoki boshqa kategoriyaga o'tkazing.` },
                { status: 400 }
            );
        }
        
        await prisma.category.delete({
            where: { id },
        });
        
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("DELETE Error:", error);
        return NextResponse.json(
            { error: "Kategoriyani o'chirish imkonsiz. Tizimda xatolik yuz berdi." },
            { status: 500 }
        );
    }
}