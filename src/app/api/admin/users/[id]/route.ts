import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { role } = await request.json();
        
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