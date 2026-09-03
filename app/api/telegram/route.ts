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
        
        // Xavfsizlik uchun tekshiruv: Ma'lumotlar to'liqligi
        if (!name || !phone || !cart || !Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json({ error: "Buyurtma ma'lumotlari xato yoki bo'sh" }, { status: 400 });
        }
        
        // NAQTOL kiber temasiga moslashtirilgan xabar formati
        let message = `⚡ <b>YANGI BUYURTMA - NAQTOL</b> ⚡\n\n`;
        message += `👤 <b>Xaridor:</b> ${name}\n`;
        message += `📞 <b>Telefon:</b> ${phone}\n`;
        message += `📍 <b>Manzil:</b> ${address || "Ko'rsatilmagan"}\n\n`;
        message += `🛒 <b>Mahsulotlar:</b>\n`;
        
        cart.forEach((item: any, index: number) => {
            const itemPrice = Number(item.price) || 0;
            const itemQty = Number(item.quantity) || 1;
            const itemTotal = itemPrice * itemQty;
            
            message += `▪️ ${index + 1}. <b>${item.name || "Mahsulot"}</b> (x${itemQty}) — $${itemTotal.toFixed(2)}\n`;
        });
        
        // Agar total kelmasa, o'zi avtomat hisoblab ketadi
        const finalTotal = typeof total === 'number' ? total : cart.reduce((acc: number, item: any) => {
            return acc + (Number(item.price) || 0) * (Number(item.quantity) || 1);
        }, 0);
        
        message += `\n💰 <b>JAMI SUMMA:</b> <b>$${finalTotal.toFixed(2)}</b>`;
        
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
        
        const telegramData = await response.json();
        
        if (!response.ok) {
            console.error("Telegram API xatosi:", telegramData);
            throw new Error("Telegram'ga yuborishda xatolik");
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API Server Error:", error);
        return NextResponse.json({ error: "Server xatosi yuz berdi" }, { status: 500 });
    }
}