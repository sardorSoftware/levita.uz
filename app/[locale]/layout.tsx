import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Header from "@/components/shared/Header";

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
  weight: ["300", "400", "500", "600", "700", "800"]
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"]
});

export const metadata: Metadata = {
  title: "NAQTOL - Smartfonlar va Aksesuarlar",
  description: "Eng so'nggi rusumdagi yangi hamda hamyonbop ishlatilgan (B/U) smartfonlar, original aksesuarlar do'koni.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>; 
}) {
  const { locale } = await params;
  const messages = await getMessages();
  
  return (
    <html lang={locale} className={`${montserrat.variable} ${inter.variable} dark`}>
    <head>
    <script src="https://telegram.org/js/telegram-web-app.js" async></script>
    </head>
    <body className="font-sans antialiased text-white bg-[#050505] flex flex-col min-h-screen selection:bg-cyan-500 selection:text-black">
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