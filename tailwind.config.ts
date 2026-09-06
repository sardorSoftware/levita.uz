import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#FF4D00", // Olovrang (Naqtol accent)
                    hover: "#E04400",
                    light: "#FFF1EB",
                },
                cream: "#F8F9FA", // Malochniy background
                dark: {
                    DEFAULT: "#1C2434", // To'q ko'k matn va sarlavhalar
                    muted: "#64748B",
                },
            },
        },
    },
    plugins: [],
};
export default config;