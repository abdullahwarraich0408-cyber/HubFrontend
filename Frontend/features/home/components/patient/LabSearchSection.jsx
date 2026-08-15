"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MagnifyingGlass, House, Flask } from "@phosphor-icons/react";

const POPULAR_TESTS = [
  { name: "HbA1c", category: "Diabetes", href: "/lab-tests/browse?q=HbA1c" },
  { name: "Fasting Blood Sugar", category: "Diabetes", href: "/lab-tests/browse?q=blood%20sugar" },
  { name: "CBC", category: "General", href: "/lab-tests/browse?q=CBC" },
  { name: "Lipid Profile", category: "Heart Health", href: "/lab-tests/browse?q=lipid" },
  { name: "Thyroid Profile", category: "Hormone", href: "/lab-tests/browse?q=thyroid" },
  { name: "Vitamin D", category: "Wellness", href: "/lab-tests/browse?q=vitamin%20D" },
];

export function LabSearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [imgFailed, setImgFailed] = useState(false);

  const submit = (e) => {
    e?.preventDefault();
    const q = query.trim();
    router.push(q ? `/lab-tests/browse?q=${encodeURIComponent(q)}` : "/lab-tests");
  };

  return (
    <section className="bg-[#F4F7FA] py-16 md:py-20 lg:py-24">
      <div className="home-container mx-auto">
        {/* Unique: search-first command layout — centered, no split editorial */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0B6E99]">
            <Flask size={14} weight="duotone" />
            Lab Tests
          </p>
          <h2 className="mt-3 text-[clamp(1.85rem,3.2vw,2.85rem)] font-semibold leading-[1.15] tracking-tight text-[#102A43]">
            Need a lab test?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-[#627D98] md:text-[17px]">
            Choose a lab partner first, then book from their tests — or search a test
            name below. Home sample collection where available.
          </p>

          <form
            onSubmit={submit}
            className="mt-8 flex items-center gap-2 rounded-[16px] border border-[#102A43]/08 bg-white px-4 py-3.5 shadow-[0_12px_40px_rgba(16,42,67,0.08)] transition-all focus-within:ring-[3px] focus-within:ring-[#0B6E99]/15"
          >
            <MagnifyingGlass size={20} className="shrink-0 text-[#0B6E99]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search HbA1c, CBC, thyroid, blood sugar..."
              className="min-w-0 flex-1 bg-transparent text-[15px] text-[#102A43] outline-none placeholder:text-[#627D98] md:text-[16px]"
              aria-label="Search lab tests"
            />
            <button
              type="submit"
              className="rounded-[12px] bg-[#0B6E99] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#073B4C]"
            >
              Search
            </button>
          </form>
        </div>

        {/* Unique: popular tests as compact chips, not rows or posters */}
        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2.5">
          {POPULAR_TESTS.map((test) => (
            <Link
              key={test.name}
              href={test.href}
              className="group inline-flex items-center gap-2 rounded-full border border-[#102A43]/08 bg-white px-4 py-2.5 text-[13px] font-medium text-[#334E68] transition-colors hover:border-[#0B6E99]/35 hover:text-[#0B6E99]"
            >
              <span>{test.name}</span>
              <span className="text-[11px] text-[#627D98] group-hover:text-[#0B6E99]/70">
                {test.category}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-center">
          <Link
            href="/lab-tests"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0B6E99]"
          >
            Browse lab offers
            <ArrowRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-[3px]"
            />
          </Link>
          <Link
            href="/lab-tests/browse"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#627D98] hover:text-[#0B6E99]"
          >
            Search all tests
            <ArrowRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-[3px]"
            />
          </Link>
        </div>

        {/* Unique: wide landscape home-sampling band below search */}
        <div className="relative mt-12 overflow-hidden rounded-[28px] md:rounded-[32px]">
          <div className="relative aspect-[21/8] min-h-[180px] bg-[#EAF7F5] md:min-h-[220px]">
            {!imgFailed ? (
              <Image
                src="/images/home-lab-sampling.png"
                alt="Healthcare professional providing home sample collection"
                fill
                className="object-cover object-center"
                sizes="100vw"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#EAF7F5] to-[#DEEEF9]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#073B4C]/70 via-[#073B4C]/35 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-6 md:p-10">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                <House size={12} weight="fill" />
                Home sampling
              </span>
              <p className="mt-3 text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-snug text-white">
                Sample collection at home from selected labs
              </p>
              <Link
                href="/lab-tests"
                className="group mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-white"
              >
                Book a test
                <ArrowRight
                  size={14}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-[3px]"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
