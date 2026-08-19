"use client";

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-heading text-[28px] font-extrabold text-ink-headline tracking-tight">{title}</h1>
        {description ? <p className="text-[14px] text-neutral-500 mt-1">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
