"use client";

export function Pagination({ page = 1, pageSize = 20, total = 0, onPageChange, onPageSizeChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-t border-neutral-200 bg-white">
      <p className="text-xs text-neutral-500">
        Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-2">
        <select
          className="h-10 rounded-lg border border-neutral-200 px-2 text-sm"
          value={pageSize}
          onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
          aria-label="Rows per page"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <button type="button" className="h-10 px-3 rounded-lg border border-neutral-200 text-sm disabled:opacity-40" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <span className="text-sm text-neutral-600">
          {page} / {pages}
        </span>
        <button type="button" className="h-10 px-3 rounded-lg border border-neutral-200 text-sm disabled:opacity-40" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
