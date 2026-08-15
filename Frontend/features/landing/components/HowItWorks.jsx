"use client";

import { MagnifyingGlass, UserCircleCheck, CalendarCheck } from "@phosphor-icons/react";
import { SectionHeading } from "./SectionHeading";
import { FadeIn } from "./FadeIn";

const STEPS = [
  {
    number: "01",
    title: "Find a Service",
    description: "Search for medicines, doctors, consultations or diagnostic tests.",
    icon: MagnifyingGlass,
  },
  {
    number: "02",
    title: "Choose a Provider",
    description:
      "Explore available healthcare providers and select an option that suits your needs.",
    icon: UserCircleCheck,
  },
  {
    number: "03",
    title: "Book or Order",
    description:
      "Book your appointment, arrange a test or continue with your medicine order.",
    icon: CalendarCheck,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="landing-container">
        <FadeIn>
          <SectionHeading
            eyebrow="Simple Healthcare Access"
            title="How Medzoos works"
          />
        </FadeIn>

        <div className="relative mt-12 md:mt-14">
          <div
            className="pointer-events-none absolute left-[16%] right-[16%] top-[52px] hidden h-px bg-gradient-to-r from-transparent via-[#087F8C]/30 to-transparent lg:block"
            aria-hidden
          />
          <ol className="grid gap-5 md:grid-cols-3 md:gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <FadeIn key={step.number} delay={0.08 * index}>
                  <li className="relative rounded-[24px] border border-[#102A43]/08 bg-white p-6 shadow-[0_8px_28px_rgba(16,42,67,0.04)] md:p-7">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF8F7] text-[#087F8C]">
                        <Icon size={24} weight="duotone" />
                      </span>
                      <span className="font-sans text-[2rem] font-semibold leading-none text-[#087F8C]/20">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-[1.15rem] font-semibold text-[#102A43]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-[#52606D] md:text-[15px]">
                      {step.description}
                    </p>
                  </li>
                </FadeIn>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
