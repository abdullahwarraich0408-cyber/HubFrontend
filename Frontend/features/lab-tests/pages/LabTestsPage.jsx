"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LabTestsHero } from "../components/LabTestsHero";
import { LabTestCard } from "../components/LabTestCard";
import {
  LabQuickLinks,
  LabHomeSamplingBand,
  LabCategoryFilter,
  LabProviderFilter,
  LabPopularStrip,
} from "../components/LabBrowseExtras";
import { MOCK_LAB_TESTS, CATEGORIES, getPopularPackages } from "../data/mockLabTests";
import { useLabTests, usePopularLabTests, useLabTestCategories } from "@/lib/hooks/useApi";

export function LabTestsPage() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const labParam = searchParams.get("lab") || "";

  const [search, setSearch] = useState(qParam);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeLab, setActiveLab] = useState(labParam || null);

  const { data: apiTests = [], isLoading, isError } = useLabTests();
  const { data: apiPopular = [] } = usePopularLabTests();
  const { data: apiCategories = [] } = useLabTestCategories();

  useEffect(() => {
    setSearch(qParam);
  }, [qParam]);

  useEffect(() => {
    if (labParam) setActiveLab(labParam);
  }, [labParam]);

  const tests = apiTests.length > 0 || !isError ? apiTests : MOCK_LAB_TESTS;
  const popular = apiPopular.length > 0 ? apiPopular : getPopularPackages();
  const categories = apiCategories.length > 0 ? apiCategories : CATEGORIES;

  const labNames = useMemo(() => {
    const names = new Set();
    tests.forEach((t) => {
      const name = t.labPartner?.name || t.lab;
      if (name) names.add(name);
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [tests]);

  const filtered = useMemo(() => {
    let result = [...tests];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          String(t.name || "").toLowerCase().includes(q) ||
          String(t.lab || "").toLowerCase().includes(q) ||
          String(t.labPartner?.name || "").toLowerCase().includes(q) ||
          String(t.category || "").toLowerCase().includes(q)
      );
    }

    if (activeCategory) {
      result = result.filter(
        (t) =>
          t.category === activeCategory ||
          String(t.category || "").toLowerCase() === String(activeCategory).toLowerCase()
      );
    }

    if (activeLab) {
      result = result.filter((t) => {
        const name = t.labPartner?.name || t.lab;
        return name === activeLab;
      });
    }

    return result;
  }, [tests, search, activeCategory, activeLab]);

  const showPopular = !search.trim() && !activeCategory && !activeLab;

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8]">
      <div className="home-container mx-auto py-8 md:py-10 lg:py-12">
        <LabTestsHero search={search} onSearchChange={setSearch} />

        <LabQuickLinks />
        <LabHomeSamplingBand />

        {showPopular ? <LabPopularStrip tests={popular.length ? popular : tests} /> : null}

        <LabCategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
        <LabProviderFilter
          labs={labNames}
          activeLab={activeLab}
          onChange={setActiveLab}
        />

        <section id="all-lab-tests">
          <div className="mb-5">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
              Catalogue
            </p>
            <p className="mt-1 text-[15px] font-semibold text-[#102A43]">
              {isLoading ? "Loading…" : `${filtered.length} tests`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[280px] animate-pulse rounded-[24px] bg-[#D7E2EA]"
                />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((test) => (
                <LabTestCard key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#102A43]/15 bg-white px-5 py-14 text-center">
              <p className="text-[18px] font-bold text-[#102A43]">No tests found</p>
              <p className="mt-1 text-[14px] text-[#627D98]">
                Try another search or category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory(null);
                  setActiveLab(null);
                }}
                className="mt-4 rounded-full bg-[#062F3D] px-5 py-2.5 text-[13px] font-bold text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
