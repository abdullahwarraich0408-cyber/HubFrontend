"use client";

import { useMemo, useState } from "react";
import { Buildings, MagnifyingGlass } from "@phosphor-icons/react";
import { HospitalCard } from "../components/HospitalCard";
import { useHospitals } from "@/lib/hooks/useApi";

export function HospitalsPage() {
  const [search, setSearch] = useState("");
  const { data: hospitals = [], isLoading, isError, refetch } = useHospitals();

  const filtered = useMemo(() => {
    if (!search.trim()) return hospitals;
    const q = search.toLowerCase();
    return hospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(q) ||
        (hospital.city || "").toLowerCase().includes(q)
    );
  }, [hospitals, search]);

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-6 md:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-brand-mist)] text-[var(--color-brand-primary)] text-[12px] font-semibold mb-3">
            <Buildings size={14} weight="fill" />
            Hospital Network
          </div>
          <h1 className="text-[28px] md:text-[32px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] mb-2">
            Find a Hospital
          </h1>
          <p className="text-[14px] text-[var(--color-neutral-500)] max-w-[640px]">
            Select a hospital first, then browse doctors by specialty and book your appointment.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-full p-1.5 pl-5 shadow-sm border border-[var(--color-neutral-200)] mb-6 max-w-[640px]">
          <MagnifyingGlass size={20} className="text-[var(--color-brand-primary)] shrink-0" weight="bold" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospitals by name or city..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] py-3 min-w-0"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[220px] bg-white rounded-[20px] border border-[var(--color-neutral-200)] animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-12 text-center">
            <p className="text-[16px] font-bold mb-2">Could not load hospitals</p>
            <button onClick={() => refetch()} className="px-5 py-2.5 bg-[var(--color-brand-primary)] text-white rounded-[12px] text-[14px] font-semibold">
              Retry
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-12 text-center">
            <Buildings size={48} className="text-[var(--color-neutral-300)] mx-auto mb-4" weight="duotone" />
            <h3 className="text-[18px] font-bold mb-2">No hospitals found</h3>
            <p className="text-[14px] text-[var(--color-neutral-500)]">
              Hospitals will appear here once added by the admin team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
