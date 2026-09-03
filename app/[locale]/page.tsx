"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import HeroSlider from "@/components/shared/HeroSlider";
import ProductCard from "@/components/shared/ProductCard";
import CartSidebar from "@/components/shared/CartSidebar";
import Footer from "@/components/shared/Footer";
import { animateRevealUp } from "@/lib/animations";
import { Smartphone, RefreshCw, Headphones } from "lucide-react";

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
    <main className="flex flex-col min-h-screen bg-[#050505] text-white" ref={sectionRef}>
    {/* HERO BANNER */}
    <HeroSlider />
    
    {/* KATALOG UMUMIY SARлавHA */}
    <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 text-center">
    <h2 className="font-heading text-3xl md:text-5xl font-light tracking-widest uppercase">
    {t("title") || "Katalog"}
    </h2>
    <div className="w-12 h-[2px] bg-cyan-400 mx-auto mt-4 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
    </div>
    
    {/* 1. YANGI SMARTFONLAR BO'LIMI */}
    <section id="new-phones" className="container mx-auto px-4 md:px-6 py-12 scroll-mt-28">
    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
    <Smartphone className="text-cyan-400" size={24} />
    <h3 className="font-heading text-xl md:text-2xl font-semibold tracking-wider uppercase text-white">
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
    
    {/* 2. ISHLATILGAN TELEFONLAR BO'LIMI */}
    <section id="used-phones" className="container mx-auto px-4 md:px-6 py-12 scroll-mt-28">
    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
    <RefreshCw className="text-indigo-400" size={24} />
    <h3 className="font-heading text-xl md:text-2xl font-semibold tracking-wider uppercase text-white">
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
    
    {/* 3. AKSESUARLAR BO'LIMI */}
    <section id="accessories" className="container mx-auto px-4 md:px-6 py-12 pb-24 scroll-mt-28">
    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
    <Headphones className="text-purple-400" size={24} />
    <h3 className="font-heading text-xl md:text-2xl font-semibold tracking-wider uppercase text-white">
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