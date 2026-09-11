"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            
            const data = await res.json();
            
            if (data.success) {
                // Cookie middleware tomonidan to'liq o'qilishi uchun to'liq qayta yuklash bilan o'tiladi
                window.location.href = "/admin";
            } else {
                setError(data.error || "Parol noto'g'ri");
            }
        } catch (err) {
            setError("Server bilan aloqa yo'q!");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-xs text-gray-500 mt-1">Kirish uchun parolni kiriting</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin paroli..."
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-sm font-medium"
        />
        </div>
        
        {error && (
            <p className="text-xs text-rose-500 font-medium text-center">{error}</p>
        )}
        
        <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
        {loading ? "Tekshirilmoqda..." : "Kirish"}
        </button>
        </form>
        </div>
        </div>
    );
}