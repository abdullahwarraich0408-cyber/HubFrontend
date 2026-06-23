"use client";

import { CreditCard, ShieldCheck, ArrowCounterClockwise, Headset } from "@phosphor-icons/react";

const TRUST_ITEMS = [
  {
    icon: CreditCard,
    title: "Secure Payments",
    subtitle: "100% Secure & Safe",
  },
  {
    icon: ShieldCheck,
    title: "Authentic Medicines",
    subtitle: "100% Genuine Products",
  },
  {
    icon: ArrowCounterClockwise,
    title: "Easy Returns",
    subtitle: "7 Days Return Policy",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    subtitle: "We are here to help",
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
