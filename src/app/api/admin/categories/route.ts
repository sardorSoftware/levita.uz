import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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