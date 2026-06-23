"use client";

import { X } from "@phosphor-icons/react";
import { ConsultOptionRow } from "./ConsultOptionRow";

export function BookConsultModal({ doctor, options, open, onClose, onSelect }) {
  if (!open || !doctor) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative bg-white w-full max-w-[480px] rounded-[20px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between p-5 border-b border-[var(--color-neutral-200)]">
          <div>
            <h2 className="text-[18px] font-bold text-[var(--color-ink-headline)]">
              Book appointment with {doctor.name}
            </h2>
            <p className="text-[13px] text-[var(--color-neutral-500)] mt-1">Please select one</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-neutral-400)] hover:text-[var(--color-ink-headline)] hover:bg-[var(--color-surface-subtle)]"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {options.map((option) => (
            <ConsultOptionRow
              key={option.id}
              option={option}
              onClick={(selected) => {
                onSelect(selected);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
