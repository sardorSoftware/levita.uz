import { prisma } from "@/lib/prisma";
import { PromoBanner } from "@/components/shop/PromoBanner";
import { SearchBar } from "@/components/shop/SearchBar";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";

// Har safar so'rov kelganda ma'lumotni bazadan yangilab olish uchun
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Bazadan kategoriyalarni va ularning mahsulotlar sonini olib kelamiz
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });
  
  // 2. Bazadan eng so'nggi qo'shilgan mahsulotlarni olib kelamiz (10 ta)
  const products = await prisma.product.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-24 space-y-4">
    {/* Banner va Qidiruv */}
    <PromoBanner />
    <SearchBar />
    
    {/* Dinamik Kategoriyalar filtri */}
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
    <Link 
    href="/" 
    className="px-4 py-2 rounded-xl text-sm font-medium bg-dark text-white whitespace-nowrap shadow-sm"
    >
    Barchasi
    </Link>
    {categories.map((cat) => (
      <Link 
      key={cat.id} 
      href={`/category/${cat.slug}`}
      className="px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-primary whitespace-nowrap shadow-sm transition-colors"
      >
      {cat.name} ({cat.products.length})
      </Link>
    ))}
    </div>
    
    {/* Tavsiya etiladigan mahsulotlar */}
    <section className="pt-2">
    <h2 className="text-base font-bold text-dark mb-3">Tavsiya etiladigan mahsulotlar</h2>
    
    {products.length === 0 ? (
      <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm text-gray-500 text-sm">
      Hozircha mahsulotlar mavjud emas. Admin paneldan mahsulot qo'shing.
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {products.map((product) => (
        <ProductCard 
        key={product.id} 
        product={product} 
        />
      ))}
      </div>
    )}
    </section>
    </div>
  );
}