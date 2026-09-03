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
        className="group relative bg-[#0A0C10] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] flex flex-col justify-between"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        >
        {/* Mahsulot belgisi (Badge: Yangi, B/U 89%, Top va hokazo) */}
        {badge && (
            <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            {badge}
            </span>
        )}
        
        <div className="h-48 w-full flex items-center justify-center mb-6 relative">
        <img 
        ref={imgRef}
        src={image} 
        alt={name} 
        className="max-h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
        />
        </div>
        
        <div className="flex justify-between items-end">
        <div>
        <h3 className="font-heading tracking-wide text-foreground text-base font-semibold group-hover:text-cyan-400 transition-colors">
        {name}
        </h3>
        <p className="text-cyan-400 font-bold mt-2 tracking-wider text-lg">
        ${price.toFixed(2)}
        </p>
        </div>
        
        <button 
        onClick={() => addItem({ id, name, price, image, quantity: 1 })}
        className="p-3 bg-white/5 rounded-full hover:bg-cyan-500 hover:text-black transition-all border border-white/10 hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        aria-label="Add to cart"
        >
        <ShoppingBag size={18} strokeWidth={1.8} />
        </button>
        </div>
        </div>
    );
}