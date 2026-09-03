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
        <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-8 bg-[#05130f]/60 backdrop-blur-2xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* 1. NAQTOL LOGO */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
        <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2"
        >
        <div className="w-9 h-9 rounded-xl bg-[#ccff00] flex items-center justify-center font-heading font-extrabold text-black text-xl shadow-[0_0_20px_rgba(204,255,0,0.4)] group-hover:scale-105 transition-transform">
        N
        </div>
        <span className="font-heading font-extrabold text-2xl tracking-[0.15em] text-white">
        NAQTOL<span className="text-[#ccff00]">.</span>
        </span>
        </motion.div>
        </Link>
        
        {/* 2. MARKAZIY KAPSULA MENYU (PILL NAVBAR) */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl">
        <a 
        href={`/${locale}#new-phones`} 
        onClick={(e) => handleNavClick(e, "new-phones")}
        className="flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full text-white/80 hover:text-black hover:bg-[#ccff00] transition-all duration-300 group cursor-pointer"
        >
        <Smartphone size={15} className="text-[#ccff00] group-hover:text-black transition-colors" />
        <span>{t("new_phones") || "Yangi smartfonlar"}</span>
        </a>
        
        <a 
        href={`/${locale}#used-phones`} 
        onClick={(e) => handleNavClick(e, "used-phones")}
        className="flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full text-white/80 hover:text-black hover:bg-[#ccff00] transition-all duration-300 group cursor-pointer"
        >
        <RefreshCw size={15} className="text-[#ccff00] group-hover:text-black transition-colors" />
        <span>{t("used_phones") || "Ishlatilgan telefonlar"}</span>
        </a>
        
        <a 
        href={`/${locale}#accessories`} 
        onClick={(e) => handleNavClick(e, "accessories")}
        className="flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full text-white/80 hover:text-black hover:bg-[#ccff00] transition-all duration-300 group cursor-pointer"
        >
        <Headphones size={15} className="text-[#ccff00] group-hover:text-black transition-colors" />
        <span>{t("accessories") || "Aksesuarlar"}</span>
        </a>
        </nav>
        
        {/* 3. O'NG TOMON: TIL ALMASHTIRGICH VA SAVATCHA */}
        <div className="flex items-center gap-4">
        {/* Til Almashtirgich (Pill Style) */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-white/5 px-3.5 py-2 rounded-full border border-white/10">
        <Link 
        href={switchLocale("uz")} 
        className={`transition-colors ${locale === "uz" ? "text-[#ccff00] font-bold" : "text-white/60 hover:text-white"}`}
        >
        Uz
        </Link>
        <span className="text-white/20">|</span>
        <Link 
        href={switchLocale("ru")} 
        className={`transition-colors ${locale === "ru" ? "text-[#ccff00] font-bold" : "text-white/60 hover:text-white"}`}
        >
        Ru
        </Link>
        <span className="text-white/20">|</span>
        <Link 
        href={switchLocale("en")} 
        className={`transition-colors ${locale === "en" ? "text-[#ccff00] font-bold" : "text-white/60 hover:text-white"}`}
        >
        En
        </Link>
        </div>
        
        {/* Savatcha Tugmasi */}
        <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)} 
        className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:border-[#ccff00]/40 group"
        >
        <ShoppingBag size={18} className="group-hover:text-[#ccff00] transition-colors" />
        
        {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ccff00] text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_#ccff00]">
            {totalItems}
            </span>
        )}
        </motion.button>
        </div>
        
        </div>
        </header>
    );
}