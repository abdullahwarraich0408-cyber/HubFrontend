"use client";

import { useLabPortalBookings, useLabPortalReports } from "@/lib/hooks/usePartnerPortal";
import { CalendarCheck, Flask, ChartBar, CurrencyCircleDollar } from "@phosphor-icons/react";

export default function LabDashboardPage() {
  const { data: bookings = [] } = useLabPortalBookings();
  const { data: summary } = useLabPortalReports();

  const newOrders = bookings.filter((b) => b.status === "pending").length;
  const running = bookings.filter((b) =>
    ["confirmed", "collector_assigned", "sample_collected", "testing"].includes(b.status)
  ).length;
  const completed = bookings.filter((b) =>
    ["completed", "report_uploaded"].includes(b.status)
  ).length;

  const stats = [
    { label: "New Orders", value: newOrders, icon: CalendarCheck, color: "text-brand-primary" },
    { label: "Running", value: running, icon: Flask, color: "text-status-info" },
    { label: "Completed", value: completed, icon: ChartBar, color: "text-status-success" },
    { label: "Revenue", value: `PKR ${(summary?.revenue || 0).toLocaleString()}`, icon: CurrencyCircleDollar, color: "text-ink-900" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline">Dashboard</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Overview of your lab operations.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-[16px] border border-neutral-200 shadow-sm">
            <div className={`flex items-center gap-2 mb-2 ${stat.color}`}>
              <stat.icon size={20} weight="fill" />
              <span className="font-bold text-[12px] uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-[28px] font-black text-ink-900">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-[16px] border border-neutral-200 p-6">
        <h2 className="text-[16px] font-bold mb-4">Recent Bookings</h2>
        {bookings.slice(0, 5).map((b) => (
          <div key={b.id} className="flex justify-between py-3 border-b border-neutral-100 last:border-0 text-[14px]">
            <span>{b.patient} — {b.test}</span>
            <span className="font-semibold capitalize">{b.status.replace(/_/g, " ")}</span>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-neutral-500 text-sm">No bookings yet.</p>}
      </div>
    </div>
  );
}
