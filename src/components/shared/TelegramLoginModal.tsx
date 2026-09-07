"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

interface TelegramLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TelegramLoginModal({ isOpen, onClose, onSuccess }: TelegramLoginModalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { setUser } = useUserStore();
    
    useEffect(() => {
        if (!isOpen || !containerRef.current) return;
        
        containerRef.current.innerHTML = "";
        const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || "naqtol_bot";
        
        // Telegram avtorizatsiyasidan keyin ishlaydigan global funksiya
        (window as any).onTelegramAuth = async (telegramUser: any) => {
            try {
                const res = await fetch("/api/auth/telegram", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ telegramData: telegramUser }),
                });
                
                const data = await res.json();
                if (data.success) {
                    setUser({
                        id: data.user.id,
                        telegramId: data.user.telegramId.toString(),
                        first_name: data.user.firstName,
                        last_name: "",
                        username: data.user.username || "",
                        avatar_url: telegramUser.photo_url || "",
                        phone: data.user.phone || "",
                    });
                    onSuccess();
                    onClose();
                }
            } catch (err) {
                console.error("Auth verification error:", err);
            }
        };
        
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-login", botUsername);
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "12");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");
        script.setAttribute("data-request-access", "write");
        script.async = true;
        
        containerRef.current.appendChild(script);
        
        return () => {
            delete (window as any).onTelegramAuth;
        };
    }, [isOpen, onClose, onSuccess, setUser]);
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative">
        <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
        <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tizimga kirish</h3>
        <p className="text-sm text-gray-500">
        Buyurtmalarni kuzatish va shaxsiy kabinetdan foydalanish uchun Telegram orqali kiring.
        </p>
        </div>
        
        <div ref={containerRef} className="flex justify-center min-h-[40px]" />
        </div>
        </div>
    );
}