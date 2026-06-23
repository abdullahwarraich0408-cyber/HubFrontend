"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { LabTestsHero } from "../components/LabTestsHero";
import { LabTestCard } from "../components/LabTestCard";
import { MOCK_LAB_TESTS, CATEGORIES, getPopularPackages } from "../data/mockLabTests";
import { useLabTests, usePopularLabTests, useLabTestCategories } from "@/lib/hooks/useApi";

export function LabTestsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const { data: apiTests = [], isLoading, isError } = useLabTests();
  const { data: apiPopular = [] } = usePopularLabTests();
  const { data: apiCategories = [] } = useLabTestCategories();

  const tests = apiTests.length > 0 || !isError ? apiTests : MOCK_LAB_TESTS;
  const popular = apiPopular.length > 0 ? apiPopular : getPopularPackages();
  const categories = apiCategories.length > 0 ? apiCategories : CATEGORIES;

  const filtered = useMemo(() => {
    let result = [...tests];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.lab.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }

    return result;
  }, [tests, search, activeCategory]);

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-6 md:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
        <LabTestsHero search={search} onSearchChange={setSearch} />

        <div className="flex flex-wrap gap-3 mb-6">
          <Link href="/lab-tests/labs" className="px-4 py-2 rounded-full bg-white border border-neutral-200 text-[13px] font-semibold hover:border-brand-primary">
            Browse Labs
          </Link>
          <Link href="/lab-tests/cart" className="px-4 py-2 rounded-full bg-brand-primary text-white text-[13px] font-semibold">
            Lab Cart
          </Link>
          <Link href="/account/reports" className="px-4 py-2 rounded-full bg-white border border-neutral-200 text-[13px] font-semibold hover:border-brand-primary">
            My Reports
          </Link>
        </div>

        {/* Home sample collection banner */}
        <div className="flex items-center gap-4 p-4 md:p-5 bg-white rounded-[16px] border border-[var(--color-neutral-200)] mb-6">
          <div className="w-12 h-12 rounded-[12px] bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0 text-[24px]">
            🏠
          </div>
          <div>
            <p className="text-[14px] font-bold text-[var(--color-ink-headline)]">Free Home Sample Collection</p>
            <p className="text-[13px] text-[var(--color-neutral-500)]">
              Certified phlebotomist visits your home. No lab visit required.
            </p>
          </div>
        </div>

        {/* Popular packages */}
        {!search && !activeCategory && (
          <section className="mb-8">
            <h2 className="text-[18px] font-bold text-[var(--color-ink-headline)] mb-4">Popular Packages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popular.map((test) => (
                <LabTestCard key={test.id} test={test} compact />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="mb-6">
          <h2 className="text-[18px] font-bold text-[var(--color-ink-headline)] mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                !activeCategory
                  ? "bg-[var(--color-brand-primary)] text-white"
                  : "bg-white border border-[var(--color-neutral-200)] text-[var(--color-neutral-600)] hover:border-[var(--color-brand-primary)]"
              }`}
            >
              All Tests
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[var(--color-brand-primary)] text-white"
                    : "bg-white border border-[var(--color-neutral-200)] text-[var(--color-neutral-600)] hover:border-[var(--color-brand-primary)]"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* All tests grid */}
        <section>
          <p className="text-[13px] text-[var(--color-neutral-500)] mb-4">
            {isLoading ? "Loading tests..." : (
              <>
                <span className="font-semibold text-[var(--color-ink-headline)]">{filtered.length}</span> tests available
              </>
            )}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[240px] bg-white rounded-[16px] border border-[var(--color-neutral-200)] animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {filtered.map((test) => (
                <LabTestCard key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-12 text-center">
              <p className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-2">No tests found</p>
              <p className="text-[14px] text-[var(--color-neutral-500)]">Try a different search or category.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
