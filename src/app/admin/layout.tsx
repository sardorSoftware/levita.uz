"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu, X, Store } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    return (
        <div className="min-h-screen bg-cream flex flex-col md:flex-row text-dark selection:bg-primary/20">
        {/* Mobil Header (Faqat kichik ekranlarda ko'rinadi) */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
        <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="p-2 rounded-xl bg-cream text-dark hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Menyu"
        >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="font-bold text-base text-dark">
        NAQTOL <span className="text-primary text-xs bg-primary/10 px-1.5 py-0.5 rounded ml-1">ADMIN</span>
        </span>
        </div>
        
        <Link
        href="/"
        className="p-2 rounded-xl bg-cream text-primary hover:bg-primary/10 transition-colors flex items-center gap-1 text-xs font-semibold"
        >
        <Store className="w-4 h-4" />
        <span>Do'kon</span>
        </Link>
        </header>
        
        {/* Mobil uchun qoraytirilgan fon (Overlay) */}
        {isMobileMenuOpen && (
            <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            />
        )}
        
        {/* Sidebar (Desktopda doimiy ochiq, Mobilda esa yon tomondan surilib chiqadi) */}
        <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out md:translate-x-0
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
            <AdminSidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
            </aside>
            
            {/* Asosiy kontent maydoni */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
            {children}
            </div>
            </main>
            </div>
        );
    }