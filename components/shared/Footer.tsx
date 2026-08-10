"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("Header");
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="w-full bg-[#0D0F12] border-t border-white/5 pt-16 pb-8 mt-20">
        <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo va Qisqa ma'lumot */}
        <div className="flex flex-col items-center md:items-start">
        <Link href="/" className="font-heading text-3xl font-light tracking-widest text-primary hover:opacity-80 transition-opacity">
        LEVITA
        </Link>
        <p className="text-muted-foreground text-sm tracking-wide mt-2">
        Solar Aromatic Innovations.
        </p>
        </div>
        
        {/* Menyu */}
        <div className="flex gap-8 text-sm font-light tracking-widest uppercase">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">{t("home")}</Link>
        <Link href="#catalog" className="text-muted-foreground hover:text-primary transition-colors">{t("catalog")}</Link>
        </div>
        
        {/* Ijtimoiy tarmoqlar (Sening bloging yoki Instagraming havolalari) */}
        <div className="flex gap-6 text-sm font-light tracking-widest uppercase">
        <a 
        href="https://www.instagram.com/levita.uz" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors"
        >
        Instagram
        </a>
        
        <a 
        href="https://t.me/dr9amus" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors"
        >
        Telegram
        </a>
        </div>
        
        </div>
        
        <div className="w-full h-[1px] bg-white/5 my-8" />
        
        <div className="text-center text-xs text-muted-foreground tracking-widest uppercase">
        &copy; {currentYear} LEVITA. Barcha huquqlar himoyalangan.
        </div>
        </div>
        </footer>
    );
}