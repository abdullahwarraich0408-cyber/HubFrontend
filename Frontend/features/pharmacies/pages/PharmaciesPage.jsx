"use client";

import { useState, useMemo } from "react";
import { Storefront } from "@phosphor-icons/react";
import { PharmacyPageHeader } from "../components/PharmacyPageHeader";
import { FeaturedPharmacies } from "../components/FeaturedPharmacies";
import { PharmacySidebarFilters } from "../components/PharmacySidebarFilters";
import { VendorGridCard } from "../components/VendorGridCard";
import { ComparePharmacies } from "../components/ComparePharmacies";
import { PrescriptionCTA } from "../components/PrescriptionCTA";
import { WhyChooseUs } from "../components/WhyChooseUs";
import {
  MOCK_PHARMACIES,
  DEFAULT_SIDEBAR_FILTERS,
  applyChipFilter,
  applySidebarFilters,
  filterPharmacies,
} from "../data/mockPharmacies";
import { useVendors } from "@/lib/hooks/useApi";

export function PharmaciesPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("DHA Phase 6, Karachi");
  const [activeChip, setActiveChip] = useState(null);
  const [sidebarFilters, setSidebarFilters] = useState(DEFAULT_SIDEBAR_FILTERS);
  const [compareIds, setCompareIds] = useState([]);
  const { data: apiPharmacies = [], isLoading, isError } = useVendors();

  const pharmacies =
    apiPharmacies.length > 0 || !isError ? apiPharmacies : MOCK_PHARMACIES;

  const filtered = useMemo(() => {
    let result = pharmacies;
    result = filterPharmacies(result, search);
    result = applyChipFilter(result, activeChip);
    result = applySidebarFilters(result, sidebarFilters);
    return result;
  }, [pharmacies, search, activeChip, sidebarFilters]);

  const comparePharmacies = useMemo(
    () => pharmacies.filter((p) => compareIds.includes(p.id)),
    [pharmacies, compareIds]
  );

  const handleCompareToggle = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-6 md:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
        <PharmacyPageHeader
          search={search}
          onSearchChange={setSearch}
          location={location}
          onLocationChange={setLocation}
          activeChip={activeChip}
          onChipChange={setActiveChip}
        />

        <FeaturedPharmacies />

        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className="w-full lg:w-[260px] shrink-0">
            <PharmacySidebarFilters
              filters={sidebarFilters}
              onChange={setSidebarFilters}
              onReset={() => setSidebarFilters(DEFAULT_SIDEBAR_FILTERS)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-[var(--color-neutral-500)] mb-5">
              <span className="font-bold text-[var(--color-ink-headline)]">{filtered.length}</span> pharmacies near{" "}
              {location.split(",")[0]}
            </p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {filtered.map((pharmacy) => (
                  <VendorGridCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    compareSelected={compareIds.includes(pharmacy.id)}
                    compareDisabled={compareIds.length >= 3}
                    onCompareToggle={handleCompareToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-12 text-center">
                <Storefront size={48} className="text-[var(--color-neutral-300)] mx-auto mb-4" weight="duotone" />
                <h3 className="text-[18px] font-bold text-[var(--color-ink-headline)] mb-2">No pharmacies found</h3>
                <p className="text-[14px] text-[var(--color-neutral-500)]">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>

        <ComparePharmacies
          selectedPharmacies={comparePharmacies}
          onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
        />

        <PrescriptionCTA />
        <WhyChooseUs />
      </div>
    </div>
  );
}
