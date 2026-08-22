"use client";

import { useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { PageHeader } from "@/shared/components/PageHeader";
import { MetricCard } from "@/shared/components/MetricCard";
import { Button } from "@/shared/components/Button";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { useVendorSalesReport } from "@/lib/hooks/useApi";
import { formatPkr, formatDate } from "@/lib/format";

const RANGES = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["last_7", "Last 7 Days"],
  ["last_30", "Last 30 Days"],
  ["this_month", "This Month"],
  ["last_month", "Last Month"],
];

export default function SalesReportPage() {
  const [range, setRange] = useState("last_30");
  const { data: report, isLoading } = useVendorSalesReport({ range });
  const kpis = report?.kpis || {};
  const rows = report?.rows || [];

  const exportCsv = () => {
    const lines = [
      "DATE,ORDER,GROSS,DISCOUNT,COMMISSION,PLATFORM FEE,REFUND,NET",
      ...rows.map((row) => [formatDate(row.date), row.order, row.gross, row.discount, row.commission, row.platform_fee, row.refund, row.net].join(",")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendor-sales-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const colors = ["#17618E", "#2563EB", "#F79009", "#079455", "#D92D20"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Report"
        description="Track pharmacy sales, earnings, fees, and product performance."
        actions={<Button onClick={exportCsv} disabled={!rows.length}><DownloadSimple size={16} className="mr-2" /> Export CSV</Button>}
      />
      <div className="flex flex-wrap gap-2">
        {RANGES.map(([value, label]) => (
          <button key={value} type="button" onClick={() => setRange(value)} className={`h-10 px-3 rounded-lg text-sm font-semibold border ${range === value ? "bg-brand-primary text-white border-brand-primary" : "bg-white"}`}>
            {label}
          </button>
        ))}
      </div>

      {isLoading ? <TableSkeleton /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Gross Sales" value={formatPkr(kpis.gross)} />
            <MetricCard title="Net Earnings" value={formatPkr(kpis.net)} />
            <MetricCard title="Orders" value={kpis.orders || 0} />
            <MetricCard title="Average Order Value" value={formatPkr(kpis.averageOrderValue)} />
            <MetricCard title="Refunds" value={formatPkr(kpis.refunds)} />
            <MetricCard title="Platform Fees" value={formatPkr(kpis.platformFees)} />
            <MetricCard title="Commission" value={formatPkr(kpis.commission)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Revenue Trend">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={report?.revenueTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="revenue" stroke="#17618E" fill="#DEEEF9" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Orders Trend">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={report?.ordersTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="orders" stroke="#2563EB" fill="#DBEAFE" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Sales by Category">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={report?.salesByCategory || []}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#17618E" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Order Status Breakdown">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={report?.statusBreakdown || []} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {(report?.statusBreakdown || []).map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="bg-white rounded-[16px] border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-neutral-50 text-[12px] font-bold text-neutral-500 uppercase">
                  <th className="p-4 pl-6">Date</th>
                  <th className="p-4">Order</th>
                  <th className="p-4">Gross</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Commission</th>
                  <th className="p-4">Platform fee</th>
                  <th className="p-4">Refund</th>
                  <th className="p-4 pr-6">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.length === 0 ? (
                  <tr><td colSpan={8} className="p-10 text-center text-neutral-500">No sales in this period.</td></tr>
                ) : rows.map((row) => (
                  <tr key={row.order_id} className="h-[58px]">
                    <td className="p-4 pl-6">{formatDate(row.date)}</td>
                    <td className="p-4">{row.order}</td>
                    <td className="p-4">{formatPkr(row.gross)}</td>
                    <td className="p-4">{formatPkr(row.discount)}</td>
                    <td className="p-4">{formatPkr(row.commission)}</td>
                    <td className="p-4">{formatPkr(row.platform_fee)}</td>
                    <td className="p-4">{formatPkr(row.refund)}</td>
                    <td className="p-4 pr-6 font-bold">{formatPkr(row.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-[16px] border p-6">
      <h3 className="font-heading font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}
