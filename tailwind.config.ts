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
                background: "#050505", // OLED to'q qora fon
                foreground: "#EAEAEA", // Asosiy oqish-kulrang matn
                primary: "#06b6d4",    // Neon Cyan urg'u rangi (texnika uchun)
                border: "#1F2328",     // Nozik kulrang chiziqlar
            },
            fontFamily: {
                montserrat: ['var(--font-montserrat)'], 
                inter: ['var(--font-inter)'],           
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;