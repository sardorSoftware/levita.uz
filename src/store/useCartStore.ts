import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartStore {
    items: CartItem[];
    addItem: (product: Product | Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    totalPrice: () => number;
    totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            
            addItem: (product) => {
                set((state) => {
                    const existingIndex = state.items.findIndex((item) => item.id === product.id);
                    if (existingIndex > -1) {
                        const newItems = [...state.items];
                        newItems[existingIndex].quantity += 1;
                        return { items: newItems };
                    }
                    return { items: [...state.items, { ...product, quantity: 1 }] };
                });
            },
            
            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));
            },
            
            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                ),
            }));
        },
        
        clearCart: () => set({ items: [] }),
        
        getTotalPrice: () => {
            return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        
        totalPrice: () => {
            return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        
        totalItems: () => {
            return get().items.reduce((sum, item) => sum + item.quantity, 0);
        },
    }),
    {
        name: "naqtol-cart-storage",
    }
)
);