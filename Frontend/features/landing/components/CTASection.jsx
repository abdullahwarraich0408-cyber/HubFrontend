"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { FadeIn } from "./FadeIn";

export function CTASection() {
  return (
    <section className="pb-16 pt-4 md:pb-20 lg:pb-24">
      <div className="landing-container">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#17618E] via-[#0FA7E3] to-[#124362] px-6 py-12 text-center text-white shadow-[0_24px_60px_rgba(8,127,140,0.28)] md:px-12 md:py-16">
            <div
              className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-8 bottom-4 h-48 w-48 rounded-full bg-[#3B82F6]/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 rounded-full border border-white/15"
              aria-hidden
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-sans text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.2] tracking-tight">
                Take the first step toward simpler healthcare
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 md:text-[16px]">
                Discover medicines, doctors, consultations and diagnostic services
                through Medzoos.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-[#17618E] transition-all hover:bg-[#EAF8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Create Free Account
                  <ArrowRight
                    size={18}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="#services"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-[15px] font-semibold text-white transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
