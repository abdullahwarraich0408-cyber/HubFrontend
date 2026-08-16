"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Stethoscope } from "@phosphor-icons/react";
import { publicContentApi } from "@/lib/api/index";

const FALLBACK = [
  { id: "general", title: "General Medicine", href: "/doctors" },
  { id: "dermatology", title: "Dermatology", href: "/doctors?q=dermatology" },
  { id: "cardiology", title: "Cardiology", href: "/doctors?q=cardiology" },
  { id: "pediatrics", title: "Pediatrics", href: "/doctors?q=pediatrics" },
  { id: "mental", title: "Mental Health", href: "/doctors?specialty=psychologist" },
];

export function SpecialtyStrip() {
  const { data } = useQuery({
    queryKey: ["content", "specialties", "website"],
    queryFn: () => publicContentApi.get("specialties", "website"),
    staleTime: 5 * 60 * 1000,
  });
  const items =
    data?.items?.length > 0
      ? data.items.map((item) => ({
          id: item.id,
          title: item.title,
          href: item.href || "/doctors",
        }))
      : FALLBACK;

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
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#102A43]/08 bg-white px-4 py-2.5 text-[13px] font-medium text-[#334E68] transition-colors hover:border-[#0B6E99]/30 hover:text-[#0B6E99]"
            >
              <Stethoscope size={15} weight="duotone" className="text-[#0B6E99]" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
