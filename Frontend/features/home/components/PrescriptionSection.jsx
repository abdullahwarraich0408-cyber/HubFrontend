"use client";

import {
  UploadSimple,
  MagnifyingGlass,
  Truck,
  Users,
  Storefront,
  Stethoscope,
  CheckCircle,
} from "@phosphor-icons/react";
import { PrescriptionUploadZone } from "./PrescriptionUploadZone";

const HOW_IT_WORKS = [
  { step: "1", title: "Upload", desc: "Upload prescription", icon: UploadSimple },
  { step: "2", title: "Auto Assign", desc: "Nearest pharmacy gets it", icon: MagnifyingGlass },
  { step: "3", title: "We Deliver", desc: "Fast delivery at home", icon: Truck },
];

const PLATFORM_STATS = [
  { value: "50K+", label: "Happy Customers", icon: Users },
  { value: "500+", label: "Partner Pharmacies", icon: Storefront },
  { value: "200+", label: "Expert Doctors", icon: Stethoscope },
  { value: "99%", label: "On-time Delivery", icon: CheckCircle },
];

export function PrescriptionSection() {
  return (
    <section className="bg-white border border-[var(--color-neutral-200)] rounded-[12px] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr_0.9fr] divide-y xl:divide-y-0 xl:divide-x divide-[var(--color-neutral-200)]">
        <div className="p-6 md:p-8">
          <PrescriptionUploadZone />
        </div>

        <div className="p-6 md:p-8">
          <h3 className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-5">How it works?</h3>
          <div className="space-y-5">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-[var(--color-brand-primary)]" weight="duotone" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[var(--color-ink-headline)]">
                    <span className="text-[var(--color-brand-primary)]">{item.step}. </span>
                    {item.title}
                  </p>
                  <p className="text-[12px] text-[var(--color-neutral-500)] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 bg-[var(--color-surface-subtle)]/60">
          <div className="grid grid-cols-2 gap-3 h-full">
            {PLATFORM_STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-[var(--color-neutral-200)] rounded-[10px] p-4 flex flex-col items-center justify-center text-center"
              >
                <stat.icon size={22} className="text-[var(--color-brand-primary)] mb-2" weight="duotone" />
                <p className="text-[18px] font-bold text-[var(--color-ink-headline)] leading-none">{stat.value}</p>
                <p className="text-[11px] text-[var(--color-neutral-500)] mt-1.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
