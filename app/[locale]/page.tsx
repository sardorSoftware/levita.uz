"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import HeroSlider from "@/components/shared/HeroSlider";
import ProductCard from "@/components/shared/ProductCard";
import CartSidebar from "@/components/shared/CartSidebar";
import Footer from "@/components/shared/Footer";
import { animateRevealUp } from "@/lib/animations";

const MOCK_PRODUCTS = [
  { id: "1", name: "AeroLux Solar", price: 15.00, image: "/products/hero-aroma.png" },
  { id: "2", name: "Levita Orbit", price: 22.50, image: "/products/hero-aroma.png" },
  { id: "3", name: "NovaScent Mini", price: 12.00, image: "/products/hero-aroma.png" },
  { id: "4", name: "SolAura Premium", price: 28.00, image: "/products/hero-aroma.png" },
];

export default function Home() {
  const t = useTranslations("Header");
  const productsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (productsRef.current) {
      // Mahsulot kartochkalarini topib, animatsiya berish
      const cards = productsRef.current.querySelectorAll('.product-card-anim');
      animateRevealUp(Array.from(cards));
    }
  }, []);
  
  return (
    <>
    <main className="flex flex-col min-h-screen">
    <HeroSlider />
    
    <section id="catalog" className="container mx-auto px-6 py-24 min-h-screen">
    <div className="text-center mb-16">
    <h2 className="font-heading text-3xl md:text-5xl font-light tracking-widest uppercase">
    {t("catalog")}
    </h2>
    <div className="w-12 h-[1px] bg-primary mx-auto mt-6" />
    </div>
    
    <div ref={productsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {MOCK_PRODUCTS.map((product) => (
      <div key={product.id} className="product-card-anim opacity-0">
      <ProductCard 
      id={product.id}
      name={product.name}
      price={product.price}
      image={product.image}
      />
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