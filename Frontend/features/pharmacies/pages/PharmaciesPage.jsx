"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Storefront } from "@phosphor-icons/react";
import { PharmaciesHero } from "../components/PharmaciesHero";
import { PharmacyPosterCard } from "../components/PharmacyPosterCard";
import { PharmacyOffersSection } from "../components/PharmacyOffersSection";
import { PrescriptionCTA } from "../components/PrescriptionCTA";
import { useVendors } from "@/lib/hooks/useApi";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "open", label: "Open now" },
  { id: "verified", label: "Verified" },
  { id: "fast", label: "Fast delivery" },
];

function applyFilters(pharmacies, { search, filter }) {
  let result = [...pharmacies];

  if (filter === "open") {
    result = result.filter((p) => p.status === "open");
  } else if (filter === "verified") {
    result = result.filter((p) => p.verified);
  } else if (filter === "fast") {
    result = result.filter((p) => p.fast);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.address || "").toLowerCase().includes(q) ||
        String(p.shortDesc || "").toLowerCase().includes(q)
    );
  }

  return result;
}

export function PharmaciesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { data: pharmacies = [], isLoading } = useVendors();

  const filtered = useMemo(
    () => applyFilters(pharmacies, { search, filter }),
    [pharmacies, search, filter]
  );

  return (
    <div className="min-h-screen w-full bg-[#E8F2F6]">
      <div className="home-container mx-auto py-8 md:py-10 lg:py-12">
        <PharmaciesHero search={search} onSearchChange={setSearch} />

        <PharmacyOffersSection />

        {/* Segmented filters — different from Labs rounded navy chips */}
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex max-w-full overflow-x-auto rounded-[14px] bg-white/80 p-1 shadow-[0_4px_20px_rgba(11,110,153,0.06)] scrollbar-hide">
            {FILTERS.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`shrink-0 rounded-[10px] px-3.5 py-2.5 text-[13px] font-bold transition-colors ${
                    active
                      ? "bg-[#0B6E99] text-white"
                      : "text-[#334E68] hover:bg-[#E8F4F8]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <Link
            href="/browse"
            className="group inline-flex items-center gap-1.5 self-start text-[14px] font-bold text-[#0B6E99] sm:self-auto"
          >
            Browse all medicines
            <ArrowRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-[3px]"
            />
          </Link>
        </div>

        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
              Storefronts
            </p>
            <h2 className="mt-1 text-[20px] font-bold tracking-tight text-[#102A43]">
              {isLoading ? "Loading…" : `${filtered.length} pharmacies nearby`}
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[160px] animate-pulse rounded-[22px] bg-white/70"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtered.map((pharmacy) => (
              <PharmacyPosterCard key={pharmacy.id} pharmacy={pharmacy} />
            ))}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-[#0B6E99]/25 bg-white/70 px-5 py-14 text-center">
            <Storefront size={40} className="mx-auto text-[#0B6E99]" weight="duotone" />
            <p className="mt-4 text-[18px] font-bold text-[#102A43]">No pharmacies found</p>
            <p className="mt-1 text-[14px] text-[#627D98]">
              Try another search or filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-4 rounded-[12px] bg-[#0B6E99] px-5 py-2.5 text-[13px] font-bold text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-10 md:mt-12">
          <PrescriptionCTA />
        </div>
      </div>
    </div>
  );
}
