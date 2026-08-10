import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0D0F12", // Asosiy to'q qora fon
                foreground: "#EAEAEA", // Asosiy oqish-kulrang matn
                primary: "#FFFFFF",    // Urg'u beriladigan oq rang (Glow effektlar uchun)
                border: "#1F2328",     // Juda xira kulrang (kerak bo'lib qolsa)
            },
            fontFamily: {
                montserrat: ['var(--font-montserrat)'], // Sarlavhalar uchun
                inter: ['var(--font-inter)'],           // Oddiy matnlar uchun
            },
        },
    },
    plugins: [require("tailwindcss-animate")], // Animatsiyalar uchun Shadcn plagini
};

export default config;