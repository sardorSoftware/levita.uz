"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export default function CartSidebar() {
    const { isOpen, setIsOpen, items, removeItem, updateQuantity, getTotal } = useCartStore();
    const locale = useLocale();
    
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) return null;
    
    // Telegram WebApp orqali buyurtmani botga yuborish
    const handleCheckout = (e: React.MouseEvent) => {
        const tg = typeof window !== "undefined" ? (window as any).Telegram?.WebApp : undefined;
        
        // Agar foydalanuvchi Telegram WebApp ichida bo'lsa
        if (tg && tg.sendData) {
            e.preventDefault(); // /checkout sahifasiga o'tib ketishni to'xtatamiz
            
            const orderData = {
                items: items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                total: getTotal(),
            };
            
            tg.sendData(JSON.stringify(orderData)); // Botga JSON yuboriladi
            tg.close(); // WebApp oynasi yopiladi
            setIsOpen(false);
        }
    };
    
    return (
        <>
        {/* Qora fon (Overlay) */}
        <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsOpen(false)}
        />
        
        {/* Savatcha paneli */}
        <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#0D0F12] border-l border-white/10 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="font-heading tracking-widest text-xl uppercase text-[#ccff00]">Savatcha</h2>
        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-[#ccff00] transition-colors">
        <X size={24} strokeWidth={1.2} />
        </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/50 tracking-widest text-sm">
            Savatchangiz bo'sh
            </div>
        ) : (
            items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-[#14171A] p-4 rounded-2xl border border-white/5 items-center">
                <div className="relative w-20 h-20 shrink-0 bg-white/5 rounded-xl overflow-hidden p-1">
                <Image 
                src={item.image} 
                alt={item.name} 
                fill
                sizes="80px"
                className="object-contain" 
                />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                <div>
                <h4 className="font-heading tracking-wide text-sm text-white">{item.name}</h4>
                <p className="text-[#ccff00] text-xs font-semibold mt-1">${item.price}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3 border border-white/10 rounded-full px-3 py-1 bg-white/5">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white/70 hover:text-[#ccff00]"><Minus size={14} /></button>
                <span className="text-xs font-medium text-white">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/70 hover:text-[#ccff00]"><Plus size={14} /></button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300">O'chirish</button>
                </div>
                </div>
                </div>
            ))
        )}
        </div>
        
        {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#0D0F12]">
            <div className="flex justify-between items-center mb-6 tracking-widest">
            <span className="text-white/60 text-sm">Jami:</span>
            <span className="font-heading text-xl text-white font-bold">${getTotal().toFixed(2)}</span>
            </div>
            <Link 
            href={`/${locale}/checkout`} 
            onClick={handleCheckout}
            className="block w-full py-4 bg-[#ccff00] text-black font-extrabold text-sm tracking-wider uppercase rounded-full text-center hover:bg-[#b8e600] transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
            Buyurtma berish
            </Link>
            </div>
        )}
        </div>
        </>
    );
}