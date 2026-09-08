"use client";

import { X, Send } from "lucide-react";

interface TelegramLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TelegramLoginModal({ isOpen, onClose }: TelegramLoginModalProps) {
    const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME || "naqtol_bot";
    
    if (!isOpen) return null;
    
    const handleLoginRedirect = () => {
        // Veb-brauzerdagilarni botga yo'naltiramiz
        window.location.href = `https://t.me/${BOT_USERNAME}?start=auth`;
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative text-center">
        <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
        <X className="w-5 h-5" />
        </button>
        
        <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tizimga kirish</h3>
        <p className="text-sm text-gray-500">
        Buyurtmalarni kuzatish va shaxsiy kabinetdan to'liq foydalanish uchun Telegram botimiz orqali kiring va raqamingizni yuboring.
        </p>
        </div>
        
        <button
        onClick={handleLoginRedirect}
        className="w-full py-3.5 bg-[#229ED9] hover:bg-[#1e88bc] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
        <Send className="w-4 h-4" />
        <span>Telegram orqali kirish / Tasdiqlash</span>
        </button>
        </div>
        </div>
    );
}