"use client";

import { useEffect } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TelegramLoginModal({ isOpen, onClose, onSuccess }: Props) {
    useEffect(() => {
        if (!isOpen) return;
        
        // Window obyektiga Telegram qayta aloqa funksiyasini biriktiramiz
        (window as any).onTelegramAuth = async (user: any) => {
            try {
                const res = await fetch("/api/auth/telegram", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ telegramData: user }),
                });
                
                if (res.ok) {
                    onSuccess();
                    onClose();
                    window.location.reload();
                } else {
                    alert("Avtorizatsiyadan o'tishda xatolik yuz berdi!");
                }
            } catch (err) {
                console.error(err);
            }
        };
        
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-login", process.env.NEXT_PUBLIC_BOT_USERNAME || "bot_username");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "10");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");
        script.setAttribute("data-request-access", "write");
        script.async = true;
        
        const container = document.getElementById("telegram-widget-container");
        if (container) {
            container.innerHTML = "";
            container.appendChild(script);
        }
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
        <h3 className="text-xl font-bold mb-2">Tizimga kirish</h3>
        <p className="text-gray-500 text-sm mb-6">
        Buyurtmalarni kuzatish va shaxsiy kabinetdan foydalanish uchun Telegram orqali kiring.
        </p>
        <div id="telegram-widget-container" className="flex justify-center my-4 min-h-[40px]"></div>
        <button
        onClick={onClose}
        className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition"
        >
        Yopish
        </button>
        </div>
        </div>
    );
}