"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { SectionHeading } from "./SectionHeading";
import { FadeIn } from "./FadeIn";
import { publicContentApi } from "@/lib/api/index";

const FALLBACK_SPECIALTIES = [
  { title: "General Medicine", href: "/doctors" },
  { title: "Cardiology", href: "/doctors?q=cardiology" },
  { title: "Dermatology", href: "/doctors?q=dermatology" },
  { title: "Gynecology", href: "/doctors?q=gynecology" },
  { title: "Pediatrics", href: "/doctors?q=pediatrics" },
  { title: "Neurology", href: "/doctors?q=neurology" },
  { title: "Nutrition", href: "/doctors?q=nutrition" },
  { title: "Physiotherapy", href: "/doctors?q=physiotherapy" },
  { title: "Dental Care", href: "/doctors?q=dentist" },
  { title: "Preventive Health", href: "/doctors" },
];

export function FutureSpecialties() {
  const { data } = useQuery({
    queryKey: ["content", "specialties", "website"],
    queryFn: () => publicContentApi.get("specialties", "website"),
    staleTime: 5 * 60 * 1000,
  });

  const specialties =
    data?.items?.length > 0
      ? data.items.map((item) => ({
          id: item.id,
          title: item.title,
          href: item.href || `/doctors?q=${encodeURIComponent(item.title.toLowerCase())}`,
        }))
      : FALLBACK_SPECIALTIES;

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
            {specialties.map((specialty) => (
              <Link
                key={specialty.id || specialty.title}
                href={specialty.href}
                className="rounded-full border border-[#102A43]/10 bg-white px-4 py-2 text-[13px] font-medium text-[#334E68] shadow-sm transition-all hover:border-[#17618E]/30 hover:text-[#17618E] hover:shadow md:text-[14px]"
              >
                {specialty.title}
              </Link>
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

