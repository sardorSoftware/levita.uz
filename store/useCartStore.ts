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
    clearCart: () => void; // Buyurtma berilgach savatchani tozalash uchun
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
                
                const addQuantity = newItem.quantity > 0 ? newItem.quantity : 1;
                
                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === newItem.id 
                        ? { ...item, quantity: item.quantity + addQuantity } 
                        : item
                    ),
                    isOpen: true, // Mahsulot qo'shilganda savatcha avtomatik ochiladi
                });
            } else {
                set({ 
                    items: [...currentItems, { ...newItem, quantity: addQuantity }], 
                    isOpen: true 
                });
            }
        },
        
        removeItem: (id) => set({ 
            items: get().items.filter((item) => item.id !== id) 
        }),
        
        updateQuantity: (id, quantity) => set({
            items: get().items.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
    }),
    
    clearCart: () => set({ items: [] }), // Savatchani to'liq bo'shatish
    
    getTotal: () => get().items.reduce(
        (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0
    ),
}),
{
    name: 'levita-cart-storage', // Loyiha nomiga moslandi ('levita-store')
}
)
);