"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Flask, Tag, Buildings } from "@phosphor-icons/react";
import { useLabTests, usePopularLabTests, useLabs } from "@/lib/hooks/useApi";
import { mapLabToFrontend } from "@/lib/mappers/labTest";

const ACCENTS = [
  { bar: "bg-[#16A9E0]", wash: "from-[#E8F7FC] to-white", icon: "bg-[#16A9E0]/15 text-[#0B6E99]" },
  { bar: "bg-[#7DD3C7]", wash: "from-[#EAF8F6] to-white", icon: "bg-[#7DD3C7]/25 text-[#087F8C]" },
  { bar: "bg-[#0B6E99]", wash: "from-[#E8F0F5] to-white", icon: "bg-[#0B6E99]/12 text-[#073B4C]" },
  { bar: "bg-[#087F8C]", wash: "from-[#E6F4F5] to-white", icon: "bg-[#087F8C]/15 text-[#062F3D]" },
];

function getLabName(test) {
  return (
    test?.labPartner?.name ||
    test?.labPartner?.business_name ||
    test?.lab ||
    null
  );
}

/**
 * Offers strip — ticket-style deal cards (distinct from tall lab posters).
 * Only renders when discounted / popular tests or labs with tests exist.
 */
export function LabOffersSection() {
  const { data: tests = [], isLoading: loadingTests } = useLabTests();
  const { data: popular = [], isLoading: loadingPopular } = usePopularLabTests();
  const { data: rawLabs = [], isLoading: loadingLabs } = useLabs();

  const offers = useMemo(() => {
    const discounted = tests.filter(
      (t) => t.discount != null && String(t.discount).trim() !== ""
    );
    if (discounted.length > 0) {
      return discounted.slice(0, 8).map((t) => ({
        id: `test-${t.id}`,
        company: getLabName(t),
        title: t.name,
        badge: String(t.discount).trim(),
        price: typeof t.price === "number" ? t.price : null,
        href:
          t.labPartnerId || t.labPartner?.id
            ? `/lab-tests/labs/${t.labPartnerId || t.labPartner.id}`
            : `/lab-tests/${t.id}`,
        cta: "Claim offer",
        pricePrefix: "",
      }));
    }

    const popularPool = popular.length
      ? popular
      : tests.filter((t) => t.popular);
    const fromPopular = popularPool
      .filter((t) => getLabName(t))
      .slice(0, 6)
      .map((t) => ({
        id: `test-${t.id}`,
        company: getLabName(t),
        title: t.name,
        badge: t.discount ? String(t.discount).trim() : "Popular",
        price: typeof t.price === "number" ? t.price : null,
        href:
          t.labPartnerId || t.labPartner?.id
            ? `/lab-tests/labs/${t.labPartnerId || t.labPartner.id}`
            : `/lab-tests/${t.id}`,
        cta: "View offer",
        pricePrefix: "",
      }));
    if (fromPopular.length > 0) return fromPopular;

    return rawLabs
      .map(mapLabToFrontend)
      .filter((lab) => lab && (lab.testCount > 0 || (lab.tests && lab.tests.length > 0)))
      .slice(0, 6)
      .map((lab) => ({
        id: `lab-${lab.id}`,
        company: lab.name,
        title: `${lab.testCount || lab.tests?.length || 0} tests available`,
        badge: lab.homeCollection ? "Home collection" : "Available now",
        price: lab.minPrice != null ? Number(lab.minPrice) : null,
        href: `/lab-tests/labs/${lab.id}`,
        cta: "View tests",
        pricePrefix: lab.minPrice != null ? "From " : "",
      }));
  }, [tests, popular, rawLabs]);

  const isLoading = loadingTests || loadingPopular || loadingLabs;

  if (isLoading) {
    return (
      <section className="mb-8 md:mb-10">
        <div className="mb-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
            Offers
          </p>
          <h2 className="mt-1 text-[20px] font-bold tracking-tight text-[#102A43]">
            Lab test offers
          </h2>
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[148px] w-[min(100%,320px)] shrink-0 animate-pulse rounded-[18px] bg-[#D7E2EA]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!offers.length) return null;

  return (
    <section className="mb-8 md:mb-10" aria-labelledby="lab-offers-heading">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
            <Tag size={13} weight="fill" />
            Offers
          </p>
          <h2
            id="lab-offers-heading"
            className="mt-1 text-[20px] font-bold tracking-tight text-[#102A43] md:text-[22px]"
          >
            Offers from partner labs
          </h2>
          <p className="mt-1 text-[14px] text-[#627D98]">
            Ticket-style deals — company name on every card.
          </p>
        </div>
        <Link
          href="/lab-tests/browse"
          className="group inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0B6E99]"
        >
          Browse all tests
          <ArrowRight
            size={14}
            weight="bold"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory md:gap-4">
        {offers.map((offer, index) => {
          const accent = ACCENTS[index % ACCENTS.length];

          return (
            <Link
              key={offer.id}
              href={offer.href}
              className={`group relative flex h-[148px] w-[min(88vw,320px)] shrink-0 snap-start overflow-hidden rounded-[18px] bg-gradient-to-br ${accent.wash} shadow-[0_8px_28px_rgba(16,42,67,0.08)] transition-transform duration-300 hover:-translate-y-1 sm:w-[300px]`}
            >
              {/* Left accent + perforated ticket edge */}
              <div className={`relative w-2.5 shrink-0 ${accent.bar}`} aria-hidden />
              <div
                className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F0F4F8]"
                aria-hidden
              />

              <div className="flex min-w-0 flex-1 flex-col justify-between p-4 pl-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex max-w-[70%] items-center gap-1.5 truncate rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-[#073B4C] ring-1 ring-[#102A43]/06">
                    <Buildings size={12} weight="fill" className="shrink-0 text-[#0B6E99]" />
                    <span className="truncate">{offer.company || "Partner lab"}</span>
                  </span>
                  <span className="shrink-0 rounded-md bg-[#062F3D] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7DD3C7]">
                    {offer.badge}
                  </span>
                </div>

                <div className="mt-2 flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${accent.icon}`}
                  >
                    <Flask size={20} weight="duotone" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-[15px] font-bold leading-snug tracking-tight text-[#102A43] transition-colors group-hover:text-[#0B6E99]">
                      {offer.title}
                    </h3>
                    {offer.price != null ? (
                      <p className="mt-1 text-[14px] font-bold text-[#062F3D]">
                        {offer.pricePrefix || ""}
                        PKR {Number(offer.price).toLocaleString()}
                      </p>
                    ) : (
                      <p className="mt-1 text-[12px] font-medium text-[#627D98]">
                        See details
                      </p>
                    )}
                  </div>
                </div>

                <span className="mt-2 inline-flex items-center gap-1 self-start text-[12px] font-bold text-[#0B6E99]">
                  {offer.cta}
                  <ArrowRight
                    size={13}
                    weight="bold"
                    className="transition-transform group-hover:translate-x-[3px]"
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
