"use client";

import { useEffect, useRef, ReactNode } from "react";
import { animateRevealUp } from "@/lib/animations";

interface ClientRevealAnimationProps {
    children: ReactNode;
    dependency?: any; // Filtr yoki mahsulotlar soni o'zgarganda animatsiyani qayta ishga tushirish uchun
}

export default function ClientRevealAnimation({ children, dependency }: ClientRevealAnimationProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (sectionRef.current) {
            const cards = sectionRef.current.querySelectorAll('.product-card-anim');
            if (cards.length > 0) {
                animateRevealUp(Array.from(cards));
            }
        }
    }, [children, dependency]); // children yoki dependency o'zgarganda animatsiya yangidan ishlaydi
    
    return <div ref={sectionRef}>{children}</div>;
}