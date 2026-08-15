"use client";

import { SectionHeading } from "./SectionHeading";
import { FadeIn } from "./FadeIn";

const SPECIALTIES = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Gynecology",
  "Pediatrics",
  "Neurology",
  "Nutrition",
  "Physiotherapy",
  "Dental Care",
  "Preventive Health",
];

export function FutureSpecialties() {
  return (
    <section className="py-14 md:py-16 lg:py-20">
      <div className="landing-container">
        <FadeIn>
          <SectionHeading
            title="Built to grow with your healthcare needs"
            description="Diabetes and mental health are only the beginning."
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5 md:mt-10 md:gap-3">
            {SPECIALTIES.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full border border-[#102A43]/10 bg-white px-4 py-2 text-[13px] font-medium text-[#334E68] shadow-sm md:text-[14px]"
              >
                {specialty}
              </span>
            ))}
          </div>
          <p className="mt-6 text-center text-[14px] text-[#7B8794]">
            And more healthcare specialties in the future.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
