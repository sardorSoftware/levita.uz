import { prisma } from "@/lib/prisma";
import { ShoppingCart, Package, DollarSign, Users, Clock, CheckCircle, XCircle, Truck, AlertCircle } from "lucide-react";

// Har safar sahifa ochilganda ma'lumotni bazadan yangilab olish uchun
export const dynamic = "force-dynamic";

// Statuslarni o'zbekcha nomlari va ranglari uchun yordamchi funksiya
const getStatusBadge = (status: string) => {
    switch (status) {
        case "PENDING":
        return { label: "Kutilmoqda", bg: "bg-yellow-100 text-yellow-800", icon: Clock };
        case "PROCESSING":
        return { label: "Jarayonda", bg: "bg-blue-100 text-blue-800", icon: Clock };
        case "SHIPPED":
        return { label: "Yo'lda", bg: "bg-indigo-100 text-indigo-800", icon: Truck };
        case "DELIVERED":
        return { label: "Yetkazildi", bg: "bg-green-100 text-green-800", icon: CheckCircle };
        case "CANCELLED":
        return { label: "Bekor qilindi", bg: "bg-red-100 text-red-800", icon: XCircle };
        default:
        return { label: status, bg: "bg-gray-100 text-gray-800", icon: AlertCircle };
    }
};

export default async function AdminDashboard() {
    // Bazadan barcha kerakli statistikani parallel ravishda tortib kelamiz
    const [totalRevenueAgg, ordersCount, productsCount, usersCount, recentOrders] = await Promise.all([
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { not: "CANCELLED" } }
        }),
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count(),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: true }
        })
    ]);
    
    const totalRevenue = totalRevenueAgg._sum.total || 0;
    
    const stats = [
        { 
            title: "Jami Tushum", 
            value: `${totalRevenue.toLocaleString()} UZS`, 
            icon: DollarSign, 
            color: "bg-green-500" 
        },
        { 
            title: "Buyurtmalar", 
            value: `${ordersCount} ta`, 
            icon: ShoppingCart, 
            color: "bg-blue-500" 
        },
        { 
            title: "Mahsulotlar", 
            value: `${productsCount} ta`, 
            icon: Package, 
            color: "bg-orange-500" 
        },
        { 
            title: "Mijozlar", 
            value: `${usersCount} ta`, 
            icon: Users, 
            color: "bg-purple-500" 
        },
    ];
    
    return (
        <div className="space-y-6">
        {/* Statistik kartalar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-xl font-bold text-dark mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-xl text-white shadow-sm shrink-0`}>
                <Icon className="w-6 h-6" />
                </div>
                </div>
            );
        })}
        </div>
        
        {/* So'nggi Buyurtmalar Jadvali */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-base font-bold text-dark mb-4">So'nggi buyurtmalar</h3>
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-cream text-dark uppercase text-[11px] font-bold">
        <tr>
        <th className="p-3 rounded-l-xl">ID</th>
        <th className="p-3">Mijoz</th>
        <th className="p-3">Telefon</th>
        <th className="p-3">Summa</th>
        <th className="p-3">Holat</th>
        <th className="p-3 rounded-r-xl">Sana</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {recentOrders.length === 0 ? (
            <tr>
            <td colSpan={6} className="p-8 text-center text-gray-400 text-xs">
            Hozircha buyurtmalar mavjud emas.
            </td>
            </tr>
        ) : (
            recentOrders.map((order) => {
                const statusInfo = getStatusBadge(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-semibold text-dark font-mono text-xs">
                    #{order.id.length > 6 ? order.id.slice(-6) : order.id}
                    </td>
                    <td className="p-3 font-medium text-dark">
                    {order.user?.firstName || order.user?.username || "Mijoz"}
                    </td>
                    <td className="p-3 text-xs">{order.phone}</td>
                    <td className="p-3 font-bold text-dark">{order.total.toLocaleString()} UZS</td>
                    <td className="p-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${statusInfo.bg}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                    </span>
                    </td>
                    <td className="p-3 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("uz-UZ", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
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