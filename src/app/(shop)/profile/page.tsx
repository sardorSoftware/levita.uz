"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { MapPin, ShoppingBag, LogOut, ChevronRight, ShieldCheck, Phone, User as UserIcon, CheckCircle2, Save, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, setUser, logout } = useUserStore();
    const router = useRouter();
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [isInTelegram, setIsInTelegram] = useState(false);
    
    // Bot username
    const BOT_USERNAME = "naqtol_bot";
    
    useEffect(() => {
        async function fetchUserData() {
            try {
                if (typeof window !== "undefined") {
                    const hasLoggedOut = sessionStorage.getItem("has_logged_out");
                    const tg = (window as any).Telegram?.WebApp;
                    const initData = tg?.initData;
                    
                    if (hasLoggedOut === "true") {
                        setIsFetching(false);
                        return;
                    }
                    
                    // Xavfsiz POST so'rov orqali foydalanuvchini tekshirish va olish
                    const res = await fetch("/api/auth/me", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ initData }),
                    });
                    
                    const data = await res.json();
                    
                    if (data.success && data.user) {
                        setIsInTelegram(true);
                        setUser({
                            id: data.user.id,
                            telegramId: data.user.telegramId.toString(),
                            first_name: data.user.firstName || "",
                            last_name: data.user.lastName || "",
                            username: data.user.username || "",
                            avatar_url: data.user.avatarUrl || tg?.initDataUnsafe?.user?.photo_url || "",
                            phone: data.user.phone || "",
                        });
                    }
                }
            } catch (err) {
                console.error("Auth sync error:", err);
            } finally {
                setIsFetching(false);
            }
        }
        
        fetchUserData();
    }, [setUser]);
    
    // Store o'zgarganda form inputlarini yangilash
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setPhone(user.phone || "");
        }
    }, [user]);
    
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.telegramId) return;
        
        setLoading(true);
        setSuccessMessage("");
        
        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    telegramId: user.telegramId,
                    firstName,
                    lastName,
                    phone,
                }),
            });
            
            const data = await res.json();
            if (data.success) {
                setUser({
                    ...user,
                    first_name: data.user.firstName,
                    last_name: data.user.lastName,
                    phone: data.user.phone,
                });
                setSuccessMessage("Shaxsiy ma'lumotlar muvaffaqiyatli yangilandi!");
            }
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("has_logged_out", "true");
        }
        logout();
        router.push("/");
    };
    
    const handleLoginRedirect = () => {
        window.location.href = `https://t.me/${BOT_USERNAME}?start=auth`;
    };
    
    const avatarUrl = user?.avatar_url || "";
    const isAuthorized = Boolean(user && user.telegramId && user.phone);
    
    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Ma'lumotlar yuklanmoqda...</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-xl mx-auto px-4 pt-4 pb-24 space-y-4">
        <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-dark">Shaxsiy kabinet</h1>
        
        {isAuthorized ? (
            <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Tasdiqlangan</span>
            </div>
        ) : (
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-200">
            <span>Mehmon</span>
            </div>
        )}
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl flex-shrink-0 overflow-hidden">
        {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : firstName ? (
            firstName[0].toUpperCase()
        ) : (
            <UserIcon className="w-7 h-7" />
        )}
        </div>
        <div className="overflow-hidden flex-1">
        <h2 className="font-bold text-dark text-base truncate">
        {isAuthorized || firstName ? `${firstName} ${lastName}`.trim() : "Mehmon foydalanuvchi"}
        </h2>
        <p className="text-xs text-gray-500 truncate">
        {user?.username ? `@${user.username}` : user?.telegramId ? `ID: ${user.telegramId}` : "Tizimga kirilmagan"}
        </p>
        </div>
        </div>
        
        {successMessage && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-2xl text-sm border border-emerald-100 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
            </div>
        )}
        
        {isAuthorized ? (
            <form onSubmit={handleUpdate} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold text-dark">Ma'lumotlarni yangilash</h2>
            
            <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Ism</label>
            <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
            required
            />
            </div>
            
            <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Familiya</label>
            <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
            />
            </div>
            
            <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Telefon raqam</label>
            <div className="relative">
            <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
            placeholder="+998 -- --- -- --"
            required
            />
            </div>
            </div>
            
            <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}</span>
            </button>
            </form>
        ) : (
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-center space-y-3">
            <p className="font-bold text-amber-900 text-sm">Tizimga kirish va raqamni tasdiqlash</p>
            <p className="text-amber-700 text-xs">
            Buyurtmalarni kuzatish va shaxsiy kabinetdan to'liq foydalanish uchun Telegram botimiz orqali telefon raqamingizni yuboring.
            </p>
            <button
            onClick={handleLoginRedirect}
            className="w-full py-3 bg-[#229ED9] hover:bg-[#1e88bc] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
            <Send className="w-4 h-4" />
            <span>Telegram orqali kirish / Tasdiqlash</span>
            </button>
            </div>
        )}
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
        <Link
        href="/orders"
        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
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
        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
        >
        <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
        <MapPin className="w-5 h-5" />
        </div>
        <span className="text-sm font-semibold text-gray-800">Saqlangan manzillar</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
        <span>Boshqarish</span>
        <ChevronRight className="w-4 h-4" />
        </div>
        </Link>
        </div>
        
        {isAuthorized && (
            <button
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
            <LogOut className="w-4 h-4" /> Hisobdan chiqish
            </button>
        )}
        </div>
    );
}