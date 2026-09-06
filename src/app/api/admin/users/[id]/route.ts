import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // <-- Next.js 15 uchun Promise qilindi
) {
    try {
        const resolvedParams = await params; // <-- Params kutib olinmoqda
        const id = resolvedParams.id;
        
        const { role } = await request.json();
        
        if (!role) {
            return NextResponse.json({ error: "Rol ko'rsatilmagan" }, { status: 400 });
        }
        
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
        });
        
        return NextResponse.json({ success: true, updatedUser });
    } catch (error) {
        console.error("User role update error:", error);
        return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
    }
}