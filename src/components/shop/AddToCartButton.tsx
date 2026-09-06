"use client";

import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartProps {
    product: Product;
}

export const AddToCartButton = ({ product }: AddToCartProps) => {
    const { addItem } = useCartStore();
    const [added, setAdded] = useState(false);
    
    const handleAdd = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };
    
    return (
        <button
        onClick={handleAdd}
        disabled={added}
        className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            added 
            ? "bg-green-500 text-white" 
            : "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 cursor-pointer"
            }`}
            >
            {added ? (
                <>
                <Check className="w-5 h-5" /> Savatga qo'shildi
                </>
            ) : (
                <>
                <ShoppingBag className="w-5 h-5" /> Savatga qo'shish
                </>
            )}
            </button>
        );
    };