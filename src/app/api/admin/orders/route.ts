import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, address, items, total, userId } = body;

        // Ma'lumotlar kelganini tekshirish
        if (!phone || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Telefon raqam va mahsulotlar bo'lishi shart!" },
                { status: 400 }
            );
        }

        // 1. PostgreSQL bazasiga Order va uning OrderItem'larini saqlash
        const newOrder = await prisma.order.create({
            data: {
                name: name || "Noma'lum",
                phone: phone,
                address: address || "Ko'rsatilmagan",
                total: Number(total) || 0,
                userId: userId || null,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id || item.productId || null,
                        name: item.name || "Mahsulot",
                        quantity: Number(item.quantity || 1),
                        price: Number(item.price || 0),
                    })),
                },
            },
            include: {
                items: true,
                user: true, // Telegram ID ni topish uchun user ni ham qo'shib olamiz
            },
        });

        // 2. Telegram bot orqali mijozga chek va adminga xabar yuborish
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const ADMIN_ID = process.env.TELEGRAM_CHAT_ID;

        if (BOT_TOKEN) {
            let itemsText = "";
            newOrder.items.forEach((item, idx) => {
                const formattedPrice = item.price.toLocaleString("uz-UZ");
                itemsText += `<b>${idx + 1}.</b> ${item.name} — <i>${item.quantity} ta x ${formattedPrice} UZS</i>\n`;
            });
            const totalFormatted = newOrder.total.toLocaleString("uz-UZ");

            // Mijozning Telegram Chat ID sini aniqlash
            let telegramChatId = null;
            if (userId && !isNaN(Number(userId))) {
                telegramChatId = Number(userId);
            } else if (newOrder.user?.telegramId) {
                telegramChatId = Number(newOrder.user.telegramId);
            }

            // A) Mijozga tasdiq chekini yuborish
            if (telegramChatId) {
                const clientMsg = (
                    `🎉 <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>\n\n` +
                    `👤 <b>Qabul qiluvchi:</b> ${newOrder.name}\n` +
                    `📞 <b>Telefon:</b> ${newOrder.phone}\n` +
                    `📍 <b>Manzil:</b> ${newOrder.address}\n\n` +
                    `📦 <b>Xarid qilingan mahsulotlar:</b>\n${itemsText}\n` +
                    `💰 <b>Jami summa:</b> <code>${totalFormatted} UZS</code>\n` +
                    `📊 <b>Status:</b> ⏳ Kutilmoqda\n\n` +
                    `⚡️ <i>Menejerimiz tez orada siz bilan bog'lanadi. Xaridingiz uchun rahmat!</i>`
                );

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: telegramChatId,
                        text: clientMsg,
                        parse_mode: "HTML",
                    }),
                }).catch(err => console.error("Telegram client notification error:", err));
            }

            // B) Adminga bildirishnoma yuborish
            if (ADMIN_ID) {
                const adminMsg = (
                    `🚨 <b>SAYTDAN YANGI BUYURTMA!</b>\n\n` +
                    `👤 <b>Mijoz:</b> ${newOrder.name}\n` +
                    `📞 <b>Telefon:</b> ${newOrder.phone}\n` +
                    `📍 <b>Manzil:</b> ${newOrder.address}\n\n` +
                    `📦 <b>Tarkib:</b>\n${itemsText}\n` +
                    `💰 <b>Jami:</b> <code>${totalFormatted} UZS</code>\n` +
                    `📊 <b>Status:</b> ⏳ Kutilmoqda`
                );

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: ADMIN_ID,
                        text: adminMsg,
                        parse_mode: "HTML",
                    }),
                }).catch(err => console.error("Telegram admin notification error:", err));
            }
        }

        return NextResponse.json({ success: true, order: newOrder }, { status: 200 });
    } catch (error: any) {
        console.error("Order API Error:", error);
        return NextResponse.json(
            { error: error.message || "Serverda xatolik yuz berdi" },
            { status: 500 }
        );
    }
}