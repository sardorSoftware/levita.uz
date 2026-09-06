"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserRoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
    const [role, setRole] = useState(currentRole);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleChange = async (newRole: string) => {
        setRole(newRole);
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            
            if (!res.ok) throw new Error("Xatolik yuz berdi");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Rolni o'zgartirishda xatolik!");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <select 
        value={role}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="bg-cream border border-gray-200 rounded-lg text-xs p-1.5 text-dark focus:outline-none focus:border-primary disabled:opacity-50 cursor-pointer font-bold"
        >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
        </select>
    );
}