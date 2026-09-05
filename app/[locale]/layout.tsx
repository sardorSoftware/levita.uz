import type { Metadata } from "next";
import { Montserrat, Inter, Caveat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Header from "@/components/shared/Header";

// Telegram WebApp turlari to'liq kengaytirildi
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        sendData: (data: string) => void;
        initDataUnsafe?: {
          query_id?: string;
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
          };
          auth_date?: string;
          hash?: string;
        };
        themeParams?: Record<string, string>;
        isExpanded?: boolean;
        viewportHeight?: number;
        viewportStableHeight?: number;
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

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "700"]
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
  params: Promise<{ locale: string }>; 
}) {
  const { locale } = await params;
  
  // next-intl tarjimalarini aniq tanlangan locale bo'yicha yuklaymiz
  const messages = await getMessages({ locale });
  
  return (
    <html 
    lang={locale} 
    className={`${montserrat.variable} ${inter.variable} ${caveat.variable} dark`} 
    suppressHydrationWarning
    >
    <head>
    {/* Next/Script o'rniga oddiy HTML script tegi ishlatildi */}
    <script src="https://telegram.org/js/telegram-web-app.js" async />
    </head>
    <body className="font-sans antialiased text-[#ffffff] bg-[#05130f] flex flex-col min-h-screen selection:bg-[#ccff00] selection:text-black">
    <NextIntlClientProvider messages={messages} locale={locale}>
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