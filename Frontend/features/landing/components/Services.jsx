"use client";

import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { SectionHeading } from "./SectionHeading";
import { LandingImage } from "./LandingImage";
import { FadeIn } from "./FadeIn";

const SERVICES = [
  {
    title: "Medicines & Pharmacy",
    description:
      "Find medicines and order from pharmacies available through the Medzoos platform.",
    features: ["Search medicines", "Prescription upload", "Order tracking", "Repeat orders"],
    cta: "Explore Medicines",
    href: "/browse",
    image: "/images/pharmacy-medicines.png",
    alt: "Pharmacist helping a customer in a modern Pakistani pharmacy",
  },
  {
    title: "Doctors & Consultations",
    description:
      "Find healthcare professionals according to your needs and book online or physical appointments.",
    features: [
      "Doctor profiles",
      "Specializations",
      "Online consultations",
      "Clinic appointments",
    ],
    cta: "Find a Doctor",
    href: "/doctors",
    image: "/images/doctor-consultation.png",
    alt: "Doctor consulting with a patient in a modern clinic",
  },
  {
    title: "Lab Tests",
    description:
      "Search diagnostic tests, explore laboratory services and request home sampling where available.",
    features: ["Test search", "Laboratory selection", "Home collection", "Digital reports"],
    cta: "Explore Lab Tests",
    href: "/lab-tests",
    image: "/images/laboratory-testing.png",
    alt: "Laboratory technologist preparing a diagnostic sample",
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 py-16 md:py-20 lg:py-24">
      <div className="landing-container">
        <FadeIn>
          <SectionHeading
            eyebrow="Healthcare Services"
            title="Everything you need for easier healthcare access"
            description="Discover essential healthcare services through one connected digital experience."
          />
        </FadeIn>

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <FadeIn key={service.title} delay={0.08 * index}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#102A43]/08 bg-white shadow-[0_8px_30px_rgba(16,42,67,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,42,67,0.1)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EAF8F7]">
                  <LandingImage
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="h-full w-full"
                    imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="text-[1.2rem] font-semibold text-[#102A43]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#52606D] md:text-[15px]">
                    {service.description}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-[14px] text-[#334E68]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF8F7] text-[#087F8C]">
                          <Check size={12} weight="bold" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={service.href}
                    className="group/btn mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-semibold text-[#087F8C] transition-colors hover:text-[#075E68]"
                  >
                    {service.cta}
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="transition-transform group-hover/btn:translate-x-0.5"
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
