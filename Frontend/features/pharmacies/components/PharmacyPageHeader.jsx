"use client";

import { MagnifyingGlass, MapPin } from "@phosphor-icons/react";
import { QUICK_CHIPS } from "../data/mockPharmacies";

export function PharmacyPageHeader({ search, onSearchChange, location, onLocationChange, activeChip, onChipChange }) {
  return (
    <section className="mb-8">
      <h1 className="text-[28px] md:text-[36px] font-bold text-[var(--color-ink-headline)] mb-2">
        Find Trusted Pharmacies
      </h1>
      <p className="text-[14px] md:text-[15px] text-[var(--color-neutral-500)] mb-6 max-w-xl">
        Compare verified vendors, delivery times, and services near you.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pharmacy or medicine..."
            className="w-full h-[52px] pl-12 pr-4 rounded-[14px] border border-[var(--color-neutral-200)] bg-white text-[14px] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/15"
          />
        </div>
        <div className="relative sm:w-[260px]">
          <MapPin
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-brand-primary)]"
            weight="fill"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Location"
            className="w-full h-[52px] pl-12 pr-4 rounded-[14px] border border-[var(--color-neutral-200)] bg-white text-[14px] focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/15"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.id}
            onClick={() => onChipChange(activeChip === chip.id ? null : chip.id)}
            className={`px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
              activeChip === chip.id
                ? "bg-[var(--color-brand-primary)] text-white shadow-md"
                : "bg-white border border-[var(--color-neutral-200)] text-[var(--color-neutral-600)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </section>
  );
}
