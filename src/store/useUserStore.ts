import { create } from "zustand";
import { persist } from "zustand/middleware";

// User tipini barcha zarur Telegram maydonlari bilan kengayturamiz
export interface User {
    id: number | string;
    telegramId?: string;
    first_name: string;
    last_name?: string;
    username?: string;
    avatar_url?: string;
    phone?: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        {
            name: "naqtol-user-storage",
        }
    )
);