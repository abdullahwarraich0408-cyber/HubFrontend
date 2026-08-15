"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MagnifyingGlass,
  Pill,
  Drop,
  Pulse,
  CircleHalf,
  Prescription,
  FirstAidKit,
  Star,
  MapPin,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  { label: "Diabetes Medicines", href: "/browse?category=diabetes", icon: Drop },
  { label: "Insulin", href: "/browse?category=diabetes&q=insulin", icon: Pill },
  { label: "Glucose Monitoring", href: "/browse?category=health-devices", icon: Pulse },
  { label: "Vitamins", href: "/browse?category=vitamins", icon: CircleHalf },
  {
    label: "Prescription Medicines",
    href: "/prescription",
    icon: Prescription,
    rx: true,
  },
  { label: "General Healthcare", href: "/browse", icon: FirstAidKit },
];

export function PharmacySection({ pharmacies = [], isLoading, isError, onRetry }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <section>
      <div className="mb-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0B6E99]">
          Pharmacies & Medicines
        </p>
        <h2 className="mt-1 text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold text-[#102A43]">
          Find the medicines you need
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = query.trim();
          router.push(q ? `/browse?q=${encodeURIComponent(q)}` : "/browse");
        }}
        className="mb-5 flex items-center gap-2 rounded-2xl border border-[#102A43]/08 bg-white px-4 py-3 shadow-sm focus-within:border-[#0B6E99] focus-within:ring-[3px] focus-within:ring-[#0B6E99]/15"
      >
        <MagnifyingGlass size={18} className="text-[#0B6E99]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medicine or product name"
          className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#627D98]"
          aria-label="Search medicines"
        />
        <button
          type="submit"
          className="rounded-xl bg-[#0B6E99] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#073B4C]"
        >
          Search
        </button>
      </form>

      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex flex-col items-center gap-2 rounded-[16px] border border-[#102A43]/08 bg-white p-3 text-center transition-all hover:-translate-y-0.5 hover:border-[#0B6E99]/25 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F7FA] text-[#0B6E99]">
                <Icon size={18} weight="duotone" />
              </span>
              <span className="text-[12px] font-medium leading-snug text-[#334E68]">
                {cat.label}
              </span>
              {cat.rx ? (
                <span className="rounded-full bg-[#FFF4DD] px-2 py-0.5 text-[9px] font-bold text-[#713F12]">
                  Rx
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[100px] animate-pulse rounded-[18px] bg-[#E8EEF2]" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-[20px] border border-[#102A43]/08 bg-white px-5 py-6 text-center">
          <p className="text-[14px] text-[#627D98]">We couldn&apos;t load pharmacies right now.</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 text-[13px] font-semibold text-[#0B6E99]"
            >
              Try Again
            </button>
          ) : null}
        </div>
      ) : pharmacies.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pharmacies.slice(0, 3).map((pharmacy) => (
            <Link
              key={pharmacy.slug || pharmacy.id || pharmacy.name}
              href={pharmacy.slug ? `/pharmacies/${pharmacy.slug}` : "/vendors"}
              className="flex gap-3 rounded-[18px] border border-[#102A43]/08 bg-white p-3.5 transition-all hover:border-[#0B6E99]/25 hover:shadow-sm"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F1F7FA]">
                {pharmacy.bgImage || pharmacy.logo ? (
                  <Image
                    src={pharmacy.bgImage || pharmacy.logo}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[#0B6E99]">
                    <FirstAidKit size={22} weight="duotone" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#102A43]">
                  {pharmacy.name}
                </p>
                {pharmacy.area || pharmacy.city || pharmacy.address ? (
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-[#627D98]">
                    <MapPin size={12} />
                    {pharmacy.area || pharmacy.city || pharmacy.address}
                  </p>
                ) : null}
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {typeof pharmacy.rating === "number" && pharmacy.rating > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-[#102A43]">
                      <Star size={12} weight="fill" className="text-[#F2B84B]" />
                      {pharmacy.rating.toFixed(1)}
                    </span>
                  ) : null}
                  {pharmacy.status !== "closed" ? (
                    <span className="text-[11px] font-medium text-[#176B4C]">Open</span>
                  ) : (
                    <span className="text-[11px] font-medium text-[#627D98]">Closed</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-5">
        <Link
          href="/vendors"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0B6E99] hover:underline"
        >
          Explore Pharmacies <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
    </section>
  );
}
