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
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
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
        className="group relative bg-[#14171A] border border-white/5 rounded-2xl p-6 transition-colors hover:border-white/20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        >
        <div className="h-48 w-full flex items-center justify-center mb-6 relative">
        <img 
        ref={imgRef}
        src={image} 
        alt={name} 
        className="max-h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
        />
        </div>
        
        <div className="flex justify-between items-end">
        <div>
        <h3 className="font-heading tracking-wider text-primary text-lg">{name}</h3>
        <p className="text-muted-foreground mt-1 tracking-wide">${price.toFixed(2)}</p>
        </div>
        
        <button 
        onClick={() => addItem({ id, name, price, image, quantity: 1 })}
        className="p-3 bg-white/5 rounded-full hover:bg-primary hover:text-background transition-all"
        >
        <ShoppingBag size={20} strokeWidth={1.5} />
        </button>
        </div>
        </div>
    );
}