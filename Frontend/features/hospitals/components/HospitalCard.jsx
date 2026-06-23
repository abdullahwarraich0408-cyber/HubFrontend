"use client";

import Image from "next/image";
import Link from "next/link";
import { Buildings, MapPin, Stethoscope, CaretRight } from "@phosphor-icons/react";

export function HospitalCard({ hospital }) {
  return (
    <Link
      href={`/hospitals/${hospital.id}`}
      className="block bg-white rounded-[20px] border border-[var(--color-neutral-200)] overflow-hidden hover:border-[var(--color-brand-primary)]/40 hover:shadow-[0_8px_24px_-8px_rgba(11,110,114,0.15)] transition-all"
    >
      <div className="relative h-[140px] bg-[var(--color-brand-mist)]">
        <Image src={hospital.coverImage} alt={hospital.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
          <div className="w-14 h-14 rounded-[12px] overflow-hidden border-2 border-white bg-white shrink-0">
            <Image src={hospital.logo} alt={hospital.name} width={56} height={56} className="object-cover w-full h-full" />
          </div>
          <div className="min-w-0 text-white">
            <h3 className="text-[16px] font-bold truncate">{hospital.name}</h3>
            {hospital.city && (
              <p className="text-[12px] text-white/80 flex items-center gap-1">
                <MapPin size={12} />
                {hospital.city}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[13px] text-[var(--color-neutral-600)]">
          <Stethoscope size={16} className="text-[var(--color-brand-primary)]" />
          <span>
            <strong className="text-[var(--color-ink-headline)]">{hospital.doctorCount}</strong> doctors available
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-brand-primary)]">
          View Doctors
          <CaretRight size={14} weight="bold" />
        </span>
      </div>
    </Link>
  );
}
