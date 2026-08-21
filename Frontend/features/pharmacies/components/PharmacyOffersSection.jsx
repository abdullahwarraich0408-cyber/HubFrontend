"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Tag, Pill, Buildings } from "@phosphor-icons/react";
import { useProducts, useVendors } from "@/lib/hooks/useApi";
import { slugifyVendorName } from "@/lib/mappers/vendor";

const ACCENTS = [
  { bar: "bg-[#16A9E0]", wash: "from-[#E8F7FC] to-white", icon: "bg-[#16A9E0]/15 text-[#0B6E99]" },
  { bar: "bg-[#7DD3C7]", wash: "from-[#EAF8F6] to-white", icon: "bg-[#7DD3C7]/25 text-[#17618E]" },
  { bar: "bg-[#0B6E99]", wash: "from-[#E8F0F5] to-white", icon: "bg-[#0B6E99]/12 text-[#073B4C]" },
  { bar: "bg-[#17618E]", wash: "from-[#E6F4F5] to-white", icon: "bg-[#17618E]/15 text-[#062F3D]" },
];

/**
 * Pharmacy offers — same ticket-style cards as LabOffersSection.
 * Only shows when discounted products / listed medicines / pharmacies with stock exist.
 */
export function PharmacyOffersSection() {
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: pharmacies = [], isLoading: loadingVendors } = useVendors();

  const pharmacyById = useMemo(() => {
    const map = new Map();
    pharmacies.forEach((p) => {
      if (p?.id) map.set(p.id, p);
    });
    return map;
  }, [pharmacies]);

  const offers = useMemo(() => {
    const discounted = products.filter(
      (p) => p.discount != null && Number(p.discount) > 0 && p.price != null
    );

    if (discounted.length > 0) {
      return discounted.slice(0, 8).map((p) => {
        const pharmacy = p.vendorId ? pharmacyById.get(p.vendorId) : null;
        const company = p.vendor || pharmacy?.name || null;
        const slug =
          p.vendorSlug ||
          pharmacy?.slug ||
          (company ? slugifyVendorName(company) : null);

        return {
          id: `product-${p.id}`,
          company,
          title: p.name,
          badge: `${Math.round(Number(p.discount))}% OFF`,
          price: Number(p.price),
          href: slug ? `/vendors/${slug}` : `/product/${p.id}`,
          cta: "Claim offer",
          pricePrefix: "",
        };
      });
    }

    const featured = products
      .filter((p) => (p.vendor || p.vendorId) && p.price != null && p.stock > 0)
      .slice(0, 6)
      .map((p) => {
        const pharmacy = p.vendorId ? pharmacyById.get(p.vendorId) : null;
        const company = p.vendor || pharmacy?.name || null;
        const slug =
          p.vendorSlug ||
          pharmacy?.slug ||
          (company ? slugifyVendorName(company) : null);

        return {
          id: `product-${p.id}`,
          company,
          title: p.name,
          badge: "Available",
          price: Number(p.price),
          href: slug ? `/vendors/${slug}` : `/product/${p.id}`,
          cta: "View offer",
          pricePrefix: "",
        };
      });
    if (featured.length > 0) return featured;

    return pharmacies
      .filter((p) => p.products > 0)
      .slice(0, 6)
      .map((p) => ({
        id: `vendor-${p.id}`,
        company: p.name,
        title: `${p.products} medicines in store`,
        badge: p.status === "open" ? "Open now" : "Pharmacy",
        price: null,
        href: `/vendors/${p.slug}`,
        cta: "Visit store",
        pricePrefix: "",
      }));
  }, [products, pharmacies, pharmacyById]);

  const isLoading = loadingProducts || loadingVendors;

  if (isLoading) {
    return (
      <section className="mb-8 md:mb-10">
        <div className="mb-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
            Offers
          </p>
          <h2 className="mt-1 text-[20px] font-bold tracking-tight text-[#102A43]">
            Medicine offers
          </h2>
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[148px] w-[min(100%,320px)] shrink-0 animate-pulse rounded-[18px] bg-white/70"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!offers.length) return null;

  return (
    <section className="mb-8 md:mb-10" aria-labelledby="pharmacy-offers-heading">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
            <Tag size={13} weight="fill" />
            Offers
          </p>
          <h2
            id="pharmacy-offers-heading"
            className="mt-1 text-[20px] font-bold tracking-tight text-[#102A43] md:text-[22px]"
          >
            Offers from pharmacies
          </h2>
          <p className="mt-1 text-[14px] text-[#627D98]">
            Ticket-style deals — pharmacy name on every card.
          </p>
        </div>
        <Link
          href="/browse"
          className="group inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0B6E99]"
        >
          Browse medicines
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
              <div className={`relative w-2.5 shrink-0 ${accent.bar}`} aria-hidden />
              <div
                className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8F2F6]"
                aria-hidden
              />

              <div className="flex min-w-0 flex-1 flex-col justify-between p-4 pl-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex max-w-[70%] items-center gap-1.5 truncate rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-[#073B4C] ring-1 ring-[#102A43]/06">
                    <Buildings size={12} weight="fill" className="shrink-0 text-[#0B6E99]" />
                    <span className="truncate">{offer.company || "Partner pharmacy"}</span>
                  </span>
                  <span className="shrink-0 rounded-md bg-[#062F3D] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7DD3C7]">
                    {offer.badge}
                  </span>
                </div>

                <div className="mt-2 flex items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${accent.icon}`}
                  >
                    <Pill size={20} weight="duotone" />
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
