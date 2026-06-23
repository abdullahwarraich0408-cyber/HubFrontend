"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Clock, ArrowRight, Phone } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

function formatSlotSummary(date, slot) {
  if (!date || !slot) return "";
  const formatted = new Date(`${date}T12:00:00`).toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
  });
  return `${formatted}, ${slot}`;
}

export function BookingAuthModal({
  open,
  onClose,
  doctor,
  consultOption,
  selectedDate,
  selectedSlot,
  onContinue,
}) {
  const [phone, setPhone] = useState("");

  if (!open || !doctor) return null;

  const handleContinue = () => {
    if (!phone.trim()) return;
    onContinue(phone.trim());
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[420px] rounded-[20px] shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[var(--color-neutral-400)] hover:text-[var(--color-ink-headline)]"
        >
          <X size={20} weight="bold" />
        </button>

        <div className="p-6 pt-8">
          <h2 className="text-[22px] font-bold text-[var(--color-ink-headline)] mb-2">Enter your phone number</h2>
          <p className="text-[13px] text-[var(--color-neutral-500)] mb-6">
            We share this information with the doctor.
          </p>

          <div className="flex gap-2 mb-6">
            <div className="h-11 px-3 flex items-center rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-surface-subtle)] text-[13px] font-semibold text-[var(--color-neutral-600)]">
              +92
            </div>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="flex-1"
            />
          </div>

          <div className="p-4 rounded-[12px] bg-[var(--color-surface-subtle)] border border-[var(--color-neutral-200)] mb-6">
            <p className="text-[12px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wide mb-3">
              Your appointment
            </p>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image src={doctor.photo} alt={doctor.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-[13px] font-bold">{doctor.name}</p>
                <p className="text-[11px] text-[var(--color-neutral-500)]">{consultOption?.title}</p>
              </div>
            </div>
            {selectedDate && selectedSlot && (
              <p className="text-[12px] text-[var(--color-neutral-600)] flex items-center gap-2">
                <Clock size={14} className="text-[var(--color-brand-primary)]" />
                {formatSlotSummary(selectedDate, selectedSlot)}
              </p>
            )}
          </div>

          <Button className="w-full h-[48px]" disabled={!phone.trim()} onClick={handleContinue}>
            Continue
            <ArrowRight size={18} className="ml-2" />
          </Button>

          <p className="text-[11px] text-[var(--color-neutral-400)] text-center mt-4 flex items-center justify-center gap-1">
            <Phone size={12} />
            Sign in or create account to complete booking
          </p>
        </div>
      </div>
    </div>
  );
}
