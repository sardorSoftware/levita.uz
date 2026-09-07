import crypto from "crypto";

interface TelegramAuthData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

// Telegram Widget orqali kelgan ma'lumotni tekshirish
export function verifyTelegramWidgetData(data: TelegramAuthData): boolean {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return false;
    
    // (Qo'shimcha xavfsizlik) 1 kundan oshib ketgan eskirgan auth_date'larni rad etish (86400 sekund = 1 kun)
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - data.auth_date > 86400) {
        return false; 
    }
    
    const { hash, ...dataCheck } = data;
    
    // Qiymati yo'q (undefined yoki null) maydonlarni chiqarib tashlab, 
    // kalit-qiymatlarni alifbo tartibida saralaymiz
    const dataCheckString = Object.keys(dataCheck)
    .filter((key) => dataCheck[key as keyof typeof dataCheck] !== undefined && dataCheck[key as keyof typeof dataCheck] !== null)
    .sort()
    .map((key) => `${key}=${dataCheck[key as keyof typeof dataCheck]}`)
    .join("\n");
    
    // Bot tokenidan secret key hosil qilish
    const secretKey = crypto.createHash("sha256").update(botToken).digest();
    
    // Data check string va secret key orqali HMAC-SHA256 xeshini hisoblash
    const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");
    
    return calculatedHash === hash;
}