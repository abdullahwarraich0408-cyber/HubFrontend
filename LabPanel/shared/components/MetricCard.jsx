"use client";

import { cn } from "@/utils/cn";

export function MetricCard({
  label,
  value,
  icon: Icon,
  color = "teal",
  subtitle,
  className,
}) {
  const colorMap = {
    teal: {
      text: "text-[#17618E]",
      bg: "bg-[#17618E]/10",
      border: "border-[#17618E]/20",
    },
    blue: {
      text: "text-[#2563EB]",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    green: {
      text: "text-[#079455]",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    navy: {
      text: "text-[#082B3F]",
      bg: "bg-slate-100",
      border: "border-slate-200",
    },
    purple: {
      text: "text-[#7C3AED]",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
  };

  const theme = colorMap[color] || colorMap.teal;

  return (
    <div
      className={cn(
        "bg-white rounded-[16px] border border-[#D9DEE5] p-6 shadow-sm flex flex-col justify-between min-h-[160px] md:min-h-[175px] transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={cn("p-1.5 rounded-lg", theme.bg, theme.text)}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <span className={cn("text-[12px] font-bold uppercase tracking-wider", theme.text)}>
            {label}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[32px] md:text-[34px] font-bold text-[#082B3F] tracking-tight leading-none">
          {value}
        </div>
        {subtitle && (
          <p className="text-[13px] text-[#667085] mt-2 font-normal">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
