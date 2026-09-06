import { prisma } from "@/lib/prisma";
import { Plus, Edit, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
    // Bazadan barcha mahsulotlarni kategoriyasi bilan qo'shib olish
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
    
    return (
        <div className="space-y-6">
        {/* Yuqori panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
        type="text"
        placeholder="Mahsulot qidirish..."
        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-dark focus:outline-none focus:border-primary"
        />
        </div>
        <Link 
        href="/admin/products/new"
        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shrink-0 transition-colors cursor-pointer shadow-sm"
        >
        <Plus className="w-4 h-4" /> Yangi qo'shish
        </Link>
        </div>
        
        {/* Mahsulotlar Jadvali */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-cream text-dark uppercase text-[11px] font-bold border-b border-gray-200">
        <tr>
        <th className="p-4">Mahsulot</th>
        <th className="p-4">Kategoriya</th>
        <th className="p-4">Narx (UZS)</th>
        <th className="p-4">Holat</th>
        <th className="p-4 text-right">Amallar</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {products.length === 0 ? (
            <tr>
            <td colSpan={5} className="p-8 text-center text-gray-400">
            Mahsulotlar hali qo'shilmagan.
            </td>
            </tr>
        ) : (
            products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                <div className="relative w-10 h-10 bg-cream rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                <Image
                src={product.image || "/assets/logo.jpg"}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 40px" // Warningni to'g'irlaydigan qator shu yerda qo'shildi
                className="object-contain p-1"
                />
                </div>
                <span className="font-semibold text-dark max-w-[200px] truncate">
                {product.title}
                </span>
                </td>
                <td className="p-4">
                <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                {product.category?.name || "Kategoriyasiz"}
                </span>
                </td>
                <td className="p-4 font-bold text-dark">
                {product.price.toLocaleString()} UZS
                </td>
                <td className="p-4">
                {product.inStock ? (
                    <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-md text-xs font-bold">
                    Omborda bor
                    </span>
                ) : (
                    <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-md text-xs font-bold">
                    Tugagan
                    </span>
                )}
                </td>
                <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                <Link 
                href={`/admin/products/edit/${product.id}`}
                className="p-1.5 text-gray-400 hover:text-primary bg-white hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                >
                <Edit className="w-4 h-4" />
                </Link>
                <DeleteProductButton productId={product.id} />
                </div>
                </td>
                </tr>
            ))
        )}
        </tbody>
        </table>
        </div>
        </div>
        </div>
    );
}