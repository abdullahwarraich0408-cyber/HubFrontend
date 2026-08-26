"use client";

import Link from "next/link";
import {
  Heartbeat,
  ShieldCheck,
  FirstAid,
  Stethoscope,
  Flask,
  Storefront,
  UsersThree,
  CheckCircle,
  Clock,
  Sparkle,
  ArrowRight,
  Handshake,
  MapPin,
  Certificate,
  Buildings,
  LockKey,
  Truck,
  DeviceMobile,
  SquaresFour,
  Lightning,
  Snowflake,
  CurrencyDollar,
  Pill,
  ChatCircle,
  Phone,
  Envelope,
  UserCheck,
  Headset,
} from "@phosphor-icons/react";

const STATS = [
  {
    value: "500,000+",
    label: "Patients Across Pakistan",
    icon: UsersThree,
    desc: "Families trusting Medzoos for daily healthcare",
  },
  {
    value: "500+",
    label: "Licensed Pharmacies",
    icon: Storefront,
    desc: "DRAP-compliant & verified partners",
  },
  {
    value: "100+",
    label: "PMDC Verified Doctors",
    icon: Stethoscope,
    desc: "Specialists in diabetes, psychology & general medicine",
  },
  {
    value: "100%",
    label: "Authentic & Cold-Chain",
    icon: ShieldCheck,
    desc: "Batch-tracked and temperature-guaranteed",
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "100% Authentic Medications",
    desc: "Every medicine dispensed is sourced strictly from licensed pharmaceutical distributors and registered pharmacies, eliminating counterfeit risks entirely.",
  },
  {
    icon: Heartbeat,
    title: "Patient-First Healthcare",
    desc: "From temperature-controlled logistics to doorstep diagnostic sampling, every workflow is engineered around patient dignity, safety, and comfort.",
  },
  {
    icon: LockKey,
    title: "Privacy & Clinical Discretion",
    desc: "Your consultations, prescriptions, and diagnostic lab reports remain strictly confidential with end-to-end encryption and strict PMDC protocols.",
  },
  {
    icon: Lightning,
    title: "Express & Dependable Care",
    desc: "Fast delivery for urgent medicines, instant online doctor consultations, and guaranteed digital lab reports within 24 hours.",
  },
  {
    icon: SquaresFour,
    title: "One Connected Ecosystem",
    desc: "Manage medicines, doctor appointments, home lab tests, and family health records without jumping between fragmented apps.",
  },
  {
    icon: MapPin,
    title: "Tailored for Pakistan",
    desc: "Built specifically around the healthcare challenges, prescription workflows, and delivery infrastructure in Pakistani cities and towns.",
  },
  {
    icon: CurrencyDollar,
    title: "Transparent & Fair Pricing",
    desc: "Clear upfront prices with zero hidden charges on diagnostic tests, doctor consultation fees, and genuine retail MRP medicines.",
  },
  {
    icon: Headset,
    title: "24/7 Clinical & Patient Support",
    desc: "Dedicated support team and licensed pharmacists on standby to assist with drug guidance, dosage queries, and order updates.",
  },
];

const PILLARS = [
  {
    title: "Digital Pharmacy & Delivery",
    desc: "Browse authentic OTC and prescription medicines. Upload your doctor's slip for pharmacist verification and receive temperature-controlled doorstep delivery.",
    icon: Pill,
    badge: "Express Delivery",
    link: "/browse",
    linkText: "Order Medicines",
    accent: "bg-[#E6F4F5] text-[#087F82]",
  },
  {
    title: "Telehealth & Doctor Consultations",
    desc: "Connect with board-certified physicians, general practitioners, and clinical psychologists. Book in-clinic appointments or schedule HD video consultations.",
    icon: Stethoscope,
    badge: "PMDC Verified",
    link: "/doctors",
    linkText: "Find a Doctor",
    accent: "bg-[#F3E8FF] text-[#7C3AED]",
  },
  {
    title: "Diagnostic Labs & Home Sampling",
    desc: "Schedule blood tests, diabetes panels, and full body checkups. Certified phlebotomists visit your home for sterile sample collection with online PDF reports.",
    icon: Flask,
    badge: "Home Sampling",
    link: "/lab-tests",
    linkText: "Book Lab Tests",
    accent: "bg-[#E0F2FE] text-[#0284C7]",
  },
  {
    title: "Chronic Care & Family Health Vault",
    desc: "Specialized chronic care programs for diabetes and wellness. Store family medical histories, ongoing prescriptions, and maintain unified health records safely.",
    icon: Heartbeat,
    badge: "Unified Records",
    link: "/family-health",
    linkText: "Explore Family Vault",
    accent: "bg-[#DCFCE7] text-[#15803D]",
  },
];

const TRUST_METRICS = [
  {
    icon: Certificate,
    title: "DRAP & PMDC Regulated",
    desc: "Operating strictly in compliance with Pakistani drug regulations and clinical standards.",
  },
  {
    icon: Snowflake,
    title: "Certified Cold-Chain",
    desc: "Temperature-controlled thermal packaging ensures sensitive insulin and vaccines stay potent.",
  },
  {
    icon: ShieldCheck,
    title: "100% Genuine Guarantee",
    desc: "Direct pharmacy provenance eliminates counterfeit risks on all medications and devices.",
  },
  {
    icon: LockKey,
    title: "Encrypted Health Vault",
    desc: "Bank-grade 256-bit encryption safeguards your medical history, test reports, and consults.",
  },
];

export function AboutPage() {
  return (
    <div className="w-full flex flex-col bg-white min-h-screen">
      {/* 1. Hero Section matching Website Palette & Giant Watermark */}
      <section
        className="relative overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-28 sm:pb-36 md:pb-44 text-white"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, #1A5E8A 0%, #0E3E5D 50%, #082B3F 100%)",
        }}
      >
        {/* Giant Watermark MEDZOOS: Matches Home Hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 select-none text-[18vw] font-black uppercase tracking-tight text-white/[0.04] leading-none whitespace-nowrap z-0"
        >
          MEDZOOS
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          {/* Eyebrow badge with Icon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#BAE6FD] text-[13px] font-medium tracking-wide mb-5 border border-white/15">
            <Sparkle size={15} weight="fill" className="text-[#38BDF8]" />
            <span>About Medzoos Healthcare</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-sans text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold text-white leading-[1.08] tracking-tight max-w-3xl mx-auto">
            Healthcare access,{" "}
            <span className="text-[#38BDF8]">redefined</span> for every family across Pakistan.
          </h1>

          {/* Subtitle */}
          <p className="font-sans mx-auto mt-4 max-w-2xl text-[15px] sm:text-[17px] leading-relaxed text-[#E0F2FE]/90 font-normal">
            Medzoos is a unified digital healthcare ecosystem connecting patients with verified pharmacies, PMDC-certified doctors, and accredited diagnostic laboratories under one seamless, dependable standard.
          </p>

          {/* Header Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/browse"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-[#17618E] transition-all hover:bg-[#EAF8F7] shadow-lg hover:scale-[1.02]"
            >
              <Pill size={18} weight="bold" />
              <span>Explore Medicines & Care</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              href="/partner-with-us"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 text-[15px] font-semibold text-white transition-all hover:bg-white/10"
            >
              <Handshake size={18} weight="bold" />
              <span>Join as Healthcare Partner</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Stats Ribbon - Arched Deck matching Hero transition */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 -mt-[70px] sm:-mt-[95px] md:-mt-[110px]">
        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 shadow-[0_16px_40px_rgba(8,43,63,0.12)] border border-[#102A43]/08">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#102A43]/08">
            {STATS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className={`flex flex-col gap-2 ${idx !== 0 ? "pt-4 sm:pt-0 sm:pl-5" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#17618E]/20 bg-[#F0F7F7] text-[#17618E] shrink-0">
                      <Icon size={22} weight="regular" />
                    </span>
                    <div>
                      <p className="text-[24px] sm:text-[28px] font-extrabold text-[#102A43] leading-none tracking-tight">
                        {s.value}
                      </p>
                      <p className="text-[13px] font-semibold text-[#17618E] mt-0.5">
                        {s.label}
                      </p>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#52606D] leading-snug pl-14 sm:pl-0">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision Cards Section (bg-[#F0F7F7]) */}
      <section className="bg-[#F0F7F7] py-16 sm:py-20 md:py-24 mt-12 md:mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-[#17618E] bg-[#17618E]/10 border border-[#17618E]/20 uppercase tracking-wider mb-3">
              <Heartbeat size={14} weight="fill" />
              Purpose & Direction
            </span>
            <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold text-[#102A43] tracking-tight leading-tight">
              Driven by clinical integrity and genuine care
            </h2>
            <p className="text-[15px] text-[#52606D] mt-2 leading-relaxed">
              We exist to ensure no patient in Pakistan is compromised by counterfeit medicine, fragmented care, or lack of trusted diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Mission Card */}
            <div className="bg-white rounded-[26px] p-7 sm:p-9 border border-[#102A43]/08 shadow-xs flex flex-col justify-between group hover:border-[#17618E]/40 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#17618E]/20 bg-[#F0F7F7] text-[#17618E]">
                    <Heartbeat size={24} weight="fill" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-[#17618E] uppercase tracking-wider">
                      Our Mission
                    </span>
                    <h3 className="text-[22px] sm:text-[24px] font-bold text-[#102A43] tracking-tight">
                      Making quality healthcare simple and universally accessible
                    </h3>
                  </div>
                </div>
                <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#52606D] space-y-3">
                  We believe every household deserves prompt access to authentic medications, compassionate doctor consultations, and certified diagnostic lab testing without fear of substandard products or unnecessary delays.
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-[#102A43]/08 flex items-center gap-2 text-[13px] font-semibold text-[#17618E]">
                <CheckCircle size={18} weight="fill" className="text-[#0D9488]" />
                <span>100% committed to patient safety, clinical verification & speed.</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-[#0E3E5D] to-[#082B3F] text-white rounded-[26px] p-7 sm:p-9 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-48 h-48 bg-[#38BDF8]/10 rounded-tl-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-[#38BDF8]">
                    <Buildings size={24} weight="bold" />
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-[#38BDF8] uppercase tracking-wider">
                      Our Vision
                    </span>
                    <h3 className="text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                      Building Pakistan's most interconnected health ecosystem
                    </h3>
                  </div>
                </div>
                <p className="text-[14px] sm:text-[15px] leading-relaxed text-white/80">
                  We envision a digitally empowered healthcare landscape where certified doctors, licensed retail pharmacies, diagnostic laboratories, and chronic care programs collaborate harmoniously to improve patient outcomes nationwide.
                </p>
              </div>
              <div className="mt-8 pt-5 border-t border-white/15 flex items-center gap-2 text-[13px] font-semibold text-[#7DD3C7] relative z-10">
                <Sparkle size={18} weight="fill" />
                <span>Digitally serving over 10 million patients by 2030.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ecosystem Pillars / Core Services (bg-white) */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-[#17618E] bg-[#F0F7F7] border border-[#17618E]/20 uppercase tracking-wider mb-3">
              <SquaresFour size={14} weight="fill" />
              The Medzoos Ecosystem
            </span>
            <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold text-[#102A43] tracking-tight leading-tight">
              Complete care across four interconnected pillars
            </h2>
            <p className="text-[15px] text-[#52606D] mt-2 leading-relaxed">
              Every healthcare requirement is unified under a single, trusted interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-[24px] border border-[#102A43]/08 bg-[#F0F7F7] p-7 sm:p-8 flex flex-col justify-between hover:border-[#17618E]/40 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#17618E]/20 bg-white text-[#17618E] shadow-xs group-hover:scale-105 transition-transform">
                        <Icon size={24} weight="bold" />
                      </span>
                      <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-white text-[#17618E] border border-[#17618E]/15">
                        {pillar.badge}
                      </span>
                    </div>
                    <h3 className="text-[20px] font-bold text-[#102A43] mb-2.5 group-hover:text-[#17618E] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-[14px] text-[#52606D] leading-relaxed mb-6">
                      {pillar.desc}
                    </p>
                  </div>
                  <Link
                    href={pillar.link}
                    className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#17618E] hover:text-[#0E3E5D] transition-colors"
                  >
                    <span>{pillar.linkText}</span>
                    <ArrowRight
                      size={15}
                      weight="bold"
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Core Values / Why Medzoos (bg-[#F0F7F7]) matching WhyMedzoos.jsx */}
      <section className="bg-[#F0F7F7] py-16 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-[#17618E] bg-white border border-[#17618E]/20 uppercase tracking-wider mb-3">
              <ShieldCheck size={14} weight="fill" />
              Our Core Principles
            </span>
            <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold text-[#102A43] tracking-tight leading-tight">
              The standards that guide our clinical platform
            </h2>
            <p className="text-[15px] text-[#52606D] mt-2 leading-relaxed">
              Designed with rigorous quality control, verified partners, and uncompromising ethics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <article
                  key={val.title}
                  className="h-full rounded-[22px] border border-[#102A43]/08 bg-white p-6 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#17618E]/20 bg-[#F0F7F7] text-[#17618E]">
                      <Icon size={22} weight="regular" />
                    </span>
                    <h3 className="text-[1.05rem] font-semibold text-[#102A43] mb-2">
                      {val.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed text-[#52606D]">
                      {val.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Trust & Quality Bar (Deep Ocean bg-[#082B3F]) */}
      <section className="bg-[#082B3F] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST_METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.title} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-[#38BDF8] shrink-0">
                    <Icon size={24} weight="bold" />
                  </span>
                  <div>
                    <h4 className="text-[16px] font-bold text-white mb-1">
                      {metric.title}
                    </h4>
                    <p className="text-[13px] text-[#BAE6FD]/80 leading-relaxed">
                      {metric.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CTA Section matching Website Gradient CTA Banner */}
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#17618E] via-[#0FA7E3] to-[#124362] px-6 py-12 text-center text-white shadow-[0_24px_60px_rgba(8,127,140,0.28)] md:px-12 md:py-16">
            <div
              className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-8 bottom-4 h-48 w-48 rounded-full bg-[#3B82F6]/25 blur-3xl"
              aria-hidden
            />

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-white bg-white/15 backdrop-blur-md border border-white/25 uppercase tracking-wider mb-4">
                <FirstAid size={14} weight="fill" />
                Start Your Health Journey
              </span>
              <h2 className="font-sans text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-[1.2] tracking-tight">
                Take the first step toward simpler, trusted healthcare
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 md:text-[16px]">
                Order genuine medicines, consult licensed doctors, and book diagnostic lab tests with at-home sampling.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/browse"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-[#17618E] transition-all hover:bg-[#EAF8F7] shadow-lg"
                >
                  Explore Medicines
                  <ArrowRight
                    size={18}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/help"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-[15px] font-semibold text-white transition-all hover:bg-white/10"
                >
                  Visit Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
