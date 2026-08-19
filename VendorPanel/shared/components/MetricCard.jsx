"use client";

import { ArrowUpRight, ArrowDownRight } from "@phosphor-icons/react";

export function MetricCard({ title, value, trend, positive = true, icon: Icon, color = "var(--color-brand-primary)", loading = false }) {
  if (loading) {
    return <div className="bg-white p-5 md:p-6 rounded-[16px] border border-neutral-200 shadow-[var(--shadow-card)] h-[140px] animate-pulse" />;
  }

  const trendPositive = positive;
  const trendNeutral = !trend || trend === "—" || trend === "n/a";

  return (
    <div className="bg-white p-5 md:p-6 rounded-[16px] border border-neutral-200 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: `${color}14` }}>
          {Icon ? <Icon size={20} style={{ color }} weight="fill" /> : null}
        </div>
        {trend ? (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
              trendNeutral
                ? "bg-neutral-50 text-neutral-500"
                : trendPositive
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
            }`}
          >
            {trendNeutral ? null : trendPositive ? <ArrowUpRight size={12} weight="bold" /> : <ArrowDownRight size={12} weight="bold" />}
            {trend}
          </div>
        ) : null}
      </div>
      <p className="text-xs md:text-sm text-neutral-500 font-semibold uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-2xl md:text-3xl font-heading font-bold text-ink-headline leading-none">{value}</h4>
    </div>
  );
}
