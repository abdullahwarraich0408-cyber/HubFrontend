"use client";

import { useAdminCustomers } from "@/lib/hooks/useApi";
import { Users, MagnifyingGlass, UserCircle } from "@phosphor-icons/react";
import { useState } from "react";

export default function AdminCustomersPage() {
  const { data: customers = [], isLoading } = useAdminCustomers();
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(c => 
    (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Customer Management</h1>
          <p className="text-[14px] text-neutral-500 mt-1">View and manage registered users.</p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex justify-between bg-neutral-50">
          <div className="relative w-full sm:w-[320px]">
            <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search by name or email..." 
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
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-neutral-400 font-medium">Loading customers...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-neutral-400 font-medium">No customers found.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E6F4F5] text-[#0B6E72] flex items-center justify-center font-bold">
                          {customer.name?.charAt(0) || <UserCircle size={24} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-ink-headline">{customer.name}</div>
                          <div className="text-xs text-neutral-500 font-mono mt-0.5">ID: ...{customer.id.substring(customer.id.length - 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-neutral-700 font-medium">{customer.email}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{customer.phone || "No phone"}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-neutral-600">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-bold text-[#0B6E72]">
                      {customer.orders?.length || 0}
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
