import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            setIsOpen: (isOpen) => set({ isOpen }),
            addItem: (newItem) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === newItem.id);
                
                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                    isOpen: true, // Qo'shilganda savatcha avtomat ochiladi
                });
            } else {
                set({ items: [...currentItems, { ...newItem, quantity: 1 }], isOpen: true });
            }
        },
        removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
        updateQuantity: (id, quantity) => set({
            items: get().items.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
    }),
    getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}),
{
    name: 'levita-cart-storage',
}
)
);