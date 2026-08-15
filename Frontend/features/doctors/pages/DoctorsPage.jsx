"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DoctorsHero } from "../components/DoctorsHero";
import { DoctorFilterBar } from "../components/DoctorFilterBar";
import { DoctorCard } from "../components/DoctorCard";
import { useDoctors } from "@/lib/hooks/useApi";

function matchesSpecialtyFocus(doctor, specialtyParam) {
  if (!specialtyParam) return true;
  const key = String(specialtyParam).toLowerCase();
  const spec = String(doctor.specialty || "").toLowerCase();

  if (key === "psychologist" || key === "mental") {
    return /psycholog|psychiatr|therap|mental/.test(spec);
  }
  if (key === "diabetes" || key === "endocrinologist") {
    return /endocrin|diabet|diabetes/.test(spec);
  }
  return spec.includes(key);
}

function applyFilters(doctors, { search, specialty, consult, availableToday }) {
  let result = [...doctors];

  if (specialty) {
    result = result.filter((d) => matchesSpecialtyFocus(d, specialty));
  }
  if (consult === "online") {
    result = result.filter((d) => d.online);
  }
  if (availableToday) {
    result = result.filter((d) => d.availableToday);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (d) =>
        String(d.name || "").toLowerCase().includes(q) ||
        String(d.specialty || "").toLowerCase().includes(q) ||
        String(d.hospital || "").toLowerCase().includes(q)
    );
  }

  return result;
}

export function DoctorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialtyParam = searchParams.get("specialty") || "";
  const consultParam = searchParams.get("consult") || "";
  const qParam = searchParams.get("q") || "";

  const [search, setSearch] = useState(qParam);
  const [availableToday, setAvailableToday] = useState(false);

  const { data: apiDoctors = [], isLoading, isError, refetch } = useDoctors();

  useEffect(() => {
    setSearch(qParam);
  }, [qParam]);

  const filtered = useMemo(
    () =>
      applyFilters(apiDoctors, {
        search,
        specialty: specialtyParam,
        consult: consultParam,
        availableToday,
      }),
    [apiDoctors, search, specialtyParam, consultParam, availableToday]
  );

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    const query = params.toString();
    router.replace(query ? `/doctors?${query}` : "/doctors");
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8]">
      <div className="home-container mx-auto py-8 md:py-10 lg:py-12">
        <DoctorsHero search={search} onSearchChange={setSearch} />

        <DoctorFilterBar
          specialty={specialtyParam}
          consult={consultParam}
          availableToday={availableToday}
          onSpecialtyChange={(specialty) => {
            setAvailableToday(false);
            updateParams({ specialty, consult: "" });
          }}
          onConsultChange={(consult) => updateParams({ consult })}
          onAvailableTodayChange={setAvailableToday}
        />

        <div className="mb-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
            Roster
          </p>
          <p className="mt-1 text-[15px] font-semibold text-[#102A43]">
            {isLoading ? "Loading…" : `${filtered.length} doctors`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-[28px] bg-[#D7E2EA]"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[28px] border border-[#102A43]/08 bg-white px-5 py-14 text-center">
            <p className="text-[16px] font-bold text-[#102A43]">Couldn&apos;t load doctors</p>
            <p className="mt-1 text-[14px] text-[#627D98]">Check your connection and retry.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 text-[13px] font-bold text-[#0B6E99]"
            >
              Try again
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                consultType={consultParam || null}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#102A43]/15 bg-white px-5 py-14 text-center">
            <p className="text-[18px] font-bold text-[#102A43]">No matches</p>
            <p className="mt-1 text-[14px] text-[#627D98]">
              Try another filter combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setAvailableToday(false);
                router.replace("/doctors");
              }}
              className="mt-4 rounded-full bg-[#062F3D] px-5 py-2.5 text-[13px] font-bold text-white"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
