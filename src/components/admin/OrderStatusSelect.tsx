"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleChange = async (newStatus: string) => {
        setStatus(newStatus);
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            
            if (!res.ok) throw new Error("Xatolik yuz berdi");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Statusni o'zgartirishda xatolik!");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <select 
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="bg-cream border border-gray-200 rounded-lg text-xs p-1.5 text-dark focus:outline-none focus:border-primary disabled:opacity-50 cursor-pointer"
        >
        <option value="PENDING">Kutilmoqda</option>
        <option value="PROCESSING">Jarayonda</option>
        <option value="SHIPPED">Yo'lda</option>
        <option value="DELIVERED">Yetkazildi</option>
        <option value="CANCELLED">Bekor qilindi</option>
        </select>
    );
}