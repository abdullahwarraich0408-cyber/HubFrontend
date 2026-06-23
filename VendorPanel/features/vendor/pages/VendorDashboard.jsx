"use client";

import { motion } from "framer-motion";
import {
  Pill,
  CurrencyDollar,
  Warning,
  ArrowUpRight,
  ArrowDownRight,
  Medal,
  DownloadSimple,
  Plus,
  DotsThree,
  Storefront,
  TrendUp,
  ChartLine,
  Bell,
  MagnifyingGlass,
  ShoppingCart,
} from "@phosphor-icons/react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Badge } from "@/shared/components/Badge";
import Link from "next/link";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { useVendorProfile, useVendorDashboardStats } from "@/lib/hooks/useApi";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export function VendorDashboard() {
  const { data: vendorProfile } = useVendorProfile();
  const { data: stats, isLoading } = useVendorDashboardStats();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const chartData = stats?.monthlyPerformance?.length ? stats.monthlyPerformance : [];
  const topProducts = stats?.topProducts || [];
  const recentOrders = stats?.recentOrders || [];

  return (
    <motion.div
      className="flex flex-col gap-6 max-w-[1440px] mx-auto w-full p-4 md:p-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[var(--radius-xl)] border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)]"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full icon-box-light flex items-center justify-center shrink-0">
            <Storefront size={24} className="text-[var(--color-brand-primary)]" weight="fill" />
          </div>
          <div>
            <h1 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold text-[var(--color-ink-headline)] leading-tight">
              Welcome back, {vendorProfile?.business_name || "Vendor"}
            </h1>
            <p className="text-[var(--color-neutral-500)] text-sm md:text-base">{today}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--color-neutral-100)] rounded-[var(--radius-md)] border border-[var(--color-neutral-200)]">
            <MagnifyingGlass size={18} className="text-[var(--color-neutral-500)]" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent border-none outline-none text-sm text-[var(--color-neutral-700)] placeholder:text-[var(--color-neutral-500)]"
            />
          </div>
          <button className="p-2 rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] bg-white hover:bg-[var(--color-neutral-100)] transition-colors">
            <Bell size={20} className="text-[var(--color-neutral-600)]" />
          </button>
          <Link href={partnerRoutes.vendor.productsNew}>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-brand-primary)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-brand-dark)] transition-colors shadow-[var(--shadow-card)]">
              <Plus size={18} weight="bold" />
              <span className="hidden sm:inline">New Product</span>
            </button>
          </Link>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="text-sm text-neutral-500">Loading your dashboard...</div>
      ) : (
        <>
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <KPICard
              title="Total Revenue"
              value={`PKR ${(stats?.totalRevenue || 0).toLocaleString()}`}
              trend={stats?.totalRevenue ? "+live" : "0"}
              positive={Boolean(stats?.totalRevenue)}
              icon={CurrencyDollar}
              color="var(--color-brand-primary)"
            />
            <KPICard
              title="Orders Today"
              value={stats?.ordersToday || 0}
              trend="today"
              positive={Boolean(stats?.ordersToday)}
              icon={ShoppingCart}
              color="var(--color-status-info)"
            />
            <KPICard
              title="Active Products"
              value={stats?.activeProducts || 0}
              trend="listed"
              positive
              icon={Pill}
              color="var(--color-status-success)"
            />
            <KPICard
              title="Low Stock"
              value={stats?.lowStock || 0}
              trend={stats?.lowStock ? "alert" : "ok"}
              positive={!stats?.lowStock}
              icon={Warning}
              color="var(--color-status-danger)"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 bg-white rounded-[var(--radius-xl)] border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)] flex flex-col p-6"
            >
              <div className="mb-6">
                <h3 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-ink-headline)]">
                  Sales Performance
                </h3>
                <p className="text-[var(--color-neutral-500)] text-sm">Your monthly revenue and orders</p>
              </div>
              <div className="flex-1 min-h-[300px] w-full">
                {chartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-neutral-500">
                    No sales data yet for your store.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-neutral-200)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-neutral-500)" }} dy={10} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-neutral-500)" }} tickFormatter={(val) => `PKR ${val / 1000}k`} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-neutral-500)" }} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid var(--color-neutral-200)", fontSize: "13px", padding: "12px" }} />
                      <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--color-brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="var(--color-status-info)" strokeWidth={2} dot={{ r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>

            <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6">
              <motion.div variants={itemVariants} className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] border border-[var(--color-neutral-200)] flex flex-col">
                <div className="p-6 border-b border-[var(--color-neutral-200)]">
                  <h3 className="font-[var(--font-heading)] text-lg font-semibold text-[var(--color-ink-headline)]">
                    Top Selling
                  </h3>
                </div>
                <div className="p-4 flex flex-col gap-1">
                  {topProducts.length === 0 ? (
                    <p className="p-4 text-sm text-neutral-500 text-center">No sales yet.</p>
                  ) : (
                    topProducts.map((product) => (
                      <div key={product.name} className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-subtle)] transition-colors">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-[var(--radius-md)] icon-box-light flex items-center justify-center font-bold text-sm">
                            {product.name.charAt(0)}
                          </div>
                          {product.rank <= 3 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-sm border border-[var(--color-neutral-200)] flex items-center justify-center">
                              <Medal size={14} weight="fill" className={product.rank === 1 ? "text-[var(--color-rating)]" : product.rank === 2 ? "text-[var(--color-neutral-500)]" : "text-amber-700"} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[var(--color-ink-headline)] truncate">{product.name}</h4>
                          <p className="text-xs text-[var(--color-neutral-500)]">{product.sales} units sold</p>
                        </div>
                        <div className="text-right text-sm font-bold text-[var(--color-brand-primary)]">
                          PKR {Math.round(product.revenue).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gradient-to-br from-[var(--color-brand-light)] to-[var(--color-brand-primary)] rounded-[var(--radius-xl)] p-6 text-[var(--color-brand-dark)]">
                <h3 className="font-[var(--font-heading)] text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link href={partnerRoutes.vendor.orders}>
                    <button className="flex flex-col items-center gap-2 p-4 bg-white/90 backdrop-blur rounded-[var(--radius-md)] hover:bg-white transition-colors shadow-sm w-full">
                      <ShoppingCart size={24} weight="bold" className="text-[var(--color-brand-primary)]" />
                      <span className="text-sm font-semibold">Orders</span>
                    </button>
                  </Link>
                  <Link href={partnerRoutes.vendor.products}>
                    <button className="flex flex-col items-center gap-2 p-4 bg-white/90 backdrop-blur rounded-[var(--radius-md)] hover:bg-white transition-colors shadow-sm w-full">
                      <Pill size={24} weight="bold" className="text-[var(--color-brand-primary)]" />
                      <span className="text-sm font-semibold">Products</span>
                    </button>
                  </Link>
                  <Link href={partnerRoutes.vendor.reports}>
                    <button className="flex flex-col items-center gap-2 p-4 bg-white/90 backdrop-blur rounded-[var(--radius-md)] hover:bg-white transition-colors shadow-sm w-full">
                      <TrendUp size={24} weight="bold" className="text-[var(--color-brand-primary)]" />
                      <span className="text-sm font-semibold">Analytics</span>
                    </button>
                  </Link>
                  <Link href={partnerRoutes.vendor.settings}>
                    <button className="flex flex-col items-center gap-2 p-4 bg-white/90 backdrop-blur rounded-[var(--radius-md)] hover:bg-white transition-colors shadow-sm w-full">
                      <ChartLine size={24} weight="bold" className="text-[var(--color-brand-primary)]" />
                      <span className="text-sm font-semibold">Settings</span>
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div variants={itemVariants} className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] border border-[var(--color-neutral-200)] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-neutral-200)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-ink-headline)]">Recent Orders</h3>
                <p className="text-[var(--color-neutral-500)] text-sm mt-1">Last orders for your pharmacy only</p>
              </div>
              <Link href={partnerRoutes.vendor.orders} className="text-sm font-semibold text-[var(--color-brand-primary)] hover:underline">
                View All Orders
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-neutral-200)]">
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold">Order ID</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold">Customer</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold">Items</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold">Status</th>
                    <th className="py-4 px-6 text-xs uppercase tracking-wider text-[var(--color-neutral-500)] font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-neutral-200)]">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-neutral-500">
                        No orders yet for your store.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[var(--color-surface-subtle)]/50 transition-colors">
                        <td className="py-4 px-6 text-sm font-bold">{String(order.id).slice(0, 8)}</td>
                        <td className="py-4 px-6 text-sm">{order.customer}</td>
                        <td className="py-4 px-6 text-sm">{order.items} items</td>
                        <td className="py-4 px-6"><Badge status={order.status} /></td>
                        <td className="py-4 px-6 text-right text-sm font-bold">PKR {Number(order.amount || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

function KPICard({ title, value, trend, positive, icon: Icon, color }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-[var(--radius-xl)] border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
          <Icon size={20} style={{ color }} weight="fill" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {positive ? <ArrowUpRight size={12} weight="bold" /> : <ArrowDownRight size={12} weight="bold" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs md:text-sm text-[var(--color-neutral-500)] font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h4 className="text-2xl md:text-3xl font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] leading-none">{value}</h4>
      </div>
    </div>
  );
}
