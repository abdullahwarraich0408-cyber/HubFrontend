"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Package, 
  Stethoscope, 
  CurrencyDollar,
  PaperPlaneTilt,
  Snowflake,
  Lightning,
  ShieldCheck,
  Flask
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { useQuery } from "@tanstack/react-query";
import { publicContentApi } from "@/lib/api/index";

const HERO_CARDS = [
  {
    id: "diabetes-care",
    title: "Diabetes Care",
    href: "#diabetes-care",
    image: "/images/card-diabetes-care.png",
    bg: "bg-[#E7F8F2]",
    alt: "Diabetes Care, Glucose Monitoring, HbA1c & Insulin",
  },
  {
    id: "mental-health",
    title: "Mental Health Support",
    href: "#mental-health",
    image: "/images/card-psychologists.png",
    bg: "bg-[#EEF5F8]",
    alt: "Mental Health, Therapy & Psychologist Support",
  },
  {
    id: "doctors",
    title: "Doctor Consultations",
    href: "#doctors",
    image: "/images/hero-consult-doctor.png",
    bg: "bg-[#F8EFE6]",
    alt: "PMDC Verified Doctor Video & Clinic Consultations",
  },
  {
    id: "medicines-labs",
    title: "Medicines & Diagnostic Labs",
    href: "#medicines-labs",
    image: "/images/card-pharmacies.png",
    bg: "bg-[#FAE9EB]",
    alt: "Prescription Medicines Delivery & Home Blood Sampling",
  },
];

const TRUST_TICKER = [
  { icon: Lightning, label: "EXPRESS MEDICINE DELIVERY" },
  { icon: Stethoscope, label: "PMDC VERIFIED SPECIALISTS" },
  { icon: Flask, label: "ACCREDITED LABS & HOME SAMPLING" },
  { icon: Snowflake, label: "COLD-CHAIN SAFETY GUARANTEED" },
  { icon: ShieldCheck, label: "100% AUTHENTIC DRUGS & OTC" },
  { icon: CurrencyDollar, label: "TRANSPARENT & CLEAR PRICING" },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { data } = useQuery({
    queryKey: ["content", "settings", "website"],
    queryFn: () => publicContentApi.get(undefined, "website"),
    staleTime: 5 * 60 * 1000,
  });
  const settings = data?.settings || {};

  return (
    <div className="relative w-full">
      
      {/* 1. Upper Medzoos Deep Ocean-Navy Canvas */}
      <section 
        className="relative overflow-hidden pt-6 sm:pt-8 md:pt-10 pb-28 sm:pb-34 md:pb-40 lg:pb-44"
        style={{
          background: "radial-gradient(circle at 50% 20%, #1A5E8A 0%, #0E3E5D 50%, #082B3F 100%)",
        }}
      >
        
        {/* Giant Watermark MEDZOOS: Bottom of letters touches behind the arching card */}
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 select-none text-[18vw] font-black uppercase tracking-tight text-white/[0.04] leading-none whitespace-nowrap z-0"
        >
          MEDZOOS
        </div>

        {/* Central Text Content */}
        <div className="landing-container relative z-10 text-center px-4 mb-6 sm:mb-8 md:mb-10">
          
          {/* Eyebrow */}
          <FadeIn>
            <p className="font-sans text-[13px] sm:text-[14px] font-normal text-[#BAE6FD] tracking-wide mb-1.5 leading-none">
              {settings.landing_eyebrow || (
                <>
                  Join <span className="font-bold text-white">500,000+</span> Medzoos patients across Pakistan
                </>
              )}
            </p>
          </FadeIn>

          {/* Main Headline */}
          <FadeIn delay={0.05}>
            <h1 className="font-sans text-[clamp(2.3rem,4.6vw,3.8rem)] font-extrabold text-white leading-[1.02] tracking-tight mt-1.5 sm:mt-2">
              Healthcare, <br className="hidden sm:inline" />
              <span className="text-[#38BDF8] font-extrabold">redefined</span> for real life.
            </h1>
          </FadeIn>

          {/* Subtitle Paragraph Tailored to Medzoos */}
          <FadeIn delay={0.1}>
            <p className="font-sans mx-auto mt-2.5 sm:mt-3 max-w-[640px] text-[13.5px] sm:text-[15px] leading-snug text-[#E0F2FE]/90 font-normal">
              {settings.landing_subhead || (
                <>
                  Order authentic medicines from licensed pharmacies, consult PMDC-verified doctors online, 
                  and book diagnostic lab tests with at-home sampling across Pakistan.
                </>
              )}
            </p>
          </FadeIn>

        </div>

      </section>

      {/* 2. Seamless White Card Deck: Arched Top, Seamless Flat Bottom Matching Page BG */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-[90px] sm:-mt-[115px] md:-mt-[135px] lg:-mt-[150px]">
        <FadeIn delay={0.15}>
          <div className="bg-white rounded-t-[26px] sm:rounded-t-[32px] md:rounded-t-[40px] rounded-b-none p-3 sm:p-4 md:p-5 pb-0 shadow-[0_-12px_45px_rgba(0,0,0,0.12)]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {HERO_CARDS.map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group flex flex-col h-full rounded-[20px] sm:rounded-[24px] cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Inner Photo Frame with Soft Pastel Background */}
                  <div className={`relative h-[130px] sm:h-[155px] md:h-[180px] lg:h-[205px] w-full rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden ${card.bg}`}>
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Title & Arrow Footer on Seamless White Background */}
                  <div className="bg-white pt-3.5 pb-2 px-1 flex items-center justify-between text-left">
                    <span className="font-sans text-[12.5px] sm:text-[14px] md:text-[15.5px] font-bold text-[#082B3F] group-hover:text-[#17618E] transition-colors truncate">
                      {card.title}
                    </span>
                    <ArrowRight 
                      size={16} 
                      weight="bold" 
                      className="text-[#082B3F] group-hover:translate-x-1 group-hover:text-[#17618E] transition-all shrink-0 ml-1.5" 
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* 3. Pure White Section: Seamless Continuation with Auto-Scroller */}
      <div className="w-full bg-white pt-10 sm:pt-14 md:pt-16 pb-6 sm:pb-8 overflow-hidden">
        <div className="relative w-full overflow-hidden mask-fade">
          <motion.div
            className="flex items-center gap-10 sm:gap-14 md:gap-16 whitespace-nowrap w-max"
            animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...TRUST_TICKER, ...TRUST_TICKER].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="font-sans flex items-center gap-2.5 text-[11.5px] sm:text-[12.5px] font-bold text-[#082B3F] tracking-wider uppercase whitespace-nowrap shrink-0 hover:text-[#17618E] transition-colors"
                >
                  <Icon size={18} weight="bold" className="text-[#17618E] shrink-0" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

    </div>
  );
}
