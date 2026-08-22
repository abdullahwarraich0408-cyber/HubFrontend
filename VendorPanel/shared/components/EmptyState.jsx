"use client";

export function EmptyState({ title, description, action }) {
  return (
    <div className="py-12 px-6 text-center">
      <p className="text-sm font-semibold text-ink-headline">{title}</p>
      {description ? <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="bg-white rounded-[16px] border border-neutral-200 overflow-hidden">
      <div className="h-12 bg-neutral-50 border-b border-neutral-200" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-[58px] border-b border-neutral-100 flex items-center gap-4 px-6">
          {Array.from({ length: cols }).map((__, col) => (
            <div key={col} className="h-3 flex-1 rounded bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}
