"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    Package, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Truck, 
    RefreshCw 
} from "lucide-react";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product?: {
        title?: string;
        image?: string;
    };
    name?: string;
}

interface Order {
    id: string;
    name?: string;
    phone: string;
    address: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

// Faol hisoblanadigan statuslar ro'yxati
const ACTIVE_STATUSES = ["PENDING", "PROCESSING", "SHIPPED"];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"active" | "all">("active");
    
    useEffect(() => {
        async function loadOrders() {
            try {
                let phone = localStorage.getItem("user_phone") || "";
                let telegramId = "";
                
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
                
                if (!phone && !telegramId) {
                    setLoading(false);
                    return;
                }
                
                const params = new URLSearchParams();
                if (phone) params.append("phone", phone);
                if (telegramId) params.append("telegramId", telegramId);
                
                const res = await fetch(`/api/orders?${params.toString()}`);
                const data = await res.json();
                
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
    
    // Status belgilari va ranglarini qaytaruvchi funksiya
    const getStatusBadge = (status: string) => {
        switch (status?.toUpperCase()) {
            case "PENDING":
            return (
                <span className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Kutilmoqda
                </span>
            );
            case "PROCESSING":
            return (
                <span className="flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" /> Jarayonda
                </span>
            );
            case "SHIPPED":
            return (
                <span className="flex items-center gap-1 text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                <Truck className="w-3.5 h-3.5 text-purple-500" /> Yo'lda
                </span>
            );
            case "DELIVERED":
            case "COMPLETED":
            return (
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Yetkazildi
                </span>
            );
            case "CANCELLED":
            return (
                <span className="flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                <XCircle className="w-3.5 h-3.5 text-rose-500" /> Bekor qilindi
                </span>
            );
            default:
            return (
                <span className="flex items-center gap-1 text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" /> {status || "Kutilmoqda"}
                </span>
            );
        }
    };
    
    // Aqlli Filtrlash Logikasi
    const filteredOrders = orders.filter((order) => {
        const orderStatus = order.status ? order.status.toUpperCase() : "PENDING";
        
        if (activeTab === "active") {
            // Faol tabda Jarayonda, Kutilmoqda va Yo'ldagi barcha buyurtmalar saqlanib turadi
            return ACTIVE_STATUSES.includes(orderStatus);
        }
        
        // Barchasi tabida barcha holatdagilar ko'rsatiladi
        return true;
    });
    
    return (
        <div className="min-h-screen bg-gray-50 pb-12">
        <div className="bg-white sticky top-0 z-20 border-b border-gray-100 px-4 py-4 flex items-center justify-between shadow-xs">
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
                    {activeTab === "active" 
                        ? "Hozircha faol jarayondagi buyurtmalaringiz yo'q" 
                        : "Sizda hechnarsa topilmadi"}
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
                            <div key={order.id} className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100">
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
                            
                            <div className="space-y-3 mb-3">
                            {order.items && order.items.map((item, idx) => {
                                const productName = item.product?.title || item.name || "Mahsulot";
                                const productImage = item.product?.image;
                                return (
                                    <div key={idx} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-none">
                                    {productImage ? (
                                        <img 
                                        src={productImage} 
                                        alt={productName} 
                                        className="w-12 h-12 object-cover rounded-xl border border-gray-100 shrink-0" 
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                        <Package className="w-6 h-6" />
                                        </div>
                                    )}
                                    
                                    <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-800 truncate">{productName}</h4>
                                    <p className="text-xs text-gray-400">
                                    {item.quantity} dona × {item.price?.toLocaleString("uz-UZ")} UZS
                                    </p>
                                    </div>
                                    
                                    <span className="text-sm font-semibold text-gray-900 shrink-0">
                                    {((item.price || 0) * (item.quantity || 1)).toLocaleString("uz-UZ")} UZS
                                    </span>
                                    </div>
                                );
                            })}
                            </div>
                            
                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Jami summa:</span>
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