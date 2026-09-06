"use client";

import Link from "next/link";
import { 
    X, User, ShoppingBag, Heart, MapPin, 
    Bell, Globe, Info, Phone 
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    if (!isOpen) return null;
    
    const menuItems = [
        { icon: User, label: "Shaxsiy ma'lumotlarim", href: "/profile" },
        { icon: ShoppingBag, label: "Buyurtmalarim", href: "/orders" },
        { icon: Heart, label: "Sevimlilar", href: "/favorites" },
        { icon: MapPin, label: "Manzillarim", href: "/addresses" },
        { icon: Bell, label: "Bildirishnomalar", href: "/notifications" },
        { icon: Globe, label: "Til: O'zbekcha", href: "#" },
        { icon: Info, label: "Biz haqimizda", href: "/about" },
    ];
    
    return (
        <div className="fixed inset-0 z-50 flex">
        {/* Fon qoplamasi (Backdrop) */}
        <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose} 
        />
        
        {/* Menyu paneli */}
        <div className="relative w-[280px] max-w-[80%] bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-5">
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
        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
        <X className="w-5 h-5" />
        </button>
        </div>
        
        {/* Menyu Ro'yxati */}
        <nav className="mt-4 space-y-1">
        {menuItems.map((item, index) => (
            <Link
            key={index}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-dark font-medium hover:bg-cream transition-colors text-sm"
            >
            <item.icon className="w-5 h-5 text-gray-500" />
            <span>{item.label}</span>
            </Link>
        ))}
        </nav>
        </div>
        
        {/* Aloqa bloki */}
        <div className="pt-4 border-t border-gray-100">
        <a 
        href="tel:+998910144040" 
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-cream text-dark font-semibold text-sm"
        >
        <Phone className="w-4 h-4 text-primary" />
        <span>+998 (91) 014-40-40</span>
        </a>
        </div>
        </div>
        </div>
    );
};