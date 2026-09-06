"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    
    // Forma ma'lumotlari uchun state
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        oldPrice: "",
        categoryId: "",
        image: "", 
        stock: "10",
        isUsed: false,
    });
    
    // Kategoriyalarni bazadan yuklab kelish
    useEffect(() => {
        fetch("/api/admin/categories")
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setCategories(data.categories);
            }
        })
        .catch((err) => console.error("Kategoriyalarni olishda xatolik:", err));
    }, []);
    
    // Rasmni fayldan o'qib Base64 ga o'tkazish funksiyasi
    const handleImageChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setImagePreview(result);
            setFormData((prev) => ({ ...prev, image: result }));
        };
        reader.readAsDataURL(file);
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.categoryId) {
            alert("Iltimos, kategoriyani tanlang!");
            return;
        }
        
        setLoading(true);
        
        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
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
                alert(data.error || "Mahsulot qo'shishda xatolik yuz berdi!");
            }
        } catch (error) {
            console.error(error);
            alert("Tarmoqda xatolik!");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
        {/* Orqaga qaytish */}
        <div className="flex items-center gap-3">
        <Link 
        href="/admin/products" 
        className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-dark transition-colors"
        >
        <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-dark">Yangi mahsulot qo'shish</h1>
        </div>
        
        {/* Forma */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div>
        <label className="block text-xs font-bold text-dark uppercase mb-1">Mahsulot nomi</label>
        <input 
        type="text" 
        required
        placeholder="Masalan: iPhone 15 Pro Max"
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
        placeholder="14500000"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
        />
        </div>
        <div>
        <label className="block text-xs font-bold text-dark uppercase mb-1">Eski narxi (Chegirma uchun)</label>
        <input 
        type="number" 
        placeholder="16000000"
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
            <option key={cat.id} value={cat.id}>
            {cat.name}
            </option>
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
        
        {/* Drag & Drop rasm yuklash qismi */}
        <div>
        <label className="block text-xs font-bold text-dark uppercase mb-1">Mahsulot Rasmi (Drag & Drop)</label>
        <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleImageChange(file);
        }}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition cursor-pointer bg-gray-50 relative flex flex-col items-center justify-center"
        >
        <input 
        type="file" 
        accept="image/*"
        onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageChange(file);
        }}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        
        {imagePreview ? (
            <div className="relative z-10 flex flex-col items-center">
            <img src={imagePreview} alt="Preview" className="h-28 object-contain rounded-lg mb-2 border shadow-sm bg-white p-1" />
            <span className="text-xs text-green-600 font-semibold">Rasm muvaffaqiyatli yuklandi! Boshqasini tanlash uchun bosing.</span>
            </div>
        ) : (
            <div className="flex flex-col items-center pointer-events-none">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
            Rasmni shu yerga tashlang yoki <span className="text-primary font-semibold">faylni tanlang</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
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
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        Mahsulotni Saqlash
        </button>
        </form>
        </div>
    );
}