"use client";

import { useState, useEffect, useRef } from "react";
import { 
    ShoppingBag, Phone, Clock, CheckCircle, Truck, XCircle, User, 
    RefreshCw, Calendar, Plus, Package, UploadCloud, ImageIcon, X, Globe, Send 
} from "lucide-react";

interface Order {
    id: string;
    customerName: string;
    phone: string;
    address?: string;
    telegramId?: string;
    telegramUser?: string;
    items: any;
    totalPrice: number;
    source: string; // "WEBSITE" yoki "TG_BOT"
    status: string;
    createdAt: string;
}

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    description?: string;
}

const CATEGORIES = [
    { id: "new_phones", label: "Yangi smartfonlar" },
    { id: "used_phones", label: "Ishlatilgan telefonlar" },
    { id: "accessories", label: "Aksessuarlar" },
];

// ================= BUYURTMALAR KOMPONENTI (CRM) =================
function OrdersView() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    const fetchOrders = async () => {
        setRefreshing(true);
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            if (Array.isArray(data)) setOrders(data);
            else if (data.success && Array.isArray(data.data)) setOrders(data.data);
        } catch (error) {
            console.error("Buyurtmalarni olishda xatolik:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };
    
    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, []);
    
    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (res.ok) {
                fetchOrders();
            } else {
                const data = await res.json();
                alert(`Xatolik: ${data.error || "Statusni yangilab bo'lmadi"}`);
            }
        } catch (error) {
            console.error("Statusni o'zgartirishda xatolik:", error);
        }
    };
    
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "NEW": return { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: <Clock size={14}/>, label: "Yangi" };
            case "CONFIRMED": return { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: <CheckCircle size={14}/>, label: "Tasdiqlangan" };
            case "SHIPPING": return { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: <Truck size={14}/>, label: "Yetkazilmoqda" };
            case "COMPLETED": return { color: "text-[#ccff00]", bg: "bg-[#ccff00]/10", border: "border-[#ccff00]/20", icon: <CheckCircle size={14}/>, label: "Yakunlangan" };
            case "CANCELLED": return { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: <XCircle size={14}/>, label: "Bekor qilingan" };
            default: return { color: "text-white", bg: "bg-white/10", border: "border-white/20", icon: <Clock size={14}/>, label: status };
        }
    };
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('uz-UZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };
    
    return (
        <div className="animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-extrabold">Buyurtmalar CRM</h2>
        <button 
        onClick={fetchOrders}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all text-sm font-semibold"
        >
        <RefreshCw size={16} className={refreshing ? "animate-spin text-[#ccff00]" : ""} /> 
        Yangilash
        </button>
        </div>
        
        {loading ? (
            <div className="flex justify-center items-center py-20">
            <RefreshCw size={40} className="animate-spin text-[#ccff00]/50" />
            </div>
        ) : orders.length === 0 ? (
            <div className="bg-black/40 border border-white/10 p-16 rounded-3xl text-center shadow-xl">
            <ShoppingBag size={40} className="text-white/25 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Hozircha buyurtmalar yo'q</h3>
            <p className="text-white/50">Mijozlar buyurtma berganda ular avtomatik shu yerda ko'rinadi.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => {
                const statusConf = getStatusConfig(order.status);
                const isTelegram = order.source === "TG_BOT";
                return (
                    <div key={order.id} className={`bg-black/40 border ${statusConf.border} p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row justify-between items-start gap-6`}>
                    <div className="space-y-4 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded">#{order.id.slice(0, 8)}</span>
                    
                    {isTelegram ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        <Send size={12} /> Telegram Bot
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Globe size={12} /> Vebsayt
                        </span>
                    )}
                    
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${statusConf.bg} ${statusConf.color}`}>
                    {statusConf.icon} {statusConf.label}
                    </span>
                    
                    <span className="flex items-center gap-1.5 text-xs text-white/50 ml-auto">
                    <Calendar size={14} /> {formatDate(order.createdAt)}
                    </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#ccff00]/10 flex items-center justify-center">
                    <User size={16} className="text-[#ccff00]" />
                    </div>
                    <div>
                    <p className="text-xs text-white/40 mb-0.5">Mijoz</p>
                    <p className="font-bold">{order.customerName}</p>
                    </div>
                    </div>
                    <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                    <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Phone size={16} className="text-blue-400" />
                    </div>
                    <div>
                    <p className="text-xs text-white/40 mb-0.5">Telefon</p>
                    <a href={`tel:${order.phone}`} className="font-bold hover:text-[#ccff00] transition-colors">{order.phone}</a>
                    </div>
                    </div>
                    {order.telegramUser && (
                        <>
                        <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                        <div>
                        <p className="text-xs text-white/40 mb-0.5">Telegram</p>
                        <span className="font-bold text-sky-400">@{order.telegramUser}</span>
                        </div>
                        </>
                    )}
                    </div>
                    
                    {order.address && (
                        <p className="text-sm text-white/70">📍 <strong className="text-white">Manzil:</strong> {order.address}</p>
                    )}
                    
                    <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Buyurtma tarkibi:</p>
                    <div className="space-y-1">
                    {Array.isArray(order.items) ? (
                        order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-white/85">{item.title} <span className="text-white/40">x{item.qty || item.quantity || 1}</span></span>
                            <span className="font-bold">${(item.price * (item.qty || item.quantity || 1)).toLocaleString()}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-white/40">Mahsulotlar formati noto'g'ri</p>
                    )}
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-white/10">
                    <span className="text-sm font-bold text-white/60">Jami summa:</span>
                    <span className="text-2xl font-extrabold text-[#ccff00]">${order.totalPrice.toLocaleString()}</span>
                    </div>
                    </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-48 overflow-x-auto">
                    <span className="text-xs text-white/40 uppercase tracking-wider hidden lg:block mb-1">Statusni o'zgartirish</span>
                    {order.status === 'NEW' && (
                        <button onClick={() => updateStatus(order.id, "CONFIRMED")} className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-bold py-3 px-4 rounded-xl transition-all border border-yellow-500/20 text-left whitespace-nowrap">
                        ✓ Tasdiqlash
                        </button>
                    )}
                    {order.status === 'CONFIRMED' && (
                        <button onClick={() => updateStatus(order.id, "SHIPPING")} className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-bold py-3 px-4 rounded-xl transition-all border border-purple-500/20 text-left whitespace-nowrap">
                        🚚 Yetkazish
                        </button>
                    )}
                    {order.status === 'SHIPPING' && (
                        <button onClick={() => updateStatus(order.id, "COMPLETED")} className="flex-1 bg-[#ccff00]/20 hover:bg-[#ccff00]/30 text-[#ccff00] text-xs font-bold py-3 px-4 rounded-xl transition-all border border-[#ccff00]/20 text-left whitespace-nowrap">
                        ✅ Yakunlash
                        </button>
                    )}
                    {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                        <button onClick={() => updateStatus(order.id, "CANCELLED")} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold py-3 px-4 rounded-xl transition-all border border-red-500/10 text-left whitespace-nowrap">
                        ✕ Bekor qilish
                        </button>
                    )}
                    </div>
                    </div>
                );
            })}
            </div>
        )}
        </div>
    );
}

// ================= MAHSULOTLAR KOMPONENTI =================
function ProductsView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("new_phones");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else if (data.success && Array.isArray(data.data)) {
                setProducts(data.data);
            } else if (Array.isArray(data.products)) {
                setProducts(data.products);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Xatolik:", error);
            setProducts([]);
        }
    };
    
    useEffect(() => { fetchProducts(); }, []);
    
    const handleFile = (file: File) => {
        if (!file.type.includes("image/")) {
            alert("Faqat rasm yuklang!");
            return;
        }
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };
    
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!previewUrl) {
            alert("Mahsulot rasmini tanlang!");
            return;
        }
        setLoading(true);
        
        try {
            const imagePayload = imageFile ? await fileToBase64(imageFile) : previewUrl;
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, price: Number(price), image: imagePayload, category, description }),
            });
            
            const responseData = await res.json();
            
            if (res.ok) {
                // Formani tozalash
                setTitle(""); setPrice(""); setDescription("");
                setImageFile(null); setPreviewUrl(null); setCategory("new_phones");
                
                // Yangi mahsulotni ro'yxatga darhol qo'shish (Optimistic update)
                const createdProduct = responseData.product || responseData.data || responseData;
                if (createdProduct && createdProduct.id) {
                    setProducts((prev) => [createdProduct, ...prev]);
                } else {
                    fetchProducts();
                }
                
                alert("Mahsulot muvaffaqiyatli qo'shildi! ✅");
            } else {
                alert(`Xatolik: ${responseData.error || "Qo'shilmadi"}`);
            }
        } catch (error: any) {
            alert("Tarmoqda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id: string) => {
        if (!confirm("Rostdan ham bu mahsulotni o'chirmoqchimisiz?")) return;
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts((prev) => prev.filter(p => p.id !== id));
            } else {
                alert("O'chirib bo'lmadi");
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    return (
        <div className="animate-in fade-in duration-300">
        <h2 className="text-3xl font-extrabold mb-8">Mahsulotlar Boshqaruvi</h2>
        
        <div className="bg-black/40 border border-white/10 p-8 rounded-2xl mb-10 shadow-xl">
        <h3 className="text-xl font-bold mb-6 text-[#ccff00]">Yangi mahsulot yaratish</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
        <div>
        <label className="text-sm text-white/60 mb-2 block">Mahsulot nomi</label>
        <input type="text" placeholder="Masalan: iPhone 15 Pro" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]" />
        </div>
        <div>
        <label className="text-sm text-white/60 mb-2 block">Narxi ($)</label>
        <input type="number" placeholder="Masalan: 1199" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]" />
        </div>
        <div>
        <label className="text-sm text-white/60 mb-2 block">Kategoriya</label>
        <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => (
            <div key={cat.id} onClick={() => setCategory(cat.id)} className={`cursor-pointer border rounded-xl py-3 px-2 text-center text-sm font-semibold transition-all ${category === cat.id ? "bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]" : "bg-white/5 border-white/10 text-white/60"}`}>
            {cat.label}
            </div>
        ))}
        </div>
        </div>
        <div>
        <label className="text-sm text-white/60 mb-2 block">Tavsif</label>
        <textarea placeholder="Tavsif..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ccff00]" rows={3} />
        </div>
        </div>
        
        <div className="flex flex-col h-full">
        <label className="text-sm text-white/60 mb-2 block">Mahsulot rasmi</label>
        <div onClick={() => fileInputRef.current?.click()} className="flex-1 min-h-[220px] border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer relative overflow-hidden">
        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFile(e.target.files[0])} className="hidden" accept="image/*" />
        {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-[200px] object-contain rounded-xl" />
        ) : (
            <div className="text-center">
            <UploadCloud size={32} className="text-white/40 mx-auto mb-2" />
            <p className="text-sm font-bold">Rasm yuklash uchun bosing</p>
            </div>
        )}
        </div>
        </div>
        
        <div className="lg:col-span-2 pt-4 border-t border-white/10">
        <button type="submit" disabled={loading} className="w-full bg-[#ccff00] text-black font-extrabold py-4 rounded-xl hover:bg-[#b3e600] transition-colors flex items-center justify-center gap-2 text-lg">
        <Plus size={20} /> Mahsulotni Qo'shish
        </button>
        </div>
        </form>
        </div>
        
        <div className="bg-black/40 border border-white/10 p-8 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold mb-6 text-[#ccff00]">Mavjud mahsulotlar ({products.length})</h3>
        {products.length === 0 ? (
            <p className="text-white/50 text-center py-8">Hozircha mahsulotlar yo'q.</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <div key={product.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col relative group">
                <div className="w-full aspect-square bg-white/5 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                {product.image ? (
                    <img src={product.image} alt={product.title} className="object-contain w-full h-full p-2" />
                ) : (
                    <ImageIcon className="text-white/20" size={48} />
                )}
                </div>
                <h4 className="font-bold text-base line-clamp-1">{product.title}</h4>
                <p className="text-[#ccff00] font-extrabold text-lg mt-1">${product.price}</p>
                <button onClick={() => handleDelete(product.id)} className="mt-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold py-2 px-3 rounded-lg border border-red-500/20 transition-all">
                O'chirish
                </button>
                </div>
            ))}
            </div>
        )}
        </div>
        </div>
    );
}

// ================= ASOSIY ADMIN PANEL =================
export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
    
    return (
        <div className="min-h-screen bg-[#05130f] text-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 bg-black/40 p-4 rounded-2xl border border-white/10 shadow-xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
        <span className="text-[#ccff00]">NAQTOL</span> ADMIN
        </h1>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
        <button onClick={() => setActiveTab("orders")} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${activeTab === "orders" ? "bg-[#ccff00] text-black shadow" : "text-white/60 hover:text-white"}`}>
        <ShoppingBag size={18} /> Buyurtmalar
        </button>
        <button onClick={() => setActiveTab("products")} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${activeTab === "products" ? "bg-[#ccff00] text-black shadow" : "text-white/60 hover:text-white"}`}>
        <Package size={18} /> Mahsulotlar
        </button>
        </div>
        </div>
        
        <div className="min-h-[60vh]">
        {activeTab === "orders" ? <OrdersView /> : <ProductsView />}
        </div>
        </div>
        </div>
    );
}