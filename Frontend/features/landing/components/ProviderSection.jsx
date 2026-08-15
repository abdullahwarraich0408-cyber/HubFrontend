"use client";

import {
  Users,
  Stethoscope,
  Pill,
  Microscope,
  Hospital,
} from "@phosphor-icons/react";
import { SectionHeading } from "./SectionHeading";
import { FadeIn } from "./FadeIn";

const ECOSYSTEM = [
  {
    title: "Patients",
    description: "Access healthcare services more conveniently.",
    icon: Users,
  },
  {
    title: "Doctors",
    description: "Connect with patients for online and physical consultations.",
    icon: Stethoscope,
  },
  {
    title: "Pharmacies",
    description: "Make pharmacy services and medicine availability easier to discover.",
    icon: Pill,
  },
  {
    title: "Laboratories",
    description: "Offer diagnostic tests and home sampling services where available.",
    icon: Microscope,
  },
];

export function ProviderSection() {
  return (
    <section className="bg-[#F7FAFC] py-16 md:py-20 lg:py-24">
      <div className="landing-container">
        <FadeIn>
          <SectionHeading
            title="One platform. An entire healthcare ecosystem."
            description="Medzoos is designed to bring patients and healthcare providers together through one connected platform."
          />
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {ECOSYSTEM.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={0.06 * index}>
                <article className="h-full rounded-[22px] border border-[#102A43]/08 bg-white p-5 shadow-[0_6px_24px_rgba(16,42,67,0.04)] md:p-6">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF8F7] text-[#087F8C]">
                    <Icon size={22} weight="duotone" />
                  </span>
                  <h3 className="text-[1.05rem] font-semibold text-[#102A43]">
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
          <div className="mt-4 flex items-start gap-3 rounded-[20px] border border-dashed border-[#087F8C]/25 bg-white/70 px-5 py-4 sm:items-center sm:px-6">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF8F7] text-[#087F8C] sm:mt-0">
              <Hospital size={20} weight="duotone" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-[#102A43]">
                Clinics & Hospitals
              </h3>
              <p className="mt-1 text-[14px] text-[#52606D]">
                Connect appointments and healthcare professionals with patients.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
