import { prisma } from "@/lib/prisma";
import OrdersClient from "./OrdersClient";

export default async function AdminOrdersPage() {
    // Sizning original Prisma so'rovingiz
    const rawOrders = await prisma.order.findMany({
        include: {
            user: true,
            items: {
                include: { product: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    
    // Client Component'ga yuborishdan oldin ma'lumotlarni toza JSON formatiga o'tkazish (Date va BigInt xatoliklarini oldini oladi)
    const orders = JSON.parse(
        JSON.stringify(rawOrders, (_, value) =>
            typeof value === "bigint" ? value.toString() : value
    )
);

return (
    <div className="w-full">
    {/* Ma'lumotlarni Client UI'ga prop sifatida beramiz */}
    <OrdersClient initialOrders={orders} />
    </div>
);
}