"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import HeroSlider from "@/components/shared/HeroSlider";
import Categories from "@/components/shared/Categories";
import PromoBanner from "@/components/shared/PromoBanner";
import ProductCard from "@/components/shared/ProductCard";
import CartSidebar from "@/components/shared/CartSidebar";
import Footer from "@/components/shared/Footer";
import { animateRevealUp } from "@/lib/animations";
import { Smartphone, RefreshCw, Headphones } from "lucide-react";

// Vaqtinchalik Ma'lumotlar (Baza ulanguncha)
const NEW_PHONES = [
  { id: "1", name: "iPhone 15 Pro Max 256GB", price: 1180, image: "/products/smartphone.png", badge: "Yangi" },
  { id: "2", name: "Samsung Galaxy S24 Ultra 512GB", price: 1090, image: "/products/smartphone.png", badge: "Yangi" },
  { id: "3", name: "iPhone 15 128GB (Black)", price: 770, image: "/products/smartphone.png", badge: "Yangi" },
  { id: "4", name: "Xiaomi 14 Ultra 512GB", price: 880, image: "/products/smartphone.png", badge: "Yangi" },
];

const USED_PHONES = [
  { id: "5", name: "iPhone 14 Pro Max 128GB", price: 790, image: "/products/smartphone.png", badge: "B/U 89%" },
  { id: "6", name: "iPhone 13 Pro 256GB", price: 590, image: "/products/smartphone.png", badge: "B/U 85%" },
  { id: "7", name: "Samsung Galaxy S23 Ultra 256GB", price: 650, image: "/products/smartphone.png", badge: "B/U 92%" },
  { id: "8", name: "iPhone 12 128GB", price: 420, image: "/products/smartphone.png", badge: "B/U 88%" },
];

const ACCESSORIES = [
  { id: "9", name: "AirPods Pro 2 (Type-C)", price: 210, image: "/products/smartwatch.png", badge: "Top" },
  { id: "10", name: "Apple 20W USB-C Power Adapter", price: 25, image: "/products/smartwatch.png", badge: "Original" },
  { id: "11", name: "MagSafe Silicone Case iPhone 15", price: 15, image: "/products/smartwatch.png", badge: "Chexol" },
  { id: "12", name: "Anker PowerBank 20000mAh", price: 45, image: "/products/smartwatch.png", badge: "Aksessuar" },
];

export default function Home() {
  const t = useTranslations("Catalog");
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.product-card-anim');
      animateRevealUp(Array.from(cards));
    }
  }, []);
  
  return (
    <>
    {/* Background rangi endi globals.css dan olinadi, shuning uchun bu yerdan bg-[#050505] olib tashlandi */}
    <main className="flex flex-col min-h-screen text-white relative" ref={sectionRef}>
    
    {/* 1. HERO BANNER */}
    <HeroSlider />
    
    {/* 2. KATEGORIYALAR (Glassmorphism grid) */}
    <Categories />
    
    {/* 3. PROMO BANNER (Katta reklama bloki) */}
    <PromoBanner />
    
    {/* KATALOG UMUMIY SARLAVHA */}
    <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-8 text-center scroll-mt-28">
    <h2 className="font-heading text-3xl md:text-5xl font-extrabold tracking-wider uppercase text-white">
    {t("title") || "Katalog"}
    </h2>
    {/* Neon chiziq */}
    <div className="w-16 h-[3px] bg-[#ccff00] mx-auto mt-4 shadow-[0_0_15px_rgba(204,255,0,0.6)] rounded-full" />
    </div>
    
    {/* 4. YANGI SMARTFONLAR BO'LIMI */}
    <section id="new-phones" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 scroll-mt-28 w-full">
    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
    <Smartphone className="text-[#ccff00]" size={28} />
    <h3 className="font-heading text-2xl font-bold tracking-wide text-white">
    {t("new") || "Yangi smartfonlar"}
    </h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {NEW_PHONES.map((product) => (
      <div key={product.id} className="product-card-anim opacity-0">
      <ProductCard {...product} />
      </div>
    ))}
    </div>
    </section>
    
    {/* 5. ISHLATILGAN TELEFONLAR BO'LIMI */}
    <section id="used-phones" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 scroll-mt-28 w-full">
    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
    <RefreshCw className="text-[#ccff00]" size={28} />
    <h3 className="font-heading text-2xl font-bold tracking-wide text-white">
    {t("used") || "Ishlatilgan telefonlar (B/U)"}
    </h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {USED_PHONES.map((product) => (
      <div key={product.id} className="product-card-anim opacity-0">
      <ProductCard {...product} />
      </div>
    ))}
    </div>
    </section>
    
    {/* 6. AKSESUARLAR BO'LIMI */}
    <section id="accessories" className="max-w-7xl mx-auto px-4 sm:px-8 py-10 pb-24 scroll-mt-28 w-full">
    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
    <Headphones className="text-[#ccff00]" size={28} />
    <h3 className="font-heading text-2xl font-bold tracking-wide text-white">
    {t("accessories") || "Aksesuarlar"}
    </h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {ACCESSORIES.map((product) => (
      <div key={product.id} className="product-card-anim opacity-0">
      <ProductCard {...product} />
      </div>
    ))}
    </div>
    </section>
    
    </main>
    
    <Footer />
    <CartSidebar />
    </>
  );
}