import crypto from "crypto";
import { User } from "@/types";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

/**
* Telegram Web App initData ma'lumotlarini HMAC-SHA256 yordamida tekshiradi
*/
export function verifyTelegramInitData(initData: string): boolean {
    if (!BOT_TOKEN || !initData) return false;
    
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get("hash");
        
        if (!hash) return false;
        
        urlParams.delete("hash");
        
        // Parametrlarni alifbo tartibida saralab, \n bilan birlashtiramiz
        const paramsToSign = Array.from(urlParams.entries())
        .map(([key, value]) => `${key}=${value}`)
        .sort()
        .join("\n");
        
        // Telegram talabi bo'yicha "WebAppData" kaliti yordamida secret_key hosil qilamiz
        const secretKey = crypto
        .createHmac("sha256", "WebAppData")
        .update(BOT_TOKEN)
        .digest();
        
        // Heshni hisoblab chiqamiz
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

/**
* initData string'idan foydalanuvchi ob'ektini ajratib olish va umumiy User turiga moslash
*/
export function parseTelegramUser(initData: string): User | null {
    try {
        const urlParams = new URLSearchParams(initData);
        const userJson = urlParams.get("user");
        if (!userJson) return null;
        
        const parsed = JSON.parse(userJson);
        
        return {
            id: parsed.id,
            first_name: parsed.first_name,
            last_name: parsed.last_name,
            username: parsed.username,
            avatar_url: parsed.photo_url || parsed.avatar_url,
        };
    } catch (error) {
        console.error("Telegram user parse xatosi:", error);
        return null;
    }
}