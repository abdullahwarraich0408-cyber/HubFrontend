"use client";

import Link from "next/link";
import Image from "next/image";
import {
  House,
  Buildings,
  ShoppingCart,
  FileText,
  ArrowRight,
} from "@phosphor-icons/react";

const QUICK_LINKS = [
  {
    label: "Lab offers",
    href: "/lab-tests",
    icon: Buildings,
    tone: "bg-white text-[#102A43] border border-[#102A43]/08",
  },
  {
    label: "Lab cart",
    href: "/lab-tests/cart",
    icon: ShoppingCart,
    tone: "bg-[#062F3D] text-white",
  },
  {
    label: "My reports",
    href: "/account/reports",
    icon: FileText,
    tone: "bg-white text-[#102A43] border border-[#102A43]/08",
  },
];

export function LabQuickLinks() {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {QUICK_LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold transition-transform hover:-translate-y-0.5 ${link.tone}`}
          >
            <Icon size={16} weight="bold" />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

export function LabHomeSamplingBand() {
  return (
    <div className="relative mb-8 overflow-hidden rounded-[28px] md:rounded-[32px]">
      <div className="relative aspect-[21/8] min-h-[160px] bg-[#EAF7F5] md:min-h-[200px]">
        <Image
          src="/images/home-lab-sampling.png"
          alt="Home sample collection"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#062F3D]/85 via-[#062F3D]/45 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center p-6 md:p-10">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            <House size={12} weight="fill" />
            Home sampling
          </span>
          <p className="mt-3 text-[clamp(1.2rem,2.2vw,1.75rem)] font-bold leading-snug text-white">
            Sample collection at home from selected labs
          </p>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/70">
            Available through participating laboratories on Medzoos.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LabCategoryFilter({ categories = [], activeCategory, onChange }) {
  const items = [
    { id: null, label: "All tests" },
    ...categories.map((cat) => ({
      id: cat.id || cat.slug || cat.label,
      label: cat.label || cat.name || String(cat.id),
    })),
  ];

  return (
    <div className="mb-3 overflow-hidden rounded-[20px] border border-[#102A43]/08 bg-white p-2 shadow-[0_10px_30px_rgba(16,42,67,0.05)]">
      <p className="mb-2 px-2 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#627D98]">
        Categories
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {items.map((item) => {
          const active =
            (item.id == null && !activeCategory) || activeCategory === item.id;
          return (
            <button
              key={item.id ?? "all"}
              type="button"
              onClick={() => onChange(item.id)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-bold transition-all ${
                active
                  ? "bg-[#062F3D] text-white shadow-sm"
                  : "bg-[#EEF2F6] text-[#627D98] hover:text-[#102A43]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LabProviderFilter({ labs = [], activeLab, onChange }) {
  if (!labs.length) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-[20px] border border-[#102A43]/08 bg-white p-2 shadow-[0_10px_30px_rgba(16,42,67,0.05)]">
      <p className="mb-2 px-2 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#627D98]">
        Laboratory
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-bold transition-all ${
            !activeLab
              ? "bg-[#16A9E0] text-white shadow-sm"
              : "bg-[#EEF2F6] text-[#627D98] hover:text-[#102A43]"
          }`}
        >
          All labs
        </button>
        {labs.map((lab) => (
          <button
            key={lab}
            type="button"
            onClick={() => onChange(lab)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-bold transition-all ${
              activeLab === lab
                ? "bg-[#16A9E0] text-white shadow-sm"
                : "bg-[#EEF2F6] text-[#627D98] hover:text-[#102A43]"
            }`}
          >
            <Buildings size={14} weight="bold" />
            {lab}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LabPopularStrip({ tests = [] }) {
  if (!tests.length) return null;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
            Popular
          </p>
          <h2 className="mt-1 text-[20px] font-bold tracking-tight text-[#102A43]">
            Frequently booked
          </h2>
        </div>
        <Link
          href="/lab-tests"
          className="group inline-flex items-center gap-1 text-[13px] font-bold text-[#0B6E99]"
          onClick={(e) => {
            // stay on page — scroll to all tests
            e.preventDefault();
            document.getElementById("all-lab-tests")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          See all
          <ArrowRight
            size={14}
            weight="bold"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {tests.slice(0, 6).map((test) => (
          <Link
            key={test.id}
            href={`/lab-tests/${test.id}`}
            className="group w-[220px] shrink-0 snap-start rounded-[20px] bg-[#062F3D] p-4 text-white transition-transform hover:-translate-y-0.5 sm:w-[240px]"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7DD3C7]">
              {test.category ? String(test.category).replace(/_/g, " ") : "Lab test"}
            </p>
            <h3 className="mt-2 line-clamp-2 min-h-[2.5rem] text-[15px] font-bold leading-snug">
              {test.name}
            </h3>
            <p className="mt-2 line-clamp-1 text-[12px] font-medium text-[#7DD3C7]">
              {test.labPartner?.name || test.lab || "Lab partner"}
            </p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[13px] font-semibold text-white/80">
                {typeof test.price === "number"
                  ? `PKR ${test.price.toLocaleString()}`
                  : "View"}
              </span>
              <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#16A9E0]">
                Book
                <ArrowRight
                  size={12}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
