"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
}) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-[#D9DEE5] bg-white text-[13px] text-[#667085]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span>Showing <strong className="font-semibold text-[#07172E]">{startItem}</strong> to <strong className="font-semibold text-[#07172E]">{endItem}</strong> of <strong className="font-semibold text-[#07172E]">{totalItems}</strong> entries</span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-4">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 px-2 bg-neutral-50 border border-[#D9DEE5] rounded text-[12px] font-medium text-[#07172E] focus:outline-none focus:border-[#087F82]"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-[#D9DEE5] hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed text-[#07172E] transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="px-3 py-1 text-[13px] font-medium text-[#07172E]">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-[#D9DEE5] hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed text-[#07172E] transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
