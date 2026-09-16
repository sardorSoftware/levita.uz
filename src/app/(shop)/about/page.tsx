import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, Headphones, Sparkles } from "lucide-react";

export default function AboutPage() {
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
        <h1 className="text-xl sm:text-2xl font-black text-[#1a1a1c]">Biz haqimizda</h1>
        <p className="text-xs text-gray-400 font-medium">Naqt Ol do'koni va afzalliklarimiz</p>
        </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#FF4D00] font-black text-lg">
        <Sparkles className="w-5 h-5" />
        <span>naqtol.uz</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
        Naqt Ol — zamonaviy texnika, smartfonlar va aksessuarlarni tez hamda qulay tarzda xarid qilish imkonini beruvchi platforma. Biz mijozlarimizga halol va ishonchli xizmat ko'rsatishni maqsad qilganmiz.
        </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF4D00] flex items-center justify-center">
        <Truck className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-sm text-gray-800">Tezkor yetkazib berish</h3>
        <p className="text-xs text-gray-400">Toshkent shahri bo'ylab qisqa fursatda yetkaziladi.</p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF4D00] flex items-center justify-center">
        <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-sm text-gray-800">Kafolatlangan sifat</h3>
        <p className="text-xs text-gray-400">Barcha mahsulotlarimiz rasmiy kafolatga ega.</p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF4D00] flex items-center justify-center">
        <Headphones className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-sm text-gray-800">24/7 Qo'llab-quvvatlash</h3>
        <p className="text-xs text-gray-400">Operatorlarimiz har qanday savolingizga javob beradi.</p>
        </div>
        </div>
        </div>
    );
}