"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, FolderTree, Package, Users } from "lucide-react";

interface AdminSidebarProps {
    onLinkClick?: () => void;
}

export default function AdminSidebar({ onLinkClick }: AdminSidebarProps) {
    const pathname = usePathname();
    
    const menuItems = [
        { name: "Asosiy", href: "/admin", icon: LayoutDashboard },
        { name: "Buyurtmalar", href: "/admin/orders", icon: ShoppingCart },
        { name: "Kategoriyalar", href: "/admin/categories", icon: FolderTree },
        { name: "Mahsulotlar", href: "/admin/products", icon: Package },
        { name: "Mijozlar", href: "/admin/users", icon: Users },
    ];
    
    return (
        <div className="h-full flex flex-col bg-white">
        <div className="p-6 border-b border-gray-100">
        <h1 className="font-bold text-xl text-dark tracking-wide">
        NAQTOL <span className="text-primary text-xs bg-primary/10 px-2 py-0.5 rounded-md ml-1">ADMIN</span>
        </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
                <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-gray-600 hover:bg-cream hover:text-dark"
                    }`}
                    >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    </Link>
                );
            })}
            </nav>
            </div>
        );
    }