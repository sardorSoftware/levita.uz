"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore();
    
    // Yangi Ism state'i qo'shildi
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("+998 ");
    const [address, setAddress] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const totalAmount = typeof totalPrice === "function" ? totalPrice() : 0;
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        
        setLoading(true);
        
        // Botimiz kutayotgan JSON formatdagi ma'lumot
        const orderPayload = {
            name: name,
            phone: phone,
            address: address,
            items: items.map(item => ({
                name: item.title,      // Agar sizda item.name bo'lsa, shunga o'zgartiring
                price: item.price,
                quantity: item.quantity
            })),
            total: totalAmount
        };
        
        try {
            // Agar sayt Telegram ichida Mini App sifatida ochilgan bo'lsa
            // @ts-ignore (TypeScript Telegram obyektini tanishi uchun)
            if (typeof window !== "undefined" && window.Telegram?.WebApp) {
                // @ts-ignore
                window.Telegram.WebApp.sendData(JSON.stringify(orderPayload));
                
                clearCart();
                setSuccess(true);
            } else {
                // Agar sayt oddiy brauzerda ochilgan bo'lsa (Zaxira uchun API qoldirildi)
                const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderPayload),
                });
                
                if (res.ok) {
                    clearCart();
                    setSuccess(true);
                } else {
                    const errorData = await res.json();
                    alert("Xatolik: " + (errorData.error || "Qaytadan urinib ko'ring."));
                }
            }
        } catch (err) {
            alert("Tarmoqda xatolik yuz berdi.");
        } finally {
            setLoading(false);
        }
    };
    
    if (success) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-in zoom-in duration-300" />
            <h2 className="text-2xl font-bold text-dark mb-2">Buyurtmangiz qabul qilindi!</h2>
            <p className="text-sm text-gray-500 max-w-xs mb-6">
            Tasdiq cheki Telegram orqali yuborildi.
            </p>
            <Link
            href="/"
            className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-primary/20"
            >
            Bosh sahifaga qaytish
            </Link>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-cream pb-20">
        <header className="bg-white border-b border-gray-100 p-4 flex items-center gap-3">
        <Link href="/" className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-dark transition-colors cursor-pointer">
        <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-lg text-dark">Buyurtmani rasmiylashtirish</h1>
        </header>
        
        <main className="max-w-xl mx-auto p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
        <h2 className="font-bold text-sm text-dark mb-2">Buyurtmangiz:</h2>
        {items.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">Savatcha bo'sh</p>
        ) : (
            items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-dark py-1 border-b border-gray-50 last:border-none">
                <span>{item.title} (x{item.quantity})</span>
                <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} UZS</span>
                </div>
            ))
        )}
        <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-sm text-dark">
        <span>Jami:</span>
        <span className="text-primary">{totalAmount.toLocaleString()} UZS</span>
        </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
        {/* ISM KIRITISH MAYDONI */}
        <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
        Ismingiz *
        </label>
        <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Masalan: Sardor"
        className="w-full bg-cream border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
        />
        </div>
        
        <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
        Telefon raqamingiz *
        </label>
        <input
        type="text"
        required
        value={phone}
        onChange={(e) => {
            const val = e.target.value;
            if (val.startsWith("+998")) {
                setPhone(val);
            } else {
                setPhone("+998 " + val.replace(/^\+998\s*/, ""));
            }
        }}
        className="w-full bg-cream border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
        />
        </div>
        
        <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
        Yetkazib berish manzili *
        </label>
        <textarea
        required
        rows={3}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Toshkent sh., Chilonzor tumani, 10-mavze..."
        className="w-full bg-cream border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-dark focus:outline-none focus:border-primary transition-colors resize-none"
        />
        </div>
        
        <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/20"
        >
        {loading ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
        </button>
        </form>
        </main>
        </div>
    );
}