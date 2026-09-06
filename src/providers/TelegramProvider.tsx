"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface TelegramContextType {
    user: any;
    webApp: any;
}

const TelegramContext = createContext<TelegramContextType>({
    user: null,
    webApp: null,
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
    const [webApp, setWebApp] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    
    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
            const app = (window as any).Telegram.WebApp;
            app.ready();
            setWebApp(app);
            setUser(app.initDataUnsafe?.user || null);
        }
    }, []);
    
    return (
        <TelegramContext.Provider value={{ user, webApp }}>
        {children}
        </TelegramContext.Provider>
    );
}

export const useTelegram = () => useContext(TelegramContext);