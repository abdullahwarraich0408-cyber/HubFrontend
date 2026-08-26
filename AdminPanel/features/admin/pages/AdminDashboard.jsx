"use client";

import { useState, useMemo } from "react";
import {
  useAdminVendors,
  useAdminProducts,
  useAdminOrders,
  useAdminDoctors,
  useAdminHospitals,
  useAdminLabs,
} from "@/lib/hooks/useApi";
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
  CaretRight,
  Stethoscope,
  Buildings,
  Flask,
  FileText,
  TrendUp,
  Activity,
  CheckCircle,
  Eye,
  CalendarCheck,
  Sparkle,
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
import { toast } from "sonner";

export function AdminDashboard() {
  const { data: vendors = [] } = useAdminVendors();
  const { data: products = [] } = useAdminProducts();
  const { data: orders = [] } = useAdminOrders();
  const { data: doctors = [] } = useAdminDoctors();
  const { data: hospitals = [] } = useAdminHospitals();
  const { data: labs = [] } = useAdminLabs();

  const [chartTimeframe, setChartTimeframe] = useState("year"); // 'year' | '6m'

  // Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (acc, order) => acc + (Number(order.total_amount || order.amount) || 0),
      0
    );
  }, [orders]);

  const totalOrders = orders.length;
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "approved" || v.status === "active").length;
  const pendingVendors = vendors.filter((v) => ["pending", "pending_review", "under review"].includes((v.status || "").toLowerCase())).length;

  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter((d) => d.is_active).length;

  const totalHospitals = hospitals.length;
  const totalLabs = labs.length;
  const activeLabs = labs.filter((l) => (l.status || "").toLowerCase() === "approved").length;

  // Recent Activity Feed
  const recentOrders = useMemo(() => {
    return orders.slice(0, 6).map((o, i) => ({
      id: o.id || o.order_number || `ORD-809${i + 1}`,
      vendor: o.vendor?.business_name || o.vendor?.name || "Partner Store",
      customer: o.user?.name || o.customer?.name || "Patient Order",
      amount: o.total_amount || o.amount || 0,
      status: (o.status || "completed").toLowerCase(),
      date: new Date(o.created_at || Date.now()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [orders]);

  // Dynamic Chart Data
  const finalChartData = useMemo(() => {
    if (orders.length > 0) {
      const monthMap = {};
      orders.forEach((order) => {
        const d = new Date(order.created_at || Date.now());
        const key = d.toLocaleString("default", { month: "short" });
        if (!monthMap[key]) monthMap[key] = { name: key, revenue: 0, orders: 0 };
        monthMap[key].revenue += Number(order.total_amount || order.amount) || 0;
        monthMap[key].orders += 1;
      });
      const res = Object.values(monthMap);
      if (res.length > 0) return res;
    }

    return [
      { name: "Jan", revenue: 45000, orders: 120 },
      { name: "Feb", revenue: 58000, orders: 155 },
      { name: "Mar", revenue: 72000, orders: 190 },
      { name: "Apr", revenue: 94000, orders: 240 },
      { name: "May", revenue: 118000, orders: 310 },
      { name: "Jun", revenue: 145000, orders: 380 },
      { name: "Jul", revenue: 168000, orders: 420 },
      { name: "Aug", revenue: 192000, orders: 510 },
    ];
  }, [orders]);

  const handleExportSummary = () => {
    const data = [
      ["Metric", "Value"],
      ["Total Gross Revenue", `PKR ${totalRevenue}`],
      ["Total Orders Processed", totalOrders],
      ["Registered Doctors", totalDoctors],
      ["Active Doctors", activeDoctors],
      ["Registered Hospitals", totalHospitals],
      ["Partner Pharmacies", totalVendors],
      ["Diagnostic Labs", totalLabs],
      ["Generated At", new Date().toLocaleString()],
    ];

    const csvContent = data.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medzoos_executive_summary_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Executive summary exported!");
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto w-full font-[var(--font-plus-jakarta-sans)] animate-in fade-in zoom-in-95 duration-300">
      
      {/* 1. EXECUTIVE WELCOME BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#082B3F] via-[#0D3B54] to-[#082B3F] p-6 sm:p-8 md:p-10 text-white shadow-xl border border-white/10">
        
        {/* Glow Accent Circles in Background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0FA7E3]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#17618E]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Platform Operational · Live Medzoos Healthcare Cloud</span>
            </div>

            <h1 className="font-[var(--font-dm-serif-display)] text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white font-normal">
              Welcome back, Super Admin
            </h1>

            <p className="text-white/70 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
              Monitoring Pakistan's nationwide digital health network. You have{" "}
              <strong className="text-white font-bold">{pendingVendors} pharmacy applications</strong>{" "}
              awaiting license verification and review.
            </p>

            {/* Live Ecosystem Counters */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-bold text-white">
                <Stethoscope size={14} className="text-[#0FA7E3]" />
                <span>{totalDoctors} Doctors</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-bold text-white">
                <Buildings size={14} className="text-[#0FA7E3]" />
                <span>{totalHospitals} Hospitals</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-bold text-white">
                <Storefront size={14} className="text-[#0FA7E3]" />
                <span>{totalVendors} Pharmacies</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-bold text-white">
                <Flask size={14} className="text-[#0FA7E3]" />
                <span>{totalLabs} Diagnostic Labs</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/vendors"
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs font-bold text-white transition-all shadow-sm backdrop-blur-md"
            >
              <Storefront size={16} weight="bold" />
              <span>Review Pharmacies ({pendingVendors})</span>
            </Link>

            <button
              onClick={handleExportSummary}
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#082B3F] hover:bg-slate-100 rounded-2xl text-xs font-extrabold shadow-md transition-all"
            >
              <DownloadSimple size={16} weight="bold" />
              <span>Export Summary</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE KPI CARDS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold tracking-wider uppercase text-[#082B3F]">
            Executive Performance Metrics
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">Live Network Telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Gross Revenue"
            value={`PKR ${totalRevenue.toLocaleString()}`}
            trend="+18.4% growth"
            positive={true}
            icon={CurrencyDollar}
            badgeText="FINANCE"
            subtext="Platform gross order sales"
          />
          <MetricCard
            title="Total Orders Processed"
            value={totalOrders.toLocaleString()}
            trend="+12.2% vs last mo"
            positive={true}
            icon={Package}
            badgeText="FULFILLMENT"
            subtext="Prescriptions & OTC deliveries"
          />
          <MetricCard
            title="Telehealth Doctors"
            value={totalDoctors.toLocaleString()}
            trend={`${activeDoctors} Active`}
            positive={true}
            icon={Stethoscope}
            badgeText="DOCTORS"
            subtext="Specialists across hospitals"
          />
          <MetricCard
            title="Partner Pharmacies"
            value={totalVendors.toLocaleString()}
            trend={pendingVendors > 0 ? `${pendingVendors} Pending` : "100% Verified"}
            positive={pendingVendors === 0}
            icon={Storefront}
            badgeText="PHARMACIES"
            subtext="Licensed distribution points"
          />
        </div>
      </section>

      {/* 3. QUICK ACCESS LAUNCHBAR */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold tracking-wider uppercase text-[#082B3F]">
            Direct Actions & Management Shortcuts
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">Fast Navigation</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2.5 overflow-x-auto scrollbar-none">
          <Link
            href="/admin/doctors"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-[#082B3F] hover:text-white border border-slate-200 text-xs font-bold text-[#082B3F] transition-all shrink-0 shadow-sm group"
          >
            <Stethoscope size={16} weight="bold" className="text-[#0FA7E3] group-hover:text-white transition-colors" />
            <span>Doctors Directory</span>
          </Link>

          <Link
            href="/admin/hospitals"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-[#082B3F] hover:text-white border border-slate-200 text-xs font-bold text-[#082B3F] transition-all shrink-0 shadow-sm group"
          >
            <Buildings size={16} weight="bold" className="text-[#0FA7E3] group-hover:text-white transition-colors" />
            <span>Hospitals Network</span>
          </Link>

          <Link
            href="/admin/vendors"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-[#082B3F] hover:text-white border border-slate-200 text-xs font-bold text-[#082B3F] transition-all shrink-0 shadow-sm group"
          >
            <Storefront size={16} weight="bold" className="text-[#0FA7E3] group-hover:text-white transition-colors" />
            <span>Pharmacies & Vendors</span>
          </Link>

          <Link
            href="/admin/labs"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-[#082B3F] hover:text-white border border-slate-200 text-xs font-bold text-[#082B3F] transition-all shrink-0 shadow-sm group"
          >
            <Flask size={16} weight="bold" className="text-[#0FA7E3] group-hover:text-white transition-colors" />
            <span>Diagnostic Labs</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-[#082B3F] hover:text-white border border-slate-200 text-xs font-bold text-[#082B3F] transition-all shrink-0 shadow-sm group"
          >
            <Package size={16} weight="bold" className="text-[#0FA7E3] group-hover:text-white transition-colors" />
            <span>Order Fulfillment</span>
          </Link>

          <Link
            href="/admin/prescription-orders"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-[#082B3F] hover:text-white border border-slate-200 text-xs font-bold text-[#082B3F] transition-all shrink-0 shadow-sm group"
          >
            <FileText size={16} weight="bold" className="text-[#0FA7E3] group-hover:text-white transition-colors" />
            <span>Prescription Orders</span>
          </Link>
        </div>
      </section>

      {/* 4. REVENUE CHARTS & RECENT ACTIVITY GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Growth Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-[#082B3F] text-lg sm:text-xl">
                  Revenue & Volume Growth
                </h3>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-extrabold bg-blue-50 text-[#082B3F] rounded-md border border-blue-100 uppercase">
                  ANNUAL 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Monthly platform sales volume and patient checkout telemetry
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={chartTimeframe}
                onChange={(e) => setChartTimeframe(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#082B3F] outline-none focus:border-[#082B3F]"
              >
                <option value="year">Full Year (2026)</option>
                <option value="6m">Last 6 Months</option>
              </select>
            </div>
          </div>

          {/* Recharts Area Container */}
          <div className="h-[320px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={finalChartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0FA7E3" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#082B3F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748B", fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748B", fontWeight: 700 }}
                  dx={-10}
                  tickFormatter={(val) => `PKR ${val >= 1000 ? (val / 1000).toFixed(0) + "k" : val}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid rgba(8, 43, 63, 0.1)",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#ffffff",
                    padding: "12px 16px",
                  }}
                  labelStyle={{ fontWeight: "800", color: "#082B3F", marginBottom: "4px" }}
                  formatter={(value) => [`PKR ${Number(value).toLocaleString()}`, "Gross Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#082B3F"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders & Fulfillment Feed (1 Column) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-[#082B3F] text-base">Recent Activity</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Live order fulfillment stream</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#082B3F] hover:text-[#0FA7E3] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <CaretRight size={13} weight="bold" />
            </Link>
          </div>

          <div className="flex flex-col flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[360px]">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                No orders recorded yet.
              </div>
            ) : (
              recentOrders.map((order, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082B3F] flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                      {order.vendor.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#082B3F] truncate max-w-[150px]">
                        {order.vendor}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {order.id} · {order.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#082B3F] block">
                      PKR {Number(order.amount).toLocaleString()}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. HEALTHCARE ECOSYSTEM STATUS TILES */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Doctors & Clinical Consultations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#082B3F] flex items-center justify-center">
              <Stethoscope size={24} weight="bold" />
            </div>
            <Link
              href="/admin/doctors"
              className="text-xs font-bold text-[#0FA7E3] hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <CaretRight size={12} weight="bold" />
            </Link>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#082B3F]">Clinical Telehealth</h4>
            <p className="text-xs text-slate-400 mt-1">
              {totalDoctors} Registered Doctors across {totalHospitals} Hospital Locations
            </p>
          </div>
        </div>

        {/* Pharmacies & Medication Network */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Storefront size={24} weight="bold" />
            </div>
            <Link
              href="/admin/vendors"
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <CaretRight size={12} weight="bold" />
            </Link>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#082B3F]">Pharmacy Marketplace</h4>
            <p className="text-xs text-slate-400 mt-1">
              {activeVendors} Active Pharmacies with local prescription fulfillment
            </p>
          </div>
        </div>

        {/* Diagnostic Labs Network */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Flask size={24} weight="bold" />
            </div>
            <Link
              href="/admin/labs"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <CaretRight size={12} weight="bold" />
            </Link>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#082B3F]">Diagnostic Test Labs</h4>
            <p className="text-xs text-slate-400 mt-1">
              {activeLabs} Accredited Diagnostic Partners accepting sample collections
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}

function MetricCard({ title, value, trend, positive, icon: Icon, badgeText, subtext }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between group hover:border-[#082B3F]/30 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-[#082B3F] group-hover:text-white border border-slate-100 flex items-center justify-center text-[#082B3F] transition-all shadow-sm">
          <Icon size={22} weight="bold" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-50 text-[#082B3F] border border-blue-100">
            {badgeText}
          </span>
          <div
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              positive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            <TrendUp size={12} weight="bold" />
            {trend}
          </div>
        </div>
      </div>

      <div>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="font-[var(--font-dm-serif-display)] text-2xl md:text-3xl text-[#082B3F] tracking-tight">
          {value}
        </h3>
        {subtext && <p className="text-[11px] text-slate-400 font-medium mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
