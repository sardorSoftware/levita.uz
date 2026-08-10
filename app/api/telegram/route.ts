import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { name, phone, address, cart, total } = data;
        
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (!botToken || !chatId) {
            return NextResponse.json({ error: "Telegram API kalitlari topilmadi" }, { status: 500 });
        }
        
        // Xabarni chiroyli qilib formatlash
        let message = `🚀 <b>YANGI BUYURTMA (LEVITA)</b>\n\n`;
        message += `👤 <b>Xaridor:</b> ${name}\n`;
        message += `📞 <b>Telefon:</b> ${phone}\n`;
        message += `📍 <b>Manzil:</b> ${address}\n\n`;
        message += `🛒 <b>Mahsulotlar:</b>\n`;
        
        cart.forEach((item: any, index: number) => {
            message += `${index + 1}. ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        message += `\n💰 <b>JAMI SUMMA:</b> $${total.toFixed(2)}`;
        
        // Telegram API ga so'rov yuborish
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
            }),
        });
        
        if (!response.ok) {
            throw new Error("Telegram'ga yuborishda xatolik");
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
}