"use client";

import { Drop, Brain, Flask, Headset } from "@phosphor-icons/react";

const TRUST_ITEMS = [
  {
    icon: Drop,
    title: "Diabetes-First Care",
    subtitle: "Medicines, monitors & supplies",
  },
  {
    icon: Brain,
    title: "Psychologist Support",
    subtitle: "Mental wellness with clinical care",
  },
  {
    icon: Flask,
    title: "Trusted Lab Panels",
    subtitle: "HbA1c & sugar tests at home",
  },
  {
    icon: Headset,
    title: "Care Guidance",
    subtitle: "Help for your diabetes journey",
  },
];

export function TrustBar() {
  return (
    <section className="w-full bg-white border-y border-[var(--color-neutral-200)]">
      <div className="w-full home-container mx-auto py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-[var(--color-brand-mist)] flex items-center justify-center">
                <item.icon size={22} className="text-[var(--color-brand-primary)]" weight="duotone" />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] md:text-[15px] font-bold text-[var(--color-ink-headline)] leading-tight">
                  {item.title}
                </p>
                <p className="text-[12px] md:text-[13px] text-[var(--color-neutral-500)] mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
