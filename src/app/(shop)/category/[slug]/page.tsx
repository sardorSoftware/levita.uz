import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Layers } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

// Dynamic SEO sarlavha va tavsifi
export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
        where: { slug },
        select: { name: true },
    });
    
    if (!category) {
        return {
            title: "Kategoriya topilmadi | Naqt Ol",
        };
    }
    
    return {
        title: `${category.name} | Naqt Ol`,
        description: `${category.name} bo'limidagi sifatli va kafolatlangan mahsulotlar.`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    
    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                orderBy: {
                    id: "desc", // Eng oxirgi qo'shilgan mahsulotlar birinchi chiqadi
                },
            },
        },
    });
    
    if (!category) {
        return notFound();
    }
    
    return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-28 space-y-5">
        {/* Sarlavha va Orqaga qaytish tugmasi */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-3">
        <Link
        href="/category"
        className="w-10 h-10 bg-white hover:bg-gray-50 rounded-xl text-gray-800 flex items-center justify-center shadow-xs border border-gray-200 transition-all active:scale-95 cursor-pointer"
        aria-label="Katalogga qaytish"
        >
        <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
        <h1 className="text-lg sm:text-xl font-black text-[#1a1a1c] tracking-tight">
        {category.name}
        </h1>
        <p className="text-xs text-gray-500 font-medium">
        Jami: {category.products.length} ta mahsulot
        </p>
        </div>
        </div>
        
        <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#FF4D00]/10 text-[#FF4D00] text-xs font-bold px-3 py-1.5 rounded-full border border-[#FF4D00]/20">
        <Layers className="w-3.5 h-3.5" />
        {category.name}
        </span>
        </div>
        
        {/* Mahsulotlar Ro'yxati yoki Bo'sh holat */}
        {category.products.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-xs max-w-md mx-auto my-8 space-y-4">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-gray-100">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">
            Hozircha mahsulotlar mavjud emas
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Ushbu kategoriyaga tez orada yangi mahsulotlar joylashtiriladi.
            </p>
            </div>
            <Link
            href="/category"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#FF4D00] hover:bg-[#e04400] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#FF4D00]/20 active:scale-95 cursor-pointer"
            >
            Boshqa bo'limlarni ko'rish
            </Link>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        )}
        </div>
    );
}