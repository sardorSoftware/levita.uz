import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, telegramId, phone, address, items, total } = body;
        
        if (!phone || !address || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Buyurtma ma'lumotlari to'liq emas" }, { status: 400 });
        }
        
        const safeTotal = typeof total === "number" ? total : 0;
        
        const orderData: any = {
            phone,
            address,
            total: safeTotal,
            items: {
                create: items.map((item: { id: string; quantity: number; price: number }) => ({
                    productId: item.id,
                    quantity: Number(item.quantity) || 1,
                    price: Number(item.price) || 0,
                })),
            },
        };
        
        let resolvedUserId = userId;
        
        // 1. Agar to'g'ri userId kelgan bo'lsa
        if (resolvedUserId && typeof resolvedUserId === "string" && resolvedUserId !== "clx_user_demo" && resolvedUserId !== "guest_user") {
            const existingUser = await prisma.user.findUnique({ where: { id: resolvedUserId } });
            if (existingUser) {
                orderData.userId = resolvedUserId;
            }
        }
        
        // 2. Agar userId bo'lmasa, lekin telegramId kelgan bo'lsa, bazadan topamiz
        if (!orderData.userId && telegramId) {
            try {
                const tgUser = await prisma.user.findFirst({
                    where: { telegramId: BigInt(telegramId) }
                });
                if (tgUser) {
                    orderData.userId = tgUser.id;
                }
            } catch (e) {
                console.log("TelegramId lookup error:", e);
            }
        }
        
        // 3. Agar hali ham userId topilmasa, kiritilgan telefon raqami bo'yicha foydalanuvchini qidirib bog'laymiz
        if (!orderData.userId && phone) {
            const phoneUser = await prisma.user.findFirst({
                where: { phone: phone }
            });
            if (phoneUser) {
                orderData.userId = phoneUser.id;
            }
        }
        
        const order = await prisma.order.create({
            data: orderData,
            include: { 
                items: { 
                    include: { product: true } 
                } 
            },
        });
        
        // Telegram xabarnomasi
        const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
        if (adminChatId) {
            try {
                const itemsList = order.items
                .map((i: any) => {
                    const title = i.product?.title || "Mahsulot";
                    const itemPrice = typeof i.price === "number" ? i.price : 0;
                    return `• ${title} x ${i.quantity} (${itemPrice.toLocaleString()} UZS)`;
                })
                .join("\n");
                
                const message = 
                `🛍 <b>YANGI BUYURTMA #${order.id.slice(-6)}</b>\n\n` +
                `👤 <b>Mijoz:</b> ${phone}\n` +
                `📍 <b>Manzil:</b> ${address || "Ko'rsatilmadi"}\n\n` +
                `📦 <b>Mahsulotlar:</b>\n${itemsList}\n\n` +
                `💰 <b>Jami summa:</b> ${safeTotal.toLocaleString()} UZS`;
                
                await sendTelegramNotification(adminChatId, message);
            } catch (tgError) {
                console.error("Telegram xatosi:", tgError);
            }
        }
        
        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        console.error("API ORDERS ERROR:", error);
        return NextResponse.json({ error: error.message || "Buyurtma berishda xatolik" }, { status: 500 });
    }
}