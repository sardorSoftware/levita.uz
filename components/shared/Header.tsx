"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag, Smartphone, RefreshCw, Headphones } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
    const t = useTranslations("Header");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    
    const { items, setIsOpen } = useCartStore();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const totalItems = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    
    const switchLocale = (newLocale: string) => {
        if (!pathname) return "/";
        return pathname.replace(`/${locale}`, `/${newLocale}`);
    };
    
    // Menyuni bosganda bosh sahifaga o'tib o'sha bo'limga skrol qilish va tabni o'zgartirish
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, category: string) => {
        e.preventDefault();
        if (pathname !== `/${locale}` && pathname !== `/`) {
            router.push(`/${locale}#${category}`);
        } else {
            const element = document.getElementById(category);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/70 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        {/* ANIMATSION LOGO: NAQTOL */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
        <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-1.5"
        >
        <motion.span 
        whileHover={{ scale: 1.05 }}
        className="font-heading text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all duration-500"
        >
        NAQTOL
        </motion.span>
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </motion.div>
        </Link>
        
        {/* 3 TA ASOSIY KATEGORIYA MENYUSI */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
        <a 
        href={`/${locale}#new-phones`} 
        onClick={(e) => handleNavClick(e, "new-phones")}
        className="flex items-center gap-2 hover:text-cyan-400 transition-colors text-muted-foreground hover:scale-105 transform duration-200 cursor-pointer"
        >
        <Smartphone size={16} className="text-cyan-400" />
        <span>{t("new_phones") || "Yangi smartfonlar"}</span>
        </a>
        
        <a 
        href={`/${locale}#used-phones`} 
        onClick={(e) => handleNavClick(e, "used-phones")}
        className="flex items-center gap-2 hover:text-cyan-400 transition-colors text-muted-foreground hover:scale-105 transform duration-200 cursor-pointer"
        >
        <RefreshCw size={16} className="text-indigo-400" />
        <span>{t("used_phones") || "Ishlatilgan telefonlar"}</span>
        </a>
        
        <a 
        href={`/${locale}#accessories`} 
        onClick={(e) => handleNavClick(e, "accessories")}
        className="flex items-center gap-2 hover:text-cyan-400 transition-colors text-muted-foreground hover:scale-105 transform duration-200 cursor-pointer"
        >
        <Headphones size={16} className="text-purple-400" />
        <span>{t("accessories") || "Aksesuarlar"}</span>
        </a>
        </nav>
        
        {/* O'NG TOMON: TIL ALMASHTIRGICH VA SAVATCHA */}
        <div className="flex items-center gap-5">
        <div className="flex gap-2 text-xs font-semibold uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
        <Link 
        href={switchLocale("uz")} 
        className={`transition-colors ${locale === "uz" ? "text-cyan-400 font-bold" : "text-muted-foreground hover:text-foreground"}`}
        >
        Uz
        </Link>
        <span className="text-white/20">|</span>
        <Link 
        href={switchLocale("ru")} 
        className={`transition-colors ${locale === "ru" ? "text-cyan-400 font-bold" : "text-muted-foreground hover:text-foreground"}`}
        >
        Ru
        </Link>
        <span className="text-white/20">|</span>
        <Link 
        href={switchLocale("en")} 
        className={`transition-colors ${locale === "en" ? "text-cyan-400 font-bold" : "text-muted-foreground hover:text-foreground"}`}
        >
        En
        </Link>
        </div>
        
        <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)} 
        className="relative flex items-center justify-center p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-foreground transition-all group"
        >
        <ShoppingBag size={20} className="group-hover:text-cyan-400 transition-colors" />
        
        {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform">
            {totalItems}
            </span>
        )}
        </motion.button>
        </div>
        </div>
        </header>
    );
}