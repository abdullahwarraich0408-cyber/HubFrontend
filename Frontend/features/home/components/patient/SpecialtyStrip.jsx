"use client";

import Link from "next/link";
import {
  Stethoscope,
  Drop,
  ForkKnife,
  Heart,
  Baby,
  PersonSimpleWalk,
  Tooth,
  Brain,
} from "@phosphor-icons/react";

const SPECIALTIES = [
  { label: "General Medicine", icon: Stethoscope, href: "/doctors" },
  { label: "Dermatology", icon: Drop, href: "/doctors?q=dermatology" },
  { label: "Nutrition", icon: ForkKnife, href: "/browse?category=nutrition" },
  { label: "Cardiology", icon: Heart, href: "/doctors?q=cardiology" },
  { label: "Gynecology", icon: Heart, href: "/doctors?q=gynecology" },
  { label: "Pediatrics", icon: Baby, href: "/doctors?q=pediatrics" },
  { label: "Physiotherapy", icon: PersonSimpleWalk, href: "/doctors?q=physiotherapy" },
  { label: "Dental Care", icon: Tooth, href: "/doctors?q=dental" },
  { label: "Mental Health", icon: Brain, href: "/doctors?specialty=psychologist" },
  { label: "Diabetes Doctors", icon: Stethoscope, href: "/doctors?specialty=diabetes" },
];

export function SpecialtyStrip() {
  return (
    <section className="border-t border-[#102A43]/06 bg-[#F1F7FA] py-12 md:py-14">
      <div className="home-container mx-auto">
        <h2 className="text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold text-[#102A43]">
          Explore more healthcare
        </h2>
        <p className="mt-1 text-[14px] text-[#627D98]">
          Diabetes and mental health are only the beginning.
        </p>

        <div className="mt-6 flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {SPECIALTIES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#102A43]/08 bg-white px-4 py-2.5 text-[13px] font-medium text-[#334E68] transition-colors hover:border-[#0B6E99]/30 hover:text-[#0B6E99]"
              >
                <Icon size={15} weight="duotone" className="text-[#0B6E99]" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
