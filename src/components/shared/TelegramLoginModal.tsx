"use client";

import { useState } from "react";
import { X, Send, RefreshCw } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

interface TelegramLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TelegramLoginModal({ isOpen, onClose, onSuccess }: TelegramLoginModalProps) {
    const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME || "naqtol_bot";
    const { user, setUser } = useUserStore();
    const [isChecking, setIsChecking] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    if (!isOpen) return null;
    
    const handleLoginRedirect = () => {
        window.open(`https://t.me/${BOT_USERNAME}?start=auth`, "_blank");
    };
    
    const handleCheckAuth = async () => {
        setIsChecking(true);
        setErrorMsg("");
        
        try {
            const res = await fetch("/api/auth/me", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ telegramId: user?.telegramId || "" }),
            });
            
            const data = await res.json();
            
            if (data.success && data.user && data.user.phone) {
                sessionStorage.removeItem("has_logged_out");
                setUser({
                    id: data.user.id,
                    telegramId: data.user.telegramId?.toString() || "",
                    first_name: data.user.first_name || data.user.firstName || "",
                    last_name: data.user.last_name || data.user.lastName || "",
                    firstName: data.user.firstName || data.user.first_name || "",
                    lastName: data.user.lastName || data.user.last_name || "",
                    username: data.user.username || "",
                    avatar_url: data.user.avatar_url || data.user.avatarUrl || "",
                    avatarUrl: data.user.avatar_url || data.user.avatarUrl || "",
                    phone: data.user.phone || "",
                });
                onClose();
                onSuccess();
            } else {
                setErrorMsg("Telefon raqami hali tasdiqlanmadi. Telegram botga o'tib kontaktni ulashing.");
            }
        } catch (err) {
            console.error("Auth check error:", err);
            setErrorMsg("Tekshirishda xatolik yuz berdi. Qayta urinib ko'ring.");
        } finally {
            setIsChecking(false);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative text-center space-y-4">
        <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
        <X className="w-5 h-5" />
        </button>
        
        <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tizimga kirish</h3>
        <p className="text-sm text-gray-500">
        Buyurtmalarni kuzatish va shaxsiy kabinetdan to'liq foydalanish uchun Telegram botimiz orqali kiring va raqamingizni yuboring.
        </p>
        </div>
        
        {errorMsg && (
            <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            {errorMsg}
            </div>
        )}
        
        <div className="space-y-2">
        <button
        onClick={handleLoginRedirect}
        className="w-full py-3.5 bg-[#229ED9] hover:bg-[#1e88bc] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
        <Send className="w-4 h-4" />
        <span>Telegram orqali kirish / Tasdiqlash</span>
        </button>
        
        <button
        onClick={handleCheckAuth}
        disabled={isChecking}
        className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-gray-200"
        >
        <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
        <span>Raqamni yubordim, tekshirish</span>
        </button>
        </div>
        </div>
        </div>
    );
}