import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, AlertCircle } from "lucide-react";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

interface ProductDetailsPageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default async function ProductDetailsPage({
    params,
}: ProductDetailsPageProps) {
    // Next.js 15 bilan moslashuvchan params ishlovi
    const resolvedParams = await params;
    
    // Bazadan ID orqali mahsulotni qidirish
    const product = await prisma.product.findUnique({
        where: { id: resolvedParams.id },
        include: { category: true },
    });
    
    if (!product) {
        return notFound();
    }
    
    // Birinchi rasm yoki standart rasmni olish
    const mainImage = product.images?.[0] || "/assets/logo.jpg";
    
    // AddToCartButton va boshqa komponenetlar tipiga moslashtirish
    const formattedProduct = {
        ...product,
        image: mainImage,
        images: product.images || [],
    };
    
    return (
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-24">
        {/* Yuqori navigatsiya */}
        <div className="flex items-center justify-between mb-4">
        <Link 
        href="/" 
        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-dark shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        >
        <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
        {product.category?.name || "Kategoriyasiz"}
        </span>
        </div>
        
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-100 grid md:grid-cols-2 gap-8">
        {/* Rasm qismi */}
        <div className="relative w-full aspect-square bg-cream rounded-2xl flex items-center justify-center overflow-hidden">
        {product.oldPrice && product.oldPrice > product.price && (
            <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg z-10">
            Chegirma
            </span>
        )}
        <Image
        src={mainImage}
        alt={product.title}
        fill
        className="object-contain p-4"
        priority
        />
        </div>
        
        {/* Ma'lumotlar qismi */}
        <div className="flex flex-col justify-between">
        <div>
        <h1 className="text-xl sm:text-2xl font-bold text-dark mb-2">
        {product.title}
        </h1>
        
        <div className="flex items-baseline gap-3 mb-6">
        <span className="text-3xl font-black text-dark">
        {product.price.toLocaleString("ru-RU")} UZS
        </span>
        {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through font-medium">
            {product.oldPrice.toLocaleString("ru-RU")} UZS
            </span>
        )}
        </div>
        
        {/* Qo'shimcha ma'lumotlar bloklari */}
        <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3 bg-cream px-4 py-3 rounded-xl">
        <Truck className="w-5 h-5 text-primary" />
        <div className="text-sm">
        <p className="font-semibold text-dark">Tezkor yetkazib berish</p>
        <p className="text-gray-500 text-xs">Toshkent bo'ylab 1 kunda</p>
        </div>
        </div>
        <div className="flex items-center gap-3 bg-cream px-4 py-3 rounded-xl">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <div className="text-sm">
        <p className="font-semibold text-dark">Rasmiy kafolat</p>
        <p className="text-gray-500 text-xs">Nosozlik bo'lsa almashtirib beriladi</p>
        </div>
        </div>
        </div>
        
        {product.description && (
            <div className="mb-8">
            <h3 className="font-bold text-dark mb-2">Mahsulot haqida:</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {product.description}
            </p>
            </div>
        )}
        </div>
        
        {/* Harakatlar (Buyurtma berish) */}
        <div className="pt-4 border-t border-gray-100">
        {product.inStock ? (
            <AddToCartButton product={formattedProduct} />
        ) : (
            <div className="w-full bg-gray-100 text-gray-500 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" /> Omborda qolmagan
            </div>
        )}
        </div>
        </div>
        </div>
        </div>
    );
}