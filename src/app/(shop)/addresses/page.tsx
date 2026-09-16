"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus, X } from "lucide-react";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [title, setTitle] = useState("");
    const [street, setStreet] = useState("");
    const [home, setHome] = useState("");
    const userId = "test-user-id";
    
    const fetchAddresses = () => {
        fetch(`/api/addresses?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data)) setAddresses(data);
        });
    };
    
    useEffect(() => {
        fetchAddresses();
    }, []);
    
    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/addresses", {
            method: "POST",
            body: JSON.stringify({ userId, title, city: "Toshkent", street, home }),
        });
        setIsOpenModal(false);
        setTitle("");
        setStreet("");
        setHome("");
        fetchAddresses();
    };
    
    return (
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-6">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
        <Link
        href="/"
        className="w-10 h-10 rounded-2xl bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-all shadow-xs"
        >
        <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1a1a1c]">Manzillarim</h1>
        <p className="text-xs text-gray-400 font-medium">Yetkazib berish manzillari</p>
        </div>
        </div>
        <button
        onClick={() => setIsOpenModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#FF4D00] text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-[#e04300] transition-all"
        >
        <Plus className="w-4 h-4" />
        <span>Qo'shish</span>
        </button>
        </div>
        
        {addresses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-orange-50 text-[#FF4D00] rounded-2xl flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">Manzillar mavjud emas</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Buyurtma berishni osonlashtirish uchun o'z manzilingizni qo'shing.
            </p>
            </div>
        ) : (
            <div className="space-y-3">
            {addresses.map((addr) => (
                <div key={addr.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
                <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF4D00] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
                </div>
                <div>
                <h4 className="font-bold text-gray-800 text-sm">{addr.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{addr.city}, {addr.street}, {addr.home}</p>
                </div>
                </div>
                </div>
            ))}
            </div>
        )}
        
        {/* Manzil qo'shish modali */}
        {isOpenModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Yangi manzil qo'shish</h3>
            <button onClick={() => setIsOpenModal(false)} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
            </button>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-3">
            <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Manzil nomi (Masalan: Uy, Ishxona)</label>
            <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Uy"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF4D00]"
            />
            </div>
            <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Ko'cha</label>
            <input
            type="text"
            required
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Amir Temur ko'chasi"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF4D00]"
            />
            </div>
            <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Uy / Xonadon raqami</label>
            <input
            type="text"
            value={home}
            onChange={(e) => setHome(e.target.value)}
            placeholder="14-uy, 42-xonadon"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF4D00]"
            />
            </div>
            <button
            type="submit"
            className="w-full py-3.5 bg-[#FF4D00] text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-[#e04300] transition-all mt-2"
            >
            Saqlash
            </button>
            </form>
            </div>
            </div>
        )}
        </div>
    );
}