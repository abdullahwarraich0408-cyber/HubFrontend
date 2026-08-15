"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export function ClosingBand() {
  return (
    <section className="bg-[#073B4C] py-16 md:py-20 lg:py-24">
      <div className="home-container mx-auto">
        <div className="max-w-2xl">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#7DD3C7]">
            Your Healthcare, Connected
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold leading-[1.15] tracking-tight text-white">
            One place for the healthcare services you use most
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-white/70 md:text-[17px]">
            Manage appointments, medicines and diagnostic services through your Medzoos
            account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#gateway"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-white px-5 text-[14px] font-semibold text-[#073B4C] transition-colors hover:bg-[#EAF7F5]"
            >
              Explore Services
              <ArrowRight
                size={15}
                weight="bold"
                className="transition-transform group-hover:translate-x-[3px]"
              />
            </Link>
            <Link
              href="/account"
              className="inline-flex h-12 items-center justify-center rounded-[12px] border border-white/25 px-5 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              View My Healthcare
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
