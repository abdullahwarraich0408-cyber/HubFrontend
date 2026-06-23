"use client";

import { FileArrowUp } from "@phosphor-icons/react";
import { PrescriptionUploadZone } from "@/features/home/components/PrescriptionUploadZone";

export function PrescriptionCTA() {
  return (
    <section className="mb-10 p-6 md:p-8 rounded-[20px] bg-white border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0">
          <FileArrowUp size={24} className="text-[var(--color-brand-primary)]" weight="duotone" />
        </div>
        <div>
          <h2 className="text-[20px] md:text-[22px] font-bold text-[var(--color-ink-headline)]">Upload Prescription</h2>
          <p className="text-[13px] text-[var(--color-neutral-500)]">
            We&apos;ll auto-assign the nearest pharmacy based on stock, distance, and availability. No manual quotes.
          </p>
        </div>
      </div>
      <PrescriptionUploadZone />
    </section>
  );
}
