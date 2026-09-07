"use client";

import { X, Send } from "lucide-react";

interface TelegramLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TelegramLoginModal({ isOpen, onClose, onSuccess }: TelegramLoginModalProps) {
    if (!isOpen) return null;
    
    // Telegram botga yo'naltirish (bot orqali avtorizatsiya qilish uchun eng oson va xatosiz yo'l)
    const handleTelegramLogin = () => {
        const botUsername = "naqtol_bot";
        // Botga maxsus start parametri bilan o'tadi
        window.open(`https://t.me/${botUsername}?start=auth`, "_blank");
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative border border-gray-100">
        {/* Yopish tugmasi */}
        <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
        <X className="w-5 h-5" />
        </button>
        
        {/* Sarlavha vaicon */}
        <div className="text-center mb-6 mt-2">
        <div className="w-16 h-16 bg-[#2AABEE]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#2AABEE] shadow-inner">
        <Send className="w-8 h-8 -ml-0.5 mt-0.5" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Telegram orqali kirish</h3>
        <p className="text-sm text-gray-500 leading-relaxed px-2">
        Buyurtmalarni kuzatish va shaxsiy kabinetdan foydalanish uchun Telegram botimizdan ro'yxatdan o'ting.
        </p>
        </div>
        
        {/* Chiroyli Telegram tugmasi */}
        <div className="space-y-3">
        <button
        onClick={handleTelegramLogin}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[#2AABEE] hover:bg-[#229ed9] text-white font-semibold rounded-2xl shadow-lg shadow-[#2AABEE]/25 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
        <Send className="w-5 h-5" />
        <span>Telegram bilan davom etish</span>
        </button>
        
        <p className="text-xs text-center text-gray-400 mt-4">
        Tugmani bosganingizda Telegram bot ochiladi va avtomatik tasdiqlanadi.
        </p>
        </div>
        </div>
        </div>
    );
}