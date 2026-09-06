import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Barcha mahsulotlarni olish
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categorySlug = searchParams.get("category");
        
        const products = await prisma.product.findMany({
            where: categorySlug ? { category: { slug: categorySlug } } : {},
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
        
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Mahsulotlarni yuklashda xatolik" }, { status: 500 });
    }
}

// Yangi mahsulot qo'shish (Admin uchun)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, price, oldPrice, isUsed, image, categoryId } = body;
        
        const product = await prisma.product.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                oldPrice: oldPrice ? parseFloat(oldPrice) : null,
                isUsed: Boolean(isUsed),
                image,
                categoryId,
            },
        });
        
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Mahsulot yaratishda xatolik" }, { status: 500 });
    }
}