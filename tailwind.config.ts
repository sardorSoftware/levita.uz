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
                background: "#05130f",    // Rasmdagi to'q yashil/zaytun premium fon
                surface: "#0f2a20",       // Kartalar va qismlar uchun ochroq yashil fon
                foreground: "#EAEAEA",    // Asosiy oqish matn
                primary: "#ccff00",       // Neon Lime (rasmdagi yorqin yashil tugma rangi)
                border: "#173d2f",        // Nozik yashil-kulrang chegaralar
                naqtol: {
                    dark: "#05130f",
                    light: "#0f2a20",
                    neon: "#ccff00",
                    text: "#a0b3a9",
                }
            },
            fontFamily: {
                montserrat: ['var(--font-montserrat)', 'sans-serif'],
                script: ['var(--font-caveat)', 'cursive'], // "World" kabi yozuvlar uchun
                inter: ['var(--font-inter)', 'sans-serif'],         
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;