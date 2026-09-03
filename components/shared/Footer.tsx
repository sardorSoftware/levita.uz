"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Phone, Send } from "lucide-react";

export default function Footer() {
    const locale = useLocale();
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="w-full bg-[#0A0C10] border-t border-white/5 pt-16 pb-8 mt-20 text-white">
        <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Logo va Qisqa ma'lumot */}
        <div className="flex flex-col items-start">
        <Link 
        href={`/${locale}`} 
        className="font-heading text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 flex items-center gap-1.5"
        >
        NAQTOL <span className="w-2 h-2 rounded-full bg-cyan-400" />
        </Link>
        <p className="text-muted-foreground text-sm tracking-wide mt-2">
        Eng so&apos;nggi rusumdagi smartfonlar va original aksesuarlar.
        </p>
        </div>
        
        {/* Bog'lanish / Telefon */}
        <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
        Bog&apos;lanish
        </span>
        <a 
        href="tel:+998910144040" 
        className="flex items-center gap-2 text-sm text-foreground hover:text-cyan-400 transition-colors"
        >
        <Phone size={16} className="text-cyan-400" />
        +998 (91) 014-40-40
        </a>
        </div>
        
        {/* Ijtimoiy tarmoqlar */}
        <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
        Ijtimoiy tarmoqlar
        </span>
        <div className="flex gap-4">
        <a 
        href="https://www.instagram.com/naqtol" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
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
        className="text-cyan-400"
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
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
        >
        <Send size={16} className="text-cyan-400" />
        Telegram
        </a>
        </div>
        </div>
        
        </div>
        
        <div className="w-full h-[1px] bg-white/5 my-8" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground tracking-widest uppercase gap-4">
        <p>&copy; {currentYear} NAQTOL. Barcha huquqlar himoyalangan.</p>
        <div className="flex gap-6">
        <Link href={`/${locale}#new-phones`} className="hover:text-cyan-400 transition-colors">
        Yangi smartfonlar
        </Link>
        <Link href={`/${locale}#used-phones`} className="hover:text-cyan-400 transition-colors">
        B/U Telefonlar
        </Link>
        <Link href={`/${locale}#accessories`} className="hover:text-cyan-400 transition-colors">
        Aksesuarlar
        </Link>
        </div>
        </div>
        </div>
        </footer>
    );
}