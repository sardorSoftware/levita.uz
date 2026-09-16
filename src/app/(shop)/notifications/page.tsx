"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const userId = "test-user-id";
    
    useEffect(() => {
        fetch(`/api/notifications?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data)) setNotifications(data);
        });
    }, []);
    
    return (
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-6">
        <div className="flex items-center gap-3">
        <Link
        href="/"
        className="w-10 h-10 rounded-2xl bg-white border border-gray-100 text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-all shadow-xs"
        >
        <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#1a1a1c]">Bildirishnomalar</h1>
        <p className="text-xs text-gray-400 font-medium">So'nggi xabarlar va aksiyalar</p>
        </div>
        </div>
        
        {notifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-orange-50 text-[#FF4D00] rounded-2xl flex items-center justify-center mx-auto">
            <Bell className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">Bildirishnomalar yo'q</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Yangi aksiyalar va buyurtma holatlari haqida xabarlar shu yerda ko'rsatiladi.
            </p>
            </div>
        ) : (
            <div className="space-y-3">
            {notifications.map((n) => (
                <div key={n.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-1">
                <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-800 text-sm">{n.title}</h4>
                <span className="text-[10px] text-gray-400 font-medium">
                {new Date(n.createdAt).toLocaleDateString()}
                </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}