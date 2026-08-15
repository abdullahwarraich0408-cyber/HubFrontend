"use client";

import { FileArrowUp } from "@phosphor-icons/react";
import { PrescriptionUploadZone } from "@/features/home/components/PrescriptionUploadZone";

export function PrescriptionCTA() {
  return (
    <section className="overflow-hidden rounded-[22px] border border-[#0B6E99]/12 bg-white p-6 shadow-[0_10px_32px_rgba(11,110,153,0.08)] md:p-8">
      <div className="mb-5 flex items-start gap-3 md:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#E8F4F8]">
          <FileArrowUp size={24} className="text-[#0B6E99]" weight="duotone" />
        </div>
        <div>
          <h2 className="text-[20px] font-bold tracking-tight text-[#102A43] md:text-[22px]">
            Upload prescription
          </h2>
          <p className="mt-1 text-[13px] text-[#627D98] md:text-[14px]">
            Send your prescription and we&apos;ll match stock from partner pharmacies.
          </p>
        </div>
      </div>
      <PrescriptionUploadZone />
    </section>
  );
}
