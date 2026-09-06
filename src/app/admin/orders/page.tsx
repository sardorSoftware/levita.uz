import { prisma } from "@/lib/prisma";
import { ShoppingCart, Clock, CheckCircle } from "lucide-react";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            items: {
                include: { product: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    
    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-dark flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-primary" /> Buyurtmalar boshqaruvi
        </h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-xl text-xs font-bold">
        Jami: {orders.length} ta
        </span>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-cream text-dark uppercase text-[11px] font-bold border-b border-gray-200">
        <tr>
        <th className="p-4">ID / Sana</th>
        <th className="p-4">Mijoz / Tel</th>
        <th className="p-4">Manzil</th>
        <th className="p-4">Summa</th>
        <th className="p-4">Holat</th>
        <th className="p-4 text-right">Amallar</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {orders.length === 0 ? (
            <tr>
            <td colSpan={6} className="p-8 text-center text-gray-400">
            Hozircha buyurtmalar mavjud emas.
            </td>
            </tr>
        ) : (
            orders.map((order) => {
                // total yoki totalAmount qaysi biri ishlatilgan bo'lsa ham xato bermasligi uchun
                const amount = (order as any).totalAmount ?? order.total ?? 0;
                
                return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                    <span className="font-bold text-dark block">#{order.id.slice(-6).toUpperCase()}</span>
                    <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
                    </span>
                    </td>
                    <td className="p-4">
                    <span className="font-semibold text-dark block">{order.user?.firstName || "Mijoz"}</span>
                    <span className="text-xs text-gray-500">{order.phone}</span>
                    </td>
                    <td className="p-4 text-xs text-gray-600 max-w-xs truncate">
                    {order.address || "Ko'rsatilmagan"}
                    </td>
                    <td className="p-4 font-bold text-dark">
                    {amount.toLocaleString()} UZS
                    </td>
                    <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "DELIVERED" ? "bg-green-100 text-green-800" : 
                        order.status === "CANCELLED" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                        }`}>
                        {order.status === "PENDING" && <Clock className="w-3 h-3" />}
                        {order.status === "DELIVERED" && <CheckCircle className="w-3 h-3" />}
                        {order.status}
                        </span>
                        </td>
                        <td className="p-4 text-right">
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                        </td>
                        </tr>
                    );
                })
            )}
            </tbody>
            </table>
            </div>
            </div>
            </div>
        );
    }