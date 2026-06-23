"use client";

import { useAdminVendors, useAdminProducts, useAdminOrders } from "@/lib/hooks/useApi";
import { 
  CurrencyDollar, 
  Storefront, 
  Package, 
  Users, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  DownloadSimple,
  DotsThree,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Warning
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
import { Badge } from "@/shared/components/Badge";

export function AdminDashboard() {
  const { data: vendors = [] } = useAdminVendors();
  const { data: products = [] } = useAdminProducts();
  const { data: orders = [] } = useAdminOrders();

  // Metrics
  const totalRevenue = orders.reduce((acc, order) => acc + (Number(order.total_amount || order.amount) || 0), 0);
  const totalOrders = orders.length;
  const totalVendors = vendors.length;
  // Fallback to deduping from orders if dedicated customer endpoint isn't connected
  const totalCustomers = new Set(orders.map(o => o.customer?.id || o.customer_id)).size || 0;
  
  const pendingVendors = vendors.filter(v => v.status === "pending").length || 0;

  // Recent Transactions
  const recentTxns = orders.slice(0, 6).map((o, i) => ({
    id: o.id || o.order_number || `ORD-809${i+1}`,
    vendor: o.vendor?.business_name || o.vendor?.name || "Vendor",
    amount: o.total_amount || o.amount,
    status: o.status,
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
  const finalChartData = chartData.reverse();

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-dm-serif-display)] text-3xl md:text-4xl text-[#0C1A2E] tracking-tight mb-2">
            Executive Overview
          </h1>
          <p className="text-[#0C1A2E]/60 text-sm font-medium">
            Real-time platform insights and administrative controls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#0C1A2E]/10 rounded-lg text-sm font-semibold text-[#0C1A2E] hover:bg-[#F6F8FA] transition-colors shadow-sm">
            <span>Last 30 Days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B6E72] hover:bg-[#084F52] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <DownloadSimple size={18} weight="bold" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard 
          title="Total Revenue" 
          value={`PKR ${totalRevenue.toLocaleString()}`} 
          trend="+12.5%" 
          positive={true} 
          icon={CurrencyDollar} 
          iconColor="#0F9D58" 
          iconBg="rgba(15, 157, 88, 0.1)"
        />
        <MetricCard 
          title="Total Orders" 
          value={totalOrders.toLocaleString()} 
          trend="+8.2%" 
          positive={true} 
          icon={Package} 
          iconColor="#0B6E72" 
          iconBg="rgba(11, 110, 114, 0.1)"
        />
        <MetricCard 
          title="Active Vendors" 
          value={totalVendors.toLocaleString()} 
          trend="+3.1%" 
          positive={true} 
          icon={Storefront} 
          iconColor="#B8860B" 
          iconBg="rgba(184, 134, 11, 0.1)"
        />
        <MetricCard 
          title="Pending Approvals" 
          value={pendingVendors.toLocaleString()} 
          trend="2 action needed" 
          positive={false} 
          icon={Clock} 
          iconColor="#D97706" 
          iconBg="rgba(217, 119, 6, 0.1)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#0C1A2E]/10 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-[#0C1A2E] text-lg">Revenue Growth</h3>
              <p className="text-sm text-[#0C1A2E]/50 mt-1">Platform revenue across previous months</p>
            </div>
            <select className="bg-[#F6F8FA] border border-[#0C1A2E]/10 rounded-lg px-3 py-1.5 text-sm font-medium text-[#0C1A2E] outline-none">
              <option>This Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          
          <div className="h-[320px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={finalChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B6E72" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0B6E72" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  tickFormatter={(val) => `Rs ${val / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0C1A2E' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0B6E72" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white rounded-xl border border-[#0C1A2E]/10 shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#0C1A2E]/10 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#0C1A2E] text-lg">Recent Orders</h3>
              <p className="text-sm text-[#0C1A2E]/50 mt-1">Latest platform activity</p>
            </div>
            <Link href="/admin/orders" className="text-sm font-semibold text-[#0B6E72] hover:text-[#084F52]">
              View All
            </Link>
          </div>
          
          <div className="flex flex-col flex-1 overflow-y-auto">
            {recentTxns.map((txn, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border-b border-[#0C1A2E]/5 hover:bg-[#F6F8FA] transition-colors last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E6F4F5] text-[#0B6E72] flex items-center justify-center font-bold text-sm shrink-0">
                    {txn.vendor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0C1A2E] line-clamp-1">{txn.vendor}</p>
                    <p className="text-xs text-[#0C1A2E]/50 font-[var(--font-jetbrains-mono)]">{txn.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#0C1A2E]">PKR {txn.amount}</p>
                  <p className="text-xs text-[#0C1A2E]/50">{txn.date}</p>
                </div>
              </div>
            ))}
            
            {recentTxns.length === 0 && (
              <div className="p-8 text-center text-[#0C1A2E]/40 text-sm">
                No recent transactions found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, positive, icon: Icon, iconColor, iconBg }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#0C1A2E]/10 shadow-sm flex flex-col justify-between group hover:border-[#0B6E72]/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: iconBg, color: iconColor }}>
          <Icon size={24} weight="fill" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${positive ? "bg-[#0F9D58]/10 text-[#0F9D58]" : "bg-[#D97706]/10 text-[#D97706]"}`}>
          {positive ? <ArrowUpRight size={12} weight="bold" /> : <Warning size={12} weight="bold" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[#0C1A2E]/60 text-sm font-semibold mb-1">{title}</p>
        <h3 className="font-[var(--font-dm-serif-display)] text-3xl text-[#0C1A2E]">{value}</h3>
      </div>
    </div>
  );
}
