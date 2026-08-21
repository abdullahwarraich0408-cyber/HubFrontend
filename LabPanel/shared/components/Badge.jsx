"use client";

import { cn } from "@/utils/cn";
import { STATUS_BADGE_STYLES, normalizeStatus } from "@/lib/constants/lab";

export function Badge({ status, type = "status", label, className }) {
  if (type === "collection") {
    const isHome = status === "Home Collection" || status === "Home" || status === "HOME";
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium tracking-tight",
          isHome
            ? "bg-teal-50 text-[#17618E] border border-[#17618E]/20"
            : "bg-slate-100 text-slate-700 border border-slate-200",
          className
        )}
      >
        {isHome ? "Home Collection" : "Lab Visit"}
      </span>
    );
  }

  if (type === "active") {
    const isActive = status === "active" || status === true;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider",
          isActive
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-rose-50 text-rose-700 border border-rose-200",
          className
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-rose-500")} />
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  }

  if (type === "payment") {
    const isPaid = String(status).toUpperCase() === "PAID";
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider",
          isPaid
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-amber-50 text-amber-700 border border-amber-200",
          className
        )}
      >
        {isPaid ? "PAID" : "UNPAID"}
      </span>
    );
  }

  // Booking status badge
  const norm = normalizeStatus(status);
  const style = STATUS_BADGE_STYLES[norm] || {
    bg: "bg-gray-100 text-gray-700 border border-gray-200",
    dot: "bg-gray-400",
    label: label || status || "Unknown",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium tracking-tight whitespace-nowrap",
        style.bg,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", style.dot)} />
      <span>{label || style.label}</span>
    </span>
  );
}
