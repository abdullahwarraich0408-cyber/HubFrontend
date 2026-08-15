"use client";

import Image from "next/image";
import { MagnifyingGlass, Pill } from "@phosphor-icons/react";

export function PharmaciesHero({ search, onSearchChange }) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="relative grid overflow-hidden rounded-[28px] bg-[#0B6E99] md:grid-cols-[1.1fr_0.9fr] md:rounded-[32px]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-9 text-white md:px-10 md:py-12 lg:px-12">
          <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#B8E8F5]">
            <Pill size={14} weight="fill" />
            Pharmacies
          </p>
          <h1 className="mt-3 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.08] tracking-tight text-white">
            Your neighbourhood{" "}
            <span className="text-[#7DD3C7]">pharmacy shelf</span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
            Open a partner store, browse their medicines, and order what you need —
            including prescription uploads.
          </p>

          <div className="mt-7 flex max-w-lg items-center gap-2 rounded-[14px] border border-white/20 bg-white px-4 py-3 text-[#102A43] shadow-[0_16px_40px_rgba(0,0,0,0.18)] focus-within:ring-[3px] focus-within:ring-[#7DD3C7]/45">
            <MagnifyingGlass size={20} className="shrink-0 text-[#0B6E99]" weight="bold" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search pharmacy name..."
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#627D98]"
              aria-label="Search pharmacies"
            />
          </div>
        </div>

        <div className="relative hidden min-h-[260px] md:block">
          <Image
            src="/images/home-pharmacy-editorial.png"
            alt="Pharmacy shelves and healthcare products"
            fill
            className="object-cover object-center"
            sizes="45vw"
            priority
          />
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0B6E99]/25 to-[#0B6E99]"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
