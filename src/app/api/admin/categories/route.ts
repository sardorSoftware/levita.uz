import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Kategoriyalarni olish (GET)
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
        });
        return NextResponse.json({ success: true, categories });
    } catch (error) {
        console.error("Fetch categories error:", error);
        return NextResponse.json({ error: "Kategoriyalarni olishda xatolik" }, { status: 500 });
    }
}

// Yangi kategoriya qo'shish (POST) - Shu funksiya yetishmayotgan edi
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, slug } = body;
        
        if (!name || !slug) {
            return NextResponse.json({ error: "Nomi va slug kiritilishi shart" }, { status: 400 });
        }
        
        // Bazaga saqlash
        const newCategory = await prisma.category.create({
            data: {
                name,
                slug,
            },
        });
        
        return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
    } catch (error: any) {
        console.error("Create category error:", error);
        
        // Agar slug takrorlanib qolsa, Prisma P2002 xatosini beradi
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Bu slug (havola) band, boshqasini tanlang" }, { status: 400 });
        }
        
        return NextResponse.json({ error: "Kategoriya saqlashda xatolik yuz berdi" }, { status: 500 });
    }
}