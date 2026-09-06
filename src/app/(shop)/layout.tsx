"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/shared/Header";
import { Sidebar } from "@/components/shared/Sidebar";
import { BottomBar } from "@/components/shared/BottomBar";
import { FloatingMenu } from "@/components/shared/FloatingMenu";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Telegram Mini App muhitiga moslashtirish va oynani kengaytirish
  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as any;
      if (win.Telegram?.WebApp) {
        const tg = win.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        // Telegram tema ranglarini moslash
        if (tg.setHeaderColor) {
          tg.setHeaderColor("#ffffff");
        }
      }
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-cream text-dark flex flex-col relative selection:bg-primary/20">
    {/* Chap yon menyu (Drawer) */}
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    
    {/* Yuqori navigatsiya qismi */}
    <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
    
    {/* Asosiy kontent konteyneri (Barcha sahifalar shu yerga tushadi) */}
    <main className="flex-1 w-full max-w-7xl mx-auto">
    {children}
    </main>
    
    {/* O'ng pastki burchakdagi tezkor yordam menyusi */}
    <FloatingMenu />
    
    {/* Qotirilgan pastki menyu (Mini App uchun tabbar) */}
    <BottomBar />
    </div>
  );
}