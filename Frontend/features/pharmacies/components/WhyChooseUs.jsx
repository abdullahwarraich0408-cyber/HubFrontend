"use client";

import { ShieldCheck, CreditCard, Lightning, Certificate } from "@phosphor-icons/react";

const CARDS = [
  {
    icon: ShieldCheck,
    title: "Verified pharmacies",
    desc: "Every partner is licensed and quality-checked before listing.",
  },
  {
    icon: CreditCard,
    title: "Secure payment",
    desc: "Encrypted checkout with multiple safe payment options.",
  },
  {
    icon: Lightning,
    title: "Fast delivery",
    desc: "Express delivery from pharmacies as close as 10 minutes away.",
  },
  {
    icon: Certificate,
    title: "Licensed vendors",
    desc: "Only registered pharmacies and healthcare providers on our platform.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="mb-6">
      <h2 className="text-[20px] md:text-[22px] font-bold text-[var(--color-ink-headline)] mb-4">Why Choose Us</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-5 bg-white rounded-[16px] border border-[var(--color-neutral-200)] hover:border-[var(--color-brand-primary)]/30 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-[var(--color-brand-mist)] flex items-center justify-center mb-3">
                <Icon size={22} className="text-[var(--color-brand-primary)]" weight="fill" />
              </div>
              <h3 className="text-[15px] font-bold text-[var(--color-ink-headline)] mb-1">{card.title}</h3>
              <p className="text-[13px] text-[var(--color-neutral-500)] leading-relaxed">{card.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
