"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { FadeIn } from "./FadeIn";

export function ProviderCTA() {
  return (
    <section className="py-10 md:py-14">
      <div className="landing-container">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[28px] border border-[#102A43]/10 bg-[#102A43] px-6 py-10 text-white md:px-10 md:py-12 lg:px-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#17618E]/30 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#3B82F6]/20 blur-3xl" aria-hidden />

            <div className="relative max-w-2xl">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#7DD3C7]">
                For Healthcare Providers
              </p>
              <h2 className="mt-3 font-sans text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-[1.2] tracking-tight text-white">
                Grow your digital presence with Medzoos
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/75 md:text-[16px]">
                If you&apos;re a healthcare professional, pharmacy, laboratory,
                clinic or hospital, Medzoos is being built to help you connect
                with patients through a modern healthcare platform.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/partner-with-us"
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[14px] font-semibold text-[#102A43] transition-all hover:bg-[#EAF8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Join as a Provider
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/partner-with-us"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/25 px-5 text-[14px] font-semibold text-white transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
