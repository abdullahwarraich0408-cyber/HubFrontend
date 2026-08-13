"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Pill,
  Stethoscope,
  Storefront,
  Flask,
  ShieldCheck,
  Truck,
  Clock,
} from "@phosphor-icons/react";

const SERVICE_CARDS = [
  {
    title: "24/7 Medicines",
    subtitle: "Essentials at your doorstep",
    href: "/browse",
    gradient: "from-[#DEEEF9] via-[#F0F6FB] to-white",
    icon: Pill,
  },
  {
    title: "Doctor Consultation",
    subtitle: "Video or in-clinic appointments",
    href: "/doctors",
    gradient: "from-[#EBF3FA] via-[#F5FAFD] to-white",
    icon: Stethoscope,
  },
  {
    title: "Nearby Pharmacies",
    subtitle: "Verified stores near you",
    href: "/vendors",
    gradient: "from-[#E4F5ED] via-[#F3FAF7] to-white",
    icon: Storefront,
  },
  {
    title: "Lab Tests",
    subtitle: "Sample pickup at your home",
    href: "/lab-tests",
    gradient: "from-[#C6E3F4]/40 via-[#F0F6FB] to-white",
    icon: Flask,
  },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Verified partners" },
  { icon: Truck, label: "Home delivery" },
  { icon: Clock, label: "Same-day care" },
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1576091160550-2173dba07efd?auto=format&fit=crop&q=80&w=1600";

export function HeroSlider() {
  return (
    <section className="w-full bg-[var(--color-surface-subtle)] py-6 md:py-10">
      <div className="w-full home-container mx-auto">
        <div className="relative rounded-[28px] md:rounded-[36px] overflow-hidden min-h-[340px] md:min-h-[420px] lg:min-h-[460px] shadow-[0_28px_70px_-18px_rgba(8,43,63,0.42)] border border-white/10">
          {/* Photo plane */}
          <div className="absolute inset-0 hero-banner-pan" aria-hidden="true">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-[center_28%]"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#082B3F] via-[#082B3F]/92 to-[#082B3F]/35 md:to-[#082B3F]/20"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#082B3F]/90 via-transparent to-[#082B3F]/25"
            aria-hidden="true"
          />
          <div className="absolute inset-0 hero-mesh opacity-50 pointer-events-none" aria-hidden="true" />
          <div
            className="absolute -top-28 -right-16 w-[28rem] h-[28rem] rounded-full bg-[var(--color-brand-highlight)]/25 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 left-[20%] w-72 h-72 rounded-full bg-[#17618E]/35 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col justify-between h-full min-h-[340px] md:min-h-[420px] lg:min-h-[460px] p-6 md:p-9 lg:p-12">
            <div className="max-w-[640px]">
              <p className="hero-fade-up font-[var(--font-heading)] text-[clamp(2.75rem,9vw,5.75rem)] leading-[0.92] tracking-[-0.04em] text-white mb-4 md:mb-5">
                Medzoos
              </p>

              <h1 className="hero-fade-up hero-fade-up-delay-1 text-[clamp(1.25rem,2.8vw,2rem)] font-bold text-white leading-snug tracking-tight max-w-[22ch] mb-3 md:mb-4">
                Care that comes to you — medicines, doctors &amp; labs.
              </h1>

              <p className="hero-fade-up hero-fade-up-delay-2 text-[14px] md:text-[16px] text-white/75 leading-relaxed max-w-[40ch] mb-6 md:mb-8">
                Authentic medicines, online consultations, and home lab pickup from verified partners across Pakistan.
              </p>

              <div className="hero-fade-up hero-fade-up-delay-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/doctors"
                  className="inline-flex items-center justify-center gap-2 h-12 md:h-[52px] px-6 md:px-7 rounded-[12px] bg-white text-[var(--color-brand-primary)] text-[14px] md:text-[15px] font-bold hover:bg-[var(--color-brand-mist)] transition-colors shadow-[0_10px_28px_rgba(8,43,63,0.25)]"
                >
                  Book a Doctor
                  <ArrowRight size={18} weight="bold" />
                </Link>
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center h-12 md:h-[52px] px-5 md:px-6 rounded-[12px] border border-white/30 text-white text-[14px] font-bold hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  Shop Medicines
                </Link>
              </div>
            </div>

            <div className="hero-fade-up hero-fade-up-delay-3 mt-8 md:mt-10 flex flex-wrap gap-2.5 md:gap-3">
              {TRUST_POINTS.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-white/10 border border-white/15 px-3 py-2 text-white/90 backdrop-blur-sm"
                >
                  <item.icon size={16} weight="fill" className="text-[var(--color-brand-highlight)]" />
                  <span className="text-[12px] md:text-[13px] font-semibold tracking-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-5">
          {SERVICE_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative rounded-[20px] md:rounded-[24px] p-5 md:p-6 min-h-[168px] md:min-h-[188px] flex flex-col overflow-hidden bg-[var(--color-surface-base)] border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 hover:border-[var(--color-brand-primary)]/30 transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} pointer-events-none`}
                aria-hidden="true"
              />
              <div className="absolute -right-2 -bottom-2 opacity-[0.12] group-hover:opacity-[0.2] group-hover:scale-105 transition-all duration-500 pointer-events-none">
                <card.icon size={108} weight="duotone" className="text-[var(--color-brand-primary)]" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-10 h-10 rounded-[12px] bg-[var(--color-brand-light)] flex items-center justify-center mb-3.5">
                  <card.icon size={20} weight="duotone" className="text-[var(--color-brand-primary)]" />
                </div>
                <h3 className="text-[16px] md:text-[17px] font-bold text-[var(--color-ink-headline)] leading-snug mb-1">
                  {card.title}
                </h3>
                <p className="text-[13px] text-[var(--color-neutral-600)] font-medium leading-relaxed">
                  {card.subtitle}
                </p>
                <span className="mt-auto pt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-brand-primary)] group-hover:gap-1.5 transition-all">
                  Explore
                  <ArrowRight size={14} weight="bold" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
