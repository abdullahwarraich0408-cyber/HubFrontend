"use client";

import { useLabPortalReports } from "@/lib/hooks/usePartnerPortal";

export default function LabReportsPage() {
  const { data: summary, isLoading } = useLabPortalReports();

  if (isLoading) return <div className="text-neutral-500 text-sm">Loading reports...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline">Reports & Analytics</h1>
        <p className="text-[14px] text-neutral-500 mt-1">Revenue and test performance.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[16px] border">
          <p className="text-[12px] text-neutral-500 uppercase font-bold">Total Bookings</p>
          <p className="text-[28px] font-black">{summary?.totalBookings || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-[16px] border">
          <p className="text-[12px] text-neutral-500 uppercase font-bold">Completed</p>
          <p className="text-[28px] font-black">{summary?.completedTests || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-[16px] border">
          <p className="text-[12px] text-neutral-500 uppercase font-bold">Pending Reports</p>
          <p className="text-[28px] font-black">{summary?.pendingReports || 0}</p>
        </div>
      </div>
      <div className="bg-white rounded-[16px] border p-6">
        <h2 className="text-[16px] font-bold mb-4">Top Tests</h2>
        {(summary?.topTests || []).map((t) => (
          <div key={t.name} className="flex justify-between py-3 border-b last:border-0 text-[14px]">
            <span>{t.name}</span>
            <span className="font-semibold">{t.count} bookings · PKR {t.revenue?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
