import React from "react";

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    emptyMessage = "Ma'lumotlar topilmadi.",
    onRowClick,
}: DataTableProps<T>) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-cream text-dark uppercase text-[11px] font-bold border-b border-gray-200 tracking-wider">
        <tr>
        {columns.map((col, index) => (
            <th key={index} className={`p-4 ${col.className || ""}`}>
            {col.header}
            </th>
        ))}
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
        {data.length === 0 ? (
            <tr>
            <td colSpan={columns.length} className="p-8 text-center text-gray-400">
            {emptyMessage}
            </td>
            </tr>
        ) : (
            data.map((item) => (
                <tr 
                key={item.id} 
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-gray-50/80" : "hover:bg-gray-50"}`}
                >
                {columns.map((col, colIndex) => {
                    let content: React.ReactNode;
                    if (typeof col.accessor === "function") {
                        content = col.accessor(item);
                    } else {
                        content = item[col.accessor] as React.ReactNode;
                    }
                    
                    return (
                        <td key={colIndex} className={`p-4 ${col.className || ""}`}>
                        {content}
                        </td>
                    );
                })}
                </tr>
            ))
        )}
        </tbody>
        </table>
        </div>
        </div>
    );
}