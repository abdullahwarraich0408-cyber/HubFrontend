"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  House,
  MapPin,
  Flask,
} from "@phosphor-icons/react";
import { useLabs } from "@/lib/hooks/useApi";
import { mapLabToFrontend } from "@/lib/mappers/labTest";
import { LabOffersSection } from "../components/LabOffersSection";
import { LabsHero } from "../components/LabsHero";

const POSTER_VISUALS = [
  {
    image: "/images/hero-lab-test.png",
    tone: "from-[#062F3D]/95 via-[#062F3D]/55 to-transparent",
  },
  {
    image: "/images/laboratory-testing.png",
    tone: "from-[#073B4C]/95 via-[#0B6E99]/50 to-transparent",
  },
  {
    image: "/images/home-lab-sampling.png",
    tone: "from-[#17618E]/95 via-[#16A9E0]/45 to-transparent",
  },
  {
    image: "/images/card-lab-tests.png",
    tone: "from-[#062F3D]/95 via-[#16A9E0]/40 to-transparent",
  },
];

export function LabsPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [homeOnly, setHomeOnly] = useState(false);
  const params = {
    ...(search && { q: search }),
    ...(city && { city }),
    ...(homeOnly && { home_collection: "true" }),
  };
  const { data: labs = [], isLoading } = useLabs(params);

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8]">
      <div className="home-container mx-auto py-8 md:py-10 lg:py-12">
        <LabsHero search={search} onSearchChange={setSearch} />

        <LabOffersSection />

        <div className="mb-6 flex flex-wrap items-center gap-2.5">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-11 rounded-full border border-[#102A43]/08 bg-white px-4 text-[13px] font-semibold text-[#102A43] outline-none focus:ring-[3px] focus:ring-[#0B6E99]/15"
            aria-label="Filter by city"
          >
            <option value="">All cities</option>
            {["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Gujranwala"].map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )
            )}
          </select>

          <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-[#102A43]/08 bg-white px-4 text-[13px] font-semibold text-[#102A43]">
            <input
              type="checkbox"
              checked={homeOnly}
              onChange={(e) => setHomeOnly(e.target.checked)}
              className="accent-[#0B6E99]"
            />
            <House size={14} weight="bold" />
            Home collection
          </label>

          <Link
            href="/lab-tests/browse"
            className="ml-auto inline-flex h-11 items-center gap-1.5 rounded-full bg-[#062F3D] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#073B4C]"
          >
            <Flask size={15} weight="bold" />
            Browse all tests
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-[28px] bg-[#D7E2EA]"
              />
            ))}
          </div>
        ) : labs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labs.map((raw, index) => {
              const lab = mapLabToFrontend(raw);
              if (!lab) return null;
              const visual = POSTER_VISUALS[index % POSTER_VISUALS.length];
              return (
                <Link
                  key={lab.id}
                  href={`/lab-tests/labs/${lab.id}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-[28px] bg-[#D7E6EF]"
                >
                  <Image
                    src={visual.image}
                    alt=""
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${visual.tone}`}
                    aria-hidden
                  />

                  <div className="absolute inset-x-0 bottom-0 flex h-full flex-col justify-end p-5 md:p-6">
                    <p className="inline-flex max-w-full truncate self-start rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                      {lab.name}
                    </p>

                    <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/75">
                      Laboratory offer
                    </p>
                    <h2 className="mt-2 max-w-[18ch] text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold leading-snug tracking-tight text-white">
                      {lab.name}
                    </h2>

                    <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-white/70">
                      <MapPin size={14} weight="fill" />
                      <span className="truncate">
                        {lab.city || lab.address || "Pakistan"}
                      </span>
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                        {lab.testCount} {lab.testCount === 1 ? "test" : "tests"}
                      </span>
                      {lab.homeCollection ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                          <House size={11} weight="fill" />
                          Home collection
                        </span>
                      ) : null}
                      {lab.minPrice ? (
                        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                          From PKR {Number(lab.minPrice).toLocaleString()}
                        </span>
                      ) : null}
                    </div>

                    <span className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full bg-[#16A9E0] px-4 py-2.5 text-[13px] font-bold text-white transition-colors group-hover:bg-[#1290c4]">
                      View tests
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-[3px]"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#102A43]/15 bg-white px-5 py-14 text-center">
            <p className="text-[18px] font-bold text-[#102A43]">No labs found</p>
            <p className="mt-1 text-[14px] text-[#627D98]">
              Try another search or city filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCity("");
                setHomeOnly(false);
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
