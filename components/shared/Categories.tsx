"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Categories() {
    const locale = useLocale();
    
    // Admin panel va baza kategoriyalariga to'liq moslashtirilgan massiv
    const categories = [
        {
            id: "new_phones",
            title: "Yangi smartfonlar",
            href: `/${locale}/catalog?category=new_phones`,
            image: "https://images.unsplash.com/photo-1592899677958-c83971c24155?q=80&w=600&auto=format&fit=crop", 
        },
        {
            id: "used_phones",
            title: "Ishlatilgan telefonlar",
            href: `/${locale}/catalog?category=used_phones`,
            image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600&auto=format&fit=crop",
        },
        {
            id: "accessories",
            title: "Aksessuarlar",
            href: `/${locale}/catalog?category=accessories`,
            image: "https://images.unsplash.com/photo-1572569433602-662439dd7b30?q=80&w=600&auto=format&fit=crop",
        }
    ];
    
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        
        {/* Sarlavha qismi (Top Bar) */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/10 relative">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-wide">
        Kategoriyalar bo'yicha xarid
        </h2>
        
        {/* View All tugmasi */}
        <Link 
        href={`/${locale}/catalog`} 
        className="group flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-[#ccff00] transition-colors"
        >
        <span className="hidden sm:inline">Barchasini ko'rish</span>
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
        <ArrowRight size={14} />
        </div>
        </Link>
        
        {/* Dizayn chizig'i (Neon accent) */}
        <div className="absolute -bottom-[1px] left-0 w-32 h-[2px] bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
        </div>
        
        {/* 3 ta Kartochka (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
            <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
            <Link 
            href={cat.href} 
            className="group block relative p-6 sm:p-8 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#ccff00]/50 transition-all duration-500 overflow-hidden h-[320px] sm:h-[380px] flex flex-col justify-end"
            >
            {/* Ichki Shaffof Gradient qora fon (Yozuvlar aniq ko'rinishi uchun) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10" />
            
            {/* Rasm (Hover bo'lganda kattalashadi) */}
            <div className="absolute inset-0 flex items-center justify-center p-8 z-0">
            <div className="relative w-full h-full transform group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-700">
            <Image
            src={cat.image}
            alt={cat.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
            />
            </div>
            </div>
            
            {/* Kategoriya Matni */}
            <div className="relative z-20">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2 group-hover:text-[#ccff00] transition-colors">
            {cat.title}
            </h3>
            <div className="flex items-center gap-2 text-sm font-semibold text-white/70 group-hover:text-white transition-colors">
            <span>Xarid qilish</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#ccff00]" />
            </div>
            </div>
            </Link>
            </motion.div>
        ))}
        </div>
        
        </section>
    );
}