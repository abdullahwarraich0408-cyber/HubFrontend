"use client";

import { cn } from "@/utils/cn";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  MinusCircle, 
  RefreshCw, 
  Package, 
  X, 
  Star,
  PlayCircle
} from "lucide-react";

export function Badge({ status, className }) {
  const baseStyles = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight border shadow-xs transition-colors duration-150";

  const config = {
    pending: {
      bg: "bg-amber-50 text-amber-700 border-amber-200/80",
      icon: <Clock size={12} className="text-amber-600 shrink-0" />,
      label: "Pending"
    },
    confirmed: {
      bg: "bg-blue-50 text-blue-700 border-blue-200/80",
      icon: <CheckCircle2 size={12} className="text-blue-600 shrink-0" />,
      label: "Confirmed"
    },
    inprogress: {
      bg: "bg-teal-50 text-teal-700 border-teal-200/80",
      icon: <PlayCircle size={12} className="text-teal-600 shrink-0" />,
      label: "In Progress"
    },
    in_progress: {
      bg: "bg-teal-50 text-teal-700 border-teal-200/80",
      icon: <PlayCircle size={12} className="text-teal-600 shrink-0" />,
      label: "In Progress"
    },
    completed: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      icon: <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />,
      label: "Completed"
    },
    cancelled: {
      bg: "bg-rose-50 text-rose-700 border-rose-200/80",
      icon: <XCircle size={12} className="text-rose-600 shrink-0" />,
      label: "Cancelled"
    },
    active: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      icon: <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />,
      label: "Active"
    },
    inactive: {
      bg: "bg-rose-50 text-rose-700 border-rose-200/80",
      icon: <XCircle size={12} className="text-rose-600 shrink-0" />,
      label: "Inactive"
    },
    premium: {
      bg: "bg-amber-50 text-amber-800 border-amber-300",
      icon: <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />,
      label: "Premium"
    }
  };

  const badgeKey = status?.toLowerCase().replace(/[\s_-]+/g, "");
  const selectedConfig = config[badgeKey] || {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: null,
    label: status || "Unknown"
  };

  return (
    <span className={cn(baseStyles, selectedConfig.bg, className)}>
      {selectedConfig.icon}
      <span>{selectedConfig.label}</span>
    </span>
  );
}

