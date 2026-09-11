import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { TelegramProvider } from "@/providers/TelegramProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "Naqt Ol — Online Do'kon",
    description: "Telegram orqali tez, oson va qulay xarid qiling",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="uz" suppressHydrationWarning>
        <head>
        {/* Script yana o'z joyiga — <head> ichiga qaytarildi */}
        <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
        />
        </head>
        <body className="bg-cream text-dark antialiased selection:bg-primary/20">
        <TelegramProvider>
        {children}
        </TelegramProvider>
        </body>
        </html>
    );
}