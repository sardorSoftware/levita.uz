"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Battery, Bluetooth } from "lucide-react";

export default function PromoBanner() {
    const locale = useLocale();
    
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 mb-20">
        <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-full rounded-[40px] overflow-hidden bg-[#0f2a20]/60 backdrop-blur-xl border border-white/10 flex flex-col lg:flex-row items-center justify-between p-8 sm:p-12 lg:p-16 gap-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
        {/* Orqa fondagi yorug'lik effekti */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ccff00]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        {/* CHAP TOMON: Matnlar va Xususiyatlar */}
        <div className="lg:w-1/2 flex flex-col items-start z-10">
        <span className="text-[#ccff00] font-bold tracking-[0.2em] uppercase text-xs mb-4">
        Mavsum Xiti
        </span>
        
        <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
        Small Size. <br />
        <span className="text-[#ccff00] font-script text-5xl sm:text-6xl md:text-7xl font-normal tracking-normal capitalize inline-block -mt-2">
        Big Performance.
        </span>
        </h2>
        
        <p className="text-white/70 text-base mb-8 max-w-md leading-relaxed">
        Yangi avlod simsiz quloqchinlari. Mukammal ovoz, uzoq batareya quvvati va faol shovqinni pasaytirish tizimi bilan.
        </p>
        
        {/* Mahsulot xususiyatlari (Features) */}
        <div className="flex flex-wrap items-center gap-6 mb-10">
        <div className="flex items-center gap-2 text-white/80">
        <Zap size={20} className="text-[#ccff00]" />
        <span className="text-sm font-semibold">Active Noise</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
        <Battery size={20} className="text-[#ccff00]" />
        <span className="text-sm font-semibold">30H Battery</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
        <Bluetooth size={20} className="text-[#ccff00]" />
        <span className="text-sm font-semibold">Bluetooth 5.3</span>
        </div>
        </div>
        
        {/* Tugma (Katalogdagi aksessuarlar filtriga olib boradi) */}
        <Link
        href={`/${locale}/catalog?category=accessories`}
        className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-[#ccff00] hover:scale-105 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] cursor-pointer"
        >
        <span>Hoziroq xarid qilish</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        </div>
        
        {/* O'NG TOMON: Mahsulot Rasmi (3D effektli) */}
        <div className="lg:w-1/2 relative flex justify-center z-10 w-full h-[300px] sm:h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center">
        <Image
        src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800&auto=format&fit=crop"
        alt="Premium Earbuds"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-700"
        />
        </div>
        </div>
        </motion.div>
        </section>
    );
}