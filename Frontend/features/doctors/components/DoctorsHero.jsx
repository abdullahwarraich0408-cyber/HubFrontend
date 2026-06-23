"use client";

import { MagnifyingGlass, Stethoscope, VideoCamera, Clock, Buildings } from "@phosphor-icons/react";

const CATEGORY_CONFIG = {
  online: {
    badge: "Online Consult",
    title: "Consult Certified Doctors Online",
    description: "Video consultations in 60 seconds. Chat with your doctor and upload prescriptions from home.",
    features: [
      { icon: VideoCamera, label: "Video & chat" },
      { icon: Clock, label: "Connect in 60 sec" },
    ],
  },
  in_person: {
    badge: "In-Person Visit",
    title: "Book Clinic Appointments",
    description: "Visit trusted doctors at their hospital or clinic at your scheduled time.",
    features: [
      { icon: Buildings, label: "Clinic visit" },
      { icon: Clock, label: "Scheduled slots" },
    ],
  },
};

export function DoctorsHero({ search, onSearchChange, category }) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.in_person;

  return (
    <div className="relative rounded-[20px] md:rounded-[24px] bg-hero-gradient overflow-hidden p-6 md:p-10 mb-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[640px]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-[11px] font-semibold uppercase tracking-wide mb-4">
          <Stethoscope size={14} weight="fill" className="text-[var(--color-brand-highlight)]" />
          {config.badge}
        </div>

        <h1 className="text-[28px] md:text-[36px] font-[var(--font-heading)] font-bold text-white leading-tight mb-3">
          {config.title}
        </h1>
        <p className="text-[14px] md:text-[15px] text-white/65 mb-6 leading-relaxed">
          {config.description}
        </p>

        <div className="flex items-center gap-2 bg-white rounded-full p-1.5 pl-5 shadow-lg focus-within:ring-2 focus-within:ring-[var(--color-brand-highlight)]/40">
          <MagnifyingGlass size={20} className="text-[var(--color-brand-primary)] shrink-0" weight="bold" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search doctors by name or specialty..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-[var(--color-neutral-900)] py-3 min-w-0 placeholder:text-[var(--color-neutral-500)]"
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-5">
          {config.features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.label} className="flex items-center gap-2 text-[12px] text-white/70 font-medium">
                <Icon size={16} className="text-[var(--color-brand-highlight)]" weight="fill" />
                {feature.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
