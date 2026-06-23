"use client";

import { useAdminOrders, useAdminCustomers, useAdminVendors } from "@/lib/hooks/useApi";
import { ChartLineUp, Users, Storefront, Package } from "@phosphor-icons/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminAnalyticsPage() {
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();
  const { data: customers = [], isLoading: customersLoading } = useAdminCustomers();
  const { data: vendors = [], isLoading: vendorsLoading } = useAdminVendors();

  const isLoading = ordersLoading || customersLoading || vendorsLoading;

  // Chart Data Preparation
  const chartData = orders.reduce((acc, order) => {
    const date = new Date(order.created_at || order.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.orders += 1;
    } else {
      acc.push({ name: month, orders: 1 });
    }
    return acc;
  }, []);
  const finalChartData = chartData.reverse().slice(0, 6); // Last 6 months

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Analytics & Reports</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Platform performance metrics and data insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[16px] border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0B6E72]/10 text-[#0B6E72] flex items-center justify-center">
              <Users size={24} weight="fill" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">Total Customers</p>
              <h3 className="text-2xl font-bold text-ink-headline">{isLoading ? "..." : customers.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[16px] border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0F9D58]/10 text-[#0F9D58] flex items-center justify-center">
              <Storefront size={24} weight="fill" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">Active Vendors</p>
              <h3 className="text-2xl font-bold text-ink-headline">{isLoading ? "..." : vendors.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[16px] border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center">
              <Package size={24} weight="fill" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold text-ink-headline">{isLoading ? "..." : orders.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
        <div className="mb-6">
          <h3 className="text-[18px] font-bold text-ink-headline">Order Volume Trend</h3>
          <p className="text-[14px] text-neutral-500 mt-1">Number of orders placed per month.</p>
        </div>
        <div className="h-[350px] w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">Loading chart data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finalChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#6b7280" }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#6b7280" }} 
                  dx={-10} 
                />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0C1A2E' }}
                />
                <Bar dataKey="orders" fill="#0B6E72" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
