"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}) {
  return (
    <div className={cn("relative flex items-center min-w-[220px] max-w-sm", className)}>
      <Search
        size={16}
        className="absolute left-3 text-[#667085] pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[40px] pl-9 pr-8 text-[13px] bg-white border border-[#D9DEE5] rounded-lg text-[#07172E] placeholder:text-[#667085] focus:outline-none focus:border-[#087F82] focus:ring-1 focus:ring-[#087F82] transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 text-[#667085] hover:text-[#07172E] p-0.5 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
