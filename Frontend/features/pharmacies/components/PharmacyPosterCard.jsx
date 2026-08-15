"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  MapPin,
  ShieldCheck,
  Truck,
} from "@phosphor-icons/react";

/**
 * Landscape storefront strip — intentionally different from Labs tall posters.
 */
export function PharmacyPosterCard({ pharmacy }) {
  if (!pharmacy) return null;

  const isOpen = pharmacy.status === "open";
  const href = `/vendors/${pharmacy.slug}`;

  return (
    <Link
      href={href}
      className="group grid overflow-hidden rounded-[22px] bg-white shadow-[0_10px_32px_rgba(11,110,153,0.08)] transition-transform duration-300 hover:-translate-y-1 sm:grid-cols-[140px_1fr] md:grid-cols-[160px_1fr]"
    >
      <div className="relative h-[120px] sm:h-auto sm:min-h-[160px]">
        <Image
          src={pharmacy.bgImage}
          alt=""
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="160px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062F3D]/50 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#062F3D]/10" />
        <span
          className={`absolute left-3 top-3 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
            isOpen
              ? "bg-[#7DD3C7] text-[#062F3D]"
              : "bg-white/90 text-[#627D98]"
          }`}
        >
          {isOpen ? "Open" : "Closed"}
        </span>
      </div>

      <div className="flex flex-col justify-between gap-3 p-4 md:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex max-w-full truncate rounded-md bg-[#E8F4F8] px-2 py-1 text-[11px] font-bold text-[#0B6E99]">
              {pharmacy.name}
            </span>
            {pharmacy.verified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087F8C]">
                <ShieldCheck size={13} weight="fill" />
                Verified
              </span>
            ) : null}
          </div>

          <h2 className="mt-2 text-[18px] font-bold leading-snug tracking-tight text-[#102A43] transition-colors group-hover:text-[#0B6E99] md:text-[20px]">
            {pharmacy.name}
          </h2>

          {pharmacy.address || pharmacy.distance ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#627D98]">
              <MapPin size={14} weight="fill" className="shrink-0 text-[#0B6E99]" />
              <span className="line-clamp-1">
                {[pharmacy.distance, pharmacy.address].filter(Boolean).join(" · ")}
              </span>
            </p>
          ) : pharmacy.shortDesc ? (
            <p className="mt-1.5 line-clamp-1 text-[13px] text-[#627D98]">
              {pharmacy.shortDesc}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#E8F0F5] pt-3">
          {pharmacy.products > 0 ? (
            <span className="text-[12px] font-semibold text-[#334E68]">
              {pharmacy.products} products
            </span>
          ) : null}
          {pharmacy.deliveryTime ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#334E68]">
              <Clock size={13} weight="fill" className="text-[#0B6E99]" />
              {pharmacy.deliveryTime}
            </span>
          ) : null}
          {pharmacy.fast ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#334E68]">
              <Truck size={13} weight="fill" className="text-[#0B6E99]" />
              Fast
            </span>
          ) : null}
          {pharmacy.rating != null ? (
            <span className="text-[12px] font-semibold text-[#334E68]">
              ★ {Number(pharmacy.rating).toFixed(1)}
            </span>
          ) : null}

          <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-bold text-[#0B6E99]">
            Visit store
            <ArrowRight
              size={14}
              weight="bold"
              className="transition-transform group-hover:translate-x-[3px]"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
