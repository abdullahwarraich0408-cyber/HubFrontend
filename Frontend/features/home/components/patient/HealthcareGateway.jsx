"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { useVendors, useLabs, useDoctors } from "@/lib/hooks/useApi";

const OFFER_BASE = [
  {
    id: "medicines",
    eyebrow: "Medicines",
    title: "Find medicines and healthcare essentials",
    cta: "Explore medicines",
    href: "/browse",
    image: "/images/hero-buy-medicine.png",
    alt: "Medicines and pharmacy products available through Medzoos",
    tone: "from-[#073B4C]/85 via-[#073B4C]/45 to-transparent",
    companyFallback: "Medzoos pharmacies",
  },
  {
    id: "pharmacies",
    eyebrow: "Pharmacies",
    title: "Browse pharmacies and healthcare products",
    cta: "Explore pharmacies",
    href: "/vendors",
    image: "/images/home-pharmacy-editorial.png",
    alt: "Pharmacist assisting a customer in a modern pharmacy",
    tone: "from-[#0B6E99]/90 via-[#0B6E99]/50 to-transparent",
    companyFallback: "Partner pharmacies",
  },
  {
    id: "doctors",
    eyebrow: "Doctors",
    title: "Consult doctors online or in clinic",
    cta: "Find a doctor",
    href: "/doctors",
    image: "/images/hero-consult-doctor.png",
    alt: "Doctor consultation available through Medzoos",
    tone: "from-[#087F8C]/90 via-[#087F8C]/45 to-transparent",
    companyFallback: "Medzoos doctors",
  },
];

export function HealthcareGateway() {
  const vendorsQuery = useVendors();
  const labsQuery = useLabs();
  const doctorsQuery = useDoctors();

  const pharmacyName =
    vendorsQuery.data?.[0]?.name || vendorsQuery.data?.[0]?.businessName || null;
  const labName = labsQuery.data?.[0]?.name || null;
  const doctorOrg =
    doctorsQuery.data?.[0]?.hospital ||
    doctorsQuery.data?.[0]?.name ||
    null;

  const posters = OFFER_BASE.map((poster) => {
    let company = poster.companyFallback;
    if (poster.id === "medicines" || poster.id === "pharmacies") {
      company = pharmacyName || poster.companyFallback;
    }
    if (poster.id === "doctors") {
      company = doctorOrg || poster.companyFallback;
    }
    // Labs aren't a poster but if we add later use labName
    void labName;
    return { ...poster, company };
  });

  return (
    <section id="gateway" className="scroll-mt-28 bg-[#E8F0F5] py-14 md:py-16 lg:py-20">
      <div className="home-container mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0B6E99]">
              Offers
            </p>
            <h2 className="mt-2 text-[clamp(1.5rem,2.5vw,2rem)] font-semibold tracking-tight text-[#102A43]">
              Offers on medicines, pharmacies and doctors
            </h2>
          </div>
          <Link
            href="/offers"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0B6E99]"
          >
            View all offers
            <ArrowRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-[3px]"
            />
          </Link>
        </div>

        <div className="mt-7 flex gap-4 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory md:mt-8 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
          {posters.map((poster) => (
            <Link
              key={poster.id}
              href={poster.href}
              className="group relative block aspect-[4/5] w-[78%] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-[24px] bg-[#D7E6EF] sm:w-[70%] md:aspect-[3/4] md:w-auto md:max-w-none"
            >
              <Image
                src={poster.image}
                alt={poster.alt}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 78vw, 33vw"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${poster.tone}`}
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="inline-flex max-w-full truncate rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                  {poster.company}
                </p>
                <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/75">
                  {poster.eyebrow}
                </p>
                <h3 className="mt-2 max-w-[16ch] text-[clamp(1.2rem,2vw,1.55rem)] font-semibold leading-snug tracking-tight text-white">
                  {poster.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
                  {poster.cta}
                  <ArrowRight
                    size={14}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-[3px]"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
