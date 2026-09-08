"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";

interface TelegramContextType {
    user: any;
    webApp: any;
    initData: string;
    isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
    user: null,
    webApp: null,
    initData: "",
    isReady: false,
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
    const [webApp, setWebApp] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [initData, setInitData] = useState<string>("");
    const [isReady, setIsReady] = useState<boolean>(false);
    
    const setStoreUser = useUserStore((state) => state.setUser);
    
    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
            const app = (window as any).Telegram.WebApp;
            app.ready();
            app.expand();
            
            setWebApp(app);
            setInitData(app.initData || "");
            setUser(app.initDataUnsafe?.user || null);
            setIsReady(true);
            
            // Mini App ichida bo'lsa va initData mavjud bo'lsa - Avto Login
            if (app.initData) {
                const hasLoggedOut = sessionStorage.getItem("has_logged_out");
                
                if (!hasLoggedOut) {
                    fetch("/api/auth/telegram", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ initData: app.initData }),
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success && data.user) {
                            setStoreUser(data.user);
                        }
                    })
                    .catch((err) => console.error("MiniApp Auto Auth Error:", err));
                }
            }
        }
    }, [setStoreUser]);
    
    return (
        <TelegramContext.Provider value={{ user, webApp, initData, isReady }}>
        {children}
        </TelegramContext.Provider>
    );
}

export const useTelegram = () => useContext(TelegramContext);