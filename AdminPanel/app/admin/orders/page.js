"use client";

import { useAdminOrders } from "@/lib/hooks/useApi";
import { ShoppingCart, MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(o => 
    (o.id || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.customer?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.vendor?.business_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#0F9D58]/10 text-[#0F9D58] capitalize">Delivered</span>;
      case 'processing':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#2563EB]/10 text-[#2563EB] capitalize">Processing</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#DC2626]/10 text-[#DC2626] capitalize">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#D97706]/10 text-[#D97706] capitalize">{status || 'Pending'}</span>;
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">All Orders</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Global view of all platform transactions.</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex justify-between bg-neutral-50">
          <div className="relative w-full sm:w-[320px]">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search by ID, customer, or vendor..." 
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
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-neutral-400 font-medium">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-neutral-400 font-medium">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 pl-6 text-sm font-mono text-ink-headline">
                      {order.id.substring(0, 8).toUpperCase()}...
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-ink-headline">{order.customer?.name || "Unknown"}</div>
                      <div className="text-xs text-neutral-500">{order.customer?.email}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-700">
                      {order.vendor?.business_name || "Unknown"}
                    </td>
                    <td className="p-4 text-sm font-bold text-[#0B6E72]">
                      PKR {order.total_amount}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-600">
                      {new Date(order.created_at).toLocaleDateString()}
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
