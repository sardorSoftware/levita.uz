import { prisma } from "@/lib/prisma";
import { Users, Shield, User } from "lucide-react";
import UserRoleSelect from "@/components/admin/UserRoleSelect";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { orders: true }
            }
        }
    });
    
    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-dark flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" /> Mijozlar bazasi
        </h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-xl text-xs font-bold">
        Jami: {users.length} ta
        </span>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-cream text-dark uppercase text-[11px] font-bold border-b border-gray-200">
        <tr>
        <th className="p-4">Mijoz</th>
        <th className="p-4">Telegram ID</th>
        <th className="p-4">Telefon</th>
        <th className="p-4">Buyurtmalar</th>
        <th className="p-4">Rol</th>
        <th className="p-4 text-right">Ro'yxatdan o'tgan sana</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {users.length === 0 ? (
            <tr>
            <td colSpan={6} className="p-8 text-center text-gray-400">
            Mijozlar topilmadi.
            </td>
            </tr>
        ) : (
            users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {u.firstName ? u.firstName[0].toUpperCase() : "U"}
                </div>
                <div>
                <span className="font-semibold text-dark block">
                {u.firstName || "Ism kiritilmagan"} {u.lastName || ""}
                </span>
                <span className="text-xs text-gray-400">
                {u.username ? `@${u.username}` : "Username yo'q"}
                </span>
                </div>
                </td>
                <td className="p-4 font-mono text-xs text-gray-500">
                {u.telegramId ? u.telegramId.toString() : "-"}
                </td>
                <td className="p-4 text-xs font-medium text-dark">
                {u.phone || "Kiritilmagan"}
                </td>
                <td className="p-4">
                <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-bold">
                {u._count.orders} ta
                </span>
                </td>
                <td className="p-4">
                <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    u.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}>
                    {u.role === "ADMIN" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {u.role}
                    </span>
                    <UserRoleSelect userId={u.id} currentRole={u.role} />
                    </div>
                    </td>
                    <td className="p-4 text-right text-xs text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString("uz-UZ")}
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