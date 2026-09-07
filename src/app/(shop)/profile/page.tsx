"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { MapPin, ShoppingBag, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, setUser, logout } = useUserStore();
    const router = useRouter();
    
    // Telegram WebApp orqali kirilganda avto-sinxronizatsiya
    useEffect(() => {
        if (typeof window !== "undefined") {
            const tg = (window as any).Telegram?.WebApp;
            const tgUser = tg?.initDataUnsafe?.user;
            
            if (tgUser && !user) {
                setUser({
                    id: tgUser.id,
                    telegramId: tgUser.id.toString(),
                    first_name: tgUser.first_name,
                    last_name: tgUser.last_name || "",
                    username: tgUser.username || "",
                    avatar_url: tgUser.photo_url || "",
                });
            }
        }
    }, [user, setUser]);
    
    const handleLogout = () => {
        logout();
        router.push("/");
    };
    
    const firstName = user?.first_name || "";
    const lastName = user?.last_name || "";
    const avatarUrl = user?.avatar_url || "";
    
    return (
        <div className="max-w-xl mx-auto px-4 pt-4 pb-20 space-y-4">
        <h1 className="text-xl font-bold text-dark mb-4">Shaxsiy kabinet</h1>
        
        {/* Foydalanuvchi karta qismi */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl flex-shrink-0 overflow-hidden">
        {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : firstName ? (
            firstName[0].toUpperCase()
        ) : (
            "U"
        )}
        </div>
        <div className="overflow-hidden">
        <h2 className="font-bold text-dark text-base truncate">
        {user ? `${firstName} ${lastName}`.trim() : "Mehmon foydalanuvchi"}
        </h2>
        <p className="text-xs text-gray-500 truncate">
        {user?.username ? `@${user.username}` : user ? "Telegram orqali kirilgan" : "Tizimga kirilmagan"}
        </p>
        </div>
        </div>
        
        {/* Menyu elementlari */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
        <Link
        href="/orders"
        className="flex items-center justify-between p-4 hover:bg-cream/60 transition-colors cursor-pointer group"
        >
        <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
        <ShoppingBag className="w-5 h-5" />
        </div>
        <span className="text-sm font-semibold text-dark">Buyurtmalarim</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
        <span>Ko'rish</span>
        <ChevronRight className="w-4 h-4" />
        </div>
        </Link>
        
        <Link
        href="/addresses"
        className="flex items-center justify-between p-4 hover:bg-cream/60 transition-colors cursor-pointer group"
        >
        <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
        <MapPin className="w-5 h-5" />
        </div>
        <span className="text-sm font-semibold text-dark">Saqlangan manzillar</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
        <span>Boshqarish</span>
        <ChevronRight className="w-4 h-4" />
        </div>
        </Link>
        </div>
        
        {/* Chiqish */}
        {user && (
            <button
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
            <LogOut className="w-4 h-4" /> Hisobdan chiqish
            </button>
        )}
        </div>
    );
}