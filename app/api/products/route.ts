import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= MAHSULOTLARNI OLISH (GET) =================
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ success: true, data: products }, { status: 200 });
    } catch (error: unknown) {
        console.error("Products GET Error:", error);
        return NextResponse.json({ success: false, error: "Server xatosi" }, { status: 500 });
    }
}

// ================= YANGI MAHSULOT QO'SHISH (POST) =================
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, price, image, category, badge, description } = body;
        
        // Majburiy maydonlarni tekshiramiz
        if (!title || price === undefined || !category) {
            return NextResponse.json(
                { success: false, error: "Nom, narx va kategoriya kiritilishi shart!" },
                { status: 400 }
            );
        }
        
        // Bazaga yangi mahsulotni qo'shamiz
        const newProduct = await prisma.product.create({
            data: {
                title,
                price: Number(price),
                image: image || "/products/smartphone.png",
                category,
                badge: badge || null,
                description: description || null,
            },
        });
        
        return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
        
    } catch (error: unknown) {
        console.error("Product POST Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Mahsulot qo'shishda xatolik yuz berdi";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}