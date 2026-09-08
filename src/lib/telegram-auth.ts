import crypto from "crypto";
import { User } from "@/types";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

interface TelegramAuthData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

/**
* 1. Telegram Widget (Login Widget) orqali kelgan ma'lumotni tekshirish
*/
export function verifyTelegramWidgetData(data: TelegramAuthData): boolean {
    // Xatolik to'g'irlandi: botToken o'rniga BOT_TOKEN ishlatildi
    if (!BOT_TOKEN) return false;
    
    // 1 kundan oshib ketgan eskirgan auth_date'larni rad etish (86400 sekund = 1 kun)
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - data.auth_date > 86400) {
        return false; 
    }
    
    const { hash, ...dataCheck } = data;
    
    const dataCheckString = Object.keys(dataCheck)
    .filter((key) => dataCheck[key as keyof typeof dataCheck] !== undefined && dataCheck[key as keyof typeof dataCheck] !== null)
    .sort()
    .map((key) => `${key}=${dataCheck[key as keyof typeof dataCheck]}`)
    .join("\n");
    
    const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
    
    const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");
    
    return calculatedHash === hash;
}

/**
* 2. Telegram Web App initData ma'lumotlarini HMAC-SHA256 yordamida tekshirish
*/
export function verifyTelegramInitData(initData: string): boolean {
    if (!BOT_TOKEN || !initData) return false;
    
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get("hash");
        
        if (!hash) return false;
        
        urlParams.delete("hash");
        
        const paramsToSign = Array.from(urlParams.entries())
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join("\n");
        
        const secretKey = crypto
        .createHmac("sha256", "WebAppData")
        .update(BOT_TOKEN)
        .digest();
        
        const calculatedHash = crypto
        .createHmac("sha256", secretKey)
        .update(paramsToSign)
        .digest("hex");
        
        return calculatedHash === hash;
    } catch (error) {
        console.error("Telegram initData validatsiya xatosi:", error);
        return false;
    }
}

// Eskirgan nomlar uchun alias (moslikni saqlab qolish maqsadida)
export const verifyTelegramWebAppData = verifyTelegramInitData;

/**
* 3. initData string'idan foydalanuvchi ob'ektini ajratib olish va umumiy User turiga moslash
*/
export function parseTelegramUser(initData: string): User | null {
    try {
        const urlParams = new URLSearchParams(initData);
        const userJson = urlParams.get("user");
        if (!userJson) return null;
        
        const parsed = JSON.parse(userJson);
        
        return {
            id: parsed.id.toString(),
            telegramId: parsed.id.toString(),
            first_name: parsed.first_name,
            last_name: parsed.last_name || "",
            username: parsed.username || "",
            avatar_url: parsed.photo_url || parsed.avatar_url || "",
        };
    } catch (error) {
        console.error("Telegram user parse xatosi:", error);
        return null;
    }
}

/**
* 4. Admin chatiga yoki foydalanuvchiga Telegram orqali xabar yuborish
*/
export async function sendTelegramNotification(chatId: string | number, text: string) {
    if (!BOT_TOKEN) return;
    
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "HTML",
            }),
        });
    } catch (error) {
        console.error("Telegram notification error:", error);
    }
}