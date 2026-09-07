import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";

// GET: Foydalanuvchining buyurtmalarini olish
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const phone = searchParams.get("phone");
        const userId = searchParams.get("userId");
        const telegramId = searchParams.get("telegramId");
        
        if (!phone && !userId && !telegramId) {
            return NextResponse.json({ error: "Parametrlar yetarli emas" }, { status: 400 });
        }
        
        let whereClause: any = {};
        
        if (phone) {
            whereClause.phone = phone;
        } else if (userId && userId !== "clx_user_demo" && userId !== "guest_user") {
            whereClause.userId = userId;
        } else if (telegramId) {
            const user = await prisma.user.findFirst({
                where: { telegramId: BigInt(telegramId) }
            });
            if (user) {
                whereClause.userId = user.id;
            } else {
                return NextResponse.json([], { status: 200 });
            }
        }
        
        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        
        return NextResponse.json(orders, { status: 200 });
    } catch (error: any) {
        console.error("API ORDERS GET ERROR:", error);
        return NextResponse.json({ error: error.message || "Buyurtmalarni olishda xatolik" }, { status: 500 });
    }
}

// POST: Yangi buyurtma yaratish
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, telegramId, phone, address, items, total, name } = body;
        
        if (!phone || !address || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Buyurtma ma'lumotlari to'liq emas" }, { status: 400 });
        }
        
        const safeTotal = typeof total === "number" ? total : 0;
        
        let resolvedUserId = null;
        
        if (userId && typeof userId === "string" && userId !== "clx_user_demo" && userId !== "guest_user") {
            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
            if (existingUser) {
                resolvedUserId = existingUser.id;
            }
        }
        
        if (!resolvedUserId && telegramId) {
            try {
                const tgUser = await prisma.user.findFirst({
                    where: { telegramId: BigInt(telegramId) }
                });
                if (tgUser) {
                    resolvedUserId = tgUser.id;
                }
            } catch (e) {
                console.log("TelegramId lookup error:", e);
            }
        }
        
        if (!resolvedUserId && phone) {
            try {
                const phoneUser = await prisma.user.findFirst({
                    where: { phone: phone }
                });
                if (phoneUser) {
                    resolvedUserId = phoneUser.id;
                }
            } catch (e) {
                console.log("Phone lookup error:", e);
            }
        }
        
        if (!resolvedUserId) {
            try {
                const newUser = await prisma.user.create({
                    data: {
                        phone: phone,
                        telegramId: telegramId ? BigInt(telegramId) : null,
                        firstName: name || "Mijoz", // <-- To'g'irlandi: first_name o'rniga firstName
                    }
                });
                resolvedUserId = newUser.id;
            } catch (creationError) {
                console.log("Yangi user yaratishda bazaviy cheklov, guest rejimda davom etamiz");
            }
        }
        
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
        
        if (resolvedUserId) {
            orderData.userId = resolvedUserId;
        }
        
        const order = await prisma.order.create({
            data: orderData,
            include: { 
                items: { 
                    include: { product: true } 
                } 
            },
        });
        
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
                
                const clientName = name || "Mijoz";
                const message = 
                `🛍 <b>YANGI BUYURTMA #${order.id.slice(-6)}</b>\n\n` +
                `👤 <b>Mijoz:</b> ${clientName}\n` +
                `📞 <b>Telefon:</b> ${phone}\n` +
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