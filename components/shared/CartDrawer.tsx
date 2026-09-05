"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

export default function CartDrawer() {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
    });
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        
        setLoading(true);
        
        try {
            // Telegram WebApp orqali kirgan bo'lsa, foydalanuvchi ma'lumotlarini olish
            const tgUser = typeof window !== "undefined" ? window.Telegram?.WebApp?.initDataUnsafe?.user : null;
            
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    telegramId: tgUser?.id ? String(tgUser.id) : null,
                    telegramUser: tgUser?.username || null,
                    source: tgUser ? "TG_BOT" : "WEBSITE",
                    items: items.map((item) => ({
                        id: item.id,
                        title: item.name, // Backendga title sifatida yuboriladi
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    totalPrice: getTotal(),
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert("✅ Buyurtmangiz qabul qilindi! Tez orada aloqaga chiqamiz.");
                clearCart();
                setIsOpen(false);
                setFormData({ name: "", phone: "", address: "" });
            } else {
                alert(`Xatolik: ${data.error || "Buyurtma yuborilmadi"}`);
            }
        } catch (error) {
            console.error("Order submit error:", error);
            alert("Server bilan bog'lanishda xatolik yuz berdi.");
        } finally {
            setLoading(false);
        }
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
        <div className="w-full max-w-md bg-[#0a1f18] text-white h-full p-6 flex flex-col justify-between shadow-xl border-l border-[#ccff00]/20 overflow-y-auto">
        
        {/* Yuqori qism: Sarlovha va Yopish */}
        <div>
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold tracking-wide text-[#ccff00]">🛒 Savatcha</h2>
        <button
        onClick={() => setIsOpen(false)}
        className="text-gray-400 hover:text-white text-2xl font-bold cursor-pointer"
        >
        ✕
        </button>
        </div>
        
        {/* Mahsulotlar ro'yxati */}
        <div className="mt-4 space-y-4 max-h-[40vh] overflow-y-auto pr-2">
        {items.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Savatchangiz bo'sh</p>
        ) : (
            items.map((item) => (
                <div
                key={item.id}
                className="flex items-center justify-between bg-[#05130f] p-3 rounded-lg border border-gray-800"
                >
                <div className="flex items-center space-x-3">
                {item.image && (
                    <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                    />
                )}
                <div>
                <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                <p className="text-xs text-[#ccff00]">${item.price}</p>
                </div>
                </div>
                
                <div className="flex items-center space-x-2">
                <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded text-sm flex items-center justify-center cursor-pointer"
                >
                -
                </button>
                <span className="text-sm font-bold">{item.quantity}</span>
                <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded text-sm flex items-center justify-center cursor-pointer"
                >
                +
                </button>
                <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-400 text-xs ml-2 cursor-pointer"
                >
                🗑
                </button>
                </div>
                </div>
            ))
        )}
        </div>
        </div>
        
        {/* Pastki qism: Forma va Buyurtma tugmasi */}
        {items.length > 0 && (
            <form onSubmit={handleSubmitOrder} className="mt-6 space-y-3 border-t border-gray-800 pt-4">
            <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Jami summa:</span>
            <span className="text-xl font-bold text-[#ccff00]">${getTotal().toFixed(2)}</span>
            </div>
            
            <input
            type="text"
            name="name"
            placeholder="Ismingiz"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-[#05130f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
            />
            
            <input
            type="tel"
            name="phone"
            placeholder="Telefon raqamingiz (+998...)"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full bg-[#05130f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
            />
            
            <input
            type="text"
            name="address"
            placeholder="Yetkazib berish manzili"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full bg-[#05130f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ccff00]"
            />
            
            <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ccff00] text-black font-bold py-3 rounded-lg hover:bg-[#b3ff00] transition-colors disabled:opacity-50 mt-2 cursor-pointer"
            >
            {loading ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
            </button>
            </form>
        )}
        </div>
        </div>
    );
}