"use client";

import {
  SquaresFour,
  DeviceMobile,
  UsersThree,
  MapPin,
} from "@phosphor-icons/react";
import { SectionHeading } from "./SectionHeading";
import { FadeIn } from "./FadeIn";

const BENEFITS = [
  {
    title: "One Connected Platform",
    description:
      "Manage multiple healthcare needs without moving between different platforms.",
    icon: SquaresFour,
  },
  {
    title: "Convenient Access",
    description: "Discover healthcare services from your phone or computer.",
    icon: DeviceMobile,
  },
  {
    title: "Multiple Healthcare Providers",
    description:
      "Explore doctors, pharmacies and diagnostic services from one place.",
    icon: UsersThree,
  },
  {
    title: "Built for Pakistan",
    description:
      "Designed around the healthcare needs and digital habits of patients in Pakistan.",
    icon: MapPin,
  },
];

export function WhyMedzoos() {
  return (
    <section className="bg-[#F0F7F7] py-16 md:py-20 lg:py-24">
      <div className="landing-container">
        <FadeIn>
          <SectionHeading title="Healthcare access designed around you" />
        </FadeIn>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <FadeIn key={benefit.title} delay={0.06 * index}>
                <article className="h-full rounded-[22px] border border-[#102A43]/08 bg-white p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#17618E]/20 bg-transparent text-[#17618E]">
                    <Icon size={22} weight="regular" />
                  </span>
                  <h3 className="text-[1.05rem] font-semibold text-[#102A43]">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#52606D]">
                    {benefit.description}
                  </p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
