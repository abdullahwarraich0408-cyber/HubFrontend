"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { SectionHeading } from "./SectionHeading";
import { LandingImage } from "./LandingImage";
import { FadeIn } from "./FadeIn";

const FOCUS_AREAS = [
  {
    id: "diabetes-care",
    title: "Diabetes Care",
    description:
      "Access the services commonly needed for ongoing diabetes management through one connected experience.",
    pills: [
      "Diabetes medicines",
      "Insulin",
      "Diabetologists",
      "HbA1c Tests",
      "Blood Tests",
      "Home Sampling",
      "Regular Consultations",
    ],
    cta: "Explore Diabetes Care",
    href: "/browse?category=diabetes",
    image: "/images/diabetes-care.png",
    alt: "Healthcare professional discussing diabetes care with a patient at home",
  },
  {
    id: "mental-health",
    title: "Mental Health Support",
    description:
      "Find mental healthcare professionals for anxiety, depression, stress and other common mental health concerns.",
    pills: [
      "Psychologists",
      "Psychiatrists",
      "Online Sessions",
      "Clinic Visits",
      "Anxiety Support",
      "Stress Support",
      "Depression Support",
    ],
    cta: "Explore Mental Health",
    href: "/doctors?specialty=psychologist",
    image: "/images/mental-health.png",
    alt: "Psychologist in a calm supportive conversation with a patient",
  },
];

export function FocusAreas() {
  return (
    <section className="bg-[#F0F7F7] py-16 md:py-20 lg:py-24">
      <div className="landing-container">
        <FadeIn>
          <SectionHeading
            eyebrow="Focused Care"
            title="Starting with healthcare needs that require continuous support"
            description="Medzoos is initially focusing on diabetes and mental health while building toward a broader healthcare ecosystem."
          />
        </FadeIn>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {FOCUS_AREAS.map((area, index) => (
            <FadeIn key={area.id} delay={0.08 * index}>
              <article
                id={area.id}
                className="scroll-mt-28 overflow-hidden rounded-[28px] border border-[#102A43]/08 bg-white shadow-[0_10px_36px_rgba(16,42,67,0.06)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#EAF8F7]">
                  <LandingImage
                    src={area.image}
                    alt={area.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-full w-full"
                    imageClassName="object-cover"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-[1.35rem] font-semibold text-[#102A43] md:text-[1.5rem]">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#52606D]">
                    {area.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {area.pills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-[#17618E]/15 bg-[#EAF8F7] px-3 py-1.5 text-[12px] font-medium text-[#124362]"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={area.href}
                    className="group mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#17618E] px-5 text-[14px] font-semibold text-white transition-all hover:bg-[#124362] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17618E]/40 focus-visible:ring-offset-2"
                  >
                    {area.cta}
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
