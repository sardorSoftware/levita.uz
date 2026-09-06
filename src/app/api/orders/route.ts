import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, phone, address, items, total } = body;
        
        if (!phone || !address || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Buyurtma ma'lumotlari to'liq emas" }, { status: 400 });
        }
        
        const safeTotal = typeof total === "number" ? total : 0;
        
        // Bazaga saqlash uchun obyekt
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
        
        // Agar haqiqiy bazadagi user ID kelgan bo'lsagina va u demo bo'lmasa bog'laymiz
        if (userId && typeof userId === "string" && userId !== "clx_user_demo" && userId !== "guest_user") {
            // Avval bazada bunaqa user borligini tekshiramiz
            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
            if (existingUser) {
                orderData.userId = userId;
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