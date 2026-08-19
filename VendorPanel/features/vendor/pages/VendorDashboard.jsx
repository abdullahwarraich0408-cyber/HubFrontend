"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Pill,
  CurrencyDollar,
  Warning,
  Clock,
  Plus,
  Storefront,
  MagnifyingGlass,
  ShoppingCart,
  Medal,
} from "@phosphor-icons/react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import Link from "next/link";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { useVendorProfile, useVendorDashboardStats, useSearchVendorProducts } from "@/lib/hooks/useApi";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { VendorNotificationInbox } from "@/shared/notifications/NotificationInbox";
import { MetricCard } from "@/shared/components/MetricCard";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatPkr, formatDate, formatToday } from "@/lib/format";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

function cleanTrend(value) {
  return String(value || "").replace(/^[↑↓]\s*/, "");
}

export function VendorDashboard() {
  const { data: vendorProfile } = useVendorProfile();
  const { data: stats, isLoading } = useVendorDashboardStats();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const { data: searchResults = [] } = useSearchVendorProducts(debouncedSearch);

  const comparisons = stats?.comparisons || {};
  const chartData = stats?.monthlyPerformance?.length ? stats.monthlyPerformance : [];
  const recentOrders = stats?.recentOrders || [];
  const lowStockAlerts = stats?.lowStockAlerts || [];
  const expiringSoon = stats?.expiringSoon || [];
  const prescriptionQueue = stats?.prescriptionQueue || [];
  const earnings = stats?.earnings || {};

  const emptyPharmacy = useMemo(
    () => !isLoading && !(stats?.activeProducts || stats?.totalOrders),
    [isLoading, stats]
  );

  return (
    <motion.div className="flex flex-col gap-6 max-w-[1440px] mx-auto w-full" variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[16px] border border-neutral-200 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full icon-box-light flex items-center justify-center shrink-0">
            <Storefront size={24} className="text-brand-primary" weight="fill" />
          </div>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink-headline leading-tight">
              Welcome back, {vendorProfile?.business_name || "Vendor"}
            </h1>
            <p className="text-neutral-500 text-sm md:text-base">{formatToday()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="hidden md:flex items-center gap-2 px-4 h-[46px] bg-neutral-100 rounded-[8px] border border-neutral-200 relative">
            <MagnifyingGlass size={18} className="text-neutral-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="bg-transparent border-none outline-none text-sm text-neutral-700 placeholder:text-neutral-500 w-48"
              aria-label="Search products"
            />
            {debouncedSearch && searchResults.length > 0 ? (
              <div className="absolute left-0 top-full mt-2 w-[320px] bg-white border border-neutral-200 rounded-[12px] shadow-xl z-30 overflow-hidden">
                {searchResults.slice(0, 6).map((product) => (
                  <Link key={product.id} href={partnerRoutes.vendor.product(product.id)} className="block px-4 py-3 text-sm hover:bg-neutral-50">
                    <p className="font-semibold text-ink-headline">{product.name}</p>
                    <p className="text-xs text-neutral-500">{product.sku || product.generic_name || product.category}</p>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <VendorNotificationInbox />
          <Link href={partnerRoutes.vendor.productsNew}>
            <button type="button" className="flex items-center gap-2 px-4 h-[46px] bg-brand-primary text-white text-sm font-semibold rounded-[8px] hover:bg-brand-dark transition-colors">
              <Plus size={18} weight="bold" />
              <span className="hidden sm:inline">New Product</span>
            </button>
          </Link>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 7 }).map((_, index) => (
            <MetricCard key={index} loading />
          ))}
        </div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <MetricCard title="Total Revenue" value={formatPkr(stats?.totalRevenue)} trend={cleanTrend(comparisons.totalRevenue)} positive={comparisons.totalRevenuePositive !== false} icon={CurrencyDollar} />
          <MetricCard title="Orders Today" value={stats?.ordersToday || 0} trend={cleanTrend(comparisons.ordersToday)} positive={comparisons.ordersTodayPositive !== false} icon={ShoppingCart} color="var(--color-status-info)" />
          <MetricCard title="Active Products" value={stats?.activeProducts || 0} trend={cleanTrend(comparisons.activeProducts)} positive icon={Pill} color="var(--color-status-success)" />
          <MetricCard title="Low Stock" value={stats?.lowStock || 0} trend={cleanTrend(comparisons.lowStock)} positive={!stats?.lowStock} icon={Warning} color="var(--color-status-danger)" />
          <MetricCard title="RX Acceptance" value={`${stats?.performance?.prescriptionAcceptanceRate || 0}%`} trend={cleanTrend(comparisons.rxAcceptance)} positive={(stats?.performance?.prescriptionAcceptanceRate || 0) >= 70} icon={Medal} color="var(--color-rating)" />
          <MetricCard title="Avg Response" value={stats?.performance?.averageResponseLabel || "0 min"} trend={cleanTrend(comparisons.avgResponse)} positive={(stats?.performance?.averageResponseMinutes || 0) <= 30} icon={Clock} color="var(--color-status-info)" />
          <MetricCard title="Net Earnings" value={formatPkr(earnings.net || 0)} trend={cleanTrend(comparisons.netEarnings) || "after fees"} positive icon={CurrencyDollar} color="var(--color-status-success)" />
        </motion.div>
      )}

      {emptyPharmacy ? (
        <div className="bg-white border border-neutral-200 rounded-[16px] p-8 text-center">
          <p className="font-semibold text-ink-headline">Add your first product to start selling on Medzoos.</p>
          <Link href={partnerRoutes.vendor.productsNew} className="inline-block mt-3 text-sm font-semibold text-brand-primary hover:underline">
            Add Product
          </Link>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[16px] border border-neutral-200 p-6">
          <h3 className="font-heading text-xl font-bold text-ink-headline">Sales Overview</h3>
          <p className="text-neutral-500 text-sm mb-4">Revenue trend for the last six months</p>
          <div className="min-h-[260px]">
            {chartData.length === 0 ? (
              <div className="h-[260px] flex items-center justify-center text-sm text-neutral-500">No sales data yet for your store.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-neutral-200)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-neutral-500)" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-neutral-500)" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-brand-primary)" strokeWidth={3} fill="var(--color-brand-light)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-[16px] border border-neutral-200 p-6">
          <h3 className="font-heading text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink href={partnerRoutes.vendor.productsNew} label="Add Product" />
            <QuickLink href={partnerRoutes.vendor.inventory} label="Update Stock" />
            <QuickLink href={partnerRoutes.vendor.prescriptionOrders} label="Review Prescriptions" />
            <QuickLink href={`${partnerRoutes.vendor.orders}?status=NEW`} label="View Pending Orders" />
          </div>
        </motion.div>
      </div>

      <DashboardTable
        title="Recent Orders"
        href={partnerRoutes.vendor.orders}
        headers={["Order", "Customer", "Items", "Amount", "Status", "Time"]}
        empty="No orders yet for your store."
        rows={recentOrders.map((order) => [
          order.order_number || String(order.id).slice(0, 8),
          order.customer,
          order.items,
          formatPkr(order.amount),
          <StatusBadge key={order.id} status={order.status} kind="order" />,
          formatDate(order.created_at, true),
        ])}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MiniList
          title="Low Stock Alerts"
          empty="No low stock products."
          items={lowStockAlerts.map((item) => ({ id: item.id, title: item.name, meta: `${item.stock} left · alert at ${item.threshold}` }))}
          href={partnerRoutes.vendor.inventory}
        />
        <MiniList
          title="Expiring Soon"
          empty="No batches expiring soon."
          items={expiringSoon.map((item) => ({ id: item.id, title: item.product, meta: `${item.quantity} units · ${formatDate(item.expiry_date)}` }))}
          href={partnerRoutes.vendor.batches}
        />
        <MiniList
          title="Prescription Queue"
          empty="No prescription requests awaiting review."
          items={prescriptionQueue.map((item) => ({ id: item.id, title: item.patient, meta: `${item.items} items · ${item.status}` }))}
          href={partnerRoutes.vendor.prescriptionOrders}
        />
      </div>
    </motion.div>
  );
}

function QuickLink({ href, label }) {
  return (
    <Link href={href} className="rounded-[12px] border border-neutral-200 px-3 py-4 text-center text-sm font-semibold hover:bg-neutral-50">
      {label}
    </Link>
  );
}

function DashboardTable({ title, href, headers, rows, empty }) {
  return (
    <div className="bg-white rounded-[16px] border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-heading text-xl font-bold">{title}</h3>
        <Link href={href} className="text-sm font-semibold text-brand-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              {headers.map((header) => (
                <th key={header} className="py-4 px-6 text-xs uppercase tracking-wider text-neutral-500 font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="py-8 text-center text-sm text-neutral-500">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((cells, index) => (
                <tr key={index} className="hover:bg-neutral-50/50">
                  {cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-4 px-6 text-sm">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniList({ title, items, empty, href }) {
  return (
    <div className="bg-white rounded-[16px] border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold">{title}</h3>
        <Link href={href} className="text-xs font-semibold text-brand-primary">
          View
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">{empty}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id}>
              <p className="text-sm font-semibold text-ink-headline">{item.title}</p>
              <p className="text-xs text-neutral-500">{item.meta}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
