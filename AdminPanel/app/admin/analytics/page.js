"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminOrders,
  useAdminCustomers,
  useAdminVendors,
  useVendorPerformance,
} from "@/lib/hooks/useApi";
import {
  ChartLineUp,
  Users,
  Storefront,
  Package,
  ArrowRight,
  ArrowsClockwise,
  UserCircle,
  ShieldCheck,
  CalendarCheck,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { toast } from "sonner";
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
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useAdminOrders();
  const { data: customers = [], isLoading: customersLoading, refetch: refetchCustomers } = useAdminCustomers();
  const { data: vendors = [], isLoading: vendorsLoading, refetch: refetchVendors } = useAdminVendors();
  const { data: performance = [], isLoading: performanceLoading, refetch: refetchPerformance } = useVendorPerformance();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const isLoading = ordersLoading || customersLoading || vendorsLoading || performanceLoading;

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        refetchOrders(),
        refetchCustomers(),
        refetchVendors(),
        refetchPerformance(),
        queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-customers"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-vendors"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-vendor-performance"] }),
      ]);
      toast.success("Analytics & reports data refreshed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh analytics");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Chart Data Preparation
  const chartData = orders.reduce((acc, order) => {
    const date = new Date(order.created_at || order.date || Date.now());
    const month = date.toLocaleString("default", { month: "short" });
    const existing = acc.find((item) => item.name === month);
    if (existing) {
      existing.orders += 1;
    } else {
      acc.push({ name: month, orders: 1 });
    }
    return acc;
  }, []);
  const finalChartData = chartData.reverse().slice(0, 6);

  // Recent 5 Customers
  const recentCustomers = customers.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#082B3F] tracking-tight flex items-center gap-3">
            <ChartLineUp size={32} className="text-[#0FA7E3]" weight="fill" />
            Analytics & Reports
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Platform-wide performance metrics, registered patients/customers, and vendor throughput insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-60 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowsClockwise
              size={16}
              weight="bold"
              className={isRefreshing ? "animate-spin text-[#0FA7E3]" : ""}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards linked to respective sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Customers */}
        <Link
          href="/admin/customers"
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#0FA7E3]/60 shadow-sm hover:shadow-md transition-all group block relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#082B3F] group-hover:bg-[#0FA7E3] group-hover:text-white transition-colors flex items-center justify-center">
                <Users size={26} weight="fill" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Customers</p>
                <h3 className="text-2xl font-extrabold text-[#082B3F] mt-0.5">
                  {isLoading ? "..." : customers.length}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#0FA7E3] group-hover:translate-x-1 transition-transform">
              <span>View Directory</span>
              <ArrowRight size={14} weight="bold" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-100 pt-2 flex items-center gap-1">
            <span>Click to manage registered user accounts & health profiles</span>
          </p>
        </Link>

        {/* Active Vendors */}
        <Link
          href="/admin/vendors"
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500/60 shadow-sm hover:shadow-md transition-all group block relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
                <Storefront size={26} weight="fill" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Pharmacies</p>
                <h3 className="text-2xl font-extrabold text-[#082B3F] mt-0.5">
                  {isLoading ? "..." : vendors.length}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>View Pharmacies</span>
              <ArrowRight size={14} weight="bold" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-100 pt-2 flex items-center gap-1">
            <span>Click to manage pharmacy network and verification</span>
          </p>
        </Link>

        {/* Total Orders */}
        <Link
          href="/admin/orders"
          className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-500/60 shadow-sm hover:shadow-md transition-all group block relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center justify-center">
                <Package size={26} weight="fill" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Orders</p>
                <h3 className="text-2xl font-extrabold text-[#082B3F] mt-0.5">
                  {isLoading ? "..." : orders.length}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>View Orders</span>
              <ArrowRight size={14} weight="bold" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-100 pt-2 flex items-center gap-1">
            <span>Click to view order fulfillment, payouts, and shipping</span>
          </p>
        </Link>
      </div>

      {/* Grid: Order Volume Trend & Recent Registered Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#082B3F]">Order Volume Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly order velocity across all fulfillment channels.</p>
            </div>
          </div>
          <div className="h-[320px] w-full">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                Loading chart metrics...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={finalChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    dx={-10}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
                      fontSize: "12px",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#082B3F" }}
                  />
                  <Bar dataKey="orders" fill="#082B3F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Customer Listing Preview (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#082B3F] flex items-center gap-2">
                  <Users size={18} className="text-[#0FA7E3]" weight="bold" />
                  <span>Recent Customers</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Recently registered users on platform.</p>
              </div>
              <Link
                href="/admin/customers"
                className="text-xs font-bold text-[#0FA7E3] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading customers...</div>
              ) : recentCustomers.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No customers registered yet.</div>
              ) : (
                recentCustomers.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#082B3F] flex items-center justify-center font-bold text-xs shrink-0">
                        {c.name?.charAt(0)?.toUpperCase() || <UserCircle size={20} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#082B3F] truncate">{c.name || "Anonymous User"}</p>
                        <p className="text-[11px] text-slate-400 truncate">{c.email}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#082B3F] border border-blue-100">
                        {c.orders?.length || 0} orders
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              href="/admin/customers"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 hover:bg-[#082B3F] text-[#082B3F] hover:text-white text-xs font-bold transition-all border border-slate-200"
            >
              <span>Go to Full Customer Management</span>
              <ArrowSquareOut size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </div>

      {/* Vendor Performance Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#082B3F]">Pharmacy Performance Overview</h3>
          <p className="text-xs text-slate-500 mt-0.5">Prescription responsiveness and operational throughput per pharmacy partner.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Pharmacy</th>
                <th className="py-3 px-4">Rx Acceptance</th>
                <th className="py-3 px-4">Avg Response</th>
                <th className="py-3 px-4">Unread Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {performance.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-xs text-slate-400">
                    No vendor performance metrics available.
                  </td>
                </tr>
              ) : (
                performance.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-xs font-bold text-[#082B3F]">{vendor.business_name}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{vendor.performance?.prescriptionAcceptanceRate || 0}%</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{vendor.performance?.averageResponseMinutes || 0} min</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{vendor.unreadNotifications || 0}</td>
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

