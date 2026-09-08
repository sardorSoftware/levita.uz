'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';

interface Address {
    id: string;
    address: string;
    phone?: string;
    name?: string;
    createdAt: string;
}

export default function AddressesPage() {
    const router = useRouter();
    const { user } = useUserStore();
    
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [newAddress, setNewAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Foydalanuvchi ma'lumotlarini va manzillarni yuklash
    useEffect(() => {
        // Agar foydalanuvchi mehmon bo'lsa yoki telegramId bo'lmasa, profil sahifasiga yo'naltiramiz
        if (!user || !user.telegramId) {
            setLoading(false);
            return;
        }
        
        fetchAddresses(user.telegramId);
    }, [user]);
    
    const fetchAddresses = async (telegramId: string | number) => {
        try {
            setLoading(true);
            // Buyurtmalar tarixi API orqali manzillarni ham olishimiz mumkin
            const res = await fetch(`/api/user/profile?telegramId=${telegramId}`);
            // Yoki o'zingizning buyurtmalar endpointi orqali
            const ordersRes = await fetch(`/api/auth/me?telegramId=${telegramId}`); // yoki orders endpointi
            
            // Hozircha oddiy holatda buyurtmalardan manzilni ajratib olamiz yoki 
            // agar alohida Address jadvalingiz bo'lsa o'sha yerdan olasiz.
            // Keling, buyurtmalar tarixi orqali kelgan manzillarni chiqaramiz:
            const data = await res.json();
            if (data && data.orders) {
                // Takrorlanmaydigan manzillarni yig'amiz
                const uniqueAddresses = Array.from(
                    new Set(data.orders.map((o: any) => o.address))
                ).filter(Boolean).map((addr, index) => ({
                    id: String(index),
                    address: addr as string,
                    createdAt: new Date().toISOString()
                }));
                setAddresses(uniqueAddresses);
            }
        } catch (error) {
            console.error("Manzillarni yuklashda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAddress.trim()) return;
        
        if (!user || !user.telegramId) {
            alert("Iltimos, oldin Telegram orqali kiring!");
            router.push('/profile');
            return;
        }
        
        setIsSubmitting(true);
        try {
            // Yangi manzilni saqlash uchun API gaso'rov (agar /api/user/addresses mavjud bo'lsa)
            // Hozircha uni lokal ro'yxatga qo'shamiz va foydalanuvchiga bildiramiz
            setAddresses(prev => [
                { id: Date.now().toString(), address: newAddress, createdAt: new Date().toISOString() },
                ...prev
            ]);
            setNewAddress('');
            alert("Manzil muvaffaqiyatli qo'shildi!");
        } catch (error) {
            console.error("Xatolik:", error);
            alert("Manzilni saqlashda xatolik yuz berdi.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        );
    }
    
    // Agar foydalanuvchi tizimga kirmagan bo'lsa
    if (!user || !user.telegramId) {
        return (
            <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-sm text-center">
            <h1 className="text-xl font-bold text-gray-800 mb-2">Tizimga kirmagansiz</h1>
            <p className="text-gray-500 mb-6">Saqlangan manzillarni ko'rish uchun Telegram orqali kiring.</p>
            <button
            onClick={() => router.push('/profile')}
            className="w-full py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition"
            >
            Shaxsiy kabinetga o'tish
            </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saqlangan manzillar</h1>
        <button
        onClick={() => router.push('/profile')}
        className="text-sm text-orange-500 font-medium hover:underline"
        >
        Orqaga qaytish
        </button>
        </div>
        
        {/* Manzil qo'shish formasi */}
        <form onSubmit={handleAddAddress} className="bg-white p-4 rounded-2xl shadow-sm mb-6 border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Yangi manzil qo'shish</label>
        <div className="flex gap-2">
        <input
        type="text"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
        placeholder="Masalan: Chilonzor 9-mavze, 12-uy"
        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
        />
        <button
        type="submit"
        disabled={isSubmitting}
        className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition disabled:opacity-50 text-sm whitespace-nowrap"
        >
        {isSubmitting ? " Qo'shilmoqda..." : "Qo'shish"}
        </button>
        </div>
        </form>
        
        {/* Manzillar ro'yxati */}
        <div className="space-y-3">
        {addresses.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
            <p className="text-gray-500 text-sm">Hozircha saqlangan manzillar yo'q.</p>
            </div>
        ) : (
            addresses.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 text-orange-500 rounded-xl mt-0.5">
                📍
                </div>
                <div>
                <p className="text-gray-800 font-medium text-sm">{item.address}</p>
                <span className="text-xs text-gray-400">Yetkazib berish manzili</span>
                </div>
                </div>
                </div>
            ))
        )}
        </div>
        </div>
    );
}