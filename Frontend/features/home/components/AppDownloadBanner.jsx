"use client";

import { CheckCircle, DeviceMobile, QrCode } from "@phosphor-icons/react";

const APP_FEATURES = [
  "Track Orders",
  "Exclusive Offers",
  "Easy Reorder",
];

export function AppDownloadBanner() {
  return (
    <section className="relative rounded-[12px] bg-hero-gradient overflow-hidden shadow-[var(--shadow-card)]">
      <div className="absolute inset-0 hero-mesh opacity-30" aria-hidden="true" />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 lg:gap-8 p-6 md:p-8 lg:p-10 items-center">
        <div className="hidden lg:flex items-end justify-center gap-3">
          <div className="w-[88px] h-[160px] rounded-[18px] bg-white/10 border border-white/20 flex items-center justify-center">
            <DeviceMobile size={36} className="text-white/70" weight="duotone" />
          </div>
          <div className="w-[96px] h-[176px] rounded-[20px] bg-white/15 border border-white/25 flex items-center justify-center -mb-2">
            <DeviceMobile size={40} className="text-white" weight="duotone" />
          </div>
        </div>

        <div className="text-white min-w-0">
          <h2 className="text-[22px] md:text-[26px] font-bold mb-2">Get the PharmaHub App</h2>
          <p className="text-[14px] text-white/75 mb-5 max-w-[420px]">
            Faster, easier &amp; better experience on the app
          </p>
          <ul className="space-y-2.5">
            {APP_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-[13px] text-white/90">
                <CheckCircle size={18} weight="fill" className="text-[var(--color-brand-highlight)] shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 shrink-0">
          <div className="w-[108px] h-[108px] rounded-[10px] bg-white p-2 flex items-center justify-center">
            <div className="w-full h-full rounded-[6px] border border-dashed border-[var(--color-neutral-300)] flex items-center justify-center bg-[var(--color-surface-subtle)]">
              <QrCode size={56} className="text-[var(--color-neutral-400)]" />
            </div>
          </div>
          <div className="flex flex-col gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              className="h-[42px] px-5 rounded-[8px] bg-white text-[var(--color-ink-headline)] text-[12px] font-bold hover:bg-[var(--color-brand-mist)] transition-colors whitespace-nowrap"
            >
              GET IT ON Google Play
            </button>
            <button
              type="button"
              className="h-[42px] px-5 rounded-[8px] bg-white/10 border border-white/30 text-white text-[12px] font-bold hover:bg-white/15 transition-colors whitespace-nowrap"
            >
              Download on the App Store
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
