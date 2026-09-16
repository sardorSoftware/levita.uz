"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, HelpCircle, Share2, Plus, X } from "lucide-react";

export function FloatingMenu() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    // Tashqariga bosilganda avtomatik yopilishi
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    
    if (pathname === "/orders") return null;
    
    const toggleMenu = () => setIsOpen(!isOpen);
    
    const handleShare = async () => {
        if (typeof window !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: "Naqt Ol - Online Do'kon",
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Ulashish bekor qilindi");
            }
        } else if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            alert("Havola nusxalandi!");
        }
        setIsOpen(false);
    };
    
    return (
        <div
        ref={menuRef}
        className="fixed bottom-20 right-3 sm:bottom-24 sm:right-5 z-40 flex flex-col items-end"
        >
        {/* Ochiladigan menyular */}
        <div
        className={`flex flex-col gap-2 mb-2 transition-all duration-200 origin-bottom-right ${
            isOpen
            ? "opacity-100 scale-100 translate-y-0 visible"
            : "opacity-0 scale-90 translate-y-2 invisible pointer-events-none"
            }`}
            >
            <a
            href="https://t.me/support_username"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-end gap-2.5 bg-white/95 backdrop-blur-md text-[#1a1a1c] px-3.5 py-2 rounded-xl shadow-md border border-gray-100 text-xs font-semibold hover:bg-gray-50 transition-all active:scale-95"
            >
            <span>Operator bilan bog'lanish</span>
            <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <MessageCircle className="w-3.5 h-3.5 text-[#FF4D00]" />
            </div>
            </a>
            
            <a
            href="/faq"
            className="flex items-center justify-end gap-2.5 bg-white/95 backdrop-blur-md text-[#1a1a1c] px-3.5 py-2 rounded-xl shadow-md border border-gray-100 text-xs font-semibold hover:bg-gray-50 transition-all active:scale-95"
            >
            <span>Ko'p beriladigan savollar</span>
            <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF4D00]" />
            </div>
            </a>
            
            <button
            onClick={handleShare}
            className="flex items-center justify-end gap-2.5 bg-white/95 backdrop-blur-md text-[#1a1a1c] px-3.5 py-2 rounded-xl shadow-md border border-gray-100 text-xs font-semibold hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
            >
            <span>Do'konni ulashish</span>
            <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <Share2 className="w-3.5 h-3.5 text-[#FF4D00]" />
            </div>
            </button>
            </div>
            
            {/* Asosiy (+) Floating Tugma (Ixchamlashtirilgan) */}
            <button
            onClick={toggleMenu}
            className="w-10 h-10 bg-[#FF4D00] hover:bg-[#e04400] text-white rounded-full shadow-lg shadow-[#FF4D00]/25 flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer border border-white"
            aria-label="Tezkor menyu"
            >
            {isOpen ? (
                <X className="w-5 h-5 transition-transform duration-200" />
            ) : (
                <Plus className="w-5 h-5 transition-transform duration-200" />
            )}
            </button>
            </div>
        );
    }