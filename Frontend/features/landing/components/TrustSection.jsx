"use client";

import {
  IdentificationCard,
  ShieldCheck,
  Prescription,
  CalendarBlank,
  Info,
} from "@phosphor-icons/react";
import { SectionHeading } from "./SectionHeading";
import { FadeIn } from "./FadeIn";

const TRUST_ITEMS = [
  {
    title: "Clear provider information",
    description: "Review profiles and service details before you book or order.",
    icon: IdentificationCard,
  },
  {
    title: "Secure account experience",
    description: "Manage your healthcare activity from a single personal account.",
    icon: ShieldCheck,
  },
  {
    title: "Prescription-aware medicine ordering",
    description: "Upload prescriptions when required for medicine requests.",
    icon: Prescription,
  },
  {
    title: "Convenient appointment management",
    description: "Book online consultations or physical visits in fewer steps.",
    icon: CalendarBlank,
  },
  {
    title: "Transparent service information",
    description: "Understand available options without unsupported medical claims.",
    icon: Info,
  },
];

export function TrustSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="landing-container">
        <FadeIn>
          <SectionHeading title="Healthcare decisions deserve confidence" />
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {TRUST_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={0.05 * index}>
                <article className="h-full rounded-[22px] border border-[#102A43]/08 bg-[#F7FAFC] p-5 md:p-6">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#087F8C] shadow-sm">
                    <Icon size={20} weight="duotone" />
                  </span>
                  <h3 className="text-[1rem] font-semibold text-[#102A43]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#52606D]">
                    {item.description}
                  </p>
                </article>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.2}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] leading-relaxed text-[#7B8794]">
            Designed to support provider credential review as the platform grows —
            Medzoos connects you with independent healthcare providers rather than
            replacing clinical judgment.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
