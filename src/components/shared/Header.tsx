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
    
    useEffect(() => {
        const checkAndFetchUser = async () => {
            try {
                const hasLoggedOut = sessionStorage.getItem("has_logged_out");
                if (hasLoggedOut === "true") return;
                
                const tg = (window as any).Telegram?.WebApp;
                const initData = tg?.initData;
                
                const res = await fetch("/api/auth/me", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ initData }),
                });
                
                const data = await res.json();
                
                if (data.success && data.user) {
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
            } catch (err) {
                console.error("User fetch error:", err);
            }
        };
        
        if (typeof window !== "undefined") {
            const tg = (window as any).Telegram?.WebApp;
            if (tg && tg.initDataUnsafe?.user) {
                setIsWebApp(true);
                tg.ready();
            }
            
            if (!user) {
                checkAndFetchUser();
            }
        }
    }, [user, setUser]);
    
    if (pathname === "/orders") {
        return null;
    }
    
    const handleProfileClick = (e: React.MouseEvent) => {
        const hasLoggedOut = sessionStorage.getItem("has_logged_out");
        
        if (hasLoggedOut === "true" || !user || !user.telegramId) {
            e.preventDefault();
            
            if (isWebApp) {
                sessionStorage.removeItem("has_logged_out");
                window.location.reload();
            } else {
                setIsAuthModalOpen(true);
            }
        }
    };
    
    return (
        <>
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
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
        {user?.first_name && sessionStorage.getItem("has_logged_out") !== "true" ? user.first_name : "Kirish"}
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