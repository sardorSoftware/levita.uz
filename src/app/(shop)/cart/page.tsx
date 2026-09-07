"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
    const pathname = usePathname();
    const { items, updateQuantity, removeItem, getTotalPrice, totalPrice } = useCartStore();
    
    // Store'dagi metod nomiga qarab umumiy summani xavfsiz hisoblash
    const calculateTotal = () => {
        if (typeof getTotalPrice === "function") return getTotalPrice();
        if (typeof totalPrice === "function") return totalPrice();
        if (typeof totalPrice === "number") return totalPrice;
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };
    
    const totalAmount = calculateTotal();
    
    if (!items || items.length === 0) {
        return (
            <div className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center text-center pb-24">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Image src="/assets/logo.jpg" alt="Empty" width={60} height={60} className="opacity-50 grayscale" />
                </div>
                <h2 className="text-lg font-bold text-dark mb-2">Savatchangiz bo'sh</h2>
                <p className="text-sm text-gray-500 mb-6">Xaridni boshlash uchun mahsulotlarni savatga qo'shing.</p>
                <Link href="/" className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer">
                    Do'konga qaytish
                </Link>
            </div>
        );
    }
    
    return (
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-4">
            <h1 className="text-xl font-bold text-dark mb-4">Savatcha</h1>
            
            {/* Mahsulotlar ro'yxati */}
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-2xl flex gap-3 shadow-sm border border-gray-100">
                        {/* Rasm */}
                        <div className="w-20 h-20 bg-cream rounded-xl flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                            {item.image ? (
                                <Image src={item.image} alt={item.title || "Mahsulot"} fill className="object-contain p-2" />
                            ) : (
                                <span className="text-xs text-gray-400">Rasm yo'q</span>
                            )}
                        </div>
                        
                        {/* Ma'lumotlar va Amallar */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="text-sm font-semibold text-dark line-clamp-2">{item.title}</h3>
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-dark">
                                    {((item.price || 0) * (item.quantity || 1)).toLocaleString()} UZS
                                </span>
                                
                                {/* Miqdor nazorati */}
                                <div className="flex items-center gap-3 bg-cream rounded-lg px-2 py-1">
                                    <button 
                                        onClick={() => {
                                            if (item.quantity > 1) {
                                                updateQuantity(item.id, item.quantity - 1);
                                            } else {
                                                removeItem(item.id);
                                            }
                                        }}
                                        className="p-1 text-gray-500 hover:text-dark cursor-pointer"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 text-gray-500 hover:text-dark cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Jami va Checkout tugmasi */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Mahsulotlar ({items.reduce((acc, i) => acc + i.quantity, 0)} ta):</span>
                    <span className="font-semibold">{totalAmount.toLocaleString()} UZS</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Yetkazib berish:</span>
                    <span className="font-semibold text-green-600">Bepul</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="text-base font-bold text-dark">Jami:</span>
                    <span className="text-lg font-black text-primary">{totalAmount.toLocaleString()} UZS</span>
                </div>
                
                <Link 
                    href="/checkout"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                    Rasmiylashtirish <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}