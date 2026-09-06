"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteProductButton({ productId }: { productId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleDelete = async () => {
        // Next.js da global ob'ektlarni aniq chaqirish xavfsizroq
        const confirmed = window.confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?");
        if (!confirmed) return;
        
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
            });
            
            if (!res.ok) {
                // Serverdan kelgan xatolik matnini ajratib olish
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "O'chirishda xatolik yuz berdi");
            }
            
            // O'chirilgandan so'ng jadvalni darhol yangilash
            router.refresh();
        } catch (error: any) {
            console.error("Delete error:", error);
            alert(error.message || "Mahsulotni o'chirib bo'lmadi.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button
        onClick={handleDelete}
        disabled={loading}
        title="O'chirish"
        className="p-1.5 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
        >
        {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
        ) : (
            <Trash2 className="w-4 h-4" />
        )}
        </button>
    );
}