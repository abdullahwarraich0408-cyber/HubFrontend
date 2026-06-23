"use client";

import { useAdminProducts } from "@/lib/hooks/useApi";
import { Pill, MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useAdminProducts();
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(p => 
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.vendor?.business_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">All Products</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Global catalog moderation and overview.</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex justify-between bg-neutral-50">
          <div className="relative w-full sm:w-[320px]">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search by product or vendor..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[40px] pl-10 pr-4 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-[#0B6E72] focus:ring-1 focus:ring-[#0B6E72]"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Product Name</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-neutral-400 font-medium">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-neutral-400 font-medium">No products found.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="text-sm font-bold text-ink-headline">{product.name}</div>
                      <div className="text-xs text-neutral-500 font-mono mt-0.5">ID: ...{product.id.substring(product.id.length - 8)}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-700">
                      {product.vendor?.business_name || "Unknown"}
                    </td>
                    <td className="p-4 text-sm font-bold text-[#0B6E72]">
                      PKR {product.price}
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-600">
                      {product.stock} units
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-600">
                      {product.category || "—"}
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
