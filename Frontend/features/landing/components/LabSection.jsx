"use client";

import Link from "next/link";
import {
  ArrowRight,
  Flask,
  Buildings,
  Clock,
  FileText,
} from "@phosphor-icons/react";
import { LandingImage } from "./LandingImage";
import { FadeIn } from "./FadeIn";

const FEATURES = [
  { label: "Choose your test", icon: Flask },
  { label: "Select a laboratory", icon: Buildings },
  { label: "Pick a time", icon: Clock },
  { label: "Receive reports digitally", icon: FileText },
];

export function LabSection() {
  return (
    <section id="medicines-labs" className="scroll-mt-24 py-16 md:py-20 lg:py-24">
      <div className="landing-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <FadeIn>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[#102A43]/08 bg-[#EAF8F7] shadow-[0_16px_48px_rgba(16,42,67,0.08)]">
              <LandingImage
                src="/images/home-sample.png"
                alt="Healthcare professional collecting a lab sample at a patient's home"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full"
                imageClassName="object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div>
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#17618E]">
                Home Collection
              </p>
              <h2 className="font-sans text-[clamp(1.75rem,3vw,2.4rem)] font-semibold leading-[1.2] tracking-tight text-[#102A43]">
                Lab testing without always leaving home
              </h2>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-[#52606D]">
                Where supported by the selected laboratory, patients can request
                home sample collection and choose a convenient date and time.
              </p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <li
                      key={feature.label}
                      className="flex items-center gap-3 rounded-2xl border border-[#102A43]/08 bg-[#F7FAFC] px-3.5 py-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#17618E] shadow-sm">
                        <Icon size={18} weight="duotone" />
                      </span>
                      <span className="text-[14px] font-medium text-[#334E68]">
                        {feature.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/lab-tests"
                className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#17618E] px-5 text-[14px] font-semibold text-white transition-all hover:bg-[#124362] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17618E]/40 focus-visible:ring-offset-2"
              >
                Find Lab Tests
                <ArrowRight
                  size={16}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
