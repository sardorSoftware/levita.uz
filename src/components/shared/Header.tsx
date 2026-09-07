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
    
    // Telegram Mini App ichida ochilganda userni avtomatik Zustand store'ga saqlash
    useEffect(() => {
        if (typeof window !== "undefined") {
            const tg = (window as any).Telegram?.WebApp;
            
            if (tg) {
                setIsWebApp(true); // Biz Telegram ichidamiz
                tg.ready();
                
                const tgUser = tg.initDataUnsafe?.user;
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
        }
    }, [user, setUser]);
    
    // Agar buyurtmalar sahifasida bo'lsak, header ko'rsatilmasin
    if (pathname === "/orders") {
        return null;
    }
    
    // Profil tugmasi bosilganda xulq-atvorni boshqarish
    const handleProfileClick = (e: React.MouseEvent) => {
        // 1. Agar foydalanuvchi Telegram Mini App ichida bo'lsa — HECH QACHON modal ochilmaydi!
        if (isWebApp) {
            return; // To'g'ridan-to'g'ri /profile sahifasiga o'taveradi
        }
        
        // 2. Agar oddiy veb-saytda (Chrome / Safari) bo'lsa va user kirmagan bo'lsa — modalni ochamiz
        if (!user) {
            e.preventDefault();
            setIsAuthModalOpen(true);
        }
    };
    
    return (
        <>
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Chap qism: Menyu va Logo */}
        <div className="flex items-center gap-3">
        <button
        onClick={onOpenSidebar}
        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer"
        aria-label="Menyu"
        >
        <Menu className="w-5 h-5" />
        </button>
        
        {/* Naqtol Logosi */}
        <Link href="/" className="flex items-center select-none group">
        <span
        className="text-2xl font-black tracking-tight text-[#1a1a1c]"
        style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.3), 0 -1px 1px rgba(255, 255, 255, 0.9)",
        }}
        >
        naqt
        </span>
        <span
        className="text-2xl font-black tracking-tight text-[#FF4D00]"
        style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.25), 0 -1px 1px rgba(255, 255, 255, 0.8)",
        }}
        >
        ol
        </span>
        </Link>
        </div>
        
        {/* Markaziy qism: Lokatsiya tugmasi */}
        <button
        onClick={onOpenLocation}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-200"
        >
        <MapPin className="w-4 h-4 text-primary" />
        <span>Toshkent sh.</span>
        </button>
        
        {/* O'ng qism: Profil / Kabinet */}
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
        
        {/* Telegram Login Modal oynasi (Faqat veb uchun ishlaydi, Mini App'da umuman render bo'lmaydi) */}
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