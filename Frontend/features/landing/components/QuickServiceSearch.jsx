"use client";

import Link from "next/link";
import { Pill, Stethoscope, TestTube } from "@phosphor-icons/react";
import { FadeIn } from "./FadeIn";

const OPTIONS = [
  {
    title: "Medicines",
    description: "Search medicines and pharmacies",
    href: "/browse",
    icon: Pill,
  },
  {
    title: "Doctors",
    description: "Find doctors and book appointments",
    href: "/doctors",
    icon: Stethoscope,
  },
  {
    title: "Lab Tests",
    description: "Find tests and laboratories",
    href: "/lab-tests",
    icon: TestTube,
  },
];

export function QuickServiceSearch() {
  return (
    <section className="relative z-10 -mt-2 pb-6 md:-mt-4 md:pb-10" aria-labelledby="quick-search-heading">
      <div className="landing-container">
        <FadeIn>
          <div className="rounded-[28px] border border-[#102A43]/08 bg-white p-5 shadow-[0_16px_48px_rgba(16,42,67,0.08)] sm:p-7 md:p-8">
            <h2
              id="quick-search-heading"
              className="mb-5 text-center text-[1.25rem] font-semibold text-[#102A43] md:mb-6 md:text-[1.35rem]"
            >
              What are you looking for?
            </h2>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              {OPTIONS.map((option, index) => {
                const Icon = option.icon;
                return (
                  <FadeIn key={option.title} delay={0.05 * index}>
                    <Link
                      href={option.href}
                      className="group flex items-start gap-4 rounded-2xl border border-[#102A43]/08 bg-[#F7FAFC] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#087F8C]/45 hover:bg-white hover:shadow-[0_12px_32px_rgba(8,127,140,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]/40 sm:flex-col sm:items-center sm:p-5 sm:text-center md:p-6"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF8F7] text-[#087F8C] transition-colors group-hover:bg-[#087F8C] group-hover:text-white">
                        <Icon size={24} weight="duotone" />
                      </span>
                      <span>
                        <span className="block text-[16px] font-semibold text-[#102A43]">
                          {option.title}
                        </span>
                        <span className="mt-1 block text-[13px] leading-snug text-[#52606D] md:text-[14px]">
                          {option.description}
                        </span>
                      </span>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
