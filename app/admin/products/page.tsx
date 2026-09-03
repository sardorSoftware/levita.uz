"use client";

import { useState, useEffect } from "react";
import { Plus, Package } from "lucide-react";

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    description?: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Forma uchun state'lar
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("new_phones");
    const [description, setDescription] = useState("");
    
    // Bazadagi mahsulotlarni olib kelish
    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error("Xatolik:", error);
        }
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);
    
    // Yangi mahsulot qo'shish
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, price, image, category, description }),
            });
            
            if (res.ok) {
                // Formani tozalash
                setTitle("");
                setPrice("");
                setImage("");
                setDescription("");
                // Ro'yxatni yangilash
                fetchProducts();
                alert("Mahsulot muvaffaqiyatli qo'shildi! ✅");
            } else {
                alert("Mahsulot qo'shishda xatolik yuz berdi!");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-[#05130f] text-white p-8">
        <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
        <Package className="text-[#ccff00]" /> NAQTOL Admin: Mahsulotlar Boshqaruvi
        </h1>
        
        {/* Mahsulot qo'shish formasi */}
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl mb-10 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-[#ccff00]">Yangi mahsulot qo'shish</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
        type="text"
        placeholder="Mahsulot nomi (masalan: iPhone 15 Pro)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]"
        />
        <input
        type="number"
        placeholder="Narxi ($)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]"
        />
        <input
        type="text"
        placeholder="Rasm manzili (URL: /products/smartphone.png)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]"
        />
        <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-[#0b1d17] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]"
        >
        <option value="new_phones">Yangi smartfonlar</option>
        <option value="used_phones">Ishlatilgan telefonlar</option>
        <option value="accessories">Aksessuarlar</option>
        </select>
        <textarea
        placeholder="Qisqacha tavsif..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]"
        rows={3}
        />
        <button
        type="submit"
        disabled={loading}
        className="md:col-span-2 bg-[#ccff00] text-black font-bold py-3 rounded-xl hover:bg-[#b3e600] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
        <Plus size={20} /> {loading ? "Qo'shilmoqda..." : "Mahsulotni Qo'shish"}
        </button>
        </form>
        </div>
        
        {/* Mahsulotlar ro'yxati */}
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-[#ccff00]">Mavjud Mahsulotlar ({products.length})</h2>
        
        {products.length === 0 ? (
            <p className="text-white/50 text-center py-8">Hozircha mahsulotlar yo'q.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div key={product.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                <div>
                <div className="w-full h-40 bg-white/5 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.title} className="object-cover h-full w-full" />
                </div>
                <span className="text-xs bg-[#ccff00]/10 text-[#ccff00] px-2.5 py-1 rounded-md uppercase font-semibold">
                {product.category}
                </span>
                <h3 className="font-bold text-lg mt-2">{product.title}</h3>
                <p className="text-[#ccff00] font-semibold mt-1">${product.price}</p>
                {product.description && (
                    <p className="text-white/60 text-sm mt-2 line-clamp-2">{product.description}</p>
                )}
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
        </div>
        </div>
    );
}