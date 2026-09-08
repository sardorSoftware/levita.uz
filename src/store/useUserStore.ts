import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: number | string;
    telegramId?: string;
    first_name: string;
    last_name?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    avatar_url?: string;
    avatarUrl?: string;
    phone?: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    updateUser: (partialUser: Partial<User>) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            
            // Butun user obyektini o'rnatish
            setUser: (user) => {
                if (user) {
                    sessionStorage.removeItem("has_logged_out");
                }
                set({ user });
            },
            
            // Faqat ma'lum bir maydonlarni yangilash (masalan, faqat telefon yoki ism)
            updateUser: (partialUser) =>
                set((state) => ({
                user: state.user ? { ...state.user, ...partialUser } : null,
            })),
            
            // Tizimdan chiqish va chiqish statusini saqlash
            logout: () => {
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("has_logged_out", "true");
                }
                set({ user: null });
            },
        }),
        {
            name: "naqtol-user-storage",
        }
    )
);