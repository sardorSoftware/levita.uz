import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST() {
    try {
        const token = "auth_" + crypto.randomBytes(16).toString("hex");
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        
        await prisma.authSession.create({
            data: {
                token,
                expiresAt,
                status: "PENDING",
            },
        });
        
        return NextResponse.json({ success: true, token });
    } catch (error) {
        console.error("SESSION POST ERROR:", error);
        return NextResponse.json({ success: false, error: "Sessiya yaratishda xatolik" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        
        if (!token) {
            return NextResponse.json({ success: false, error: "Token ko'rsatilmadi" }, { status: 400 });
        }
        
        const session = await prisma.authSession.findUnique({
            where: { token },
            include: { user: true },
        });
        
        if (!session) {
            return NextResponse.json({ success: false, error: "Sessiya topilmadi" }, { status: 404 });
        }
        
        if (session.expiresAt < new Date()) {
            return NextResponse.json({ success: true, status: "EXPIRED" });
        }
        
        if (session.status === "APPROVED" && session.user) {
            const user = session.user;
            return NextResponse.json({
                success: true,
                status: "APPROVED",
                user: {
                    id: user.id.toString(),
                    telegramId: user.telegramId ? user.telegramId.toString() : "",
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    first_name: user.firstName || "",
                    last_name: user.lastName || "",
                    username: user.username || "",
                    phone: user.phone || "",
                    avatarUrl: "",
                    avatar_url: "",
                },
            });
        }
        
        return NextResponse.json({ success: true, status: "PENDING" });
    } catch (error) {
        console.error("SESSION GET ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}