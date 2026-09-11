"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Grid } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface BottomBarProps {
    onOpenCategories?: () => void;
}

export const BottomBar = ({ onOpenCategories }: BottomBarProps) => {
    const pathname = usePathname();
    const { items, totalPrice } = useCartStore();
    
    // Hydration xatosining oldini olish uchun komponent brauzerda yuklanganini kuzatamiz
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Agar buyurtmalar sahifasida bo'lsak, pastdagi savatcha paneli ko'rsatilmasin
    if (pathname === "/orders") {
        return null;
    }
    
    // Agar hali client'da to'liq yuklanmagan bo'lsa, server bilan bir xil 0 qiymatni olamiz
    const totalItemsCount = isMounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    
    const rawTotal = typeof totalPrice === "function" ? totalPrice() : 0;
    const safeTotal = isMounted ? rawTotal : 0;
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-100 p-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        
        {/* Savatcha tugmasi - Bosilganda to'g'ridan-to'g'ri /cart sahifasiga o'tadi */}
        <Link 
        href="/cart"
        className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-between shadow-lg shadow-primary/20 transition-colors cursor-pointer"
        >
        <div className="flex items-center gap-2">
        <div className="relative">
        <ShoppingBag className="w-5 h-5" />
        {totalItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
            {totalItemsCount}
            </span>
        )}
        </div>
        <span>Savatcha</span>
        </div>
        <span>{safeTotal.toLocaleString()} UZS</span>
        </Link>
        
        {/* Kategoriyalar / Menu tugmasi */}
        <button 
        onClick={onOpenCategories}
        className="w-12 h-12 bg-dark hover:bg-black text-white rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer"
        aria-label="Kategoriyalar"
        >
        <Grid className="w-5 h-5" />
        </button>
        
        </div>
        </div>
    );
};