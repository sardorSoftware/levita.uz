import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) return NextResponse.json([], { status: 400 });
    
    const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(addresses);
}

export async function POST(req: Request) {
    try {
        const { userId, title, city, street, home } = await req.json();
        
        if (!userId || !title || !street) {
            return NextResponse.json({ error: "Majburiy maydonlar to'ldirilmagan" }, { status: 400 });
        }
        
        const address = await prisma.address.create({
            data: { userId, title, city, street, home },
        });
        
        return NextResponse.json(address);
    } catch (error) {
        return NextResponse.json({ error: "Manzil qo'shishda xatolik" }, { status: 500 });
    }
}