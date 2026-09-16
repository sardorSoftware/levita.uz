"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, RefreshCw, CheckCircle2 } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

interface TelegramLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TelegramLoginModal({ isOpen, onClose, onSuccess }: TelegramLoginModalProps) {
    const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME || "naqtol_bot";
    const { setUser } = useUserStore();
    
    const [token, setToken] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const tokenRef = useRef<string | null>(null);
    
    const stopPolling = useCallback(() => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    }, []);
    
    const checkSessionStatus = useCallback(async (currentToken: string) => {
        try {
            const res = await fetch(`/api/auth/session?token=${currentToken}`);
            const data = await res.json();
            
            if (data.success && data.status === "APPROVED" && data.user) {
                stopPolling();
                setIsSuccess(true);
                
                sessionStorage.removeItem("has_logged_out");
                setUser({
                    id: data.user.id,
                    telegramId: data.user.telegramId?.toString() || "",
                    first_name: data.user.first_name || data.user.firstName || "",
                    last_name: data.user.last_name || data.user.lastName || "",
                    firstName: data.user.firstName || data.user.first_name || "",
                    lastName: data.user.lastName || data.user.last_name || "",
                    username: data.user.username || "",
                    avatar_url: data.user.avatar_url || data.user.avatarUrl || "",
                    avatarUrl: data.user.avatar_url || data.user.avatarUrl || "",
                    phone: data.user.phone || "",
                });
                
                setTimeout(() => {
                    onClose();
                    onSuccess();
                    setIsSuccess(false);
                }, 1200);
                
                return true;
            } else if (data.status === "EXPIRED") {
                stopPolling();
                setErrorMsg("Sessiya vaqti tugadi. Qaytadan urinib ko'ring.");
                return false;
            }
        } catch (err) {
            console.error("Session polling error:", err);
        }
        return false;
    }, [setUser, onClose, onSuccess, stopPolling]);
    
    // Modal ochilganda token olib tayyorlab qo'yish (Pop-up blocker oldini olish uchun)
    useEffect(() => {
        if (isOpen && !tokenRef.current) {
            fetch("/api/auth/session", { method: "POST" })
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.token) {
                    setToken(data.token);
                    tokenRef.current = data.token;
                }
            })
            .catch(() => setErrorMsg("Sessiya yaratishda xatolik"));
        }
        
        if (!isOpen) {
            stopPolling();
            setToken(null);
            tokenRef.current = null;
            setErrorMsg("");
            setIsSuccess(false);
        }
    }, [isOpen, stopPolling]);
    
    // Foydalanuvchi Telegram'dan sayt tabiga qaytib kirganda darhol tekshirish
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && tokenRef.current && !isSuccess) {
                checkSessionStatus(tokenRef.current);
            }
        };
        
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [checkSessionStatus, isSuccess]);
    
    const handleLoginRedirect = () => {
        if (!token) {
            setErrorMsg("Sessiya yuklanmoqda, ozgina kuting...");
            return;
        }
        
        setErrorMsg("");
        
        // Asinxron fetch yo'qligi sababli brauzer buni bloklamaydi
        window.open(`https://t.me/${BOT_USERNAME}?start=${token}`, "_blank");
        
        stopPolling();
        pollingRef.current = setInterval(() => {
            if (tokenRef.current) {
                checkSessionStatus(tokenRef.current);
            }
        }, 2000);
    };
    
    const handleManualCheck = async () => {
        if (!token) return;
        setIsChecking(true);
        setErrorMsg("");
        const approved = await checkSessionStatus(token);
        if (!approved && !errorMsg) {
            setErrorMsg("Raqam hali tasdiqlanmadi. Botga o'tib kontaktni ulashing.");
        }
        setIsChecking(false);
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative text-center space-y-4">
        <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
        <X className="w-5 h-5" />
        </button>
        
        {isSuccess ? (
            <div className="py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-gray-900">Muvaffaqiyatli kirildi!</h3>
            <p className="text-sm text-gray-500">Tizimga muvaffaqiyatli ulandingiz.</p>
            </div>
        ) : (
            <>
            <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tizimga kirish</h3>
            <p className="text-sm text-gray-500">
            Buyurtmalarni kuzatish va shaxsiy kabinetdan to'liq foydalanish uchun Telegram botimiz orqali kiring va raqamingizni yuboring.
            </p>
            </div>
            
            {errorMsg && (
                <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                {errorMsg}
                </div>
            )}
            
            <div className="space-y-2">
            <button
            onClick={handleLoginRedirect}
            disabled={!token}
            className="w-full py-3.5 bg-[#229ED9] hover:bg-[#1e88bc] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
            <Send className="w-4 h-4" />
            <span>{token ? "Telegram orqali kirish / Tasdiqlash" : "Yuklanmoqda..."}</span>
            </button>
            
            <button
            onClick={handleManualCheck}
            disabled={isChecking || !token}
            className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-gray-200 disabled:opacity-50"
            >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
            <span>Raqamni yubordim, tekshirish</span>
            </button>
            </div>
            </>
        )}
        </div>
        </div>
    );
}