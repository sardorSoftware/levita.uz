export interface User {
    id: string;
    telegramId?: number | string | null;
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    phone?: string | null;
    role?: "USER" | "ADMIN";
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
}

export interface Product {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    oldPrice?: number | null;
    isUsed: boolean;
    inStock: boolean;
    images: string[];          // Prisma modelidagi asosiy massiv
    image?: string | null;     // Eski va bitta rasmli komponentlar uchun ixtiyoriy maydon
    categoryId: string;
    category?: Category;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId?: string | null;
    quantity: number;
    price: number;
    name?: string | null;
    product?: Product | null;
}

export interface Order {
    id: string;
    userId?: string | null;
    total: number;
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    address?: string | null;
    phone: string;
    name?: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    items?: OrderItem[];
    user?: User | null;
}