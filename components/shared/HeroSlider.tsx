"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Headphones } from "lucide-react";

export default function HeroSlider() {
    const locale = useLocale();
    
    // Ishonchli afzalliklar (Trust Badges) - O'zbekiston bozoriga moslashtirilgan
    const badges = [
        {
            icon: Zap,
            title: "Super Narxlar",
            subtitle: "Hamyonbop va qulay",
        },
        {
            icon: ShieldCheck,
            title: "1 yil Kafolat",
            subtitle: "Rasmiy servis markazi",
        },
        {
            icon: Headphones,
            title: "24/7 Qo'llab-quvvatlash",
            subtitle: "Doim aloqadamiz",
        },
        {
            icon: Sparkles,
            title: "100% Original",
            subtitle: "Faqat saralangan brendlar",
        },
    ];
    
    return (
        <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between pt-8 pb-12 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* 1. ASOSIY HERO MAZMUNI (Grid Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        
        {/* CHAP TOMON: Matnlar va Chaqiriq Tugmalari */}
        <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:col-span-7 flex flex-col items-start gap-6 z-10"
        >
        {/* Kichik Sub-tag */}
        <div className="flex items-center gap-3">
        <span className="w-8 h-[2px] bg-[#ccff00]" />
        <span className="text-xs font-semibold tracking-[0.2em] text-[#ccff00] uppercase">
        ENG SÓNGGI RUSUMDAGI GADJETLAR
        </span>
        </div>
        
        {/* Katta Sarlavha */}
        <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-white">
        Kelajak texnologiyasi <br />
        <span className="font-script text-[#ccff00] font-normal tracking-normal capitalize text-6xl sm:text-7xl md:text-8xl inline-block -mt-2">
        Hozir siz bilan.
        </span>
        </h1>
        
        {/* Tavsif Matni */}
        <p className="text-white/70 text-base sm:text-lg max-w-lg font-light leading-relaxed">
        Hayotingizni osonlashtiruvchi zamonaviy smartfonlar, quloqchinlar va aqlli gadjetlarni eng yaxshi narxlarda xarid qiling.
        </p>
        
        {/* Action Tugmalar */}
        <div className="flex flex-wrap items-center gap-5 pt-2">
        {/* Primary Lime Button */}
        <Link
        href={`/${locale}#catalog`}
        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#ccff00] text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-[#b8e600] hover:scale-105 shadow-[0_0_25px_rgba(204,255,0,0.3)]"
        >
        <span>Katalogga o'tish</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        
        {/* Tezkor Aloqa yoki Chegirmalar tugmasi */}
        <Link
        href={`/${locale}#contact`}
        className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-[#ccff00] transition-colors group"
        >
        <span className="w-12 h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center group-hover:border-[#ccff00] group-hover:scale-110 transition-all shadow-lg">
        <Sparkles size={18} className="text-white group-hover:text-[#ccff00]" />
        </span>
        <div className="text-left">
        <span className="block text-xs font-bold uppercase tracking-wider text-white">
        Aksiyalar va Chegirmalar
        </span>
        <span className="block text-[11px] text-white/50">
        Maxsus takliflarni ko'ring
        </span>
        </div>
        </Link>
        </div>
        </motion.div>
        
        {/* O'NG TOMON: High-End Gadjet Rasmi */}
        <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="lg:col-span-5 relative flex items-center justify-center"
        >
        {/* Orqa fondagi Neon Nur va Podium Effekti */}
        <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#173d2f] rounded-full blur-[90px] -z-10 opacity-70" />
        <div className="absolute bottom-4 w-3/4 h-12 bg-black/60 rounded-[100%] blur-md -z-10" />
        
        {/* Mahsulot Rasmi */}
        <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
        <Image
        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
        alt="Premium Gadget"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
        className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500"
        />
        </div>
        </motion.div>
        
        </div>
        
        {/* 2. TRUST BADGES (Pastki kafolat va imtiyozlar bloki) */}
        <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10"
        >
        {badges.map((badge, idx) => {
            const IconComponent = badge.icon;
            return (
                <div key={idx} className="flex items-center gap-3.5 p-2">
                <div className="w-10 h-10 rounded-full bg-white/0 border border-white/10 flex items-center justify-center shrink-0 text-[#ccff00]">
                <IconComponent size={20} />
                </div>
                <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {badge.title}
                </h4>
                <p className="text-[11px] text-white/50 mt-0.5">
                {badge.subtitle}
                </p>
                </div>
                </div>
            );
        })}
        </motion.div>
        
        </section>
    );
}