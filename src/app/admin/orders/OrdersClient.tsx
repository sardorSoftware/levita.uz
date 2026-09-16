"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Search,
    Phone,
    MapPin,
    Clock,
    RefreshCw,
    Truck,
    CheckCircle,
    XCircle,
    Check,
    Package,
} from "lucide-react";

const STATUS_TABS = [
    { key: "ALL", label: "Barchasi" },
    { key: "PENDING", label: "⏳ Yangi" },
    { key: "PROCESSING", label: "🔄 Tayyorlanmoqda" },
    { key: "SHIPPED", label: "🚚 Yo'lda" },
    { key: "DELIVERED", label: "✅ Yetkazildi" },
    { key: "CANCELLED", label: "❌ Bekor qilingan" },
];

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
    // 1. Hydration xatosini oldini olish uchun isMounted holatini qo'shamiz
    const [isMounted, setIsMounted] = useState(false);
    
    const [orders, setOrders] = useState(initialOrders);
    const [activeTab, setActiveTab] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    
    // 2. Komponent brauzerda yuklanganini bildirish uchun useEffect qo'shamiz
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Tezkor Statusni o'zgartirish (API orqali)
    const handleQuickStatusChange = async (orderId: string | number, newStatus: string) => {
        setUpdatingId(String(orderId));
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            
            if (res.ok) {
                setOrders((prev) =>
                    prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
            );
        } else {
            alert("Statusni yangilashda xatolik yuz berdi");
        }
    } catch (error) {
        console.error("Status update error:", error);
    } finally {
        setUpdatingId(null);
    }
};

// Qidiruv va Tab bo'yicha filtrlash
const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "ALL" || order.status?.toUpperCase() === activeTab;
    const matchesSearch =
    String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.name || order.user?.firstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.phone || "").includes(searchQuery) ||
    (order.address || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
});

const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
        case "PENDING":
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Yangi</span>;
        case "PROCESSING":
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Tayyorlanmoqda</span>;
        case "SHIPPED":
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Truck className="w-3 h-3" /> Yo'lda</span>;
        case "DELIVERED":
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Yetkazildi</span>;
        case "CANCELLED":
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Bekor qilindi</span>;
        default:
        return <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{status}</span>;
    }
};

return (
    <div className="w-full flex flex-col gap-6 font-sans">
    {/* Yuqori qism (Header va Qidiruv) */}
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
    <div>
    <h1 className="text-xl font-bold text-gray-900">CRM Buyurtmalar Boshqaruvi</h1>
    <p className="text-xs text-gray-500">Tezkor 1-Click boshqaruv va statuslar nazorati</p>
    </div>
    
    <div className="relative w-full sm:w-80">
    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
    type="text"
    placeholder="ID, ism, tel yoki manzil..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
    />
    </div>
    </div>
    
    {/* Tablar */}
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
    {STATUS_TABS.map((tab) => {
        const count = tab.key === "ALL"
        ? orders.length
        : orders.filter((o) => o.status?.toUpperCase() === tab.key).length;
        
        const isActive = activeTab === tab.key;
        
        return (
            <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${isActive
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
                >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                {count}
                </span>
                </button>
            );
        })}
        </div>
        
        {/* Buyurtmalar Grid (Kartalar) */}
        {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">Hech qanday buyurtma topilmadi</h3>
            <p className="text-xs text-gray-400 mt-1">Tanlangan filtrlarga mos keluvchi buyurtmalar yo'q</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
                const customerName = order.name || order.user?.firstName || "Mijoz";
                const isUpdating = updatingId === String(order.id);
                const amount = order.totalAmount ?? order.total ?? 0;
                
                return (
                    <div
                    key={order.id}
                    className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative ${isUpdating ? "opacity-60 pointer-events-none" : ""
                        }`}
                        >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div>
                        <span className="font-bold text-slate-900 text-sm block">
                        #{String(order.id).slice(-6).toUpperCase()}
                        </span>
                        {/* 3. Sana qismi yangilandi (Hydration uchun) */}
                        <span className="text-[11px] text-gray-400">
                        {isMounted 
                            ? new Date(order.createdAt).toLocaleDateString("uz-UZ", {
                                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                            })
                            : "..." // Yuklanayotganda qisqa matn
                        }
                        </span>
                        </div>
                        {getStatusBadge(order.status)}
                        </div>
                        
                        {/* Mijoz ma'lumotlari */}
                        <div className="p-4 space-y-3 border-b border-gray-100 text-xs">
                        <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 text-sm truncate max-w-[140px]">
                        {customerName}
                        </span>
                        {order.phone && (
                            <a href={`tel:${order.phone}`} className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{order.phone}</span>
                            </a>
                        )}
                        </div>
                        <div className="flex items-start gap-1.5 text-gray-500 bg-gray-50 p-2 rounded-xl">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-tight">
                        {order.address || "Manzil ko'rsatilmagan"}
                        </span>
                        </div>
                        </div>
                        
                        {/* Mahsulotlar ro'yxati */}
                        <div className="p-4 flex-1">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Mahsulotlar ({order.items?.length || 0})
                        </p>
                        <div className="max-h-36 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {order.items?.map((item: any, idx: number) => {
                            const pName = item.product?.title || item.name || "Noma'lum mahsulot";
                            const pImg = item.product?.images?.[0];
                            
                            return (
                                <div key={idx} className="flex items-center gap-2.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                {pImg ? (
                                    <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-white">
                                    <Image src={pImg} alt={pName} fill className="object-contain p-0.5" sizes="36px" />
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                    <Package className="w-4 h-4" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-gray-800 text-xs truncate">{pName}</h5>
                                <p className="text-[10px] text-gray-500">
                                {item.quantity} ta × {Number(item.price).toLocaleString("ru-RU")} UZS
                                </p>
                                </div>
                                </div>
                            );
                        })}
                        </div>
                        </div>
                        
                        {/* Summa va Tugmalar */}
                        <div className="p-4 bg-gray-50/70 border-t border-gray-100 space-y-3">
                        <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">Jami Summa:</span>
                        <span className="text-base font-extrabold text-slate-900">
                        {Number(amount).toLocaleString("ru-RU")} UZS
                        </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1.5">
                        <button
                        onClick={() => handleQuickStatusChange(order.id, "PROCESSING")}
                        className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white py-2 px-1 rounded-xl text-xs font-bold transition-all border border-blue-200 hover:border-blue-600"
                        >
                        <RefreshCw className="w-3 h-3" /> Tayyor
                        </button>
                        <button
                        onClick={() => handleQuickStatusChange(order.id, "DELIVERED")}
                        className="flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white py-2 px-1 rounded-xl text-xs font-bold transition-all border border-emerald-200 hover:border-emerald-600"
                        >
                        <Check className="w-3 h-3" /> Yetkaz.
                        </button>
                        <button
                        onClick={() => handleQuickStatusChange(order.id, "CANCELLED")}
                        className="flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white py-2 px-1 rounded-xl text-xs font-bold transition-all border border-rose-200 hover:border-rose-600"
                        >
                        <XCircle className="w-3 h-3" /> Bekor
                        </button>
                        </div>
                        </div>
                        </div>
                    );
                })}
                </div>
            )}
            </div>
        );
    }