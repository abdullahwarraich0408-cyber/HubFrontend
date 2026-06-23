"use client";

import { useAdminOrders } from "@/lib/hooks/useApi";
import { Receipt, CurrencyDollar, ArrowUpRight } from "@phosphor-icons/react";

export default function AdminFinancePage() {
  const { data: orders = [], isLoading } = useAdminOrders();

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered');
  const completedRevenue = completedOrders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Financial & Payouts</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Platform financial ledger and settlements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[16px] border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 font-medium mb-1">Total Platform Revenue</p>
            <h3 className="text-3xl font-bold text-ink-headline">PKR {totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0F9D58]/10 text-[#0F9D58] flex items-center justify-center">
            <CurrencyDollar size={24} weight="fill" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[16px] border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 font-medium mb-1">Realized Revenue (Completed)</p>
            <h3 className="text-3xl font-bold text-ink-headline">PKR {completedRevenue.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0B6E72]/10 text-[#0B6E72] flex items-center justify-center">
            <ArrowUpRight size={24} weight="bold" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-[18px] font-bold text-ink-headline">Transactions Ledger</h3>
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-neutral-400 font-medium">Loading ledger...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-neutral-400 font-medium">No transactions found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 pl-6 text-sm font-mono text-ink-headline">
                      {order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-700">
                      {order.vendor?.business_name || "Unknown Vendor"}
                    </td>
                    <td className="p-4 text-sm font-bold text-[#0B6E72]">
                      PKR {order.total_amount}
                    </td>
                    <td className="p-4 text-sm font-medium capitalize text-neutral-600">
                      {order.status}
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
