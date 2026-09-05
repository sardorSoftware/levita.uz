import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"; // Global prisma klienti olib kelindi

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { name, phone, address, message, cart, items, total, totalPrice } = data;
        
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (!botToken || !chatId) {
            return NextResponse.json({ error: "Telegram API kalitlari topilmadi" }, { status: 500 });
        }
        
        if (!name || !phone) {
            return NextResponse.json({ error: "Ism va telefon raqam kiritilishi shart" }, { status: 400 });
        }
        
        // Savatchadan mahsulotlar kelganini aniqlaymiz (Buyurtma formasi)
        const orderItems = cart || items || [];
        const finalTotal = total || totalPrice || 0;
        const isOrder = orderItems.length > 0;
        
        let tgMessage = "";
        
        if (isOrder) {
            // 1. Agar buyurtma bo'lsa - mahsulotlarni chiroyli ro'yxat qilamiz
            const itemsListText = orderItems.map((item: any, idx: number) => {
                const itemTitle = item.title || item.name || "Mahsulot";
                const itemQty = item.qty || item.quantity || 1;
                const itemPrice = item.price || 0;
                return `  ${idx + 1}. ${itemTitle} x${itemQty} — $${(itemPrice * itemQty).toLocaleString()}`;
            }).join('\n');
            
            tgMessage = `🛒 <b>YANGI BUYURTMA - NAQTOL (Vebsayt)</b> 🛒\n\n` +
            `👤 <b>Mijoz:</b> ${name}\n` +
            `📞 <b>Telefon:</b> ${phone}\n` +
            `📍 <b>Manzil:</b> ${address || "Ko'rsatilmagan"}\n\n` +
            `📦 <b>Buyurtmalar:</b>\n${itemsListText}\n\n` +
            `💰 <b>Jami summa:</b> $${Number(finalTotal).toLocaleString()}`;
            
            // 2. Bazaga saqlaymiz (Admin CRM panelda ko'rinishi uchun)
            try {
                await prisma.order.create({
                    data: {
                        customerName: name,
                        phone: phone,
                        address: address || "",
                        items: orderItems,
                        totalPrice: Number(finalTotal),
                        source: "WEBSITE", // Vebsaytdan kelgani belgilanadi
                        status: "NEW"      // Yangi statusda tushadi
                    }
                });
            } catch (dbError) {
                console.error("Bazaga yozishda xatolik:", dbError);
            }
            
        } else {
            // Agar oddiy xabar / aloqa formasi bo'lsa
            tgMessage = `🔔 <b>YANGI XABAR - NAQTOL</b> 🔔\n\n` +
            `👤 <b>Ism:</b> ${name}\n` +
            `📞 <b>Telefon:</b> ${phone}\n` +
            `📝 <b>Xabar:</b> ${message || "Yo'q"}`;
        }
        
        // 3. Telegram botga xabar yuborish
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: tgMessage,
                parse_mode: 'HTML',
            }),
        });
        
        if (!response.ok) {
            const errData = await response.json();
            console.error("Telegram API Error:", errData);
            return NextResponse.json({ error: "Telegram'ga yuborishda xatolik" }, { status: 500 });
        }
        
        return NextResponse.json({ success: true }, { status: 200 });
        
    } catch (error: any) {
        console.error("Telegram API Server Error:", error.message || error);
        return NextResponse.json({ error: "Server xatos yuz berdi" }, { status: 500 });
    }
}