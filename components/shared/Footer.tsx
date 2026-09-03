"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Send } from "lucide-react";

export default function Footer() {
    const locale = useLocale();
    const t = useTranslations("Footer");
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="w-full bg-[#05130f] border-t border-white/10 pt-16 pb-8 mt-20 text-white relative overflow-hidden">
        {/* Orqa fon nur effekti */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-[#ccff00]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Logo va Qisqa ma'lumot */}
        <div className="flex flex-col items-start">
        <Link 
        href={`/${locale}`} 
        className="font-heading text-2xl font-extrabold tracking-widest text-white flex items-center gap-2.5 group"
        >
        <div className="w-8 h-8 rounded-xl bg-[#ccff00] flex items-center justify-center font-heading font-extrabold text-black text-lg shadow-[0_0_15px_rgba(204,255,0,0.4)] group-hover:scale-105 transition-transform">
        N
        </div>
        <span>NAQTOL<span className="text-[#ccff00]">.</span></span>
        </Link>
        <p className="text-white/60 text-sm tracking-wide mt-3 max-w-sm">
        {t("description")}
        </p>
        </div>
        
        {/* Bog'lanish / Telefon */}
        <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-[#ccff00] font-semibold">
        {t("contact")}
        </span>
        <a 
        href="tel:+998910144040" 
        className="flex items-center gap-2 text-sm text-white/80 hover:text-[#ccff00] transition-colors"
        >
        <Phone size={16} className="text-[#ccff00]" />
        +998 (91) 014-40-40
        </a>
        </div>
        
        {/* Ijtimoiy tarmoqlar */}
        <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-[#ccff00] font-semibold">
        {t("socials")}
        </span>
        <div className="flex gap-4">
        <a 
        href="https://www.instagram.com/naqtol" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-white/80 hover:text-[#ccff00] transition-colors"
        >
        <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-[#ccff00]"
        >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
        Instagram
        </a>
        
        <a 
        href="https://t.me/Mirbayev" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-white/80 hover:text-[#ccff00] transition-colors flex items-center gap-2 text-sm"
        >
        <Send size={16} className="text-[#ccff00]" />
        Telegram
        </a>
        </div>
        </div>
        
        </div>
        
        <div className="w-full h-[1px] bg-white/10 my-8" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 tracking-widest uppercase gap-4">
        <p>&copy; {currentYear} NAQTOL. {t("all_rights")}</p>
        <div className="flex gap-6">
        <Link href={`/${locale}#new-phones`} className="hover:text-[#ccff00] transition-colors">
        {t("new_phones")}
        </Link>
        <Link href={`/${locale}#used-phones`} className="hover:text-[#ccff00] transition-colors">
        {t("used_phones")}
        </Link>
        <Link href={`/${locale}#accessories`} className="hover:text-[#ccff00] transition-colors">
        {t("accessories")}
        </Link>
        </div>
        </div>
        </div>
        </footer>
    );
}