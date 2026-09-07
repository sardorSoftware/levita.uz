"use client";

import { useState, useEffect } from "react";
import { Menu, MapPin, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import TelegramLoginModal from "./TelegramLoginModal";

interface HeaderProps {
    onOpenSidebar: () => void;
    onOpenLocation?: () => void;
}

export const Header = ({ onOpenSidebar, onOpenLocation }: HeaderProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser } = useUserStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isWebApp, setIsWebApp] = useState(false);
    
    // Foydalanuvchini bazadan (API orqali) tekshirib olish funksiyasi
    useEffect(() => {
        const checkAndFetchUser = async (telegramId: string | number, fallbackData: any) => {
            try {
                const res = await fetch(`/api/auth/me?telegramId=${telegramId}`);
                const data = await res.json();
                if (data.success && data.user) {
                    setUser({
                        id: data.user.id,
                        telegramId: data.user.telegramId.toString(),
                        first_name: data.user.firstName || fallbackData.first_name,
                        last_name: data.user.lastName || fallbackData.last_name || "",
                        username: data.user.username || fallbackData.username || "",
                        avatar_url: fallbackData.photo_url || "",
                        phone: data.user.phone || "",
                    });
                } else {
                    setUser(fallbackData);
                }
            } catch (err) {
                console.error("User fetch error:", err);
                setUser(fallbackData);
            }
        };
        
        if (typeof window !== "undefined") {
            const tg = (window as any).Telegram?.WebApp;
            
            if (tg && tg.initDataUnsafe?.user) {
                setIsWebApp(true);
                tg.ready();
                const tgUser = tg.initDataUnsafe.user;
                
                if (!user) {
                    checkAndFetchUser(tgUser.id, {
                        id: tgUser.id,
                        telegramId: tgUser.id.toString(),
                        first_name: tgUser.first_name,
                        last_name: tgUser.last_name || "",
                        username: tgUser.username || "",
                        avatar_url: tgUser.photo_url || "",
                    });
                }
            } else {
                // Agar veb-saytda bo'lsa, cookie/sesseani tekshiramiz yoki localStorage/store'ni tahlil qilamiz
                // Yoki /api/auth/me orqali veb sessiyani tekshirish mumkin
                fetch('/api/auth/me')
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.user && !user) {
                        setUser({
                            id: data.user.id,
                            telegramId: data.user.telegramId.toString(),
                            first_name: data.user.firstName,
                            last_name: "",
                            username: data.user.username || "",
                            avatar_url: "",
                            phone: data.user.phone || "",
                        });
                    }
                })
                .catch(() => {});
            }
        }
    }, [user, setUser]);
    
    if (pathname === "/orders") {
        return null;
    }
    
    const handleProfileClick = (e: React.MouseEvent) => {
        if (isWebApp) {
            // Mini App ichida to'g'ridan-to'g'ri profilga o'tadi
            return;
        }
        
        if (!user) {
            e.preventDefault();
            setIsAuthModalOpen(true);
        }
    };
    
    return (
        <>
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
        <button
        onClick={onOpenSidebar}
        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer"
        aria-label="Menyu"
        >
        <Menu className="w-5 h-5" />
        </button>
        
        <Link href="/" className="flex items-center select-none group">
        <span className="text-2xl font-black tracking-tight text-[#1a1a1c]">naqt</span>
        <span className="text-2xl font-black tracking-tight text-[#FF4D00]">ol</span>
        </Link>
        </div>
        
        <button
        onClick={onOpenLocation}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-200"
        >
        <MapPin className="w-4 h-4 text-primary" />
        <span>Toshkent sh.</span>
        </button>
        
        <Link
        href="/profile"
        onClick={handleProfileClick}
        className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs overflow-hidden">
        {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
        ) : user?.first_name ? (
            user.first_name[0].toUpperCase()
        ) : (
            <UserIcon className="w-3.5 h-3.5" />
        )}
        </div>
        <span className="text-xs font-semibold text-gray-800 hidden sm:inline">
        {user?.first_name || "Kabinet"}
        </span>
        </Link>
        </div>
        </header>
        
        {!isWebApp && (
            <TelegramLoginModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={() => router.push("/profile")}
            />
        )}
        </>
    );
};