"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { animateLevitation } from "@/lib/animations";

export default function HeroSlider() {
    const t = useTranslations("Hero");
    const productRef = useRef<HTMLImageElement>(null);
    
    useEffect(() => {
        if (productRef.current) {
            animateLevitation(productRef.current);
        }
    }, []);
    
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
        {/* Orqa fondagi yorug'lik effekti (Glow) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="z-10 text-center flex flex-col items-center">
        {/* Mahsulot rasmi 3D/Levitatsiya (public/products ichiga bitta rasm tashlab qo'yish kerak) */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 mb-8">
        <img 
        ref={productRef}
        src="/products/hero-aroma.png" 
        alt="Levita Aromatic" 
        className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(255,255,255,0.1)]"
        />
        </div>
        
        <h1 className="font-heading text-6xl md:text-9xl font-extralight tracking-[0.2em] text-primary uppercase">
        {t("title")}
        </h1>
        <p className="mt-6 text-foreground/60 font-light tracking-widest max-w-lg text-sm md:text-lg">
        {t("subtitle")}
        </p>
        
        <button className="mt-12 px-10 py-4 border border-white/20 hover:border-primary rounded-full uppercase tracking-widest text-xs font-medium transition-all hover:bg-primary hover:text-background shadow-[0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
        {t("cta")}
        </button>
        </div>
        </section>
    );
}