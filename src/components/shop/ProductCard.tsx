"use client";

import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";

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
    const [isHovered, setIsHovered] = useState(false); // Hover holatini kuzatish
    
    const images: string[] = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : product?.image
    ? [product.image]
    : [];
    
    // Faqat hover qilinganda (ustiga borganda) ishlaydigan taymer
    useEffect(() => {
        if (images.length <= 1 || !isHovered) return;
        
        const timer = setInterval(() => {
            setCurrentImgIndex((prev) => (prev + 1) % images.length);
        }, 2000); // Har 2 soniyada sekin almashadi
        
        return () => clearInterval(timer);
    }, [images.length, isHovered]);
    
    if (!product) return null;
    
    const { title, price, oldPrice, isUsed } = product;
    
    const discount = oldPrice && oldPrice > price 
    ? Math.round(((oldPrice - price) / oldPrice) * 100) 
    : null;
    
    return (
        <div 
        className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-col justify-between relative group hover:shadow-md transition-shadow"
        onMouseEnter={() => setIsHovered(true)} // Sichqoncha ustiga kelganda yoniq
        onMouseLeave={() => {
            setIsHovered(false); // Sichqoncha ketganda o'chiq
            setCurrentImgIndex(0); // Ixtiyoriy: ketganda 1-rasmga qaytarish (xohlasangiz olib tashlang)
        }}
        >
        
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
            key={currentImgIndex} // Animatsiya ishlashi uchun kalit
            src={images[currentImgIndex]}
            alt={title || "Mahsulot"}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-all duration-500 ease-in-out opacity-0 animate-fadeIn z-10"
            style={{ animation: 'fadeIn 0.5s forwards' }} // Sekin paydo bo'lish effekti
            />
            
            {/* Dot-Pagination (Slider elementlari) */}
            {images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {images.map((_: string, idx: number) => (
                    <button
                    key={idx}
                    onMouseEnter={() => setCurrentImgIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
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
            
            {/* Qolgan ma'lumotlar */}
            <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-dark line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors duration-300">
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
            className="w-8 h-8 rounded-full bg-cream text-dark flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 flex-shrink-0"
            >
            <Plus className="w-4 h-4" />
            </button>
            </div>
            </div>
            
            {/* Tailwind dagi maxsus animatsiya uchun stil (global.css ga qoshish o'rniga shu yerda berib ketildi) */}
            <style jsx>{`
                @keyframes fadeIn {
                from { opacity: 0.6; }
                    to { opacity: 1; }
                }
            `}</style>
                </div>
            );
        };