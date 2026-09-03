"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Phone, Clock, CheckCircle, Truck, XCircle, User } from "lucide-react";

interface Order {
    id: string;
    customerName: string;
    phone: string;
    telegramId?: string;
    items: any;
    totalPrice: number;
    status: string;
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (error) {
            console.error("Xatolik:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchOrders();
        // Har 10 sekundda bazadan yangi buyurtmalarni tekshirib turish
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);
    
    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error("Statusni o'zgartirishda xatolik:", error);
        }
    };
    
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "NEW":
            return <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1"><Clock size={12}/> Yangi</span>;
            case "CONFIRMED":
            return <span className="bg-yellow-500/10 text-yellow-400 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1"><CheckCircle size={12}/> Tasdiqlangan</span>;
            case "SHIPPING":
            return <span className="bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1"><Truck size={12}/> Yetkazilmoqda</span>;
            case "COMPLETED":
            return <span className="bg-green-500/10 text-green-400 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1"><CheckCircle size={12}/> Yakunlangan</span>;
            case "CANCELLED":
            return <span className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1"><XCircle size={12}/> Bekor qilingan</span>;
            default:
            return <span className="bg-white/10 text-white px-2.5 py-1 rounded-md text-xs font-semibold">{status}</span>;
        }
    };
    
    return (
        <div className="min-h-screen bg-[#05130f] text-white p-8">
        <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
        <ShoppingBag className="text-[#ccff00]" /> NAQTOL Admin: Buyurtmalar CRM
        </h1>
        
        {loading ? (
            <p className="text-white/50 text-center py-12">Buyurtmalar yuklanmoqda...</p>
        ) : orders.length === 0 ? (
            <div className="bg-black/40 border border-white/10 p-12 rounded-2xl text-center">
            <ShoppingBag size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/50 text-lg">Hozircha hech qanday buyurtma kelib tushmadi.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
                <div key={order.id} className="bg-black/40 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-white/40">ID: {order.id.slice(0, 8)}...</span>
                {getStatusBadge(order.status)}
                <span className="text-xs text-white/50">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm pt-2">
                <span className="flex items-center gap-1.5 font-bold text-white">
                <User size={16} className="text-[#ccff00]" /> {order.customerName}
                </span>
                <a href={`tel:${order.phone}`} className="flex items-center gap-1.5 text-[#ccff00] hover:underline">
                <Phone size={16} /> {order.phone}
                </a>
                {order.telegramId && (
                    <span className="text-white/60 text-xs">TG ID: {order.telegramId}</span>
                )}
                </div>
                
                {/* Buyurtma tarkibi */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 mt-3 max-w-xl">
                <p className="text-xs font-semibold text-[#ccff00] mb-2 uppercase tracking-wider">Buyurtma tarkibi:</p>
                <ul className="space-y-1 text-sm text-white/80">
                {Array.isArray(order.items) ? (
                    order.items.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between border-b border-white/5 pb-1 last:border-0">
                        <span>{item.title} (x{item.qty || item.quantity || 1})</span>
                        <span className="font-semibold text-[#ccff00]">${item.price * (item.qty || item.quantity || 1)}</span>
                        </li>
                    ))
                ) : (
                    <p className="text-xs text-white/60">Ma'lumot mavjud emas</p>
                )}
                </ul>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10 font-bold">
                <span>Jami summa:</span>
                <span className="text-[#ccff00] text-lg">${order.totalPrice}</span>
                </div>
                </div>
                </div>
                
                {/* Statusni o'zgartirish tugmalari */}
                <div className="flex flex-col gap-2 w-full md:w-48">
                <span className="text-xs text-white/50 uppercase tracking-wider">Statusni o'zgartirish:</span>
                <button 
                onClick={() => updateStatus(order.id, "CONFIRMED")}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-xs font-semibold py-2 px-3 rounded-lg border border-yellow-500/30 transition-colors text-left"
                >
                ✓ Tasdiqlash
                </button>
                <button 
                onClick={() => updateStatus(order.id, "SHIPPING")}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold py-2 px-3 rounded-lg border border-purple-500/30 transition-colors text-left"
                >
                🚚 Yetkazilmoqda
                </button>
                <button 
                onClick={() => updateStatus(order.id, "COMPLETED")}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs font-semibold py-2 px-3 rounded-lg border border-green-500/30 transition-colors text-left"
                >
                ✅ Yakunlash
                </button>
                <button 
                onClick={() => updateStatus(order.id, "CANCELLED")}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold py-2 px-3 rounded-lg border border-red-500/30 transition-colors text-left"
                >
                ✕ Bekor qilish
                </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
        </div>
    );
}