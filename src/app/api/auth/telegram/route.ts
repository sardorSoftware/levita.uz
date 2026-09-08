import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, first_name, last_name, username, photo_url, hash } = body;
        
        if (!id) {
            return NextResponse.json({ success: false, error: "Telegram ID topilmadi" }, { status: 400 });
        }
        
        if (BOT_TOKEN && hash) {
            const dataCheckArr = Object.keys(body)
            .filter((key) => key !== "hash" && body[key] !== undefined && body[key] !== null)
            .sort()
            .map((key) => `${key}=${body[key]}`)
            .join("\n");
            
            const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
            const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckArr).digest("hex");
            
            if (hmac !== hash) {
                console.warn("Telegram Widget Hash mismatch detected!");
            }
        }
        
        const telegramId = BigInt(id);
        
        const user = await prisma.user.upsert({
            where: { telegramId },
            update: {
                firstName: first_name || "Mijoz",
                lastName: last_name || null,
                username: username || null,
            },
            create: {
                telegramId,
                firstName: first_name || "Mijoz",
                lastName: last_name || null,
                username: username || null,
            },
        });
        
        return NextResponse.json({
            success: true,
            user: {
                id: user.id.toString(),
                telegramId: user.telegramId ? user.telegramId.toString() : id.toString(),
                first_name: user.firstName,
                last_name: user.lastName,
                username: user.username,
                phone: user.phone,
                avatar_url: photo_url || "", // <-- photo_url to'g'ridan-to'g'ri olindi
            },
        });
    } catch (error) {
        console.error("TELEGRAM AUTH ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}