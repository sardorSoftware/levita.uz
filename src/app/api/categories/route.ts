import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: {
                name: "asc",
            },
        });
        
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: "Kategoriyalarni yuklashda xatolik" },
            { status: 500 }
        );
    }
}