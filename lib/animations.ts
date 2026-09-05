import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Smartfonlar va bannerlar uchun havoda muallaq turishi effekti
export const animateLevitation = (element: gsap.TweenTarget) => {
    if (!element) return; 
    
    // Xotirada ortiqcha animatsiya qolib ketishining oldini olish
    gsap.killTweensOf(element);
    
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
export const animateRevealUp = (elements: gsap.TweenTarget, triggerContainer?: gsap.TweenTarget) => {
    if (!elements) return;
    
    const scrollTriggerTarget = triggerContainer || elements;
    
    // Avvalgi animatsiyalarni tozalab tashlaymiz
    gsap.killTweensOf(elements);
    
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
                trigger: scrollTriggerTarget as Element | string,
                start: "top 85%",
                toggleActions: "play none none reverse",
            },
        }
    );
};