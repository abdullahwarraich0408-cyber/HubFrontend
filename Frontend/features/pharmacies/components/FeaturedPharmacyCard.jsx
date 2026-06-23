"use client";

import Link from "next/link";
import { Star, Clock, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";

export function FeaturedPharmacyCard({ pharmacy }) {
  return (
    <div className="flex-shrink-0 w-[280px] md:w-[300px] bg-white rounded-[18px] border border-[var(--color-neutral-200)] p-5 hover:border-[var(--color-brand-primary)]/40 hover:shadow-lg transition-all">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-14 h-14 rounded-[14px] icon-box-light flex items-center justify-center shrink-0">
          <span className="text-[var(--color-brand-primary)] font-bold text-[16px]">{pharmacy.initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-bold text-[var(--color-ink-headline)] truncate">{pharmacy.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Star size={14} weight="fill" className="text-[var(--color-rating)]" />
            <span className="text-[13px] font-bold">{pharmacy.rating}</span>
            <span className="text-[11px] text-[var(--color-neutral-400)]">({pharmacy.reviews})</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-neutral-600)] mb-3">
        <Clock size={14} className="text-[var(--color-brand-primary)]" weight="fill" />
        Delivery {pharmacy.deliveryTime}
      </div>

      <p className="text-[13px] text-[var(--color-neutral-500)] leading-relaxed line-clamp-2 mb-4 min-h-[40px]">
        {pharmacy.shortDesc}
      </p>

      <Link href={`/pharmacies/${pharmacy.slug}`}>
        <Button variant="primary" className="w-full h-[42px] rounded-full text-[13px] font-semibold gap-2">
          Visit Store
          <ArrowRight size={16} weight="bold" />
        </Button>
      </Link>
    </div>
  );
}
