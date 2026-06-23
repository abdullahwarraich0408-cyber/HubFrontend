"use client";

import { Scales, X } from "@phosphor-icons/react";

const METRICS = [
  { key: "delivery", label: "Delivery" },
  { key: "pricing", label: "Pricing" },
  { key: "availability", label: "Availability" },
];

function ScoreBar({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[var(--color-neutral-100)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-brand-primary)] rounded-full transition-all"
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="text-[12px] font-bold text-[var(--color-neutral-600)] w-6">{value}/10</span>
    </div>
  );
}

export function ComparePharmacies({ selectedPharmacies, onRemove }) {
  if (selectedPharmacies.length === 0) return null;

  return (
    <section className="mb-10 p-5 md:p-6 bg-white rounded-[20px] border border-[var(--color-neutral-200)]">
      <div className="flex items-center gap-2 mb-5">
        <Scales size={22} className="text-[var(--color-brand-primary)]" weight="fill" />
        <div>
          <h2 className="text-[18px] font-bold text-[var(--color-ink-headline)]">Compare Pharmacies</h2>
          <p className="text-[12px] text-[var(--color-neutral-500)]">Compare up to 3 pharmacies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectedPharmacies.map((pharmacy) => (
          <div key={pharmacy.id} className="p-4 rounded-[14px] border border-[var(--color-neutral-200)] bg-[var(--color-surface-subtle)]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-[10px] icon-box-light flex items-center justify-center">
                  <span className="text-[var(--color-brand-primary)] font-bold text-[12px]">{pharmacy.initials}</span>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[var(--color-ink-headline)]">{pharmacy.name}</p>
                  <p className="text-[11px] text-[var(--color-neutral-500)]">{pharmacy.deliveryTime}</p>
                </div>
              </div>
              <button
                onClick={() => onRemove(pharmacy.id)}
                className="p-1 rounded-full hover:bg-white text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)]"
                aria-label={`Remove ${pharmacy.name} from compare`}
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {METRICS.map((m) => (
                <div key={m.key}>
                  <p className="text-[11px] font-semibold text-[var(--color-neutral-500)] mb-1">{m.label}</p>
                  <ScoreBar value={pharmacy.compare[m.key]} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
