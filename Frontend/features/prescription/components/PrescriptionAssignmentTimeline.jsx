"use client";

import { Check, Clock, X, Storefront } from "@phosphor-icons/react";

const ACTION_STYLES = {
  offered: { icon: Clock, color: "text-[var(--color-status-warning-text)]", bg: "bg-[var(--color-status-warning-bg)]" },
  accepted: { icon: Check, color: "text-[var(--color-status-success-text)]", bg: "bg-[var(--color-status-success-bg)]" },
  declined: { icon: X, color: "text-[var(--color-status-danger-text)]", bg: "bg-[var(--color-status-danger-bg)]" },
  timeout: { icon: Clock, color: "text-[var(--color-status-danger-text)]", bg: "bg-[var(--color-status-danger-bg)]" },
};

export function PrescriptionAssignmentTimeline({ history = [], assignedVendor, currentVendor }) {
  if (!history.length) {
    return (
      <p className="text-[13px] text-[var(--color-neutral-500)]">
        No pharmacies have been contacted yet. We will notify you when a pharmacy is matched.
      </p>
    );
  }

  const activePharmacy = assignedVendor?.name || currentVendor?.name;

  return (
    <div className="space-y-4">
      {activePharmacy && (
        <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[var(--color-brand-mist)] border border-[var(--color-brand-light)]">
          <Storefront size={20} className="text-[var(--color-brand-primary)]" weight="duotone" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-neutral-500)]">Active pharmacy</p>
            <p className="text-[14px] font-bold text-[var(--color-ink-headline)]">{activePharmacy}</p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-start min-w-max gap-2 pb-1">
          {history.map((entry, index) => {
            const style = ACTION_STYLES[entry.action] || ACTION_STYLES.offered;
            const Icon = style.icon;
            const isLast = index === history.length - 1;

            return (
              <div key={entry.id || `${entry.vendorId}-${index}`} className="flex items-start">
                <div className="w-[120px] sm:w-[140px] shrink-0 rounded-[12px] border border-[var(--color-neutral-200)] bg-[var(--color-surface-subtle)] p-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-2 ${style.bg}`}>
                    <Icon size={13} weight="bold" className={style.color} />
                  </div>
                  <p className="text-[12px] font-bold text-[var(--color-ink-headline)] leading-tight truncate" title={entry.vendorName}>
                    {entry.vendorName}
                  </p>
                  <p className="text-[11px] text-[var(--color-neutral-600)] mt-0.5">{entry.actionLabel}</p>
                  <p className="text-[10px] text-[var(--color-neutral-400)] mt-1">{entry.time}</p>
                </div>
                {!isLast && (
                  <div className="flex items-center h-[52px] px-1 shrink-0">
                    <div className="h-0.5 w-4 bg-[var(--color-neutral-200)]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
