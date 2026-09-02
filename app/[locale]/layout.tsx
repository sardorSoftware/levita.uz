import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Header from "@/components/shared/Header";

// TypeScript uchun Telegram WebApp global obyektini e'lon qilish
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        sendData: (data: string) => void;
      };
    };
  }
}

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"]
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  weight: ["300", "400", "500"]
});

export const metadata: Metadata = {
  title: "Levita - Solar Aromatic Innovations",
  description: "Premium solar-powered and levitating car aromatics.",
};

// Next.js 15 uchun params'ni Promise tipida yozamiz
export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>; 
}) {
  // params ichidan locale'ni await orqali ajratib olamiz
  const { locale } = await params;
  const messages = await getMessages();
  
  return (
    <html lang={locale} className={`${montserrat.variable} ${inter.variable} dark`}>
    <head>
    {/* Telegram WebApp rasmiy SDK skripti */}
    <script src="https://telegram.org/js/telegram-web-app.js" async></script>
    </head>
    <body className="font-sans antialiased text-foreground bg-background flex flex-col min-h-screen">
    <NextIntlClientProvider messages={messages}>
    <SmoothScroll>
    <Header />
    <div className="pt-20 flex-1 flex flex-col">
    {children}
    </div>
    </SmoothScroll>
    </NextIntlClientProvider>
    </body>
    </html>
  );
}