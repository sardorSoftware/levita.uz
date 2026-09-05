"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag, Smartphone, RefreshCw, Headphones, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const t = useTranslations("Header");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    
    const { items, setIsOpen } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const totalItems = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    
    // Xavfsiz til almashtirish funksiyasi (Regular expression yordamida)
    const switchLocale = (newLocale: string) => {
        if (!pathname) return `/${newLocale}`;
        const segments = pathname.split("/");
        segments[1] = newLocale; // Ikkinchi segment doimo til kodi (masalan: /uz/...)
        return segments.join("/");
    };
    
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, category: string) => {
        e.preventDefault();
        setMobileMenuOpen(false);
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
        
        {/* 2. MARKAZIY KAPSULA MENYU (PILL NAVBAR - Desktop) */}
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
        
        {/* 3. O'NG TOMON: TIL ALMASHTIRGICH, SAVATCHA VA MOBIL MENYU */}
        <div className="flex items-center gap-3">
        
        {/* Til Almashtirgich (Pill Style) */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-white/5 px-3.5 py-2 rounded-full border border-white/10">
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
        aria-label="Cart"
        >
        <ShoppingBag size={18} className="group-hover:text-[#ccff00] transition-colors" />
        
        {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ccff00] text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_#ccff00]">
            {totalItems}
            </span>
        )}
        </motion.button>
        
        {/* Mobil Menyu Ochish Tugmasi */}
        <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white hover:border-[#ccff00]/40"
        aria-label="Toggle Menu"
        >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        </div>
        
        </div>
        
        {/* MOBIL MENYU DROPDOWN */}
        <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#05130f]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-4 lg:hidden shadow-2xl"
            >
            <nav className="flex flex-col gap-3">
            <a 
            href={`/${locale}#new-phones`} 
            onClick={(e) => handleNavClick(e, "new-phones")}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-sm font-semibold text-white hover:bg-[#ccff00] hover:text-black transition-all"
            >
            <Smartphone size={18} className="text-[#ccff00]" />
            <span>{t("new_phones") || "Yangi smartfonlar"}</span>
            </a>
            
            <a 
            href={`/${locale}#used-phones`} 
            onClick={(e) => handleNavClick(e, "used-phones")}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-sm font-semibold text-white hover:bg-[#ccff00] hover:text-black transition-all"
            >
            <RefreshCw size={18} className="text-[#ccff00]" />
            <span>{t("used_phones") || "Ishlatilgan telefonlar"}</span>
            </a>
            
            <a 
            href={`/${locale}#accessories`} 
            onClick={(e) => handleNavClick(e, "accessories")}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-sm font-semibold text-white hover:bg-[#ccff00] hover:text-black transition-all"
            >
            <Headphones size={18} className="text-[#ccff00]" />
            <span>{t("accessories") || "Aksesuarlar"}</span>
            </a>
            </nav>
            
            {/* Mobil Til Almashtirgich */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10 text-sm font-semibold uppercase">
            <Link 
            href={switchLocale("uz")} 
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-1.5 rounded-full ${locale === "uz" ? "bg-[#ccff00] text-black font-bold" : "text-white/60"}`}
            >
            Uz
            </Link>
            <Link 
            href={switchLocale("ru")} 
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-1.5 rounded-full ${locale === "ru" ? "bg-[#ccff00] text-black font-bold" : "text-white/60"}`}
            >
            Ru
            </Link>
            <Link 
            href={switchLocale("en")} 
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-1.5 rounded-full ${locale === "en" ? "bg-[#ccff00] text-black font-bold" : "text-white/60"}`}
            >
            En
            </Link>
            </div>
            </motion.div>
        )}
        </AnimatePresence>
        </header>
    );
}