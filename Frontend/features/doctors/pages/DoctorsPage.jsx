"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Funnel } from "@phosphor-icons/react";
import { DoctorsHero } from "../components/DoctorsHero";
import { DoctorFilters } from "../components/DoctorFilters";
import { DoctorCard } from "../components/DoctorCard";
import { ConsultTypeTabs } from "../components/ConsultTypeTabs";
import { MOCK_DOCTORS } from "../data/mockDoctors";
import { useDoctors } from "@/lib/hooks/useApi";

const DEFAULT_FILTERS = {
  specialties: [],
  languages: [],
  experience: [],
  online: false,
  availableToday: false,
};

const QUICK_FILTERS = [
  { id: "availableToday", label: "Available Today" },
  { id: "online", label: "Video Consultation" },
  { id: "experienced", label: "Most Experienced" },
];

function applyFilters(doctors, filters, search, category) {
  let result = [...doctors];

  if (category === "online") {
    result = result.filter((d) => d.online);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q)
    );
  }

  if (filters.specialties?.length) {
    result = result.filter((d) => filters.specialties.includes(d.specialty));
  }
  if (filters.online) {
    result = result.filter((d) => d.online);
  }
  if (filters.availableToday) {
    result = result.filter((d) => d.availableToday);
  }
  if (filters.languages?.length) {
    result = result.filter((d) => filters.languages.some((l) => d.languages.includes(l)));
  }
  if (filters.experience?.length) {
    result = result.filter((d) => {
      return filters.experience.some((exp) => {
        const min = parseInt(exp, 10);
        return d.experienceYears >= min;
      });
    });
  }

  if (filters.experienced) {
    result = [...result].sort((a, b) => b.experienceYears - a.experienceYears);
  }

  return result;
}

function parseConsultType(value) {
  if (value === "online" || value === "in_person") return value;
  return "in_person";
}

export function DoctorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: apiDoctors = [], isLoading, isError } = useDoctors();

  const doctors = apiDoctors.length > 0 || !isError ? apiDoctors : MOCK_DOCTORS;
  const category = parseConsultType(searchParams.get("consult"));
  const onlineCount = useMemo(() => doctors.filter((d) => d.online).length, [doctors]);

  const filtered = useMemo(
    () => applyFilters(doctors, filters, search, category),
    [doctors, filters, search, category]
  );

  const handleConsultChange = (nextCategory) => {
    router.replace(`/doctors?consult=${nextCategory}`);
  };

  const toggleQuickFilter = (id) => {
    if (id === "availableToday") {
      setFilters((current) => ({ ...current, availableToday: !current.availableToday }));
    } else if (id === "online") {
      setFilters((current) => ({ ...current, online: !current.online }));
    } else if (id === "experienced") {
      setFilters((current) => ({ ...current, experienced: !current.experienced }));
    }
  };

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-6 md:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
        <DoctorsHero
          search={search}
          onSearchChange={setSearch}
          category={category}
        />

        <ConsultTypeTabs
          value={category}
          onChange={handleConsultChange}
          onlineCount={onlineCount}
          className="mb-5"
        />

        <div className="flex flex-wrap gap-2 mb-5">
          {QUICK_FILTERS.map((chip) => {
            const active =
              chip.id === "availableToday"
                ? filters.availableToday
                : chip.id === "online"
                  ? filters.online
                  : filters.experienced;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => toggleQuickFilter(chip.id)}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold border transition-all ${
                  active
                    ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]"
                    : "bg-white text-[var(--color-neutral-600)] border-[var(--color-neutral-200)] hover:border-[var(--color-brand-primary)]/40"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <DoctorFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          horizontal
          category={category}
        />

        <div className="flex gap-6 lg:gap-8 mt-4">
          <div className="hidden lg:block w-[240px] shrink-0 sticky top-[120px] self-start">
            <DoctorFilters
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(DEFAULT_FILTERS)}
              category={category}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] text-[var(--color-neutral-500)]">
                {isLoading ? (
                  "Loading doctors..."
                ) : (
                  <>
                    <span className="font-semibold text-[var(--color-ink-headline)]">{filtered.length}</span>{" "}
                    doctors found
                  </>
                )}
              </p>
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-[var(--color-neutral-200)] rounded-[10px] text-[13px] font-semibold"
              >
                <Funnel size={16} />
                Filters
              </button>
            </div>

            {mobileFiltersOpen && (
              <div className="lg:hidden mb-5">
                <DoctorFilters
                  filters={filters}
                  onChange={setFilters}
                  onClear={() => setFilters(DEFAULT_FILTERS)}
                  category={category}
                />
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[200px] bg-white rounded-[16px] border border-[var(--color-neutral-200)] animate-pulse" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-4">
                {filtered.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} consultType={category} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-12 text-center">
                <p className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-2">No doctors found</p>
                <p className="text-[14px] text-[var(--color-neutral-500)]">
                  Try another consult type or adjust your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
