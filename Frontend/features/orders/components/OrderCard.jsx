"use client";

import Link from "next/link";
import {
  Pill,
  Stethoscope,
  Flask,
  CaretRight,
  FileText,
  CalendarBlank,
} from "@phosphor-icons/react";
import { Badge } from "@/shared/components/Badge";

const TYPE_CONFIG = {
  medicines: {
    icon: Pill,
    label: "Medicine Order",
    ring: "ring-[var(--color-brand-primary)]/20",
    iconBg: "bg-[var(--color-brand-mist)]",
    iconColor: "text-[var(--color-brand-primary)]",
  },
  doctor: {
    icon: Stethoscope,
    label: "Doctor Appointment",
    ring: "ring-[var(--color-status-info)]/20",
    iconBg: "bg-[var(--color-status-info-bg)]",
    iconColor: "text-[var(--color-status-info)]",
  },
  lab: {
    icon: Flask,
    label: "Lab Test",
    ring: "ring-emerald-500/20",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  prescription: {
    icon: FileText,
    label: "Prescription Order",
    ring: "ring-violet-500/20",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
};

function formatOrderRef(id) {
  if (!id) return "";
  const parts = String(id).split("-");
  if (parts.length >= 2 && parts[1]) {
    return `#${parts[1].slice(0, 8).toUpperCase()}`;
  }
  return `#${String(id).slice(0, 8).toUpperCase()}`;
}

function getTrackingProgress(tracking) {
  if (!tracking?.length) return null;
  const done = tracking.filter((step) => step.done).length;
  return Math.round((done / tracking.length) * 100);
}

function getActiveStep(tracking) {
  if (!tracking?.length) return null;
  const current = [...tracking].reverse().find((step) => step.done);
  return current?.step || tracking[0]?.step;
}

export function OrderCard({ order }) {
  const config = TYPE_CONFIG[order.type] || TYPE_CONFIG.medicines;
  const Icon = config.icon;
  const href = order.detailHref || `/orders/${order.id}`;
  const progress = getTrackingProgress(order.tracking);
  const activeStep = getActiveStep(order.tracking);
  const displayTitle = order.title || config.label;
  const subtitle =
    order.type === "prescription" && order.statusLabel
      ? order.statusLabel
      : order.type === "lab" && order.testName
        ? order.testName
        : order.vendor;
  const showProgress =
    progress !== null && order.status !== "cancelled" && order.status !== "delivered";

  return (
    <Link
      href={href}
      className={`group block bg-white rounded-2xl border border-[var(--color-neutral-200)] ring-1 ${config.ring} hover:border-[var(--color-brand-primary)]/30 hover:shadow-md transition-shadow`}
    >
      <div className="p-4 sm:p-5">
        {/* Top row: icon, info, price */}
        <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-3 sm:gap-4">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0 row-span-1 sm:row-span-2`}
          >
            <Icon size={22} className={config.iconColor} weight="duotone" />
          </div>

          <div className="min-w-0 col-start-2">
            <div className="flex flex-wrap items-start gap-x-2 gap-y-1 mb-1">
              <h3 className="text-[15px] sm:text-[16px] font-bold text-[var(--color-ink-headline)] leading-snug">
                {displayTitle}
              </h3>
              <Badge status={order.status} />
            </div>
            <p className="text-[13px] text-[var(--color-neutral-600)] line-clamp-2 sm:truncate">{subtitle}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] sm:text-[12px] text-[var(--color-neutral-500)]">
              <span className="font-mono font-medium text-[var(--color-neutral-400)]">{formatOrderRef(order.id)}</span>
              <span className="inline-flex items-center gap-1">
                <CalendarBlank size={12} />
                {order.date}
              </span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 sm:col-start-3 sm:row-start-1 flex sm:block items-center justify-between sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-neutral-100)]">
            <span className="text-[11px] uppercase tracking-wide text-[var(--color-neutral-400)] font-semibold sm:mb-0.5">
              Total
            </span>
            <p className="text-lg sm:text-xl font-bold text-[var(--color-ink-headline)] tabular-nums">
              PKR {order.total.toLocaleString()}
            </p>
          </div>
        </div>

        {showProgress && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-medium text-[var(--color-neutral-600)] truncate pr-2">{activeStep}</span>
              <span className="text-[var(--color-brand-primary)] font-bold shrink-0">{progress}%</span>
            </div>
            <div className="h-1 bg-[var(--color-neutral-100)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-brand-primary)] rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[var(--color-neutral-100)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex -space-x-1.5 shrink-0">
              {order.items.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-white bg-[var(--color-neutral-50)]"
                >
                  <img src={item.img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-[12px] text-[var(--color-neutral-600)] line-clamp-2 sm:truncate min-w-0">
              {order.items.length === 1
                ? order.items[0].name
                : `${order.items.length} items`}
            </p>
          </div>
          <span className="inline-flex items-center justify-center sm:justify-end gap-1 text-[13px] font-semibold text-[var(--color-brand-primary)] shrink-0">
            View Details
            <CaretRight size={14} weight="bold" />
          </span>
        </div>
      </div>
    </Link>
  );
}
