import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    // Next.js uchun params ni Promise sifatida kutib olamiz
    const resolvedParams = await params;
    
    const category = await prisma.category.findUnique({
        where: { slug: resolvedParams.slug },
        include: {
            products: true,
        },
    });
    
    if (!category) {
        return notFound();
    }
    
    return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-24 space-y-4">
        <div className="flex items-center gap-3 mb-2">
        <Link href="/" className="p-2 bg-white rounded-xl text-dark shadow-sm border border-gray-100 cursor-pointer">
        <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-dark">{category.name}</h1>
        </div>
        
        {category.products.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm text-gray-500">
            Ushbu kategoriyada hozircha mahsulotlar mavjud emas.
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        )}
        </div>
    );
}