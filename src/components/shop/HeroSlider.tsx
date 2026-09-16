"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        id: 1,
        tag: "YANGI KELGANLAR",
        title: "Yangi smartfonlar va gadjetlar!",
        description: "Eng so'nggi rusumdagi yangi telefonlar to'plami bilan tanishing.",
        buttonText: "Telefonlarni ko'rish",
        link: "/category/newphones",
        isExternal: false,
        bgGradient: "from-[#FF4D00] to-amber-500",
        icon: "📱",
    },
    {
        id: 2,
        tag: "TEZKOR BUYURTMA",
        title: "Telegram Bot orqali tezkor xarid qiling!",
        description: "Operatorni kutmasdan, botimiz orqali 1 daqiqada buyurtma bering.",
        buttonText: "Bot orqali xarid qilish",
        link: "https://t.me/naqtol_bot",
        isExternal: true,
        bgGradient: "from-[#1a1a1c] via-slate-800 to-[#1a1a1c]",
        icon: "🤖",
    },
    {
        id: 3,
        tag: "KATALOG",
        title: "Barcha toifadagi mahsulotlar",
        description: "Do'konimizdagi barcha mahsulotlar va aksessuarlar katalogi.",
        buttonText: "Katalogga o'tish",
        link: "/category",
        isExternal: false,
        bgGradient: "from-emerald-600 via-teal-600 to-cyan-600",
        icon: "🗂️",
    },
];

export const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);
    
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };
    
    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(nextSlide, 4500);
        return () => clearInterval(timer);
    }, [nextSlide, isHovered]);
    
    return (
        <div
        className="relative w-full rounded-2xl overflow-hidden shadow-md group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
        {slides.map((slide) => (
            <div
            key={slide.id}
            className={`w-full flex-shrink-0 bg-gradient-to-r ${slide.bgGradient} text-white p-5 sm:p-7 relative overflow-hidden flex items-center min-h-[190px] sm:min-h-[210px]`}
            >
            <div className="relative z-10 flex flex-col justify-between h-full max-w-[80%] sm:max-w-[70%]">
            <div>
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold w-max mb-2 border border-white/20">
            <Sparkles className="w-3 h-3 text-amber-300" />
            {slide.tag}
            </span>
            
            <h2 className="text-lg sm:text-2xl font-black leading-tight tracking-tight mb-1">
            {slide.title}
            </h2>
            
            <p className="text-xs sm:text-sm text-white/80 line-clamp-2 font-medium">
            {slide.description}
            </p>
            </div>
            
            <div className="mt-4">
            {slide.isExternal ? (
                <a
                href={slide.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#1a1a1c] hover:bg-gray-100 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 group/btn"
                >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-4 h-4 text-[#FF4D00] transition-transform group-hover/btn:translate-x-1" />
                </a>
            ) : (
                <Link
                href={slide.link}
                className="inline-flex items-center gap-2 bg-white text-[#1a1a1c] hover:bg-gray-100 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 group/btn"
                >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-4 h-4 text-[#FF4D00] transition-transform group-hover/btn:translate-x-1" />
                </Link>
            )}
            </div>
            </div>
            
            <div className="absolute -right-6 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-xs rounded-3xl flex items-center justify-center font-black text-5xl sm:text-6xl text-white/30 select-none pointer-events-none rotate-6 border border-white/10 shadow-inner">
            {slide.icon}
            </div>
            </div>
        ))}
        </div>
        
        <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/20 active:scale-90"
        aria-label="Oldingi slayd"
        >
        <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/20 active:scale-90"
        aria-label="Keyingi slayd"
        >
        <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {slides.map((_, index) => (
            <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                ? "w-5 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slayd ${index + 1}`}
                />
            ))}
            </div>
            </div>
        );
    };