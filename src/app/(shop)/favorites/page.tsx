"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Trash2, ShoppingBag } from "lucide-react";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Hozircha test uchun user ID (Keyinchalik auth sessiondan olinadi)
    const userId = "test-user-id"; 
    
    useEffect(() => {
        fetch(`/api/favorites?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data)) setFavorites(data);
            setLoading(false);
        });
    }, []);
    
    const removeFavorite = async (productId: string) => {
        await fetch("/api/favorites", {
            method: "POST",
            body: JSON.stringify({ userId, productId }),
        });
        setFavorites(favorites.filter((item) => item.productId !== productId));
    };
    
    return (
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-28 space-y-6">
        <div className="flex items-center gap-3">
        <Link
        href="/"
        className="w-10 h-10 rounded-2xl bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-all shadow-xs"
        >
        <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1a1a1c]">Sevimlilar</h1>
        <p className="text-xs text-gray-400 font-medium">Saqlangan mahsulotlaringiz ro'yxati</p>
        </div>
        </div>
        
        {loading ? (
            <div className="text-center py-20 text-gray-400">Yuklanmoqda...</div>
        ) : favorites.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-orange-50 text-[#FF4D00] rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">Sevimlilar bo'sh</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Mahsulotlardagi yurakcha tugmasini bosish orqali bu yerga qo'shishingiz mumkin.
            </p>
            <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#FF4D00] text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-[#e04300] transition-all"
            >
            Xarid qilishni boshlash
            </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
                <div key={fav.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs flex flex-col justify-between space-y-3">
                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
                <img 
                src={fav.product.images[0] || "/placeholder.png"} 
                alt={fav.product.title} 
                className="object-cover w-full h-full"
                />
                <button
                onClick={() => removeFavorite(fav.product.id)}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-xs text-red-500 rounded-xl hover:bg-white shadow-sm transition-all"
                >
                <Trash2 className="w-4 h-4" />
                </button>
                </div>
                <div className="space-y-1">
                <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{fav.product.title}</h4>
                <p className="font-black text-[#FF4D00] text-base">{fav.product.price.toLocaleString()} so'm</p>
                </div>
                <Link
                href={`/products/${fav.product.id}`}
                className="w-full py-2.5 bg-gray-50 hover:bg-orange-50 hover:text-[#FF4D00] text-gray-700 font-bold text-xs rounded-xl transition-all text-center block"
                >
                Mahsulotni ko'rish
                </Link>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}