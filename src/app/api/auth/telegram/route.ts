import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, first_name, last_name, username, photo_url, auth_date, hash } = body;
        
        if (!id) {
            return NextResponse.json({ success: false, error: "Telegram ID topilmadi" }, { status: 400 });
        }
        
        // Xavfsizlik uchun Telegram hash tekshiruvi (agar token mavjud bo'lsa)
        if (BOT_TOKEN) {
            const dataCheckArr = Object.keys(body)
            .filter((key) => key !== "hash")
            .sort()
            .map((key) => `${key}=${body[key]}`)
            .join("\n");
            
            const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
            const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckArr).digest("hex");
            
            if (hmac !== hash) {
                return NextResponse.json({ success: false, error: "Xavfsizlik xatosi: Ma'lumotlar tasdiqlanmadi" }, { status: 403 });
            }
        }
        
        const telegramId = BigInt(id);
        
        // Bazada bor yoki yo'qligini tekshirib, upsert qilamiz
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
                id: user.id,
                // Null xatoligini oldini olish uchun optional chaining va fallback qo'shamiz
                telegramId: user.telegramId ? user.telegramId.toString() : id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                phone: user.phone,
                avatar_url: photo_url || "",
            },
        });
    } catch (error) {
        console.error("TELEGRAM AUTH ERROR:", error);
        return NextResponse.json({ success: false, error: "Server xatoligi" }, { status: 500 });
    }
}