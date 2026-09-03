import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mahsulotlarni olish
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
    }
}

// Yangi mahsulot qo'shish (Admin panel uchun)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, price, image, category, description } = body;
        
        const newProduct = await prisma.product.create({
            data: { title, price: parseFloat(price), image, category, description },
        });
        
        return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Mahsulot qo'shilmadi" }, { status: 500 });
    }
}