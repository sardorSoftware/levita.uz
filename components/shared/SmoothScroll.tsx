"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: ReactNode }) {
    useEffect(() => {
        // GSAP ScrollTrigger pluginini ro'yxatdan o'tkazamiz
        gsap.registerPlugin(ScrollTrigger);
        
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Juda yumshoq va premium effekt
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });
        
        // Lenis skroll bo'lganda GSAP ScrollTrigger ham birga yangilanishi uchun
        lenis.on("scroll", ScrollTrigger.update);
        
        // GSAP ticker orqali Lenis animatsiyasini boshqarish (Eng silliq kadr almashinuvi uchun)
        const updateTicker = (time: number) => {
            lenis.raf(time * 1000);
        };
        
        gsap.ticker.add(updateTicker);
        gsap.ticker.lagSmoothing(0); // Animatsiyada mikro-otishlarning oldini oladi
        
        return () => {
            lenis.destroy();
            gsap.ticker.remove(updateTicker);
        };
    }, []);
    
    return <>{children}</>;
}