"use client";

import { useState } from "react";
import { MessageCircle, HelpCircle, Share2, Plus, X } from "lucide-react";

export function FloatingMenu() {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleMenu = () => setIsOpen(!isOpen);
    
    // Havolani ulashish funksiyasi
    const handleShare = () => {
        if (typeof window !== "undefined" && navigator.share) {
            navigator.share({
                title: "Naqt Ol - Online Do'kon",
                url: window.location.href,
            }).catch(() => {});
        } else if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            alert("Havola vaqtinchalik xotiraga nusxalandi!");
        }
        setIsOpen(false);
    };
    
    return (
        <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end">
        {/* Ochiladigan yordamchi menyu elementlari */}
        {isOpen && (
            <div className="flex flex-col gap-2 mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <a
            href="https://t.me/support_username"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-white text-dark px-4 py-2.5 rounded-full shadow-lg border border-gray-100 text-xs font-semibold hover:bg-cream transition-colors cursor-pointer"
            >
            <span>Operator bilan bog'lanish</span>
            <MessageCircle className="w-4 h-4 text-primary" />
            </a>
            
            <a
            href="/faq"
            className="flex items-center gap-2.5 bg-white text-dark px-4 py-2.5 rounded-full shadow-lg border border-gray-100 text-xs font-semibold hover:bg-cream transition-colors cursor-pointer"
            >
            <span>Ko'p beriladigan savollar</span>
            <HelpCircle className="w-4 h-4 text-primary" />
            </a>
            
            <button
            onClick={handleShare}
            className="flex items-center gap-2.5 bg-white text-dark px-4 py-2.5 rounded-full shadow-lg border border-gray-100 text-xs font-semibold hover:bg-cream transition-colors text-left cursor-pointer"
            >
            <span>Do'konni ulashish</span>
            <Share2 className="w-4 h-4 text-primary" />
            </button>
            </div>
        )}
        
        {/* Asosiy Floating Action Button (FAB) */}
        <button
        onClick={toggleMenu}
        className="w-12 h-12 bg-primary hover:bg-primary-hover text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
        aria-label="Tezkor menyu"
        >
        {isOpen ? (
            <X className="w-6 h-6 rotate-90 transition-transform duration-300" />
        ) : (
            <Plus className="w-6 h-6 rotate-0 transition-transform duration-300" />
        )}
        </button>
        </div>
    );
}