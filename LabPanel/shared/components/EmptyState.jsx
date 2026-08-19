"use client";

import { cn } from "@/utils/cn";

export function EmptyState({
  message = "No data yet.",
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "py-16 px-6 text-center flex flex-col items-center justify-center",
        className
      )}
    >
      <p className="text-[14px] text-[#667085] font-medium">{message}</p>
      {description && (
        <p className="text-[13px] text-[#667085]/80 mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
