"use client";

import Link from "next/link";
import { ShieldCheck, Star, Clock, ArrowRight, CheckCircle, XCircle } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";

const SERVICE_LABELS = [
  { key: "medicines", icon: "💊", label: "Medicines" },
  { key: "doctors", icon: "🩺", label: "Doctors" },
  { key: "labTests", icon: "🧪", label: "Lab" },
];

export function VendorGridCard({ pharmacy, compareSelected, onCompareToggle, compareDisabled }) {
  const isOpen = pharmacy.status === "open";
  const activeServices = SERVICE_LABELS.filter((s) => pharmacy.services[s.key]);

  return (
    <div className="group flex flex-col bg-white rounded-[20px] border border-[var(--color-neutral-200)] overflow-hidden hover:border-[var(--color-brand-primary)]/35 hover:shadow-[0_12px_40px_-12px_rgba(11,110,114,0.15)] transition-all duration-300">
      <div className="relative h-[140px] overflow-hidden bg-[var(--color-neutral-100)]">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${pharmacy.bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <label className="flex items-center gap-1.5 px-2.5 py-1 bg-white/95 rounded-full text-[11px] font-semibold text-[var(--color-neutral-700)] cursor-pointer">
            <input
              type="checkbox"
              checked={compareSelected}
              disabled={compareDisabled && !compareSelected}
              onChange={() => onCompareToggle(pharmacy.id)}
              className="w-3.5 h-3.5 rounded text-[var(--color-brand-primary)]"
            />
            Compare
          </label>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-3 -mt-10 relative z-10">
          <div className="w-14 h-14 rounded-[14px] icon-box-light flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
            <span className="text-[var(--color-brand-primary)] font-bold text-[15px]">{pharmacy.initials}</span>
          </div>
          <div className="flex-1 min-w-0 pt-6">
            <h3 className="text-[17px] font-bold text-[var(--color-ink-headline)] truncate">{pharmacy.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    weight="fill"
                    className={s <= Math.round(pharmacy.rating) ? "text-[var(--color-rating)]" : "text-[var(--color-neutral-200)]"}
                  />
                ))}
                <span className="text-[12px] font-bold ml-1">{pharmacy.rating}</span>
              </div>
              {pharmacy.verified && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase text-[var(--color-brand-primary)]">
                  <ShieldCheck size={12} weight="fill" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-[13px] font-semibold text-[var(--color-neutral-600)] mb-3">
          <span className={isOpen ? "text-[var(--color-status-success)]" : "text-[var(--color-neutral-400)]"}>
            {isOpen ? "Open" : "Closed"}
          </span>
          <span className="text-[var(--color-neutral-300)] mx-1.5">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={13} className="text-[var(--color-brand-primary)]" weight="fill" />
            Delivery {pharmacy.deliveryTime}
          </span>
        </p>

        <div className="mb-4">
          <p className="text-[11px] font-bold uppercase text-[var(--color-neutral-400)] mb-2">Services</p>
          <div className="flex flex-wrap gap-2">
            {activeServices.map((s) => (
              <span
                key={s.key}
                className="px-2.5 py-1 bg-[var(--color-surface-subtle)] rounded-lg text-[11px] font-semibold text-[var(--color-neutral-600)]"
              >
                {s.icon} {s.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          {pharmacy.stockAvailable ? (
            <>
              <CheckCircle size={16} className="text-[var(--color-status-success)]" weight="fill" />
              <span className="text-[12px] font-semibold text-[var(--color-status-success)]">Stock Available</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-[var(--color-status-danger)]" weight="fill" />
              <span className="text-[12px] font-semibold text-[var(--color-status-danger)]">Limited Stock</span>
            </>
          )}
        </div>

        <Link href={`/pharmacies/${pharmacy.slug}`} className="mt-auto">
          <Button variant="primary" className="w-full h-[44px] rounded-full text-[13px] font-semibold gap-2">
            Visit Store
            <ArrowRight size={16} weight="bold" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
