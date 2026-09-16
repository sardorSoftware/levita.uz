"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    X, User, ShoppingBag, Heart, MapPin, 
    Bell, Globe, Info, Phone, Check 
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const [langModalOpen, setLangModalOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState("O'zbekcha");
    
    if (!isOpen) return null;
    
    const menuItems = [
        { icon: User, label: "Shaxsiy ma'lumotlarim", href: "/profile" },
        { icon: ShoppingBag, label: "Buyurtmalarim", href: "/orders" },
        { icon: Heart, label: "Sevimlilar", href: "/favorites" },
        { icon: MapPin, label: "Manzillarim", href: "/addresses" },
        { icon: Bell, label: "Bildirishnomalar", href: "/notifications" },
        { 
            icon: Globe, 
            label: `Til: ${currentLang}`, 
            href: "#", 
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                setLangModalOpen(true);
            } 
        },
        { icon: Info, label: "Biz haqimizda", href: "/about" },
    ];
    
    return (
        <div className="fixed inset-0 z-50 flex">
        {/* Fon qoplamasi (Backdrop) */}
        <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
        />
        
        {/* Menyu paneli */}
        <div className="relative w-[280px] max-w-[85%] bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-5">
        <div>
        {/* Yuqori qism: Maxsus text-shadow logotip va Yopish tugmasi */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <Link href="/" onClick={onClose} className="flex items-center select-none group">
        <span 
        className="text-2xl font-black tracking-tight text-[#1a1a1c]"
        style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.3), 0 -1px 1px rgba(255, 255, 255, 0.9)",
        }}
        >
        naqt
        </span>
        <span 
        className="text-2xl font-black tracking-tight text-[#e84118]"
        style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.25), 0 -1px 1px rgba(255, 255, 255, 0.8)",
        }}
        >
        ol
        </span>
        </Link>
        
        <button 
        onClick={onClose}
        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
        >
        <X className="w-5 h-5" />
        </button>
        </div>
        
        {/* Menyu Ro'yxati */}
        <nav className="mt-4 space-y-1">
        {menuItems.map((item, index) => {
            const Icon = item.icon;
            
            if (item.onClick) {
                return (
                    <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm cursor-pointer text-left"
                    >
                    <Icon className="w-5 h-5 text-gray-500 shrink-0" />
                    <span>{item.label}</span>
                    </button>
                );
            }
            
            return (
                <Link
                key={index}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                <Icon className="w-5 h-5 text-gray-500 shrink-0" />
                <span>{item.label}</span>
                </Link>
            );
        })}
        </nav>
        </div>
        
        {/* Aloqa bloki */}
        <div className="pt-4 border-t border-gray-100">
        <a 
        href="tel:+998910144040" 
        className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold text-sm transition-colors"
        >
        <Phone className="w-4 h-4 text-[#e84118] shrink-0" />
        <span>+998 (91) 014-40-40</span>
        </a>
        </div>
        </div>
        
        {/* Til tanlash modal oynasi */}
        {langModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">
            Tilni tanlang
            </h3>
            <button 
            onClick={() => setLangModalOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
            >
            <X className="w-5 h-5" />
            </button>
            </div>
            
            <div className="space-y-2">
            <button
            onClick={() => {
                setCurrentLang("O'zbekcha");
                setLangModalOpen(false);
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                currentLang === "O'zbekcha"
                ? "border-[#e84118] bg-orange-50/50 text-[#e84118]"
                : "border-gray-100 hover:bg-gray-50 text-gray-700"
                }`}
                >
                <span>O'zbekcha</span>
                {currentLang === "O'zbekcha" && <Check className="w-4 h-4 text-[#e84118]" />}
                </button>
                
                <button
                onClick={() => {
                    setCurrentLang("Русский");
                    setLangModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                    currentLang === "Русский"
                    ? "border-[#e84118] bg-orange-50/50 text-[#e84118]"
                    : "border-gray-100 hover:bg-gray-50 text-gray-700"
                    }`}
                    >
                    <span>Русский</span>
                    {currentLang === "Русский" && <Check className="w-4 h-4 text-[#e84118]" />}
                    </button>
                    </div>
                    </div>
                    </div>
                )}
                </div>
            );
        };