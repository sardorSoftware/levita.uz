"use client";

import { useState, useEffect, useRef } from "react";
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
    const [isMounted, setIsMounted] = useState(false);
    const hasFetched = useRef(false);
    
    useEffect(() => {
        setIsMounted(true);
        
        const checkAndFetchUser = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;
            
            try {
                const hasLoggedOut = sessionStorage.getItem("has_logged_out");
                if (hasLoggedOut === "true") return;
                
                const tg = (window as any).Telegram?.WebApp;
                const initData = tg?.initData;
                
                const res = await fetch("/api/auth/me", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        initData: initData || "",
                        telegramId: user?.telegramId || "",
                    }),
                });
                
                const data = await res.json();
                
                if (data.success && data.user) {
                    setUser({
                        id: data.user.id,
                        telegramId: data.user.telegramId?.toString() || "",
                        firstName: data.user.firstName || data.user.first_name || "",
                        lastName: data.user.lastName || data.user.last_name || "",
                        username: data.user.username || "",
                        avatarUrl:
                        data.user.avatarUrl ||
                        data.user.avatar_url ||
                        tg?.initDataUnsafe?.user?.photo_url ||
                        "",
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
            checkAndFetchUser();
        }
    }, [setUser, user?.telegramId]);
    
    if (pathname === "/orders") return null;
    
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
    
    const isAuthorized = Boolean(
        user?.telegramId &&
        user?.phone &&
        (typeof window !== "undefined"
            ? sessionStorage.getItem("has_logged_out") !== "true"
            : true)
        );
        
        return (
            <>
            <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
            <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl bg-gray-100/70 hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer active:scale-95"
            aria-label="Menyu"
            >
            <Menu className="w-5 h-5" />
            </button>
            
            <Link href="/" className="flex items-center select-none group">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1a1a1c]">
            naqt
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#FF4D00]">
            ol
            </span>
            </Link>
            </div>
            
            <div className="flex items-center gap-2">
            <button
            onClick={onOpenLocation}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100/70 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-200"
            >
            <MapPin className="w-4 h-4 text-[#FF4D00]" />
            <span>Toshkent sh.</span>
            </button>
            
            <Link
            href="/profile"
            onClick={handleProfileClick}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-gray-100/70 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
            >
            <div className="w-7 h-7 rounded-full bg-[#FF4D00]/10 text-[#FF4D00] flex items-center justify-center font-bold overflow-hidden border border-[#FF4D00]/20">
            {isAuthorized && user?.avatarUrl ? (
                <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
                />
            ) : (
                <UserIcon className="w-4 h-4" />
            )}
            </div>
            <span className="text-xs font-semibold text-gray-800 hidden sm:inline">
            {isAuthorized ? user?.firstName || "Profil" : "Kirish"}
            </span>
            </Link>
            </div>
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