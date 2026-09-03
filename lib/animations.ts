import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type TargetType = string | Element | Element[] | null;

// Smartfonlar havoda muallaq turishi effekti (sal tekinroq va barqaror qilingan)
export const animateLevitation = (element: TargetType) => {
    if (!element) return; 
    
    return gsap.to(element, {
        y: -10,
        rotation: 1,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
    });
};

// Skrol qilganda pastdan chiroyli qalqib chiquvchi effekt
export const animateRevealUp = (elements: TargetType, triggerContainer?: TargetType) => {
    if (!elements || (Array.isArray(elements) && elements.length === 0)) return;
    
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