"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react"; // <--- Qo'shamiz

export default function CartSidebar() {
    const { isOpen, setIsOpen, items, removeItem, updateQuantity, getTotal } = useCartStore();
    const locale = useLocale();
    
    // MUHIM HIMOYA
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Agar sahifa hali yuklanmagan bo'lsa, savatchani yashirib turamiz
    if (!mounted) return null; 
    
    return (
        <>
        {/* Qora fon (Overlay) */}
        <div 
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsOpen(false)}
        />
        
        {/* Savatcha paneli */}
        <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#0D0F12] border-l border-white/10 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="font-heading tracking-widest text-xl uppercase text-primary">Savatcha</h2>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary transition-colors">
        <X size={24} strokeWidth={1.2} />
        </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground tracking-widest text-sm">
            Savatchangiz bo'sh
            </div>
        ) : (
            items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-[#14171A] p-4 rounded-xl border border-white/5">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
                <div className="flex-1 flex flex-col justify-between">
                <div>
                <h4 className="font-heading tracking-wide text-sm">{item.name}</h4>
                <p className="text-muted-foreground text-xs mt-1">${item.price}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 border border-white/10 rounded-full px-3 py-1">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-primary"><Minus size={14} /></button>
                <span className="text-xs font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-primary"><Plus size={14} /></button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-400">O'chirish</button>
                </div>
                </div>
                </div>
            ))
        )}
        </div>
        
        {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#0D0F12]">
            <div className="flex justify-between items-center mb-6 tracking-widest">
            <span className="text-muted-foreground">Jami:</span>
            <span className="font-heading text-xl">${getTotal().toFixed(2)}</span>
            </div>
            <Link href={`/${locale}/checkout`} onClick={() => setIsOpen(false)}>
            <button className="w-full py-4 bg-primary text-background font-medium tracking-widest uppercase rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
            Buyurtma berish
            </button>
            </Link>
            </div>
        )}
        </div>
        </>
    );
}