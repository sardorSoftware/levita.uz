import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
    id: string | number;
    telegramId?: string;
    firstName?: string;
    lastName?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    avatarUrl?: string;
    avatar_url?: string;
    phone?: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    updateUser: (partialUser: Partial<User>) => void;
    logout: () => void;
}

// Maydonlarni (camelCase va snake_case) bir xil formatga keltirish
const normalizeUser = (userData: User | null): User | null => {
    if (!userData) return null;
    
    const firstName = userData.firstName || userData.first_name || "";
    const lastName = userData.lastName || userData.last_name || "";
    const avatarUrl = userData.avatarUrl || userData.avatar_url || "";
    
    return {
        ...userData,
        id: userData.id.toString(),
        telegramId: userData.telegramId?.toString() || "",
        firstName,
        first_name: firstName,
        lastName,
        last_name: lastName,
        avatarUrl,
        avatar_url: avatarUrl,
        username: userData.username || "",
        phone: userData.phone || "",
    };
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            
            // Butun user obyektini o'rnatish va sinxronizatsiya qilish
            setUser: (user) => {
                if (user && typeof window !== "undefined") {
                    sessionStorage.removeItem("has_logged_out");
                }
                const normalized = normalizeUser(user);
                set({ user: normalized });
            },
            
            // Faqat ma'lum bir maydonlarni yangilash
            updateUser: (partialUser) =>
                set((state) => {
                if (!state.user) return { user: null };
                const merged = { ...state.user, ...partialUser };
                return { user: normalizeUser(merged) };
            }),
            
            // Tizimdan chiqish
            logout: () => {
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("has_logged_out", "true");
                }
                set({ user: null });
            },
        }),
        {
            name: "naqtol-user-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);