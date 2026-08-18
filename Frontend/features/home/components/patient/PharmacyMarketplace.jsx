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
    <section className="overflow-hidden bg-[#EEF5FC] py-16 md:py-20 lg:py-24">
      <div className="home-container mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0B6E99]">
              <Pill size={14} weight="duotone" />
              Medicines & Pharmacies
            </p>
            <h2 className="mt-3 max-w-xl text-[clamp(1.85rem,3.2vw,2.75rem)] font-semibold leading-[1.15] tracking-tight text-[#102A43]">
              Search medicines without jumping between pharmacies
            </h2>
          </div>
          <Link
            href="/vendors"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0B6E99]"
          >
            Explore pharmacies
            <ArrowRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-[3px]"
            />
          </Link>
        </div>

        {/* Unique: dual panels — search + prescription (no lifestyle photo posters) */}
        <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:gap-5">
          <div className="rounded-[24px] border border-[#102A43]/06 bg-white p-6 md:p-8 lg:col-span-7">
            <h3 className="text-[18px] font-semibold text-[#102A43]">
              Search by medicine name
            </h3>
            <p className="mt-1.5 text-[14px] text-[#627D98]">
              Explore medicines and healthcare products available through pharmacies on
              Medzoos.
            </p>

            <form
              onSubmit={submit}
              className="mt-5 flex items-center gap-2 rounded-[14px] border border-[#102A43]/10 bg-[#F4F8FB] px-3 py-2.5 focus-within:border-[#0B6E99] focus-within:bg-white focus-within:ring-[3px] focus-within:ring-[#0B6E99]/15"
            >
              <MagnifyingGlass size={18} className="ml-1 shrink-0 text-[#0B6E99]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medicine or healthcare product"
                className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#627D98]"
                aria-label="Search medicines"
              />
              <button
                type="submit"
                className="rounded-[10px] bg-[#0B6E99] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#073B4C]"
              >
                Search
              </button>
            </form>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="group flex items-start gap-3 rounded-[16px] border border-transparent bg-[#F4F8FB] px-4 py-3.5 transition-colors hover:border-[#0B6E99]/20 hover:bg-[#EAF4FA]"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0B6E99]">
                      <Icon size={18} weight="duotone" />
                    </span>
                    <span>
                      <span className="block text-[14px] font-semibold text-[#102A43] group-hover:text-[#0B6E99]">
                        {cat.label}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-[#627D98]">
                        {cat.hint}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[24px] bg-[#073B4C] p-6 text-white md:p-8 lg:col-span-5">
            <div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#7DD3C7]">
                <UploadSimple size={22} weight="duotone" />
              </span>
              <h3 className="mt-5 text-[clamp(1.35rem,2vw,1.65rem)] font-semibold leading-snug tracking-tight">
                Already have a prescription?
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                Upload it securely and continue your medicine order through pharmacies
                available on Medzoos.
              </p>
              <p className="mt-3 text-[12px] leading-relaxed text-white/45">
                Prescription medicines require a valid prescription where applicable.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <button
                type="button"
                onClick={openPrescriptionModal}
                className="inline-flex h-12 items-center justify-center rounded-[12px] bg-white px-5 text-[14px] font-semibold text-[#073B4C] hover:bg-[#EAF7F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Upload Prescription
              </button>
              <Link
                href="/browse"
                className="group inline-flex h-12 items-center justify-center gap-1.5 rounded-[12px] border border-white/25 px-5 text-[14px] font-semibold text-white hover:bg-white/10"
              >
                Browse medicines
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
