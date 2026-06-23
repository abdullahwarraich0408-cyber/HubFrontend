"use client";

import { MagnifyingGlass, Flask, House, Clock } from "@phosphor-icons/react";

export function LabTestsHero({ search, onSearchChange }) {
  return (
    <div className="relative rounded-[20px] md:rounded-[24px] bg-hero-gradient overflow-hidden p-6 md:p-10 mb-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[640px]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-[11px] font-semibold uppercase tracking-wide mb-4">
          <Flask size={14} weight="fill" className="text-[var(--color-brand-highlight)]" />
          Diagnostics
        </div>

        <h1 className="text-[28px] md:text-[36px] font-[var(--font-heading)] font-bold text-white leading-tight mb-3">
          Book Lab Tests at Home
        </h1>
        <p className="text-[14px] md:text-[15px] text-white/65 mb-6 leading-relaxed">
          Certified labs, home sample collection, digital reports delivered to your inbox.
        </p>

        <div className="flex items-center gap-2 bg-white rounded-full p-1.5 pl-5 shadow-lg focus-within:ring-2 focus-within:ring-[var(--color-brand-highlight)]/40">
          <MagnifyingGlass size={20} className="text-[var(--color-brand-primary)] shrink-0" weight="bold" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tests, packages, or labs..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-[var(--color-neutral-900)] py-3 min-w-0 placeholder:text-[var(--color-neutral-500)]"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-5">
          <div className="flex items-center gap-2 text-[12px] text-white/70 font-medium">
            <House size={16} className="text-[var(--color-brand-highlight)]" weight="fill" />
            Home sample collection
          </div>
          <div className="flex items-center gap-2 text-[12px] text-white/70 font-medium">
            <Clock size={16} className="text-[var(--color-brand-highlight)]" weight="fill" />
            Reports in 6–48 hrs
          </div>
        </div>
      </div>
    </div>
  );
}
