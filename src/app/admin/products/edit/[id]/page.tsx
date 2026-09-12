"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, UploadCloud, X, Plus } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        oldPrice: "",
        categoryId: "",
        images: [] as string[],
        stock: "10",
        isUsed: false,
    });
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const catRes = await fetch("/api/admin/categories");
                const catData = await catRes.json();
                if (catData.success) {
                    setCategories(catData.categories);
                }
                
                const prodRes = await fetch(`/api/admin/products/${productId}`);
                const prodData = await prodRes.json();
                
                if (prodData.success && prodData.product) {
                    const p = prodData.product;
                    setFormData({
                        title: p.title || "",
                        price: p.price?.toString() || "",
                        oldPrice: p.oldPrice?.toString() || "",
                        categoryId: p.categoryId || "",
                        images: p.images || (p.image ? [p.image] : []), // Eski `image` bo'lsa uni arrayga aylantiramiz
                        stock: p.inStock ? "10" : "0", 
                        isUsed: p.isUsed || false,
                    });
                } else {
                    alert("Mahsulot topilmadi");
                    router.push("/admin/products");
                }
            } catch (error) {
                console.error(error);
                alert("Ma'lumotlarni yuklashda xatolik yuz berdi");
            } finally {
                setFetching(false);
            }
        };
        
        if (productId) loadData();
    }, [productId, router]);
    
    const handleImageChange = (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        if (formData.images.length + fileArray.length > 4) {
            alert("Maksimal 4 ta rasm yuklash mumkin!");
            return;
        }
        
        fileArray.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormData((prev) => ({ ...prev, images: [...prev.images, result] }));
            };
            reader.readAsDataURL(file);
        });
    };
    
    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.categoryId) {
            alert("Iltimos, kategoriyani tanlang!");
            return;
        }
        
        setLoading(true);
        
        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
                    stock: Number(formData.stock),
                }),
            });
            
            if (res.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Mahsulotni yangilashda xatolik yuz berdi!");
            }
        } catch (error) {
            console.error(error);
            alert("Tarmoqda xatolik!");
        } finally {
            setLoading(false);
        }
    };
    
    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
        <div className="flex items-center gap-3">
        <Link
        href="/admin/products"
        className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-dark transition-colors"
        >
        <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-dark">Mahsulotni tahrirlash</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div>
        <label className="block text-xs font-bold text-dark uppercase mb-1">Mahsulot nomi</label>
        <input
        type="text"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
        />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-bold text-dark uppercase mb-1">Narxi (UZS)</label>
        <input
        type="number"
        required
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
        />
        </div>
        <div>
        <label className="block text-xs font-bold text-dark uppercase mb-1">Eski narxi</label>
        <input
        type="number"
        value={formData.oldPrice}
        onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
        />
        </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-bold text-dark uppercase mb-1">Kategoriya</label>
        <select
        required
        value={formData.categoryId}
        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary bg-white text-dark"
        >
        <option value="">Kategoriyani tanlang</option>
        {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
        </select>
        </div>
        <div>
        <label className="block text-xs font-bold text-dark uppercase mb-1">Ombordagi soni</label>
        <input
        type="number"
        required
        value={formData.stock}
        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
        />
        </div>
        </div>
        
        <div>
        <label className="block text-xs font-bold text-dark uppercase mb-1">
        Mahsulot Rasmlari (Maks 4 ta)
        </label>
        <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.length) handleImageChange(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-primary transition bg-gray-50 relative flex flex-col items-center justify-center min-h-[140px]"
        >
        <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
            if (e.target.files?.length) handleImageChange(e.target.files);
        }}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
        disabled={formData.images.length >= 4}
        />
        
        {formData.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full relative z-30 pointer-events-none">
            {formData.images.map((img, idx) => (
                <div key={idx} className="relative group pointer-events-auto">
                <img src={img} alt={`Preview ${idx}`} className="h-24 w-full object-cover rounded-lg border shadow-sm bg-white p-1" />
                <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); removeImage(idx); }} 
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors"
                >
                <X className="w-3.5 h-3.5" />
                </button>
                </div>
            ))}
            {formData.images.length < 4 && (
                <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-[10px] uppercase font-bold">Yana qo'shish</span>
                </div>
            )}
            </div>
        ) : (
            <div className="flex flex-col items-center pointer-events-none">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
            Rasmlarni shu yerga tashlang yoki <span className="text-primary font-semibold">fayllarni tanlang</span>
            </p>
            </div>
        )}
        </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
        <input
        type="checkbox"
        id="isUsed"
        checked={formData.isUsed}
        onChange={(e) => setFormData({ ...formData, isUsed: e.target.checked })}
        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
        />
        <label htmlFor="isUsed" className="text-sm font-medium text-dark cursor-pointer">
        Ishlatilgan (B/U) mahsulot
        </label>
        </div>
        
        <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        O'zgarishlarni Saqlash
        </button>
        </form>
        </div>
    );
}