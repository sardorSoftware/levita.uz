import { NextResponse } from "next/server";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
    try {
        const update = await req.json();
        
        // Telegram /start buyrug'iga javob berish
        if (update.message && update.message.text === "/start") {
            const chatId = update.message.chat.id;
            const firstName = update.message.from.first_name || "Foydalanuvchi";
            
            const welcomeText = `Assalomu alaykum, <b>${firstName}</b>!\n\n<b>Naqtol</b> do'konimizga xush kelibsiz. Quyidagi tugma orqali katalog va mahsulotlarni ko'rishingiz mumkin:`;
            
            const webAppUrl = process.env.NEXT_PUBLIC_APP_URL || "https://naqtol.uz";
            
            // Telegram Bot API orqali Inline Keyboard va Web App tugmasini yuborish
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: welcomeText,
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "🛍 Do'konni ochish",
                                    web_app: { url: webAppUrl },
                                },
                            ],
                        ],
                    },
                }),
            });
        }
        
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Telegram Webhook xatoligi:", error);
        return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
    }
}