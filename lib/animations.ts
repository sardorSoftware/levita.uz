import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Server-side rendering (SSR) muhitida xato bermasligi uchun tekshiruv
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Barcha GSAP nishonlari uchun umumiy tip
type TargetType = string | Element | Element[] | null;

// Mahsulot havoda muallaq turishi effekti
export const animateLevitation = (element: TargetType) => {
    // Element mavjud bo'lmasa, funksiyani to'xtatish
    if (!element) return; 
    
    return gsap.to(element, {
        y: -15,
        rotation: 2,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
    });
};

// Skrol qilganda pastdan chiroyli qalqib chiquvchi effekt
export const animateRevealUp = (elements: TargetType, triggerContainer?: TargetType) => {
    // Elementlar mavjudligini va bo'sh massiv emasligini tekshirish
    if (!elements || (Array.isArray(elements) && elements.length === 0)) return;
    
    // ScrollTrigger qaysi elementga qarab ishlashini aniqlash:
    // Agar maxsus triggerContainer berilgan bo'lsa shuni, 
    // yo'qsa massivning birinchi elementini, bo'lmasa elementning o'zini oladi.
    const scrollTriggerTarget = triggerContainer || (Array.isArray(elements) ? elements[0] : elements);
    
    return gsap.fromTo(
        elements,
        { y: 60, opacity: 0, scale: 0.95 },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: scrollTriggerTarget as string | Element,
                start: "top 85%",
                toggleActions: "play none none reverse",
            },
        }
    );
};