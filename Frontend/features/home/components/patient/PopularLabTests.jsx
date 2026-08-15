"use client";

import Link from "next/link";
import { ArrowRight, Flask, House, TestTube } from "@phosphor-icons/react";

const FALLBACK_TEST_NAMES = [
  { name: "HbA1c", category: "Diabetes" },
  { name: "Fasting Blood Sugar", category: "Diabetes" },
  { name: "Random Blood Sugar", category: "Diabetes" },
  { name: "Lipid Profile", category: "Heart Health" },
  { name: "CBC", category: "General" },
  { name: "Thyroid Profile", category: "Hormone" },
];

export function PopularLabTests({ tests = [], isLoading, isError, onRetry }) {
  const hasApiTests = tests.length > 0;
  const displayTests = hasApiTests
    ? tests.slice(0, 6).map((t) => ({
        id: t.id,
        name: t.name,
        category: t.category || "Lab Test",
        price: typeof t.price === "number" ? t.price : null,
        homeSample: Boolean(t.homeSample || t.homeCollection),
        href: t.id ? `/lab-tests/${t.id}` : "/lab-tests",
      }))
    : FALLBACK_TEST_NAMES.map((t) => ({
        ...t,
        id: null,
        price: null,
        homeSample: false,
        href: `/lab-tests/browse?q=${encodeURIComponent(t.name)}`,
      }));

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0B6E99]">
            Lab Tests
          </p>
          <h2 className="mt-1 text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold text-[#102A43]">
            Popular health tests
          </h2>
        </div>
        <Link
          href="/lab-tests"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0B6E99] hover:underline"
        >
          View All Lab Tests <ArrowRight size={14} weight="bold" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[120px] animate-pulse rounded-[18px] bg-[#E8EEF2]" />
          ))}
        </div>
      ) : isError && !hasApiTests ? (
        <div className="rounded-[20px] border border-[#102A43]/08 bg-white px-5 py-8 text-center">
          <p className="text-[14px] text-[#627D98]">We couldn&apos;t load lab tests right now.</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex h-10 items-center rounded-xl border border-[#102A43]/12 px-4 text-[13px] font-semibold"
            >
              Try Again
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayTests.map((test) => (
            <Link
              key={test.id || test.name}
              href={test.href}
              className="group flex items-start gap-3 rounded-[18px] border border-[#102A43]/08 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-[#0B6E99]/25 hover:shadow-[0_8px_24px_rgba(16,42,67,0.06)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7F5] text-[#0B6E99]">
                <Flask size={18} weight="duotone" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-[#102A43] group-hover:text-[#0B6E99]">
                  {test.name}
                </span>
                <span className="mt-0.5 block text-[12px] text-[#627D98]">{test.category}</span>
                <span className="mt-2 flex flex-wrap items-center gap-2">
                  {typeof test.price === "number" ? (
                    <span className="text-[13px] font-semibold text-[#102A43]">
                      PKR {test.price.toLocaleString()}
                    </span>
                  ) : null}
                  {test.homeSample ? (
                    <span className="rounded-full bg-[#E4F5ED] px-2 py-0.5 text-[10px] font-semibold text-[#176B4C]">
                      Home sample
                    </span>
                  ) : null}
                  <span className="text-[12px] font-semibold text-[#0B6E99]">View Test</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-4 rounded-[20px] border border-[#0B6E99]/15 bg-gradient-to-r from-[#EAF7F5] to-[#DEEEF9] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0B6E99] shadow-sm">
            <span className="relative">
              <House size={20} weight="duotone" />
              <TestTube size={12} className="absolute -bottom-0.5 -right-1" weight="fill" />
            </span>
          </span>
          <div>
            <h3 className="text-[16px] font-semibold text-[#102A43]">
              Need a lab test at home?
            </h3>
            <p className="mt-1 max-w-lg text-[14px] text-[#627D98]">
              Choose a participating laboratory and request home sample collection where
              the service is available.
            </p>
          </div>
        </div>
        <Link
          href="/lab-tests"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#0B6E99] px-5 text-[13px] font-semibold text-white hover:bg-[#073B4C]"
        >
          Explore Home Sampling
        </Link>
      </div>
    </section>
  );
}
