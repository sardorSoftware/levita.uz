"use client";

import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";

// Product tipini local ravishda kengaytiramiz (images va image uchun)
type ExtendedProduct = Product & {
    images?: string[];
    image?: string;
};

interface ProductCardProps {
    product: ExtendedProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { addItem } = useCartStore();
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    
    if (!product) return null;
    
    // Rasmlar massivini string[] deb aniq tiplashtiramiz
    const images: string[] = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];
    
    const { title, price, oldPrice, isUsed } = product;
    
    const discount = oldPrice && oldPrice > price 
    ? Math.round(((oldPrice - price) / oldPrice) * 100) 
    : null;
    
    return (
        <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow">
        
        {/* Rasm, Chegirma va Yurakcha */}
        <div className="relative w-full aspect-square bg-cream rounded-xl mb-3 overflow-hidden flex items-center justify-center">
        
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
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
        className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors z-20 cursor-pointer shadow-xs"
        aria-label="Sevimlilarga qo'shish"
        >
        <Heart className="w-4 h-4" />
        </button>
        
        {images.length > 0 ? (
            <>
            <Image
            src={images[currentImgIndex]}
            alt={title || "Mahsulot"}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 z-10"
            />
            
            {/* Dot-Pagination (Slider elementlari) */}
            {images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
                {images.map((_: string, idx: number) => (
                    <button
                    key={idx}
                    onMouseEnter={() => setCurrentImgIndex(idx)}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        currentImgIndex === idx 
                        ? "bg-primary w-3" 
                        : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Rasm ${idx + 1}`}
                        />
                    ))}
                    </div>
                )}
                </>
            ) : (
                <div className="text-gray-400 text-xs">Rasm yo'q</div>
            )}
            </div>
            
            {/* Qolgan ma'lumotlar (Narxi, nomi, savatcha) */}
            <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-dark line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
            {title}
            </h3>
            
            <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
            {oldPrice && oldPrice > price && (
                <span className="text-xs text-gray-400 line-through">
                {oldPrice.toLocaleString("ru-RU")} UZS
                </span>
            )}
            <span className="text-base font-bold text-dark">
            {price.toLocaleString("ru-RU")} UZS
            </span>
            </div>
            
            <button 
            onClick={() => addItem(product)}
            className="w-8 h-8 rounded-full bg-cream text-dark flex items-center justify-center hover:bg-primary hover:text-white transition-colors flex-shrink-0"
            >
            <Plus className="w-4 h-4" />
            </button>
            </div>
            </div>
            </div>
        );
    };