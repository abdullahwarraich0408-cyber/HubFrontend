"use client";

import Link from "next/link";
import { ShieldCheck, MapPin, Star, Clock, Pill, ArrowRight } from "@phosphor-icons/react";

export function PharmacyCard({ pharmacy }) {
  const isOpen = pharmacy.status === "open";

  return (
    <Link
      href="/browse"
      className="group flex flex-col bg-white rounded-[20px] border border-[var(--color-neutral-200)] overflow-hidden hover:border-[var(--color-brand-primary)]/35 hover:shadow-[0_12px_40px_-12px_rgba(11,110,114,0.15)] transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative h-[180px] overflow-hidden bg-[var(--color-neutral-100)]">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${pharmacy.bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          {pharmacy.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-md border border-white/15">
              {tag}
            </span>
          ))}
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md ${
            isOpen ? "bg-[var(--color-status-success)]/90 text-white" : "bg-neutral-500/90 text-white"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-white animate-pulse" : "bg-white/60"}`} />
            {isOpen ? "Open" : "Closed"}
          </span>
          {pharmacy.verified && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-[var(--color-brand-primary)] text-white text-[10px] font-bold uppercase rounded-full">
              <ShieldCheck size={12} weight="fill" />
              Verified
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-[12px] font-semibold text-white">
          <MapPin size={14} className="text-[var(--color-brand-highlight)]" weight="fill" />
          {pharmacy.distance}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-[14px] icon-box-light flex items-center justify-center shrink-0 -mt-8 relative z-10 border-2 border-white shadow-sm">
            <span className="text-[var(--color-brand-primary)] font-bold text-[14px]">{pharmacy.initials}</span>
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="text-[17px] font-bold text-[var(--color-ink-headline)] group-hover:text-[var(--color-brand-primary)] transition-colors truncate">
              {pharmacy.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star size={14} weight="fill" className="text-[var(--color-rating)]" />
                <span className="text-[13px] font-bold">{pharmacy.rating}</span>
              </div>
              <span className="text-[11px] text-[var(--color-neutral-400)]">({pharmacy.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <p className="text-[13px] text-[var(--color-neutral-500)] leading-relaxed line-clamp-2 mb-4">
          {pharmacy.desc}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2.5 bg-[var(--color-surface-subtle)] rounded-[10px]">
            <Pill size={16} className="text-[var(--color-brand-primary)]" />
            <span className="text-[12px] font-semibold text-[var(--color-neutral-700)]">{pharmacy.products.toLocaleString()}+ items</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-[var(--color-surface-subtle)] rounded-[10px]">
            <Clock size={16} className="text-[var(--color-brand-primary)]" weight="fill" />
            <span className="text-[12px] font-semibold text-[var(--color-neutral-700)]">{pharmacy.deliveryTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-neutral-100)] mt-auto">
          <span className="text-[12px] font-semibold text-[var(--color-neutral-400)]">Browse products</span>
          <span className="flex items-center gap-1 text-[13px] font-bold text-[var(--color-brand-primary)] group-hover:gap-2 transition-all">
            Visit Store
            <ArrowRight size={16} weight="bold" />
          </span>
        </div>
      </div>
    </Link>
  );
}
