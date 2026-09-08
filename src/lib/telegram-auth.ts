import crypto from "crypto";
import { User } from "@/store/useUserStore";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || "";

/**
* 1. Telegram Web App initData ma'lumotlarini HMAC-SHA256 yordamida tekshirish
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

/**
* 2. initData string'idan foydalanuvchi obyektini ajratib olish
*/
export function parseTelegramUser(initData: string): Partial<User> | null {
    try {
        const urlParams = new URLSearchParams(initData);
        const userJson = urlParams.get("user");
        if (!userJson) return null;
        
        const parsed = JSON.parse(userJson);
        const avatar = parsed.photo_url || parsed.avatar_url || "";
        
        return {
            id: parsed.id.toString(),
            telegramId: parsed.id.toString(),
            first_name: parsed.first_name || "",
            last_name: parsed.last_name || "",
            firstName: parsed.first_name || "",
            lastName: parsed.last_name || "",
            username: parsed.username || "",
            avatar_url: avatar,
            avatarUrl: avatar,
        };
    } catch (error) {
        console.error("Telegram user parse xatosi:", error);
        return null;
    }
}

/**
* 3. Telegram Login Widget orqali kelgan ma'lumotni tekshirish
*/
export function verifyTelegramWidgetData(data: Record<string, any>): boolean {
    if (!BOT_TOKEN || !data.hash) return false;
    
    const { hash, ...dataCheck } = data;
    
    const dataCheckString = Object.keys(dataCheck)
    .filter((key) => dataCheck[key] !== undefined && dataCheck[key] !== null)
    .sort()
    .map((key) => `${key}=${dataCheck[key]}`)
    .join("\n");
    
    const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
    const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");
    
    return calculatedHash === hash;
}

/**
* 4. Adminga Telegram orqali xabar yuborish funksiyasi
*/
export async function sendTelegramNotification(chatId: string, message: string): Promise<void> {
    if (!BOT_TOKEN || !chatId) return;
    
    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
            }),
        });
    } catch (error) {
        console.error("Telegram bildirishnoma yuborishda xatolik:", error);
    }
}