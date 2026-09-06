"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Edit, Trash2 } from "lucide-react";

interface CategoryModalProps {
    category?: {
        id: string;
        name: string;
        slug: string;
        image?: string | null;
    };
}

export function CategoryModal({ category }: CategoryModalProps) {
    const isEditing = !!category;
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState(category?.name || "");
    const [slug, setSlug] = useState(category?.slug || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        if (category) {
            setName(category.name);
            setSlug(category.slug);
        }
    }, [category]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const url = isEditing ? `/api/admin/categories/${category.id}` : "/api/admin/categories";
            const method = isEditing ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug }),
            });
            
            // Serverdan kelgan javobni xavfsiz o'qish
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error(`Server xatosi: ${res.status}. API manzilni tekshiring.`);
            }
            
            if (!res.ok) throw new Error(data?.error || "Xatolik yuz berdi");
            
            setIsOpen(false);
            if (!isEditing) {
                setName("");
                setSlug("");
            }
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Amaliyotni bajarishda xatolik!");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
        {isEditing ? (
            <button 
            onClick={() => setIsOpen(true)}
            className="p-1.5 text-gray-400 hover:text-primary bg-white hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
            >
            <Edit className="w-4 h-4" />
            </button>
        ) : (
            <button 
            onClick={() => setIsOpen(true)}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
            <Plus className="w-4 h-4" /> Yangi qo'shish
            </button>
        )}
        
        {isOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-dark text-base">
            {isEditing ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-dark cursor-pointer">
            <X className="w-5 h-5" />
            </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-xs font-bold text-dark uppercase mb-1">Kategoriya nomi</label>
            <input
            type="text"
            required
            value={name}
            onChange={(e) => {
                setName(e.target.value);
                if (!isEditing) {
                    setSlug(e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
                }
            }}
            placeholder="Masalan: Ichimliklar"
            className="w-full bg-cream border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-primary"
            />
            </div>
            
            <div>
            <label className="block text-xs font-bold text-dark uppercase mb-1">Slug (Havola)</label>
            <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ichimliklar"
            className="w-full bg-cream border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-primary font-mono text-xs"
            />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
            <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-dark transition-colors cursor-pointer"
            >
            Bekor qilish
            </button>
            <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-hover text-white transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
            {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
            </div>
            </form>
            </div>
            </div>
        )}
        </>
    );
}

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleDelete = async () => {
        if (!confirm("Haqiqatan ham bu kategoriyani o'chirmoqchimisiz?")) return;
        
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/categories/${categoryId}`, {
                method: "DELETE",
            });
            
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error(`Server xatosi: ${res.status}`);
            }
            
            if (!res.ok) throw new Error(data?.error || "O'chirishda xatolik");
            
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Kategoriyani o'chirib bo'lmadi.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button 
        onClick={handleDelete}
        disabled={loading}
        className="p-1.5 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
        <Trash2 className="w-4 h-4" />
        </button>
    );
}