"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Grid, ChevronRight, Layers, X, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        products: number;
    };
}

interface BottomBarProps {
    onOpenCategories?: () => void;
}

export const BottomBar = ({ onOpenCategories }: BottomBarProps) => {
    const pathname = usePathname();
    const { items, totalPrice } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Tashqariga bosilganda yopish
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    
    // Sahifa o'zgarganda yopish
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);
    
    const toggleCategories = async () => {
        if (onOpenCategories) {
            onOpenCategories();
        }
        
        if (!isOpen && categories.length === 0) {
            setLoading(true);
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (err) {
                console.error("Kategoriyalarni yuklashda xatolik:", err);
            } finally {
                setLoading(false);
            }
        }
        setIsOpen((prev) => !prev);
    };
    
    if (pathname === "/orders") return null;
    
    const totalItemsCount = isMounted
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;
    const rawTotal = typeof totalPrice === "function" ? totalPrice() : 0;
    const safeTotal = isMounted ? rawTotal : 0;
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pointer-events-none">
        <div className="max-w-md mx-auto relative pointer-events-auto" ref={popoverRef}>
        
        {/* ALOHIDA KARTOCHKALARDAN IBORAT USTM-UST FLOATING MENYU */}
        {isOpen && (
            <div className="absolute bottom-16 right-0 w-72 sm:w-80 space-y-2.5 z-50 max-h-[65vh] overflow-y-auto pr-1 pb-1 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {loading ? (
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-xl flex flex-col items-center justify-center gap-2 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin text-[#FF4D00]" />
                <span className="text-xs font-semibold">Yuklanmoqda...</span>
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 text-center text-xs text-gray-400 font-semibold border border-gray-100 shadow-xl">
                Kategoriyalar topilmadi
                </div>
            ) : (
                categories.map((cat) => (
                    <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="bg-white/95 backdrop-blur-xl border border-gray-100/80 p-3.5 rounded-[22px] shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-lg transition-all flex items-center justify-between gap-3 group active:scale-[0.98] cursor-pointer"
                    >
                    <span className="text-sm font-bold text-gray-800 group-hover:text-[#FF4D00] transition-colors truncate pl-1">
                    {cat.name}
                    </span>
                    
                    <div className="flex items-center gap-2 shrink-0">
                    {cat._count?.products !== undefined && (
                        <span className="text-[10px] font-extrabold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {cat._count.products}
                        </span>
                    )}
                    <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#FF4D00] flex items-center justify-center font-bold group-hover:bg-[#FF4D00] group-hover:text-white transition-all">
                    <Layers className="w-4 h-4" />
                    </div>
                    </div>
                    </Link>
                ))
            )}
            </div>
        )}
        
        {/* BOTTOM BAR TUGMALARI */}
        <div className="bg-white/85 backdrop-blur-xl border border-gray-100 p-2 rounded-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2.5">
        {/* Savatcha */}
        <Link
        href="/cart"
        className="flex-1 bg-[#FF4D00] hover:bg-[#e04400] text-white py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-between shadow-md shadow-[#FF4D00]/20 transition-all active:scale-[0.98] cursor-pointer"
        >
        <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center">
        <ShoppingBag className="w-5 h-5" />
        {totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#FF4D00] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
            {totalItemsCount}
            </span>
        )}
        </div>
        <span>Savatcha</span>
        </div>
        <span className="font-mono text-xs sm:text-sm tracking-tight">
        {safeTotal.toLocaleString()} UZS
        </span>
        </Link>
        
        {/* Grid / X Tugmasi */}
        <button
        onClick={toggleCategories}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-md cursor-pointer ${
            isOpen
            ? "bg-[#FF4D00] text-white shadow-[#FF4D00]/30"
            : "bg-[#1a1a1c] hover:bg-black text-white shadow-black/10"
            }`}
            aria-label="Kategoriyalar"
            >
            {isOpen ? <X className="w-5.5 h-5.5" /> : <Grid className="w-5 h-5" />}
            </button>
            </div>
            
            </div>
            </div>
        );
    };