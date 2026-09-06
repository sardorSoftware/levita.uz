"use client";

import { useState } from "react";

interface CategoryPillsProps {
    onSelect?: (categoryId: string) => void;
}

const categories = [
    { id: "all", name: "Barchasi" },
    { id: "new", name: "Yangi telefonlar" },
    { id: "used", name: "Ishlatilgan telefonlar" },
    { id: "accessories", name: "Aksessuarlar" },
];

export const CategoryPills = ({ onSelect }: CategoryPillsProps) => {
    const [active, setActive] = useState("all");
    
    const handleSelect = (id: string) => {
        setActive(id);
        if (onSelect) {
            onSelect(id);
        }
    };
    
    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
            const isActive = active === cat.id;
            return (
                <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                    ? "bg-dark text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
                    }`}
                    >
                    {cat.name}
                    </button>
                );
            })}
            </div>
        );
    };