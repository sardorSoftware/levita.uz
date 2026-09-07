import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const telegramIdParam = searchParams.get("telegramId");
        
        if (telegramIdParam) {
            const user = await prisma.user.findFirst({
                where: { telegramId: BigInt(telegramIdParam) },
            });
            if (user) {
                return NextResponse.json({
                    success: true,
                    user: { ...user, telegramId: user.telegramId?.toString() }
                });
            }
        }
        
        return NextResponse.json({ success: false });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}