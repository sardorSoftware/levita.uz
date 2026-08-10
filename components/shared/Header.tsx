"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react"; // <--- React'dan qo'shamiz

export default function Header() {
    const t = useTranslations("Header");
    const locale = useLocale();
    const pathname = usePathname();
    
    const { items, setIsOpen } = useCartStore();
    
    // MUHIM HIMOYA: Sahifa to'liq brauzerga yuklanmaguncha xotirani o'qimaymiz
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Faqat mounted bo'lgach raqamni hisoblaymiz, ungacha 0 turadi
    const totalItems = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    
    const switchLocale = (newLocale: string) => {
        if (!pathname) return "/";
        return pathname.replace(`/${locale}`, `/${newLocale}`);
    };
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href={`/${locale}`} className="font-heading text-2xl font-light tracking-widest text-primary hover:opacity-80 transition-opacity">
        LEVITA
        </Link>
        
        <nav className="hidden md:flex items-center gap-10 text-sm font-light tracking-wide">
        <Link href={`/${locale}`} className="hover:text-primary transition-colors">{t("home")}</Link>
        <Link href={`/${locale}#catalog`} className="hover:text-primary transition-colors">{t("catalog")}</Link>
        </nav>
        
        <div className="flex items-center gap-6">
        {/* Til almashtirgich */}
        <div className="flex gap-3 text-xs font-medium uppercase tracking-widest">
        <Link 
        href={switchLocale("uz")} 
        className={`transition-colors ${locale === "uz" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
        Uz
        </Link>
        <span className="text-border">|</span>
        <Link 
        href={switchLocale("ru")} 
        className={`transition-colors ${locale === "ru" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
        Ru
        </Link>
        <span className="text-border">|</span>
        <Link 
        href={switchLocale("en")} 
        className={`transition-colors ${locale === "en" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
        En
        </Link>
        </div>
        
        {/* Tugma bosilganda savatchani ochamiz */}
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group">
        <div className="relative">
        <ShoppingBag size={22} strokeWidth={1.2} />
        {/* Dinamik mahsulot soni */}
        {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            {totalItems}
            </span>
        )}
        </div>
        <span className="hidden md:block text-sm font-light ml-2">{t("cart")}</span>
        </button>
        </div>
        </div>
        </header>
    );
}