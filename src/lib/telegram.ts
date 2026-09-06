import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

/**
* Telegram Web App initData ma'lumotlarini xavfsizlikka tekshiradi
*/
export function verifyTelegramWebAppData(telegramInitData: string): boolean {
    if (!BOT_TOKEN) return false;
    
    const urlParams = new URLSearchParams(telegramInitData);
    const hash = urlParams.get("hash");
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
}

/**
* Admin chatiga Telegram orqali xabar yuboradi
*/
export async function sendTelegramNotification(chatId: string | number, text: string) {
    if (!BOT_TOKEN) return;
    
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
        }),
    });
}