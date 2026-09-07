import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const phone = searchParams.get("phone");
        const telegramId = searchParams.get("telegramId");
        
        let conditions: any[] = [];
        
        if (phone && phone !== "null" && phone !== "undefined" && phone.trim() !== "") {
            // Telefon raqamidan faqat raqamlarni ajratib olamiz (+998 va h.k. lar xalaqit bermasligi uchun)
            const cleanPhone = phone.replace(/\D/g, "");
            if (cleanPhone.length >= 7) {
                const searchDigits = cleanPhone.slice(-9); // Oxirgi 9 ta raqam
                conditions.push({
                    phone: {
                        contains: searchDigits,
                    },
                });
            } else {
                conditions.push({ phone: phone.trim() });
            }
        }
        
        if (telegramId && telegramId !== "null" && telegramId !== "undefined") {
            try {
                const dbUser = await prisma.user.findFirst({
                    where: {
                        telegramId: BigInt(telegramId)
                    }
                });
                if (dbUser) {
                    if (dbUser.id) conditions.push({ userId: dbUser.id });
                    if (dbUser.phone) {
                        const cleanUserPhone = dbUser.phone.replace(/\D/g, "").slice(-9);
                        if (cleanUserPhone) {
                            conditions.push({ phone: { contains: cleanUserPhone } });
                        }
                    }
                }
            } catch (e) {
                console.log("TelegramId lookup error:", e);
            }
        }
        
        if (conditions.length === 0) {
            return NextResponse.json({ success: true, orders: [] }, { status: 200 });
        }
        
        const orders = await prisma.order.findMany({
            where: {
                OR: conditions,
            },
            include: {
                items: {
                    include: { product: true }
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        
        return NextResponse.json({ success: true, orders }, { status: 200 });
    } catch (error: any) {
        console.error("Fetch Orders Error:", error);
        return NextResponse.json(
            { error: error.message || "Server xatoligi" },
            { status: 500 }
        );
    }
}