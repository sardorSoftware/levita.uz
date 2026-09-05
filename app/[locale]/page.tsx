import { getTranslations } from "next-intl/server";
import HeroSlider from "@/components/shared/HeroSlider";
import Categories from "@/components/shared/Categories";
import PromoBanner from "@/components/shared/PromoBanner";
import ProductCard from "@/components/shared/ProductCard";
import CartDrawer from "@/components/shared/CartDrawer";
import Footer from "@/components/shared/Footer";
import { prisma } from "@/lib/prisma";
import { Smartphone, RefreshCw, Headphones } from "lucide-react";
import ClientRevealAnimation from "@/components/shared/ClientRevealAnimation";

export const revalidate = 60; // Har 60 soniyada ma'lumotlarni yangilab turish (ISR)

// Prisma natijasidan turini avtomatik olib beruvchi yordamchi type
type Product = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

export default async function Home() {
  const t = await getTranslations("Catalog");
  
  let products: Product[] = [];
  
  // Bazadan mahsulotlarni xavfsiz olish (Agar baza ishlamasa sayt qulab tushmaydi)
  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Bazadan mahsulotlarni olishda xatolik (Kredensiallarni tekshiring):", error);
  }
  
  // Bazadagi category maydoniga moslab filtrlaymiz
  const newPhones = products.filter((p: Product) => p.category.toLowerCase() === "new_phones" || p.category.toLowerCase() === "yangi");
  const usedPhones = products.filter((p: Product) => p.category.toLowerCase() === "used_phones" || p.category.toLowerCase() === "b/u");
  const accessories = products.filter((p: Product) => p.category.toLowerCase() === "accessories" || p.category.toLowerCase() === "aksessuar");
  
  return (
    <>
    <main className="flex flex-col min-h-screen text-white relative">
    
    <HeroSlider />
    <Categories />
    <PromoBanner />
    
    <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-8 text-center scroll-mt-28">
    <h2 className="font-heading text-3xl md:text-5xl font-extrabold tracking-wider uppercase text-white">
    {t("title") || "Katalog"}
    </h2>
    <div className="w-16 h-[3px] bg-[#ccff00] mx-auto mt-4 shadow-[0_0_15px_rgba(204,255,0,0.6)] rounded-full" />
    </div>
    
    <ClientRevealAnimation>
    
    {/* 1. YANGI SMARTFONLAR BO'LIMI */}
    <section id="new-phones" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 scroll-mt-28 w-full">
    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
    <Smartphone className="text-[#ccff00]" size={28} />
    <h3 className="font-heading text-2xl font-bold tracking-wide text-white">
    {t("new") || "Yangi smartfonlar"}
    </h3>
    </div>
    {newPhones.length === 0 ? (
      <p className="text-gray-500 text-sm py-4">Hozircha yangi smartfonlar mavjud emas (yoki bazaga ulanish tekshirilmoqda).</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {newPhones.map((product: Product) => (
        <div key={product.id} className="product-card-anim opacity-0">
        <ProductCard  
        id={product.id}
        name={product.title}
        price={product.price}
        image={product.image || "/products/smartphone.png"}
        badge={product.badge || "Yangi"}
        />
        </div>
      ))}
      </div>
    )}
    </section>
    
    {/* 2. ISHLATILGAN TELEFONLAR BO'LIMI */}
    <section id="used-phones" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 scroll-mt-28 w-full">
    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
    <RefreshCw className="text-[#ccff00]" size={28} />
    <h3 className="font-heading text-2xl font-bold tracking-wide text-white">
    {t("used") || "Ishlatilgan telefonlar (B/U)"}
    </h3>
    </div>
    {usedPhones.length === 0 ? (
      <p className="text-gray-500 text-sm py-4">Hozircha B/U telefonlar mavjud emas.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {usedPhones.map((product: Product) => (
        <div key={product.id} className="product-card-anim opacity-0">
        <ProductCard
        id={product.id}
        name={product.title}
        price={product.price}
        image={product.image || "/products/smartphone.png"}
        badge={product.badge || "B/U"}
        />
        </div>
      ))}
      </div>
    )}
    </section>
    
    {/* 3. AKSESUARLAR BO'LIMI */}
    <section id="accessories" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 pb-24 scroll-mt-28 w-full">
    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
    <Headphones className="text-[#ccff00]" size={28} />
    <h3 className="font-heading text-2xl font-bold tracking-wide text-white">
    {t("accessories") || "Aksesuarlar"}
    </h3>
    </div>
    {accessories.length === 0 ? (
      <p className="text-gray-500 text-sm py-4">Hozircha aksesuarlar mavjud emas.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {accessories.map((product: Product) => (
        <div key={product.id} className="product-card-anim opacity-0">
        <ProductCard
        id={product.id}
        name={product.title}
        price={product.price}
        image={product.image || "/products/smartwatch.png"}
        badge={product.badge || "Aksessuar"}
        />
        </div>
      ))}
      </div>
    )}
    </section>
    
    </ClientRevealAnimation>
    
    </main>
    
    <Footer />
    <CartDrawer />
    </>
  );
}