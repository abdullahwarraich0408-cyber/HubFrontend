"use client";

import { MagnifyingGlass, MapPin, Storefront, ShieldCheck, Clock, Truck } from "@phosphor-icons/react";

export function PharmaciesHero({ search, onSearchChange, location, onLocationChange }) {
  return (
    <div className="relative rounded-[20px] md:rounded-[24px] bg-hero-gradient overflow-hidden p-6 md:p-10 mb-6">
      <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--color-brand-primary)]/10 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-[11px] font-semibold uppercase tracking-wide mb-4">
          <ShieldCheck size={14} weight="fill" className="text-[var(--color-brand-highlight)]" />
          Verified Pharmacy Network
        </div>

        <h1 className="text-[28px] md:text-[36px] font-[var(--font-heading)] font-bold text-white leading-tight mb-3">
          Find Trusted Pharmacies Near You
        </h1>
        <p className="text-[14px] md:text-[15px] text-white/65 max-w-[520px] mb-6 leading-relaxed">
          Order from verified local pharmacies with fast delivery, authentic medicines, and real-time tracking.
        </p>

        <div className="flex flex-col md:flex-row gap-3 max-w-[720px]">
          <div className="flex-1 flex items-center gap-3 bg-white rounded-[14px] px-4 py-3 focus-within:ring-2 focus-within:ring-[var(--color-brand-highlight)]/40">
            <MagnifyingGlass size={20} className="text-[var(--color-brand-primary)] shrink-0" weight="bold" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search pharmacies..."
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-[var(--color-neutral-900)] min-w-0"
            />
          </div>
          <div className="flex-1 flex items-center gap-3 bg-white rounded-[14px] px-4 py-3">
            <MapPin size={20} className="text-[var(--color-brand-primary)] shrink-0" weight="fill" />
            <input
              type="text"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Your location"
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-[var(--color-neutral-900)] min-w-0"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-5 mt-5">
          {[
            { icon: Storefront, label: "50+ partners" },
            { icon: Truck, label: "30-min delivery" },
            { icon: Clock, label: "24/7 available" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[12px] text-white/70 font-medium">
              <item.icon size={16} className="text-[var(--color-brand-highlight)]" weight="fill" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
