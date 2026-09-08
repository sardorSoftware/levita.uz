import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const message = body.message;
        
        if (!message) {
            return NextResponse.json({ status: "ok" });
        }
        
        const chatId = message.chat.id;
        const telegramId = BigInt(message.from.id);
        const firstName = message.from.first_name || "Mijoz";
        const lastName = message.from.last_name || null;
        const username = message.from.username || null;
        const text = message.text;
        
        // 1. Agar foydalanuvchi /start yoki /start auth ni yuborsa (startswith orqali tekshirish xavfsizroq)
        if (text && text.startsWith("/start")) {
            await sendContactRequest(chatId, firstName);
            return NextResponse.json({ status: "ok" });
        }
        
        // 2. Agar foydalanuvchi o'z kontaktini (telefon raqamini) yuborsa
        if (message.contact) {
            const phone = message.contact.phone_number;
            
            // Bazaga saqlash yoki yangilash (Upsert)
            await prisma.user.upsert({
                where: { telegramId },
                update: {
                    firstName,
                    lastName,
                    username,
                    phone,
                },
                create: {
                    telegramId,
                    firstName,
                    lastName,
                    username,
                    phone,
                },
            });
            
            // Foydalanuvchiga muvaffaqiyatli ro'yxatdan o'tganini bildirish va klaviaturani olib tashlab, Mini App tugmasini berish
            await sendMessageWithWebApp(chatId, "✅ Muvaffaqiyatli ro'yxatdan o'tdingiz!\n\nEndi pastdagi tugma orqali do'konga o'tishingiz mumkin.");
            return NextResponse.json({ status: "ok" });
        }
        
        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("BOT ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Telefon raqamni so'rovchi tugmani yuborish funksiyasi
async function sendContactRequest(chatId: number, name: string) {
    if (!TELEGRAM_BOT_TOKEN) return;
    
    await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: `Assalomu alaykum, ${name}!\n\nServisimizdan foydalanish va buyurtmalarni kuzatish uchun iltimos, pastdagi **"📞 Telefon raqamni yuborish"** tugmasini bosing.`,
            reply_markup: {
                keyboard: [
                    [{ text: "📞 Telefon raqamni yuborish", request_contact: true }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        }),
    });
}

// Mini App ochish tugmasini yuborish funksiyasi (Kontakt yuborilgandan so'ng klaviaturani tozalaydi)
async function sendMessageWithWebApp(chatId: number, text: string) {
    if (!TELEGRAM_BOT_TOKEN) return;
    
    const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL || "https://sizning-domen.uz";
    
    await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🛍 Do'konni ochish", web_app: { url: webAppUrl } }]
                ],
            },
        }),
    });
}