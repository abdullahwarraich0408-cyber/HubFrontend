"use client";

import Image from "next/image";
import { MagnifyingGlass } from "@phosphor-icons/react";

/**
 * Shared page poster — matches Pharmacies hero color scheme:
 * deep teal (#0B6E99), mint accent (#7DD3C7), split image panel.
 */
export function PageHero({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  accent,
  description,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  searchAriaLabel = "Search",
  image,
  imageAlt = "",
  actions = null,
  priority = false,
}) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="relative grid overflow-hidden rounded-[28px] bg-[#0B6E99] md:grid-cols-[1.1fr_0.9fr] md:rounded-[32px]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-9 text-white md:px-10 md:py-12 lg:px-12">
          <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#B8E8F5]">
            {EyebrowIcon ? <EyebrowIcon size={14} weight="fill" /> : null}
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-[18ch] text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.08] tracking-tight text-white">
            {title}{" "}
            {accent ? <span className="text-[#7DD3C7]">{accent}</span> : null}
          </h1>
          {description ? (
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
              {description}
            </p>
          ) : null}

          {typeof onSearchChange === "function" ? (
            <div className="mt-7 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[14px] border border-white/20 bg-white px-4 py-3 text-[#102A43] shadow-[0_16px_40px_rgba(0,0,0,0.18)] focus-within:ring-[3px] focus-within:ring-[#7DD3C7]/45">
                <MagnifyingGlass
                  size={20}
                  className="shrink-0 text-[#0B6E99]"
                  weight="bold"
                />
                <input
                  type="text"
                  value={search ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#627D98]"
                  aria-label={searchAriaLabel}
                />
              </div>
              {actions}
            </div>
          ) : actions ? (
            <div className="mt-7">{actions}</div>
          ) : null}
        </div>

        {image ? (
          <div className="relative hidden min-h-[260px] md:block">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover object-center"
              sizes="45vw"
              priority={priority}
            />
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0B6E99]/25 to-[#0B6E99]"
              aria-hidden
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
