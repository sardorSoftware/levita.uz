"use client";

import { Tag, Copy, Check } from "lucide-react";
import { useState } from "react";

export const PromoBanner = () => {
    const [copied, setCopied] = useState(false);
    const promoCode = "NAQTOL2026";
    
    const handleCopy = () => {
        navigator.clipboard.writeText(promoCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <div className="w-full bg-primary text-white rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-lg shadow-primary/20">
        <div className="relative z-10 flex flex-col justify-between h-full max-w-[75%]">
        <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold w-max mb-2">
        <Tag className="w-3 h-3" /> MAXSUS TAKLIF
        </span>
        
        <h2 className="text-xl sm:text-2xl font-bold leading-tight">
        Yangi aksessuarlarga 15% chegirma!
        </h2>
        
        <div className="flex items-center gap-2 mt-2">
        <p className="text-xs sm:text-sm text-white/90">
        Promokod:
        </p>
        <button 
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 font-mono font-bold text-white bg-black/20 hover:bg-black/30 px-2 py-1 rounded-lg transition-colors cursor-pointer"
        title="Nusxalash"
        >
        <span>{promoCode}</span>
        {copied ? (
            <Check className="w-3.5 h-3.5 text-green-300" />
        ) : (
            <Copy className="w-3.5 h-3.5 opacity-80" />
        )}
        </button>
        </div>
        </div>
        
        {/* Dekorativ orqa fon doiralari */}
        <div className="absolute -right-6 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-28 h-28 bg-white/10 rounded-full flex items-center justify-center font-black text-4xl text-white/20 select-none">
        %
        </div>
        </div>
    );
};