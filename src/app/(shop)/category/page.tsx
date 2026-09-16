import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight, Layers, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kategoriyalar | Naqt Ol",
    description: "Barcha mahsulot kategoriyalari",
};

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true },
            },
        },
        orderBy: {
            name: "asc",
        },
    });
    
    return (
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-28 space-y-6">
        {/* Sarlavha va Orqaga qaytish tugmasi */}
        <div className="flex items-center gap-3">
        <Link
        href="/"
        className="w-10 h-10 rounded-2xl bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-all shadow-xs active:scale-95 shrink-0"
        aria-label="Bosh sahifaga qaytish"
        >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1a1a1c] tracking-tight">
        Kategoriyalar
        </h1>
        <p className="text-xs text-gray-400 font-medium">
        Kerakli bo'limni tanlang
        </p>
        </div>
        </div>
        
        {/* Kategoriyalar Ro'yxati */}
        {categories.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 text-center border border-gray-100 text-gray-400 text-sm font-semibold shadow-xs">
            Hozircha hech qanday kategoriya topilmadi.
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => (
                <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="bg-white/95 backdrop-blur-xl border border-gray-100 p-4 rounded-[22px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#FF4D00]/20 transition-all flex items-center justify-between gap-3 active:scale-[0.99] cursor-pointer group"
                >
                <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#FF4D00] border border-orange-100/60 flex items-center justify-center font-bold shrink-0 group-hover:bg-[#FF4D00] group-hover:text-white group-hover:scale-105 transition-all">
                <Layers className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                <h2 className="text-sm font-bold text-gray-800 group-hover:text-[#FF4D00] transition-colors truncate">
                {cat.name}
                </h2>
                <span className="text-[11px] font-semibold text-gray-400">
                {cat._count.products} ta mahsulot
                </span>
                </div>
                </div>
                
                <div className="w-8 h-8 rounded-xl bg-gray-50 group-hover:bg-[#FF4D00]/10 group-hover:text-[#FF4D00] text-gray-400 flex items-center justify-center shrink-0 transition-colors">
                <ChevronRight className="w-4 h-4" />
                </div>
                </Link>
            ))}
            </div>
        )}
        </div>
    );
}