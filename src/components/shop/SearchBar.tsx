"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
    value?: string;
    onChange?: (value: string) => void;
}

export const SearchBar = ({ value = "", onChange }: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState(value);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (onChange) {
            onChange(val);
        }
    };
    
    const handleClear = () => {
        setSearchTerm("");
        if (onChange) {
            onChange("");
        }
    };
    
    return (
        <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Mahsulotlarni qidirish..."
        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors shadow-sm"
        />
        
        {searchTerm && (
            <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Tozalash"
            >
            <X className="w-4 h-4" />
            </button>
        )}
        </div>
    );
};