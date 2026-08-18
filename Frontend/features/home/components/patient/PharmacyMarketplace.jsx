"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  MagnifyingGlass,
  UploadSimple,
  Pill,
  Drop,
  Heartbeat,
  Leaf,
  FirstAidKit,
} from "@phosphor-icons/react";
import { usePrescriptionModal } from "@/features/prescription/context/PrescriptionModalContext";

const CATEGORIES = [
  {
    label: "Diabetes Medicines",
    href: "/browse?category=diabetes",
    icon: Drop,
    hint: "Oral medicines & insulin",
  },
  {
    label: "Glucose Monitoring",
    href: "/browse?category=health-devices",
    icon: Heartbeat,
    hint: "Meters, strips & sensors",
  },
  {
    label: "Vitamins",
    href: "/browse?category=vitamins",
    icon: Leaf,
    hint: "Supplements & wellness",
  },
  {
    label: "General Healthcare",
    href: "/browse",
    icon: FirstAidKit,
    hint: "Everyday healthcare products",
  },
];

export function PharmacyMarketplace() {
  const { openPrescriptionModal } = usePrescriptionModal();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    const q = query.trim();
    router.push(q ? `/browse?q=${encodeURIComponent(q)}` : "/vendors");
  };

  return (
    <section className="overflow-hidden bg-[#EEF5FC] py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="home-container mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.14em] text-[#0B6E99]">
              <Pill size={15} weight="duotone" />
              Medicines & Pharmacies
            </p>
            <h2 className="mt-2 max-w-xl text-[clamp(1.35rem,3.8vw,2.5rem)] font-extrabold leading-[1.18] tracking-tight text-[#102A43]">
              Search medicines without jumping between pharmacies
            </h2>
          </div>
          <Link
            href="/vendors"
            className="group inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-bold text-[#0B6E99] hover:text-[#073B4C] transition-colors mt-1 sm:mt-0"
          >
            <span>Explore pharmacies</span>
            <ArrowRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-[3px]"
            />
          </Link>
        </div>

        {/* Dual panels — search + prescription */}
        <div className="mt-6 sm:mt-8 grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Panel 1: Search & Categories */}
          <div className="rounded-[20px] sm:rounded-[24px] border border-[#102A43]/06 bg-white p-4 sm:p-6 md:p-8 lg:col-span-7 shadow-xs">
            <h3 className="text-[16px] sm:text-[18px] font-bold text-[#102A43]">
              Search by medicine name
            </h3>
            <p className="mt-1 text-[13px] sm:text-[14px] text-[#627D98] leading-relaxed">
              Explore medicines and healthcare products available through pharmacies on
              Medzoos.
            </p>

            <form
              onSubmit={submit}
              className="mt-4 flex items-center gap-2 rounded-[14px] border border-[#102A43]/10 bg-[#F4F8FB] px-3 py-2 focus-within:border-[#0B6E99] focus-within:bg-white focus-within:ring-[3px] focus-within:ring-[#0B6E99]/15"
            >
              <MagnifyingGlass size={18} className="ml-1 shrink-0 text-[#0B6E99]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medicine or product..."
                className="min-w-0 flex-1 bg-transparent text-[13px] sm:text-[14px] outline-none placeholder:text-[#627D98]"
                aria-label="Search medicines"
              />
              <button
                type="submit"
                className="rounded-[10px] bg-[#0B6E99] px-3.5 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-bold text-white hover:bg-[#073B4C] transition-colors shrink-0 shadow-xs"
              >
                Search
              </button>
            </form>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="group flex items-start gap-3 rounded-[16px] border border-transparent bg-[#F4F8FB] p-3 sm:px-4 sm:py-3.5 transition-all hover:border-[#0B6E99]/20 hover:bg-[#EAF4FA]"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0B6E99] shadow-xs">
                      <Icon size={18} weight="duotone" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] sm:text-[14px] font-bold text-[#102A43] group-hover:text-[#0B6E99] truncate">
                        {cat.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] sm:text-[12px] text-[#627D98] truncate">
                        {cat.hint}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Panel 2: Upload Prescription Action Card */}
          <div className="flex flex-col justify-between rounded-[20px] sm:rounded-[24px] bg-[#073B4C] p-5 sm:p-6 md:p-8 text-white lg:col-span-5 shadow-sm">
            <div>
              <span className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-white/10 text-[#7DD3C7]">
                <UploadSimple size={22} weight="duotone" />
              </span>
              <h3 className="mt-4 text-[clamp(1.25rem,2vw,1.65rem)] font-extrabold leading-snug tracking-tight text-white">
                Already have a prescription?
              </h3>
              <p className="mt-2 text-[13px] sm:text-[14px] leading-relaxed text-white/80">
                Upload it securely and continue your medicine order through pharmacies
                available on Medzoos.
              </p>
              <p className="mt-2 text-[11px] sm:text-[12px] leading-relaxed text-white/50">
                Prescription medicines require a valid prescription where applicable.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
              <button
                type="button"
                onClick={openPrescriptionModal}
                className="inline-flex h-11 sm:h-12 items-center justify-center rounded-[12px] bg-white px-5 text-[13px] sm:text-[14px] font-bold text-[#073B4C] hover:bg-[#EAF7F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-sm"
              >
                Upload Prescription
              </button>
              <Link
                href="/browse"
                className="group inline-flex h-11 sm:h-12 items-center justify-center gap-1.5 rounded-[12px] border border-white/25 px-5 text-[13px] sm:text-[14px] font-bold text-white hover:bg-white/10 transition-colors"
              >
                <span>Browse medicines</span>
                <ArrowRight
                  size={14}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-[3px]"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
