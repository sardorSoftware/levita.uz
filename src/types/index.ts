export interface User {
    id: number | string;
    first_name?: string;
    last_name?: string;
    username?: string;
    phone?: string;
    avatar_url?: string;
    telegramId?: string;
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
    image: string;
    categoryId: string;
    category?: Category;
    createdAt: Date;
    updatedAt: Date;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product?: Product;
}

export interface Order {
    id: string;
    userId: string;
    total: number;
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    address?: string | null;
    phone: string;
    createdAt: Date;
    items?: OrderItem[];
}