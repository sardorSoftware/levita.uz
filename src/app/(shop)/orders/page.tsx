"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from "lucide-react";

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    name: string;
    phone: string;
    address: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"active" | "all">("active");
    
    useEffect(() => {
        async function loadOrders() {
            try {
                let phone = localStorage.getItem("user_phone") || "";
                let telegramId = "";
                
                // Telegram WebApp obyektini xavfsiz o'qib olamiz
                if (typeof window !== "undefined") {
                    // @ts-ignore
                    const tg = window.Telegram?.WebApp;
                    if (tg) {
                        tg.ready();
                        // @ts-ignore
                        const tgUser = tg.initDataUnsafe?.user;
                        if (tgUser?.id) {
                            telegramId = tgUser.id.toString();
                        }
                    }
                }
                
                // Agar ikkalasi ham bo'lmasa, serverga so'rov yuborib vaqt yo'qotmaymiz
                if (!phone && !telegramId) {
                    setLoading(false);
                    return;
                }
                
                const params = new URLSearchParams();
                if (phone) params.append("phone", phone);
                if (telegramId) params.append("telegramId", telegramId);
                
                // API manzili: Agar loyihangizda /api/orders bo'lsa, shuni ishlatamiz
                const res = await fetch(`/api/orders?${params.toString()}`);
                const data = await res.json();
                
                // Backend array yoki { success: true, orders: [] } qaytarishiga qarab tekshiramiz
                if (Array.isArray(data)) {
                    setOrders(data);
                } else if (data.success && Array.isArray(data.orders)) {
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Buyurtmalarni yuklashda xatolik:", error);
            } finally {
                setLoading(false);
            }
        }
        
        loadOrders();
    }, []);
    
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
            return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-semibold"><Clock className="w-3.5 h-3.5" /> Kutilmoqda</span>;
            case "COMPLETED":
            return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold"><CheckCircle className="w-3.5 h-3.5" /> Bajarildi</span>;
            case "CANCELLED":
            return <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-xs font-semibold"><XCircle className="w-3.5 h-3.5" /> Bekor qilindi</span>;
            default:
            return <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full text-xs font-semibold"><Clock className="w-3.5 h-3.5" /> {status || "Kutilmoqda"}</span>;
        }
    };
    
    const filteredOrders = orders.filter(order => {
        const orderStatus = order.status ? order.status.toUpperCase() : "PENDING";
        if (activeTab === "active") {
            return orderStatus === "PENDING";
        }
        return true;
    });
    
    return (
        <div className="min-h-screen bg-gray-50 pb-12">
        <div className="bg-white sticky top-0 z-20 border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
        <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Buyurtmalarim</h1>
        </div>
        </div>
        
        <div className="max-w-md mx-auto px-4 pt-4">
        <div className="flex bg-gray-200/70 p-1 rounded-xl mb-6">
        <button
        onClick={() => setActiveTab("active")}
        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
            >
            Faol
            </button>
            <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
                >
                Barchasi
                </button>
                </div>
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-gray-500 mt-3">Yuklanmoqda...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <Package className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">Buyurtmalar topilmadi</h3>
                    <p className="text-xs text-gray-500 max-w-[220px] mb-6">
                    So'rovingiz bo'yicha hech qanday natija topilmadi
                    </p>
                    <Link 
                    href="/" 
                    className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                    >
                    Xarid qilishni boshlash
                    </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                        <span className="text-xs font-medium text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("uz-UZ", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        }) : "Yaqinda"}
                        </span>
                        {getStatusBadge(order.status)}
                        </div>
                        
                        <div className="space-y-2 mb-3">
                        {order.items && order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-800 font-medium">
                            {item.name} <span className="text-gray-400 text-xs">x{item.quantity}</span>
                            </span>
                            <span className="text-gray-900 font-semibold">
                            {(item.price * item.quantity).toLocaleString("uz-UZ")} UZS
                            </span>
                            </div>
                        ))}
                        </div>
                        
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Jami summa:</span>
                        <span className="text-sm font-bold text-gray-900">
                        {order.total ? order.total.toLocaleString("uz-UZ") : 0} UZS
                        </span>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
                </div>
                </div>
            );
        }