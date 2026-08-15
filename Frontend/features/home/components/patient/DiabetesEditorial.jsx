"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  MagnifyingGlass,
  Pill,
  Drop,
  Pulse,
  Syringe,
} from "@phosphor-icons/react";

const MEDICINE_PATHS = [
  {
    label: "Diabetes Medicines",
    detail: "Oral medicines available through Medzoos",
    href: "/browse?category=diabetes",
    icon: Pill,
  },
  {
    label: "Insulin",
    detail: "Explore insulin options where available",
    href: "/browse?category=diabetes&q=insulin",
    icon: Syringe,
  },
  {
    label: "Glucose Monitoring",
    detail: "Meters, strips and monitoring supplies",
    href: "/browse?category=health-devices",
    icon: Pulse,
  },
  {
    label: "All Diabetes Care",
    detail: "Browse the full diabetes category",
    href: "/browse?category=diabetes",
    icon: Drop,
  },
];

export function DiabetesEditorial() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [imgFailed, setImgFailed] = useState(false);

  const submit = (e) => {
    e?.preventDefault();
    const q = query.trim();
    router.push(
      q
        ? `/browse?category=diabetes&q=${encodeURIComponent(q)}`
        : "/browse?category=diabetes"
    );
  };

  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="home-container mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0B6E99]">
              <Drop size={14} weight="fill" />
              Diabetes Care
            </p>
            <h2 className="mt-3 text-[clamp(1.9rem,3.8vw,3.15rem)] font-semibold leading-[1.12] tracking-tight text-[#102A43]">
              Diabetes medicines and monitoring, in one place
            </h2>
          </div>
          <p className="max-w-sm text-[16px] leading-relaxed text-[#627D98] lg:pb-1">
            Search diabetes medicines and monitoring supplies available through pharmacies
            on Medzoos.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-8 flex items-center gap-2 rounded-[16px] border border-[#102A43]/08 bg-[#F4F8FB] px-4 py-3.5 transition-all focus-within:border-[#0B6E99] focus-within:bg-white focus-within:ring-[3px] focus-within:ring-[#0B6E99]/15 md:mt-10"
        >
          <MagnifyingGlass size={20} className="shrink-0 text-[#0B6E99]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search diabetes medicine, insulin, strips..."
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[#102A43] outline-none placeholder:text-[#627D98]"
            aria-label="Search diabetes medicines"
          />
          <button
            type="submit"
            className="rounded-[12px] bg-[#0B6E99] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#073B4C]"
          >
            Search
          </button>
        </form>

        <div className="relative mt-8 overflow-hidden rounded-[28px] md:rounded-[32px]">
          <div className="relative aspect-[21/9] min-h-[220px] bg-[#EAF7F5] md:aspect-[2.4/1] md:min-h-[280px]">
            {!imgFailed ? (
              <Image
                src="/images/home-diabetes-editorial.png"
                alt="Patient managing diabetes medicines and care at home"
                fill
                className="object-cover object-[center_28%]"
                sizes="100vw"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#EAF7F5] to-[#DEEEF9]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#073B4C]/55 via-[#073B4C]/15 to-transparent" />
            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
              <Link
                href="/browse?category=diabetes"
                className="group inline-flex h-12 items-center gap-2 rounded-[12px] bg-white px-5 text-[14px] font-semibold text-[#073B4C] transition-colors hover:bg-[#EAF7F5]"
              >
                Explore diabetes medicines
                <ArrowRight
                  size={16}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-[3px]"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid border-t border-[#102A43]/08 sm:grid-cols-2 lg:grid-cols-4">
          {MEDICINE_PATHS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group flex gap-3 border-b border-[#102A43]/08 px-1 py-5 transition-colors hover:bg-[#F7FBFC] sm:px-4 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7F5] text-[#0B6E99]">
                  <Icon size={18} weight="duotone" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold text-[#102A43] transition-colors group-hover:text-[#0B6E99]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-[13px] text-[#627D98]">
                    {item.detail}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
