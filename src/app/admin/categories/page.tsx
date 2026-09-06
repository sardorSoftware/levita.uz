import { prisma } from "@/lib/prisma";
import { FolderTree } from "lucide-react";
import { CategoryModal, DeleteCategoryButton } from "@/components/admin/CategoryModal";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        },
        orderBy: { name: "asc" }
    });
    
    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-dark flex items-center gap-2">
        <FolderTree className="w-5 h-5 text-primary" /> Kategoriyalar
        </h2>
        <CategoryModal />
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-cream text-dark uppercase text-[11px] font-bold border-b border-gray-200">
        <tr>
        <th className="p-4">Nomi</th>
        <th className="p-4">Slug (Havola)</th>
        <th className="p-4">Mahsulotlar soni</th>
        <th className="p-4 text-right">Amallar</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {categories.length === 0 ? (
            <tr>
            <td colSpan={4} className="p-8 text-center text-gray-400">
            Kategoriyalar mavjud emas.
            </td>
            </tr>
        ) : (
            categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-semibold text-dark">
                {category.name}
                </td>
                <td className="p-4 font-mono text-xs text-gray-500">
                /{category.slug}
                </td>
                <td className="p-4">
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-bold">
                {category._count.products} ta
                </span>
                </td>
                <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                <CategoryModal category={category} />
                <DeleteCategoryButton categoryId={category.id} />
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