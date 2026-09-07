"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

export default function TelegramLoginButton() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { setUser } = useUserStore();
    const router = useRouter();
    
    useEffect(() => {
        if (!containerRef.current) return;
        
        // Bot nomini o'zingizning botingiz username bilan almashtiring (masalan: naqtol_bot)
        const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "naqtol_bot";
        
        // Global callback funksiyani o'rnatamiz
        (window as any).onTelegramAuth = async (user: any) => {
            try {
                const res = await fetch("/api/auth/telegram", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user),
                });
                
                const data = await res.json();
                if (data.success) {
                    setUser(data.user);
                    router.push("/profile");
                }
            } catch (err) {
                console.error("Login widget error:", err);
            }
        };
        
        // Telegram scriptini dinamik ravishda qo'shamiz
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-login", botUsername);
        script.setAttribute("data-size", "large");
        script.setAttribute("data-radius", "12");
        script.setAttribute("data-onauth", "onTelegramAuth(user)");
        script.setAttribute("data-request-access", "write");
        script.async = true;
        
        containerRef.current.appendChild(script);
    }, [setUser, router]);
    
    return <div ref={containerRef} className="flex justify-center my-4" />;
}