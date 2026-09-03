"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import HeroAnimation from "@/components/shared/HeroAnimation"; // Orqa fon nurlari uchun

export default function HeroSlider() {
    const t = useTranslations("Hero");
    
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505] text-white">
        
        {/* Orqa fon animatsiyasi (Nurlar va to'r) */}
        <HeroAnimation />
        
        {/* Asosiy Kontent */}
        <div className="z-10 text-center flex flex-col items-center px-4 max-w-4xl mx-auto">
        
        {/* Sarlavha */}
        <motion.h1 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
        className="font-heading text-5xl sm:text-7xl md:text-9xl font-bold tracking-[0.15em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20"
        >
        {t("title") || "NAQTOL"}
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-6 text-cyan-100/70 font-light tracking-[0.2em] max-w-lg text-xs sm:text-sm md:text-base uppercase text-center drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
        {t("subtitle")}
        </motion.p>
        
        </div>
        </section>
    );
}