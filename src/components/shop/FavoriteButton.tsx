"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
    productId: string;
}

export default function FavoriteButton({ productId }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // 1. Sahifa ochilganda oldindan sevimlilarda bor-yo'qligini tekshirish
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            const userId = localStorage.getItem("app_user_id");
            if (!userId || !productId) return;
            
            try {
                const res = await fetch(`/api/favorites?userId=${userId}`);
                if (res.ok) {
                    const favorites = await res.json();
                    const exists = favorites.some((fav: any) => fav.productId === productId);
                    setIsFavorite(exists);
                }
            } catch (error) {
                console.error("Statusni tekshirishda xato:", error);
            }
        };
        
        checkFavoriteStatus();
    }, [productId]);
    
    // 2. Bosilganda ishlaydigan funksiya
    const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (loading) return;
        
        let userId = localStorage.getItem("app_user_id");
        if (!userId) {
            userId = "user_" + Math.random().toString(36).substring(2, 9);
            localStorage.setItem("app_user_id", userId);
        }
        
        try {
            setLoading(true);
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId }),
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.status === "added") {
                    setIsFavorite(true);
                } else if (data.status === "removed") {
                    setIsFavorite(false);
                }
            } else {
                console.error("Server xatosi statusi:", res.status);
            }
        } catch (error) {
            console.error("Tarmoq xatosi:", error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className="p-2.5 rounded-full bg-white shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center z-30"
        style={{ pointerEvents: "auto" }}
        aria-label="Sevimlilarga qo'shish"
        >
        <Heart
        className={`w-4 h-4 transition-colors duration-200 ${
            isFavorite 
            ? "text-red-500 fill-red-500 scale-110" 
            : "text-gray-400 hover:text-red-400 fill-transparent"
            }`}
            />
            </button>
        );
    }