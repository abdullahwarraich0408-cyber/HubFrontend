"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pill, SortAscending } from "@phosphor-icons/react";
import { MedicineCard } from "../components/MedicineCard";
import { MOCK_MEDICINES } from "../data/mockMedicines";
import { useProducts } from "@/lib/hooks/useApi";
import { PageHero } from "@/shared/components/PageHero";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

function normalizeCategory(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .trim();
}

function applyFilters(medicines, { search, category, rxFilter, sort }) {
  let result = [...medicines];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter((m) => {
      const haystack = [
        m.name,
        m.generic,
        m.brand,
        m.vendor,
        m.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  if (category) {
    const key = normalizeCategory(category);
    result = result.filter((m) => normalizeCategory(m.category).includes(key) || key.includes(normalizeCategory(m.category)));
  }

  if (rxFilter === "rx") {
    result = result.filter((m) => m.prescriptionRequired);
  } else if (rxFilter === "otc") {
    result = result.filter((m) => !m.prescriptionRequired);
  }

  switch (sort) {
    case "price-low":
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;
    case "price-high":
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    default:
      break;
  }

  return result;
}

export function MedicinesPage() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  const [search, setSearch] = useState(qParam);
  const [category, setCategory] = useState(categoryParam);
  const [rxFilter, setRxFilter] = useState("all");
  const [sort, setSort] = useState("relevance");
  const { data: apiMedicines = [], isLoading, isError } = useProducts();

  useEffect(() => {
    setSearch(qParam);
  }, [qParam]);

  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  const medicines =
    apiMedicines.length > 0 || !isError ? apiMedicines : MOCK_MEDICINES;

  const categories = useMemo(() => {
    const set = new Set();
    medicines.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [medicines]);

  const filtered = useMemo(
    () => applyFilters(medicines, { search, category, rxFilter, sort }),
    [medicines, search, category, rxFilter, sort]
  );

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8]">
      <div className="home-container mx-auto py-8 md:py-10 lg:py-12">
        <PageHero
          eyebrow="Medicine"
          eyebrowIcon={Pill}
          title="Find medicines."
          accent="Order with ease."
          description="Search medicines from partner pharmacies — see who sells each product before you add to cart."
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search name, generic, brand, pharmacy..."
          searchAriaLabel="Search medicines"
          image="/images/hero-buy-medicine.png"
          imageAlt="Medicines available through Medzoos"
          priority
          actions={
            <div className="relative flex h-[50px] shrink-0 items-center gap-2 rounded-[14px] border border-white/25 bg-white/10 px-4 text-white">
              <SortAscending size={16} weight="bold" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-[13px] font-bold outline-none"
                aria-label="Sort medicines"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-[#102A43]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        {/* Filters — same segmented style as Pharmacies / Doctors */}
        <div className="mb-7 flex flex-col gap-3">
          <div className="inline-flex max-w-full overflow-x-auto rounded-[14px] bg-white/80 p-1 shadow-[0_4px_20px_rgba(11,110,153,0.06)] scrollbar-hide">
            <button
              type="button"
              onClick={() => setCategory("")}
              className={`shrink-0 rounded-[10px] px-3.5 py-2.5 text-[13px] font-bold transition-colors ${
                !category
                  ? "bg-[#0B6E99] text-white"
                  : "text-[#334E68] hover:bg-[#E8F4F8]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const active =
                normalizeCategory(category) === normalizeCategory(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(active ? "" : cat)}
                  className={`shrink-0 rounded-[10px] px-3.5 py-2.5 text-[13px] font-bold capitalize transition-colors ${
                    active
                      ? "bg-[#0B6E99] text-white"
                      : "text-[#334E68] hover:bg-[#E8F4F8]"
                  }`}
                >
                  {String(cat).replace(/_/g, " ")}
                </button>
              );
            })}
          </div>

          <div className="inline-flex max-w-full overflow-x-auto rounded-[14px] bg-white/80 p-1 shadow-[0_4px_20px_rgba(11,110,153,0.06)] scrollbar-hide">
            {[
              { id: "all", label: "Any type" },
              { id: "otc", label: "OTC" },
              { id: "rx", label: "Prescription" },
            ].map((item) => {
              const active = rxFilter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRxFilter(item.id)}
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
        </div>

        <div className="mb-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
            Catalogue
          </p>
          <p className="mt-1 text-[15px] font-semibold text-[#102A43]">
            {isLoading ? "Loading…" : `${filtered.length} medicines`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[220px] animate-pulse rounded-[16px] bg-[#D7E2EA]"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#102A43]/15 bg-white px-5 py-14 text-center">
            <Pill size={40} className="mx-auto text-[#627D98]" weight="duotone" />
            <p className="mt-4 text-[18px] font-bold text-[#102A43]">No medicines found</p>
            <p className="mt-1 text-[14px] text-[#627D98]">
              Try another search or category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("");
                setRxFilter("all");
              }}
              className="mt-4 rounded-full bg-[#062F3D] px-5 py-2.5 text-[13px] font-bold text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
