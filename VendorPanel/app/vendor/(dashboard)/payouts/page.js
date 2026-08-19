"use client";

import { PageHeader } from "@/shared/components/PageHeader";
import { MetricCard } from "@/shared/components/MetricCard";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { TableSkeleton } from "@/shared/components/EmptyState";
import { useVendorPayouts } from "@/lib/hooks/useApi";
import { formatPkr, formatDate } from "@/lib/format";

export default function PayoutsPage() {
  const { data, isLoading } = useVendorPayouts();
  const payouts = data?.payouts || [];

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title="Payouts" description="Available balance, pending settlements, and payout history." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Available Balance" value={formatPkr(data?.available)} />
        <MetricCard title="Pending Balance" value={formatPkr(data?.pending)} />
        <MetricCard title="Total Paid" value={formatPkr(data?.totalPaid)} />
        <MetricCard title="Next Payout" value={data?.nextPayout ? formatPkr(data.nextPayout.net_amount || data.nextPayout.amount) : "—"} trend={data?.nextPayout ? formatDate(data.nextPayout.created_at) : "No payouts yet."} />
      </div>
      <div className="bg-white rounded-[16px] border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 text-[12px] font-bold text-neutral-500 uppercase">
              <th className="p-4 pl-6">Payout</th>
              <th className="p-4">Period</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Method</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payouts.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-neutral-500">No payouts yet.</td></tr>
            ) : payouts.map((payout) => (
              <tr key={payout.id} className="h-[62px]">
                <td className="p-4 pl-6 font-semibold">{payout.payout_number || String(payout.id).slice(0, 8)}</td>
                <td className="p-4">{formatDate(payout.period_start)} – {formatDate(payout.period_end)}</td>
                <td className="p-4 font-bold">{formatPkr(payout.net_amount || payout.amount)}</td>
                <td className="p-4"><StatusBadge status={payout.status} /></td>
                <td className="p-4">{payout.method || "Bank transfer"}</td>
                <td className="p-4">{formatDate(payout.paid_at || payout.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
