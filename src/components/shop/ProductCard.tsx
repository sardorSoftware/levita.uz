"use client";

import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { addItem } = useCartStore();
    
    // Agar product kelmasa, xatolik bermasligi uchun himoya
    if (!product) return null;
    
    const { title, image, price, oldPrice, isUsed } = product;
    
    // Chegirma foizini hisoblash (agar eski narx bo'lsa)
    const discount = oldPrice && oldPrice > price 
    ? Math.round(((oldPrice - price) / oldPrice) * 100) 
    : null;
    
    return (
        <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow">
        {/* Rasm, Chegirma va Yurakcha */}
        <div className="relative w-full aspect-square bg-cream rounded-xl mb-3 overflow-hidden flex items-center justify-center">
        
        {/* Belgilar (Chegirma va Ishlatilgan) yonma-yon yoki ustma-ust chiroyli turishi uchun */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {discount && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            -{discount}%
            </span>
        )}
        {isUsed && (
            <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            Ishlatilgan
            </span>
        )}
        </div>
        
        <button 
        className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors z-10 cursor-pointer shadow-xs"
        aria-label="Sevimlilarga qo'shish"
        >
        <Heart className="w-4 h-4" />
        </button>
        
        {image ? (
            <Image
            src={image}
            alt={title || "Mahsulot"}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
        ) : (
            <div className="text-gray-400 text-xs">Rasm yo'q</div>
        )}
        </div>
        
        {/* Ma'lumotlar */}
        <div>
        <h3 className="text-xs sm:text-sm font-semibold text-dark line-clamp-2 mb-1">
        {title || "Nomsiz mahsulot"}
        </h3>
        
        <div className="flex items-baseline gap-1.5">
        <span className="text-sm sm:text-base font-bold text-dark">
        {price ? `${price.toLocaleString()} UZS` : "0 UZS"}
        </span>
        {oldPrice && (
            <span className="text-[11px] text-gray-400 line-through">
            {oldPrice.toLocaleString()}
            </span>
        )}
        </div>
        </div>
        
        {/* Savatga qo'shish tugmasi */}
        <button 
        onClick={() => addItem(product)}
        className="mt-3 w-full bg-cream hover:bg-primary hover:text-white text-dark py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
        <Plus className="w-3.5 h-3.5" /> Qo'shish
        </button>
        </div>
    );
};