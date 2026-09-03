"use client";

import { useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import gsap from "gsap";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    badge?: string; // Yangi yoki B/U foizini ko'rsatish uchun
}

export default function ProductCard({ id, name, price, image, badge }: ProductCardProps) {
    const { addItem } = useCartStore();
    const imgRef = useRef<HTMLImageElement>(null);
    
    const handleMouseEnter = () => {
        gsap.to(imgRef.current, { y: -10, scale: 1.05, duration: 0.5, ease: "power2.out" });
    };
    
    const handleMouseLeave = () => {
        gsap.to(imgRef.current, { y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
    };
    
    return (
        <div 
        className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 transition-all duration-300 hover:border-[#ccff00]/50 hover:shadow-[0_10px_30px_rgba(204,255,0,0.15)] flex flex-col justify-between overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        >
        {/* Orqa fondagi yorug'lik effekti (Hover paytida paydo bo'ladi) */}
        <div className="absolute -inset-px bg-gradient-to-b from-[#ccff00]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px] pointer-events-none" />
        
        {/* Mahsulot belgisi (Badge: Yangi, B/U 89%, Top va hokazo) */}
        {badge && (
            <span className="absolute top-5 left-5 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 shadow-[0_0_10px_rgba(204,255,0,0.2)]">
            {badge}
            </span>
        )}
        
        <div className="h-48 w-full flex items-center justify-center mb-6 relative z-10">
        <img 
        ref={imgRef}
        src={image} 
        alt={name} 
        className="max-h-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)]"
        />
        </div>
        
        <div className="flex justify-between items-end relative z-10">
        <div>
        <h3 className="font-heading tracking-wide text-white text-base font-semibold group-hover:text-[#ccff00] transition-colors line-clamp-1">
        {name}
        </h3>
        <p className="text-[#ccff00] font-bold mt-2 tracking-wider text-lg">
        ${price.toFixed(2)}
        </p>
        </div>
        
        <button 
        onClick={() => addItem({ id, name, price, image, quantity: 1 })}
        className="p-3 bg-white/5 rounded-full hover:bg-[#ccff00] hover:text-black transition-all border border-white/10 hover:border-[#ccff00] hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] text-white"
        aria-label="Add to cart"
        >
        <ShoppingBag size={18} strokeWidth={1.8} />
        </button>
        </div>
        </div>
    );
}