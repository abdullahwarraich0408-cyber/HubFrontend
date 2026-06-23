"use client";

import { TrendUp, DownloadSimple, CalendarCheck, CurrencyDollar, Pill, Clock } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { useVendorDashboardStats } from "@/lib/hooks/useApi";

export default function VendorReportsPage() {
  const { data: stats, isLoading } = useVendorDashboardStats();

  const handleExport = () => {
    if (!stats) return;
    const lines = [
      "Metric,Value",
      `Total Revenue,${stats.totalRevenue}`,
      `Orders Today,${stats.ordersToday}`,
      `Active Products,${stats.activeProducts}`,
      `Low Stock Items,${stats.lowStock}`,
      "",
      "Top Product,Units Sold,Revenue",
      ...(stats.topProducts || []).map((product) => `"${product.name}",${product.sales},${product.revenue}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendor-sales-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || !stats) {
    return <div className="text-sm text-neutral-500">Loading your reports...</div>;
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">Sales Reports</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Analytics for your pharmacy only.</p>
        </div>
        <Button onClick={handleExport} className="h-[44px] flex items-center gap-2">
          <DownloadSimple size={18} weight="bold" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CalendarCheck} label="Total Orders" value={stats.totalOrders || 0} />
        <StatCard icon={Pill} label="Active Products" value={stats.activeProducts} />
        <StatCard icon={CurrencyDollar} label="Revenue (PKR)" value={stats.totalRevenue.toLocaleString()} />
        <StatCard icon={Clock} label="Low Stock" value={stats.lowStock} />
      </div>

      <div className="bg-white rounded-[16px] border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-200 flex items-center gap-3">
          <TrendUp size={24} className="text-brand-primary" weight="fill" />
          <div>
            <h3 className="text-[18px] font-bold text-ink-headline">Top Performing Products</h3>
            <p className="text-[13px] text-neutral-500">Based on your store&apos;s order history</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[12px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">Units Sold</th>
                <th className="p-4 pr-6 text-right">Revenue (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(stats.topProducts || []).length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-sm text-neutral-500">
                    No sales data yet.
                  </td>
                </tr>
              ) : (
                stats.topProducts.map((product) => (
                  <tr key={product.name} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 pl-6 text-[14px] font-bold text-ink-900">{product.name}</td>
                    <td className="p-4 text-[14px] text-neutral-600">{product.sales}</td>
                    <td className="p-4 pr-6 text-right text-[14px] font-bold text-brand-primary">
                      {Math.round(product.revenue).toLocaleString()}
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

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-[16px] border border-neutral-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-brand-primary">
        <Icon size={20} weight="fill" />
        <span className="font-bold text-[13px] uppercase tracking-wider text-neutral-500">{label}</span>
      </div>
      <div className="text-[28px] font-black text-ink-900">{value}</div>
    </div>
  );
}
