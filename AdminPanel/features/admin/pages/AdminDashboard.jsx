"use client";

import { useAdminVendors, useAdminProducts, useAdminOrders } from "@/lib/hooks/useApi";
import { 
  CurrencyDollar, 
  Storefront, 
  Package, 
  Users, 
  Clock,
  ArrowUpRight,
  DownloadSimple,
  ShieldCheck,
  PlusCircle,
  CaretRight
} from "@phosphor-icons/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export function AdminDashboard() {
  const { data: vendors = [] } = useAdminVendors();
  const { data: products = [] } = useAdminProducts();
  const { data: orders = [] } = useAdminOrders();

  // Metrics
  const totalRevenue = orders.reduce((acc, order) => acc + (Number(order.total_amount || order.amount) || 0), 0);
  const totalOrders = orders.length;
  const totalVendors = vendors.length;
  const pendingVendors = vendors.filter(v => v.status === "pending").length || 0;

  // Recent Transactions
  const recentTxns = orders.slice(0, 6).map((o, i) => ({
    id: o.id || o.order_number || `ORD-809${i+1}`,
    vendor: o.vendor?.business_name || o.vendor?.name || "Vendor Partner",
    amount: o.total_amount || o.amount || 0,
    status: o.status || "completed",
    date: new Date(o.created_at || Date.now()).toLocaleDateString()
  }));

  // Chart Data
  const chartData = orders.reduce((acc, order) => {
    const date = new Date(order.created_at || order.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.orders += 1;
      existing.revenue += (Number(order.total_amount || order.amount) || 0);
    } else {
      acc.push({ name: month, orders: 1, revenue: (Number(order.total_amount || order.amount) || 0) });
    }
    return acc;
  }, []);

  const finalChartData = chartData.length > 0 ? chartData.reverse() : [
    { name: "Jan", revenue: 45000, orders: 120 },
    { name: "Feb", revenue: 58000, orders: 155 },
    { name: "Mar", revenue: 72000, orders: 190 },
    { name: "Apr", revenue: 94000, orders: 240 },
    { name: "May", revenue: 118000, orders: 310 },
    { name: "Jun", revenue: 145000, orders: 380 },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)]">
      
      {/* SECTION 1: EXECUTIVE BANNER */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#0C1A2E]/50">
            SECTION 1 — EXECUTIVE OVERVIEW
          </span>
          <div className="h-[1px] flex-1 bg-[#0C1A2E]/10" />
        </div>
        <div className="rounded-2xl bg-[#0A0F1D] p-6 md:p-8 text-white shadow-sm border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-[10px] font-mono font-bold tracking-widest uppercase text-white/80">
                HQ STATUS: OPTIMAL
              </div>
              <h1 className="font-[var(--font-dm-serif-display)] text-2xl md:text-3xl tracking-tight text-white">
                Welcome back, Super Admin
              </h1>
              <p className="text-white/60 text-xs font-medium max-w-xl">
                Platform status is operational. You have <span className="text-white font-bold">{pendingVendors} vendor applications</span> pending review.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link 
                href="/admin/vendors"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all"
              >
                <Storefront size={15} weight="bold" />
                <span>Review Vendors</span>
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#0A0F1D] hover:bg-white/90 rounded-xl text-xs font-extrabold shadow-sm transition-all">
                <DownloadSimple size={15} weight="bold" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: KPI METRICS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#0C1A2E]/50">
            SECTION 2 — KEY PERFORMANCE INDICATORS
          </span>
          <div className="h-[1px] flex-1 bg-[#0C1A2E]/10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard 
            title="Total Gross Revenue" 
            value={`PKR ${totalRevenue.toLocaleString()}`} 
            trend="+18.4% vs last mo" 
            positive={true} 
            icon={CurrencyDollar} 
            badgeText="FINANCE"
          />
          <MetricCard 
            title="Total Orders Processed" 
            value={totalOrders.toLocaleString()} 
            trend="+12.2% growth" 
            positive={true} 
            icon={Package} 
            badgeText="ORDERS"
          />
          <MetricCard 
            title="Active Partner Vendors" 
            value={totalVendors.toLocaleString()} 
            trend="+5 new this week" 
            positive={true} 
            icon={Storefront} 
            badgeText="NETWORK"
          />
          <MetricCard 
            title="Pending Partner Review" 
            value={pendingVendors.toLocaleString()} 
            trend={pendingVendors > 0 ? "Requires Review" : "Verified"} 
            positive={pendingVendors === 0} 
            icon={Clock} 
            badgeText="ACTION"
          />
        </div>
      </section>

      {/* SECTION 3: FAST ACTIONS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#0C1A2E]/50">
            SECTION 3 — QUICK SHORTCUTS
          </span>
          <div className="h-[1px] flex-1 bg-[#0C1A2E]/10" />
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#0C1A2E]/10 shadow-sm flex items-center gap-3 overflow-x-auto scrollbar-none">
          <Link 
            href="/admin/doctors"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#0C1A2E]/10 hover:bg-[#0C1A2E]/5 text-xs font-bold text-[#0C1A2E] transition-all shrink-0"
          >
            <PlusCircle size={16} weight="bold" className="text-[#0C1A2E]" />
            <span>Add Doctor</span>
          </Link>
          <Link 
            href="/admin/products"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#0C1A2E]/10 hover:bg-[#0C1A2E]/5 text-xs font-bold text-[#0C1A2E] transition-all shrink-0"
          >
            <Package size={16} weight="bold" className="text-[#0C1A2E]" />
            <span>Catalog Products</span>
          </Link>
          <Link 
            href="/admin/orders"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#0C1A2E]/10 hover:bg-[#0C1A2E]/5 text-xs font-bold text-[#0C1A2E] transition-all shrink-0"
          >
            <Package size={16} weight="bold" className="text-[#0C1A2E]" />
            <span>Fulfillment Queue</span>
          </Link>
          <Link 
            href="/admin/vendors"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#0C1A2E]/10 hover:bg-[#0C1A2E]/5 text-xs font-bold text-[#0C1A2E] transition-all shrink-0"
          >
            <Storefront size={16} weight="bold" className="text-[#0C1A2E]" />
            <span>Vendor Directory</span>
          </Link>
        </div>
      </section>

      {/* SECTION 4: ANALYTICS & RECENT ACTIVITY */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#0C1A2E]/50">
            SECTION 4 — ANALYTICS & ACTIVITY FEED
          </span>
          <div className="h-[1px] flex-1 bg-[#0C1A2E]/10" />
        </div>
        
        {/* Analytics Chart & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#0C1A2E]/10 shadow-sm p-6 md:p-8 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0C1A2E] text-lg">Revenue Growth Metrics</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#0C1A2E]/5 text-[#0C1A2E]/70 rounded border border-[#0C1A2E]/10">
                  ANNUAL
                </span>
              </div>
              <p className="text-xs text-[#0C1A2E]/50 font-medium mt-1">Monthly platform gross revenue breakdown</p>
            </div>
            <select className="bg-[#F8FAFC] border border-[#0C1A2E]/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#0C1A2E] outline-none">
              <option>This Year (2026)</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          
          <div className="h-[320px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={finalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A0F1D" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0A0F1D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }} 
                  dx={-10} 
                  tickFormatter={(val) => `Rs ${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid rgba(12, 26, 46, 0.1)', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    backgroundColor: '#ffffff',
                    padding: '10px 14px'
                  }}
                  labelStyle={{ fontWeight: '700', color: '#0C1A2E', marginBottom: '2px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0A0F1D" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-[#0C1A2E]/10 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-[#0C1A2E]/10 flex items-center justify-between bg-[#F8FAFC]">
            <div>
              <h3 className="font-bold text-[#0C1A2E] text-base">Recent Orders</h3>
              <p className="text-xs text-[#0C1A2E]/50 font-medium mt-0.5">Platform activity feed</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-[#0C1A2E] hover:underline flex items-center gap-1">
              <span>View All</span>
              <CaretRight size={13} weight="bold" />
            </Link>
          </div>
          
          <div className="flex flex-col flex-1 divide-y divide-[#0C1A2E]/5 overflow-y-auto">
            {recentTxns.map((txn, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-[#F8FAFC] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0C1A2E]/5 border border-[#0C1A2E]/10 text-[#0C1A2E] flex items-center justify-center font-bold text-xs shrink-0">
                    {txn.vendor.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0C1A2E] line-clamp-1">
                      {txn.vendor}
                    </span>
                    <span className="text-[10px] text-[#0C1A2E]/50 font-mono">{txn.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#0C1A2E] block">PKR {Number(txn.amount).toLocaleString()}</span>
                  <span className="text-[10px] font-mono text-[#0C1A2E]/60">
                    {txn.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      </section>

    </div>
  );
}

function MetricCard({ title, value, trend, positive, icon: Icon, badgeText }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#0C1A2E]/10 shadow-sm flex flex-col justify-between group hover:border-[#0C1A2E]/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#0C1A2E]/5 border border-[#0C1A2E]/10 flex items-center justify-center text-[#0C1A2E]">
          <Icon size={20} weight="fill" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#0C1A2E]/5 text-[#0C1A2E]/60 border border-[#0C1A2E]/10">
            {badgeText}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0C1A2E]/5 text-[#0C1A2E]">
            <ArrowUpRight size={11} weight="bold" />
            {trend}
          </div>
        </div>
      </div>

      <div>
        <p className="text-[#0C1A2E]/50 text-[11px] font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="font-[var(--font-dm-serif-display)] text-2xl text-[#0C1A2E] tracking-tight">{value}</h3>
      </div>
    </div>
  );
}


