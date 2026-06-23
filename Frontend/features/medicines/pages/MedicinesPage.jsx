"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlass, Funnel, SortAscending } from "@phosphor-icons/react";
import { MedicineFilters } from "../components/MedicineFilters";
import { MedicineCard } from "../components/MedicineCard";
import { MOCK_MEDICINES, FILTER_OPTIONS } from "../data/mockMedicines";
import { useProducts } from "@/lib/hooks/useApi";

const DEFAULT_FILTERS = {
  categories: [],
  brands: [],
  generics: [],
  deliveryTimes: [],
  vendors: [],
  priceRanges: [],
  prescription: null,
};

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "delivery", label: "Fastest Delivery" },
  { value: "rating", label: "Top Rated" },
];

function applyFilters(medicines, filters, search, sort) {
  let result = [...medicines];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.generic.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.vendor.toLowerCase().includes(q)
    );
  }

  if (filters.categories?.length) {
    result = result.filter((m) => filters.categories.includes(m.category));
  }
  if (filters.prescription !== null) {
    result = result.filter((m) => m.prescriptionRequired === filters.prescription);
  }
  if (filters.brands?.length) {
    result = result.filter((m) => filters.brands.includes(m.brand));
  }
  if (filters.generics?.length) {
    result = result.filter((m) => filters.generics.some((g) => m.generic.includes(g)));
  }
  if (filters.vendors?.length) {
    result = result.filter((m) => filters.vendors.includes(m.vendor));
  }
  if (filters.deliveryTimes?.length) {
    result = result.filter((m) => filters.deliveryTimes.includes(m.deliveryEta));
  }
  if (filters.priceRanges?.length) {
    result = result.filter((m) =>
      filters.priceRanges.some((label) => {
        const range = FILTER_OPTIONS.priceRanges.find((r) => r.label === label);
        return range && m.price >= range.min && m.price < range.max;
      })
    );
  }

  switch (sort) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "delivery":
      result.sort((a, b) => a.deliveryEta.localeCompare(b.deliveryEta));
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return result;
}

export function MedicinesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: apiMedicines = [], isLoading, isError } = useProducts();

  const medicines = apiMedicines.length > 0 || !isError ? apiMedicines : MOCK_MEDICINES;

  const filtered = useMemo(
    () => applyFilters(medicines, filters, search, sort),
    [medicines, filters, search, sort]
  );

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-6 md:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-[26px] md:text-[28px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] mb-1">
            Medicines
          </h1>
          <p className="text-[14px] text-[var(--color-neutral-500)]">
            Shop authentic medicines from verified pharmacies
          </p>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-[260px] shrink-0 sticky top-[120px] self-start">
            <MedicineFilters
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>

          {/* Main area */}
          <div className="flex-1 min-w-0">
            {/* Search + sort toolbar */}
            <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-4 mb-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 bg-[var(--color-surface-subtle)] border border-[var(--color-neutral-200)] rounded-[12px] px-4 py-2.5 focus-within:border-[var(--color-brand-primary)] focus-within:ring-2 focus-within:ring-[var(--color-brand-primary)]/10 transition-all">
                  <MagnifyingGlass size={18} className="text-[var(--color-neutral-400)] shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search medicines by name, generic, or brand..."
                    className="flex-1 bg-transparent border-none outline-none text-[14px] text-[var(--color-neutral-900)] min-w-0"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface-subtle)] border border-[var(--color-neutral-200)] rounded-[12px] text-[13px] font-semibold text-[var(--color-neutral-700)]"
                  >
                    <Funnel size={16} />
                    Filters
                  </button>

                  <div className="relative flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface-subtle)] border border-[var(--color-neutral-200)] rounded-[12px]">
                    <SortAscending size={16} className="text-[var(--color-neutral-500)]" />
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="bg-transparent border-none outline-none text-[13px] font-semibold text-[var(--color-neutral-700)] cursor-pointer pr-6"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile filters drawer */}
            {mobileFiltersOpen && (
              <div className="lg:hidden mb-5">
                <MedicineFilters
                  filters={filters}
                  onChange={setFilters}
                  onClear={() => setFilters(DEFAULT_FILTERS)}
                />
              </div>
            )}

            {/* Results count */}
            <p className="text-[13px] text-[var(--color-neutral-500)] mb-4">
              {isLoading ? "Loading medicines..." : (
                <>
                  Showing <span className="font-semibold text-[var(--color-ink-headline)]">{filtered.length}</span> medicines
                  {isError && apiMedicines.length === 0 && (
                    <span className="ml-2 text-[var(--color-status-warning-text)]">(showing offline catalog)</span>
                  )}
                </>
              )}
            </p>

            {/* Medicine grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[360px] bg-white rounded-[16px] border border-[var(--color-neutral-200)] animate-pulse" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {filtered.map((medicine) => (
                  <MedicineCard key={medicine.id} medicine={medicine} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-12 text-center">
                <p className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-2">No medicines found</p>
                <p className="text-[14px] text-[var(--color-neutral-500)]">Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
