"use client";

import { Button } from "@/shared/components/Button";
import { ConsultOptionRow } from "./ConsultOptionRow";
import { buildDoctorConsultOptions } from "../utils/consultOptions";

export function DoctorBookingSidebar({ doctor, hospitalContext = null, onBookOption }) {
  const options = buildDoctorConsultOptions(doctor, { hospitalContext });

  return (
    <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] overflow-hidden sticky top-[100px]">
      <div className="p-5 border-b border-[var(--color-neutral-200)] bg-[var(--color-surface-subtle)]">
        <h3 className="text-[16px] font-bold text-[var(--color-ink-headline)]">Book Appointment</h3>
        <p className="text-[12px] text-[var(--color-neutral-500)] mt-1">Choose how you want to consult</p>
      </div>

      <div className="p-4 space-y-3">
        {options.map((option) => (
          <div key={option.id} className="space-y-2">
            <ConsultOptionRow option={option} compact />
            <Button
              className="w-full h-[42px] text-[13px]"
              onClick={() => onBookOption(option)}
            >
              Book Appointment
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
