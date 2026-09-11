"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OrderStatusSelectProps {
    orderId: string;
    currentStatus: string;
}

export default function OrderStatusSelect({
    orderId,
    currentStatus,
}: OrderStatusSelectProps) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    // Server/Parent tomonidan yangi currentStatus kelganda lokal state'ni moslash
    useEffect(() => {
        setStatus(currentStatus);
    }, [currentStatus]);
    
    const handleChange = async (newStatus: string) => {
        if (newStatus === status || loading) return;
        
        const previousStatus = status; // Xatolik bo'lsa qaytarish uchun
        setStatus(newStatus);
        setLoading(true);
        
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            
            const data = await res.json();
            
            if (!res.ok || !data.success) {
                throw new Error(data.error || "Status o'zgarmadi");
            }
            
            // Admin sahifasidagi Server Component ma'lumotlarini qayta yuklash
            router.refresh();
        } catch (error) {
            console.error("Status update error:", error);
            setStatus(previousStatus); // Xatolik yuz berganda eski statusni qaytarish
            alert("Statusni o'zgartirishda xatolik yuz berdi!");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="bg-cream border border-gray-200 rounded-lg text-xs p-1.5 font-medium text-dark focus:outline-none focus:border-primary disabled:opacity-50 cursor-pointer transition-all"
        >
        <option value="PENDING">Kutilmoqda</option>
        <option value="PROCESSING">Jarayonda</option>
        <option value="SHIPPED">Yo'lda</option>
        <option value="DELIVERED">Yetkazildi</option>
        <option value="CANCELLED">Bekor qilindi</option>
        </select>
    );
}