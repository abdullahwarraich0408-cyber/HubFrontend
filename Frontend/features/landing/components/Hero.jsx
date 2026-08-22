"use client";

import Link from "next/link";
import { ArrowRight, Heart, Pulse } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { LandingImage } from "./LandingImage";
import { FadeIn } from "./FadeIn";
import { useQuery } from "@tanstack/react-query";
import { publicContentApi } from "@/lib/api/index";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { data } = useQuery({
    queryKey: ["content", "settings", "website"],
    queryFn: () => publicContentApi.get(undefined, "website"),
    staleTime: 5 * 60 * 1000,
  });
  const settings = data?.settings || {};

  return (
    <section className="relative flex min-h-0 items-center overflow-x-clip py-5 md:py-6 lg:min-h-[calc(100dvh-76px)] lg:py-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#17618E]/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#3B82F6]/10 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-[#16A085]/10 blur-3xl" />
      </div>

      <div className="landing-container grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        <div className="order-1">
          <FadeIn>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#17618E]/20 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#16A085]" aria-hidden />
              <span className="text-[13px] font-semibold text-[#17618E]">
                {settings.landing_eyebrow || "Healthcare, made simpler"}
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h1 className="font-sans text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-[#102A43]">
              {settings.landing_headline || "Your Healthcare. One Trusted Platform."}
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="mt-2 text-[15px] font-medium text-[#17618E] md:text-[16px]">
              Medicines, Doctors & Lab Tests in One Place
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#52606D] md:text-[16px] lg:line-clamp-3">
              {settings.landing_subhead ||
                "Medzoos connects you with healthcare providers across Pakistan, helping you discover medicines, doctors, consultations, appointments and diagnostic services from one convenient platform."}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#services"
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#17618E] px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(8,127,140,0.25)] transition-all hover:bg-[#124362] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17618E]/40 focus-visible:ring-offset-2 sm:w-auto"
              >
                {settings.landing_cta_secondary || "Explore Healthcare"}
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/doctors"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#102A43]/12 bg-white px-6 text-[15px] font-semibold text-[#102A43] transition-all hover:border-[#17618E]/35 hover:bg-[#EAF8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17618E]/40 focus-visible:ring-offset-2 sm:w-auto"
              >
                {settings.landing_cta_primary || "Find a Doctor"}
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-[#7B8794] lg:mt-5">
              Built to connect patients with professional healthcare providers
              across Pakistan.
            </p>
          </FadeIn>
        </div>

        <div className="order-2">
          <FadeIn
            delay={0.12}
            className="relative mx-auto w-full max-w-[480px] overflow-visible lg:max-w-none"
          >
            {/* Height capped to first viewport so image + cards aren’t clipped */}
            <div className="relative mx-auto h-[min(420px,calc(100dvh-14rem))] w-full overflow-hidden rounded-[28px] border border-white/70 bg-[#EAF8F7] shadow-[0_24px_60px_rgba(16,42,67,0.12)] sm:h-[min(480px,calc(100dvh-12rem))] sm:rounded-[32px] lg:h-[min(520px,calc(100dvh-10rem))] lg:max-h-[calc(100dvh-9rem)]">
              <LandingImage
                src="/images/medzoos-hero.png"
                alt="Doctor consulting with a patient through Medzoos"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 480px"
                className="h-full w-full"
                imageClassName="object-cover object-[center_22%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#102A43]/25 via-transparent to-transparent" />
            </div>

            <FloatingCard
              className="absolute left-2 top-[10%] max-w-[180px] sm:left-3 sm:max-w-[200px]"
              reduceMotion={reduceMotion}
              delay={0}
            >
              <p className="text-[13px] font-semibold text-[#102A43]">Doctor Consultations</p>
              <p className="mt-0.5 text-[12px] text-[#52606D]">Online & In-Person</p>
            </FloatingCard>

            <FloatingCard
              className="absolute right-2 top-[36%] max-w-[160px] sm:right-3 sm:max-w-[180px]"
              reduceMotion={reduceMotion}
              delay={0.4}
            >
              <p className="text-[13px] font-semibold text-[#102A43]">Lab Tests</p>
              <p className="mt-0.5 text-[12px] text-[#52606D]">Home Sampling Available</p>
            </FloatingCard>

            <FloatingCard
              className="absolute bottom-[10%] left-[8%] max-w-[180px] sm:left-[10%] sm:max-w-[200px]"
              reduceMotion={reduceMotion}
              delay={0.8}
            >
              <p className="text-[13px] font-semibold text-[#102A43]">Medicines</p>
              <p className="mt-0.5 text-[12px] text-[#52606D]">From Registered Pharmacies</p>
            </FloatingCard>

            <motion.div
              className="absolute bottom-[16%] right-[8%] flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/95 text-[#17618E] shadow-[0_10px_30px_rgba(16,42,67,0.12)] sm:h-14 sm:w-14"
              animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              aria-hidden
            >
              <div className="relative">
                <Heart size={22} weight="fill" className="text-[#17618E]" />
                <Pulse size={12} weight="bold" className="absolute -bottom-1 -right-2 text-[#16A085]" />
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ children, className, reduceMotion, delay = 0 }) {
  return (
    <motion.div
      className={`rounded-2xl border border-white/80 bg-white/95 px-3.5 py-3 shadow-[0_12px_32px_rgba(16,42,67,0.12)] backdrop-blur-sm ${className}`}
      animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}
