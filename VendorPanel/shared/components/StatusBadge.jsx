"use client";

import { Badge } from "@/shared/components/Badge";
import { APPROVAL_LABELS, LISTING_LABELS, ORDER_LABELS } from "@/lib/vendor/status";

const EXTRA = {
  draft: { bg: "bg-neutral-100", text: "text-neutral-700" },
  pending_review: { bg: "bg-[var(--color-status-warning-bg)]", text: "text-[var(--color-status-warning-text)]" },
  approved: { bg: "bg-[var(--color-status-success-bg)]", text: "text-[var(--color-status-success-text)]" },
  rejected: { bg: "bg-[var(--color-status-danger-bg)]", text: "text-[var(--color-status-danger-text)]" },
  changes_requested: { bg: "bg-[var(--color-status-info-bg)]", text: "text-[var(--color-status-info-text)]" },
  NEW: { bg: "bg-[var(--color-status-warning-bg)]", text: "text-[var(--color-status-warning-text)]" },
  ACCEPTED: { bg: "bg-[var(--color-status-info-bg)]", text: "text-[var(--color-status-info-text)]" },
  PREPARING: { bg: "bg-[var(--color-status-info-bg)]", text: "text-[var(--color-status-info-text)]" },
  READY_FOR_PICKUP: { bg: "bg-[var(--color-status-shipped-bg)]", text: "text-[var(--color-status-shipped-text)]" },
  OUT_FOR_DELIVERY: { bg: "bg-[var(--color-status-shipped-bg)]", text: "text-[var(--color-status-shipped-text)]" },
  LOW_STOCK: { bg: "bg-[var(--color-status-warning-bg)]", text: "text-[var(--color-status-warning-text)]" },
  IN_STOCK: { bg: "bg-[var(--color-status-success-bg)]", text: "text-[var(--color-status-success-text)]" },
};

export function StatusBadge({ status, kind = "generic" }) {
  const raw = String(status || "");
  const label =
    kind === "approval"
      ? APPROVAL_LABELS[raw] || APPROVAL_LABELS[raw.toLowerCase()] || raw
      : kind === "listing"
        ? LISTING_LABELS[raw] || raw
        : kind === "order"
          ? ORDER_LABELS[raw] || ORDER_LABELS[raw.toUpperCase()] || raw
          : raw.replace(/_/g, " ");

  const extra = EXTRA[raw] || EXTRA[raw.toUpperCase()] || EXTRA[raw.toLowerCase()];
  if (extra) {
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${extra.bg} ${extra.text}`}>
        {label}
      </span>
    );
  }
  return <Badge status={raw.toLowerCase().replace(/\s+/g, "")} />;
}
