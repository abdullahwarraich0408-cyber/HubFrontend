"use client";

import { cn } from "@/utils/cn";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Warning, 
  MinusCircle, 
  ArrowsClockwise, 
  Package, 
  X, 
  Star 
} from "@phosphor-icons/react";

export function Badge({ status, className }) {
  const baseStyles = "inline-flex items-center gap-1.5 rounded-pill px-[12px] py-[6px] text-[11px] font-semibold uppercase tracking-wider";

  const config = {
    active: {
      bg: "bg-[var(--color-status-success-bg)]",
      text: "text-[var(--color-status-success-text)]",
      icon: <CheckCircle weight="fill" size={14} />,
      label: "Active"
    },
    instock: {
      bg: "bg-[var(--color-status-success-bg)]",
      text: "text-[var(--color-status-success-text)]",
      icon: <CheckCircle weight="fill" size={14} />,
      label: "In Stock"
    },
    inactive: {
      bg: "bg-[var(--color-status-danger-bg)]",
      text: "text-[var(--color-status-danger-text)]",
      icon: <XCircle weight="fill" size={14} />,
      label: "Inactive"
    },
    pending: {
      bg: "bg-[var(--color-status-warning-bg)]",
      text: "text-[var(--color-status-warning-text)]",
      icon: <Clock size={14} />,
      label: "Pending"
    },
    lowstock: {
      bg: "bg-[var(--color-status-warning-bg)]",
      text: "text-[var(--color-status-warning-text)]",
      icon: <Warning size={14} />,
      label: "Low Stock"
    },
    outofstock: {
      bg: "bg-[var(--color-status-danger-bg)]",
      text: "text-[var(--color-status-danger-text)]",
      icon: <MinusCircle size={14} />,
      label: "Out of Stock"
    },
    processing: {
      bg: "bg-[var(--color-status-info-bg)]",
      text: "text-[var(--color-status-info-text)]",
      icon: <ArrowsClockwise size={14} />,
      label: "Processing"
    },
    shipped: {
      bg: "bg-[var(--color-status-shipped-bg)]",
      text: "text-[var(--color-status-shipped-text)]",
      icon: <Package size={14} />,
      label: "Shipped"
    },
    delivered: {
      bg: "bg-[var(--color-status-success-bg)]",
      text: "text-[var(--color-status-success-text)]",
      icon: <CheckCircle weight="fill" size={14} />,
      label: "Delivered"
    },
    cancelled: {
      bg: "bg-[var(--color-status-cancelled-bg)]",
      text: "text-[var(--color-status-cancelled-text)]",
      icon: <X size={14} />,
      label: "Cancelled"
    },
    premium: {
      bg: "bg-[var(--color-accent-gold-bg)]",
      text: "text-[var(--color-accent-gold-text)]",
      icon: <Star weight="fill" size={14} className="text-[var(--color-accent-gold)]" />,
      label: "Premium"
    }
  };

  // Default to a simple gray badge if status not found
  const badgeKey = status?.toLowerCase().replace(/\s+/g, "");
  const selectedConfig = config[badgeKey] || {
    bg: "bg-[var(--color-surface-subtle)]",
    text: "text-[var(--color-neutral-600)]",
    icon: null,
    label: status
  };

  return (
    <span className={cn(baseStyles, selectedConfig.bg, selectedConfig.text, className)}>
      {selectedConfig.icon}
      {selectedConfig.label}
    </span>
  );
}
