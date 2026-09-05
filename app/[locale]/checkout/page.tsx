"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    // clearCart funksiyasini ham chaqirib olamiz
    const { items, getTotal, clearCart } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Forma holati
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
    });
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            alert("Savatchangiz bo'sh!");
            return;
        }
        
        setLoading(true);
        
        try {
            // Ma'lumotlarni to'g'ridan-to'g'ri /api/orders ga yuboramiz (Admin CRM ko'rishi uchun)
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: formData.name, // Prisma bazasidagi nomga moslandi
                    phone: formData.phone,
                    address: formData.address,
                    items: items,
                    totalPrice: getTotal(),
                    source: "WEBSITE" // Vebsaytdan kelgani belgilanmoqda
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert("Buyurtmangiz muvaffaqiyatli qabul qilindi! Tez orada aloqaga chiqamiz.");
                clearCart(); // Savatchani tozalash
                router.push("/");
            } else {
                alert(`Xatolik yuz berdi: ${data.error || "Qaytadan urinib ko'ring."}`);
            }
        } catch (error) {
            console.error("Buyurtma yuborishda xatolik:", error);
            alert("Tarmoqda xatolik yuz berdi. Internetni tekshiring.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <main className="min-h-screen pt-32 pb-24 container mx-auto px-6">
        <h1 className="font-heading text-4xl font-light tracking-widest uppercase mb-10 text-center">Buyurtmani Rasmiylashtirish</h1>
        
        <div className="max-w-2xl mx-auto bg-[#14171A] p-8 rounded-2xl border border-white/5">
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Ism va Familiya</label>
        <input 
        required
        type="text" 
        placeholder="Masalan: Anvar Toshmatov"
        className="w-full bg-[#0D0F12] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm text-white"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        </div>
        <div>
        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Telefon raqam</label>
        <input 
        required
        type="tel" 
        placeholder="+998 90 123 45 67"
        className="w-full bg-[#0D0F12] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm text-white"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        </div>
        <div>
        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Viloyat / Manzil</label>
        <textarea 
        required
        rows={3}
        placeholder="Toshkent shahri, Chilonzor tumani..."
        className="w-full bg-[#0D0F12] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-sm resize-none text-white"
        value={formData.address}
        onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
        </div>
        
        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
        <span className="text-muted-foreground tracking-widest">JAMI TO'LOV:</span>
        <span className="font-heading text-2xl text-primary">${getTotal().toFixed(2)}</span>
        </div>
        
        <button 
        disabled={loading || items.length === 0}
        type="submit" 
        className="w-full mt-6 py-4 bg-primary text-background font-medium tracking-widest uppercase rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 cursor-pointer"
        >
        {loading ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
        </button>
        </form>
        </div>
        </main>
    );
}