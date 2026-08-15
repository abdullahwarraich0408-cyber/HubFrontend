"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Pill, Drop, Pulse, Flask, Stethoscope } from "@phosphor-icons/react";

const SHORTCUTS = [
  { label: "Diabetes Medicines", href: "/browse?category=diabetes", icon: Pill },
  { label: "Insulin", href: "/browse?category=diabetes&q=insulin", icon: Drop },
  { label: "Glucose Meters", href: "/browse?category=health-devices", icon: Pulse },
  { label: "Test Strips", href: "/browse?category=diabetes&q=strips", icon: Pulse },
  { label: "HbA1c", href: "/lab-tests/browse?q=HbA1c", icon: Flask },
  { label: "Blood Sugar Tests", href: "/lab-tests/browse?q=blood%20sugar", icon: Flask },
  { label: "Diabetes Doctors", href: "/doctors?specialty=endocrinologist", icon: Stethoscope },
];

export function DiabetesSpotlight() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#102A43]/08 bg-white shadow-[0_4px_20px_rgba(16,42,67,0.04)]">
      <div className="grid lg:grid-cols-2">
        <div className="p-6 md:p-8 lg:p-9">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0B6E99]">
            Diabetes Care
          </p>
          <h2 className="mt-2 text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold leading-tight text-[#102A43]">
            Everything you need for better diabetes care access
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#627D98]">
            Find medicines, monitoring products, consultations and diagnostic
            services in one connected experience.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {SHORTCUTS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#102A43]/08 bg-[#F1F7FA] px-3 py-1.5 text-[12px] font-medium text-[#334E68] transition-colors hover:border-[#0B6E99]/30 hover:text-[#0B6E99]"
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/browse?category=diabetes"
            className="group mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#0B6E99] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#073B4C]"
          >
            Explore Diabetes Care
            <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="relative min-h-[220px] bg-gradient-to-br from-[#EAF7F5] to-[#DEEEF9] lg:min-h-full">
          {!imgFailed ? (
            <Image
              src="/images/home-diabetes-care.png"
              alt="Patient managing diabetes care with Medzoos at home"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="max-w-xs text-center">
                <Drop size={40} className="mx-auto text-[#0B6E99]" weight="duotone" />
                <p className="mt-3 text-[14px] font-medium text-[#334E68]">
                  Diabetes care, medicines and monitoring in one place
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
