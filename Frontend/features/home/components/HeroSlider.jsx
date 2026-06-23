"use client";

import Link from "next/link";
import {
  ArrowRight,
  Pill,
  Stethoscope,
  Storefront,
  Flask,
} from "@phosphor-icons/react";

const SERVICE_CARDS = [
  {
    title: "24/7 Medicines",
    subtitle: "Essentials at your doorstep",
    href: "/browse",
    gradient: "from-[#E6F7F8] via-[#F4FCFD] to-white",
    iconBg: "bg-[#0B6E72]/12",
    iconColor: "text-[#0B6E72]",
    watermark: "text-[#0B6E72]",
    icon: Pill,
  },
  {
    title: "Doctor Consultation",
    subtitle: "Video or in-clinic appointments",
    href: "/doctors",
    gradient: "from-[#E0F4F6] via-[#F0FAFB] to-white",
    iconBg: "bg-[#0891A0]/12",
    iconColor: "text-[#0891A0]",
    watermark: "text-[#0891A0]",
    icon: Stethoscope,
  },
  {
    title: "Nearby Pharmacies",
    subtitle: "Verified stores near you",
    href: "/vendors",
    gradient: "from-[#E8F8EF] via-[#F4FBF7] to-white",
    iconBg: "bg-[#0F9D58]/12",
    iconColor: "text-[#0F9D58]",
    watermark: "text-[#0F9D58]",
    icon: Storefront,
  },
  {
    title: "Lab Tests",
    subtitle: "Sample pickup at your home",
    href: "/lab-tests",
    gradient: "from-[#EEEAF8] via-[#F7F5FC] to-white",
    iconBg: "bg-[#6366F1]/12",
    iconColor: "text-[#6366F1]",
    watermark: "text-[#6366F1]",
    icon: Flask,
  },
];

export function HeroSlider() {
  return (
    <section className="w-full bg-[var(--color-surface-subtle)] py-6 md:py-10">
      <div className="w-full home-container mx-auto">
        <div className="relative rounded-[28px] md:rounded-[36px] bg-hero-gradient overflow-hidden p-6 md:p-8 lg:p-10 flex flex-col justify-between min-h-[280px] md:min-h-[300px] shadow-[0_24px_64px_-12px_rgba(11,110,114,0.45)] border border-white/10">
          <div className="absolute inset-0 hero-mesh pointer-events-none" aria-hidden="true" />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[var(--color-brand-highlight)]/20 blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/2 right-[12%] -translate-y-1/2 opacity-[0.06] pointer-events-none hidden lg:block" aria-hidden="true">
            <Stethoscope size={220} weight="thin" className="text-white" />
          </div>
          <div className="absolute bottom-[18%] left-[38%] opacity-[0.05] pointer-events-none hidden xl:block" aria-hidden="true">
            <Pill size={140} weight="thin" className="text-white rotate-12" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] md:text-[11px] font-semibold text-white/80 uppercase tracking-[0.14em] mb-4 md:mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-highlight)] animate-pulse" />
              Trusted across Pakistan
            </span>
            <h1 className="font-[var(--font-heading)] font-bold text-white text-[52px] sm:text-[72px] md:text-[96px] lg:text-[112px] leading-none tracking-[-0.04em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
              Healthcare
            </h1>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 mt-8 md:mt-10">
            <p className="text-[10px] md:text-[11px] font-medium text-white/75 uppercase tracking-[0.12em] leading-[1.8] max-w-[280px] md:max-w-[320px]">
              Authentic medicines, online doctors &amp; lab tests — delivered across Pakistan from verified partners.
            </p>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center h-[48px] md:h-[52px] px-7 md:px-9 rounded-full bg-white text-[var(--color-brand-primary)] text-[14px] md:text-[15px] font-bold hover:bg-[var(--color-brand-mist)] hover:scale-[1.02] transition-all shadow-lg shadow-black/10"
              >
                Book Appointment
              </Link>
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center w-[48px] h-[48px] md:w-[52px] md:h-[52px] rounded-full bg-white/15 border border-white/25 text-white hover:bg-white/25 hover:scale-[1.05] transition-all backdrop-blur-sm"
                aria-label="Book appointment"
              >
                <ArrowRight size={20} weight="bold" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 md:mt-5">
          {SERVICE_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative rounded-[24px] md:rounded-[28px] p-6 md:p-7 min-h-[200px] md:min-h-[220px] flex flex-col overflow-hidden bg-white border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 hover:border-[var(--color-brand-primary)]/25 ring-1 ring-transparent hover:ring-[var(--color-brand-primary)]/10 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} pointer-events-none`} aria-hidden="true" />
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/70 to-transparent rounded-bl-[48px] pointer-events-none" aria-hidden="true" />

              <div className="absolute -right-3 -bottom-3 pointer-events-none opacity-[0.14] group-hover:opacity-[0.22] group-hover:scale-105 transition-all duration-500">
                <card.icon size={120} weight="duotone" className={card.watermark} />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-11 h-11 rounded-[14px] ${card.iconBg} flex items-center justify-center mb-4 shadow-sm`}>
                  <card.icon size={22} weight="duotone" className={card.iconColor} />
                </div>

                <h3 className="text-[17px] md:text-[18px] font-bold text-[var(--color-ink-headline)] leading-snug mb-1.5 pr-2">
                  {card.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-[var(--color-neutral-600)] font-medium leading-relaxed">
                  {card.subtitle}
                </p>

                <div className="mt-auto pt-6">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[var(--color-neutral-200)] text-[var(--color-brand-primary)] shadow-sm group-hover:bg-[var(--color-brand-primary)] group-hover:text-white group-hover:border-[var(--color-brand-primary)] group-hover:scale-110 transition-all duration-300">
                    <ArrowRight size={18} weight="bold" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
