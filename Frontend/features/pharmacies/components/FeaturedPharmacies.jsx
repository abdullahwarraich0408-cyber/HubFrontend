"use client";

import { FeaturedPharmacyCard } from "./FeaturedPharmacyCard";
import { getFeaturedPharmacies } from "../data/mockPharmacies";
import { useVendors } from "@/lib/hooks/useApi";

export function FeaturedPharmacies() {
  const { data: apiPharmacies = [] } = useVendors();
  const featured =
    apiPharmacies.filter((pharmacy) => pharmacy.featured).slice(0, 6) ||
    getFeaturedPharmacies();

  const list = featured.length > 0 ? featured : getFeaturedPharmacies();

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[20px] md:text-[22px] font-bold text-[var(--color-ink-headline)]">Featured Pharmacies</h2>
          <p className="text-[13px] text-[var(--color-neutral-500)] mt-0.5">Top verified vendors near you</p>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {list.map((pharmacy) => (
          <FeaturedPharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
        ))}
      </div>
    </section>
  );
}
