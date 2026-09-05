"use client";

import { useRef } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import gsap from "gsap";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    badge?: string;
}

export default function ProductCard({ id, name, price, image, badge }: ProductCardProps) {
    const { addItem } = useCartStore();
    const imgRef = useRef<HTMLImageElement>(null);
    
    const handleMouseEnter = () => {
        if (imgRef.current) {
            gsap.to(imgRef.current, { y: -8, scale: 1.05, duration: 0.4, ease: "power2.out" });
        }
    };
    
    const handleMouseLeave = () => {
        if (imgRef.current) {
            gsap.to(imgRef.current, { y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
        }
    };
    
    // Price raqam emas, string bo'lib kelsa ham qulab tushmasligi uchun muhofaza
    const formattedPrice = (Number(price) || 0).toFixed(2);
    
    return (
        <div 
        // product-card-anim class'i ClientRevealAnimation ishklashi uchun juda muhim!
        className="product-card-anim group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 transition-all duration-300 hover:border-[#ccff00]/50 hover:shadow-[0_10px_30px_rgba(204,255,0,0.15)] flex flex-col justify-between overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        >
        {/* Hover paytidagi neon yorug'lik effekti */}
        <div className="absolute -inset-px bg-gradient-to-b from-[#ccff00]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px] pointer-events-none" />
        
        {/* Badge (Yangi, B/U) */}
        {badge && (
            <span className="absolute top-5 left-5 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 shadow-[0_0_10px_rgba(204,255,0,0.2)]">
            {badge}
            </span>
        )}
        
        {/* Mahsulot Rasmi */}
        <div className="h-48 w-full flex items-center justify-center mb-6 relative z-10">
        {image ? (
            <img 
            ref={imgRef}
            src={image} 
            alt={name} 
            className="max-h-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)] transition-transform"
            />
        ) : (
            <div className="w-full h-full bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 text-xs">
            Rasm mavjud emas
            </div>
        )}
        </div>
        
        {/* Mahsulot Nomi va Narxi */}
        <div className="flex justify-between items-end relative z-10">
        <div className="pr-2">
        <h3 className="font-heading tracking-wide text-white text-base font-semibold group-hover:text-[#ccff00] transition-colors line-clamp-1">
        {name}
        </h3>
        <p className="text-[#ccff00] font-bold mt-2 tracking-wider text-lg">
        ${formattedPrice}
        </p>
        </div>
        
        {/* Savatga qo'shish tugmasi */}
        <button 
        onClick={() => addItem({ id, name, price: Number(price) || 0, image, quantity: 1 })}
        className="p-3 bg-white/5 rounded-full hover:bg-[#ccff00] hover:text-black transition-all border border-white/10 hover:border-[#ccff00] hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] text-white shrink-0 cursor-pointer"
        aria-label="Add to cart"
        >
        <ShoppingBag size={18} strokeWidth={1.8} />
        </button>
        </div>
        </div>
    );
}