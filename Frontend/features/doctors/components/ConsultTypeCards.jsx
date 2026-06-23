"use client";

import { VideoCamera, Buildings, ChatCircleText, UploadSimple, MapPin } from "@phosphor-icons/react";

const OPTIONS = [
  {
    id: "online",
    title: "Consult Online Now",
    description: "Instantly connect with specialists through video call, chat, and file uploads.",
    icon: VideoCamera,
    accent: "from-[var(--color-brand-primary)] to-[#0d8a8f]",
    badge: null,
    perks: [
      { icon: VideoCamera, label: "Video call" },
      { icon: ChatCircleText, label: "Live chat" },
      { icon: UploadSimple, label: "Upload reports" },
    ],
  },
  {
    id: "in_person",
    title: "In-Clinic Appointment",
    description: "Book an in-person visit to the doctor's hospital or clinic.",
    icon: Buildings,
    accent: "from-[#1e5f63] to-[var(--color-brand-primary)]",
    badge: null,
    perks: [
      { icon: Buildings, label: "Clinic visit" },
      { icon: MapPin, label: "Scheduled slot" },
    ],
  },
];

export function ConsultTypeCards({ onSelect, onlineCount = 0, layout = "grid", hospitalName = null }) {
  const isHero = layout === "hero";

  const options = OPTIONS.map((option) => {
    if (option.id === "in_person" && hospitalName) {
      return {
        ...option,
        description: `Book an in-person visit at ${hospitalName}.`,
        perks: [
          { icon: Buildings, label: hospitalName },
          { icon: MapPin, label: "Scheduled slot" },
        ],
      };
    }
    return option;
  });

  return (
    <div className={isHero ? "grid md:grid-cols-2 gap-4 md:gap-6" : "grid sm:grid-cols-2 gap-4"}>
      {options.map((option) => {
        const Icon = option.icon;
        const showOnlineBadge = option.id === "online" && onlineCount > 0;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`group text-left bg-white rounded-[20px] border-2 border-[var(--color-neutral-200)] hover:border-[var(--color-brand-primary)] overflow-hidden transition-all hover:shadow-[0_12px_32px_-12px_rgba(11,110,114,0.25)] ${
              isHero ? "p-0" : "p-5"
            }`}
          >
            {isHero ? (
              <>
                <div className={`relative h-[140px] md:h-[160px] bg-gradient-to-br ${option.accent} flex items-center justify-center`}>
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Icon size={40} weight="fill" className="text-white" />
                  </div>
                  {showOnlineBadge && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#f59e0b] text-white text-[11px] font-bold shadow-md">
                      {onlineCount} Doctors Online Now
                    </span>
                  )}
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[var(--color-ink-headline)] mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-[13px] md:text-[14px] text-[var(--color-neutral-600)] leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${option.accent} flex items-center justify-center shrink-0`}>
                    <Icon size={24} weight="fill" className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[var(--color-ink-headline)]">{option.title}</h3>
                    {showOnlineBadge && (
                      <span className="text-[11px] font-semibold text-[#d97706]">{onlineCount} online now</span>
                    )}
                  </div>
                </div>
                <p className="text-[12px] text-[var(--color-neutral-600)] leading-relaxed mb-3">{option.description}</p>
                <div className="flex flex-wrap gap-2">
                  {option.perks.map((perk) => {
                    const PerkIcon = perk.icon;
                    return (
                      <span
                        key={perk.label}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-neutral-500)] bg-[var(--color-surface-subtle)] px-2.5 py-1 rounded-full"
                      >
                        <PerkIcon size={12} />
                        {perk.label}
                      </span>
                    );
                  })}
                </div>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
