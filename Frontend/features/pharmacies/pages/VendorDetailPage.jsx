"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import {
  CaretRight,
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle,
  ChatCircle,
  MapTrifold,
  ShareNetwork,
  Heart,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { useVendorBySlug, useVendorProducts } from "@/lib/hooks/useApi";
import { MOCK_VENDOR_REVIEWS } from "../data/mockPharmacies";
import { STORE_CATEGORIES, filterStoreProducts } from "../data/mockStoreProducts";
import { StoreProductCard } from "../components/StoreProductCard";

const WHY_CHOOSE = [
  "Partner pharmacy on Medzoos",
  "Order medicines from this store",
  "Upload prescriptions when needed",
  "Track your order in the app",
];

function SidebarCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-[12px] border border-[var(--color-neutral-200)] p-5 shadow-[var(--shadow-card)] ${className}`}>
      {title ? <h3 className="text-[14px] font-bold text-[var(--color-ink-headline)] mb-4">{title}</h3> : null}
      {children}
    </div>
  );
}

function PriceRangeFilter({ maxPrice, onChange }) {
  const min = 0;
  const max = 10000;
  const percent = Math.round(((maxPrice - min) / max) * 100);

  return (
    <div>
      <p className="text-[12px] font-semibold text-[var(--color-neutral-500)] mb-2.5">Price Range</p>
      <input
        type="range"
        min={500}
        max={10000}
        step={500}
        value={maxPrice}
        onChange={(e) => onChange(Number(e.target.value))}
        className="store-price-range w-full"
        style={{ "--range-progress": `${percent}%` }}
      />
      <div className="flex justify-between text-[11px] text-[var(--color-neutral-500)] mt-2">
        <span>PKR 0</span>
        <span className="font-semibold text-[var(--color-brand-primary)]">
          {maxPrice >= max ? "PKR 10,000+" : `Up to PKR ${maxPrice.toLocaleString()}`}
        </span>
      </div>
    </div>
  );
}

export function VendorDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const { data: pharmacy, isLoading: vendorLoading, isError: vendorError } = useVendorBySlug(slug);
  const { data: storeProducts = [], isLoading: productsLoading } = useVendorProducts(pharmacy?.id);
  const [activeTab, setActiveTab] = useState("medicines");
  const [activeCategory, setActiveCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("popularity");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const tabs = ["store", "medicines", "healthcare", "reviews", "about"];
    if (tab && tabs.includes(tab)) setActiveTab(tab);
  }, [searchParams]);

  const products = useMemo(() => {
    let list = filterStoreProducts(storeProducts, activeCategory, maxPrice);
    if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "discount") list = [...list].sort((a, b) => b.discount - a.discount);
    return list;
  }, [storeProducts, activeCategory, maxPrice, sortBy]);

  if (vendorLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F0F4F8] py-8 md:py-10">
        <div className="home-container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-48 rounded bg-[#D7E2EA]" />
            <div className="h-48 rounded-[28px] bg-[#D7E2EA]" />
            <div className="h-12 rounded-[14px] bg-[#D7E2EA]" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 rounded-[12px] bg-[#D7E2EA]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (vendorError || !pharmacy) {
    return (
      <div className="min-h-screen w-full bg-[#F0F4F8] py-16">
        <div className="home-container mx-auto px-4 text-center">
          <h1 className="text-[22px] font-bold text-[#102A43]">Pharmacy not found</h1>
          <p className="mt-2 text-[14px] text-[#627D98]">
            This pharmacy may no longer be available or the link is incorrect.
          </p>
          <Link
            href="/vendors"
            className="mt-6 inline-flex rounded-full bg-[#062F3D] px-5 py-2.5 text-[13px] font-bold text-white"
          >
            Browse Pharmacies
          </Link>
        </div>
      </div>
    );
  }

  const isOpen = pharmacy.status === "open";

  const showCatalog = activeTab === "store" || activeTab === "medicines" || activeTab === "healthcare";
  const activeCategoryLabel = STORE_CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "All Medicines";

  const tabs = [
    { id: "store", label: "Store" },
    { id: "medicines", label: "Medicines" },
    { id: "healthcare", label: "Healthcare" },
    { id: "reviews", label: `Reviews${pharmacy.reviews ? ` (${pharmacy.reviews})` : ""}` },
    { id: "about", label: "About" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8] py-8 md:py-10">
      <div className="home-container mx-auto">
        <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-[#627D98]">
          <Link href="/vendors" className="font-semibold hover:text-[#0B6E99]">
            Pharmacies
          </Link>
          <CaretRight size={12} />
          <span className="font-semibold text-[#102A43]">{pharmacy.name}</span>
        </nav>

        {/* Store profile — Gen-Z navy hero */}
        <div className="relative mb-0 overflow-hidden rounded-t-[28px] bg-[#0B6E99] px-6 py-8 text-white md:rounded-t-[32px] md:px-8 md:py-10">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#7DD3C7]/20 blur-3xl"
            aria-hidden
          />
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-6 md:top-6">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 text-[12px] font-bold text-white hover:bg-white/15"
            >
              <ShareNetwork size={15} />
              Share
            </button>
            <button
              type="button"
              onClick={() => setSaved((s) => !s)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[12px] font-bold transition-colors ${
                saved
                  ? "border-[#7DD3C7]/40 bg-[#7DD3C7]/20 text-[#7DD3C7]"
                  : "border-white/15 bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              <Heart size={15} weight={saved ? "fill" : "regular"} />
              Save
            </button>
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-8">
            <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-[18px] bg-white/10 sm:w-[200px] lg:h-[160px]">
              <Image
                src={pharmacy.bgImage}
                alt={pharmacy.name}
                fill
                className="object-cover"
                sizes="200px"
                priority
              />
            </div>

            <div className="min-w-0 flex-1 pr-0 md:pr-36">
              <p className="inline-flex max-w-full truncate rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                {pharmacy.name}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <h1 className="text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight tracking-tight text-white">
                  {pharmacy.name}
                </h1>
                {pharmacy.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#16A9E0]/25 px-2.5 py-1 text-[11px] font-bold text-[#7DD3C7]">
                    <ShieldCheck size={12} weight="fill" />
                    Verified
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold ${
                    isOpen
                      ? "bg-[#7DD3C7]/25 text-[#7DD3C7]"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isOpen ? "bg-[#7DD3C7]" : "bg-white/40"
                    }`}
                  />
                  {isOpen ? "Open now" : "Closed"}
                </span>
                {pharmacy.rating != null ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/85">
                    <Star size={13} weight="fill" className="text-[#7DD3C7]" />
                    {Number(pharmacy.rating).toFixed(1)}
                    {pharmacy.reviews ? (
                      <span className="text-white/50">({pharmacy.reviews})</span>
                    ) : null}
                  </span>
                ) : null}
                {pharmacy.deliveryTime ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/85">
                    <Clock size={13} weight="fill" />
                    Delivery {pharmacy.deliveryTime}
                  </span>
                ) : null}
                {pharmacy.minOrder != null ? (
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/85">
                    Min PKR {Number(pharmacy.minOrder).toLocaleString()}
                  </span>
                ) : null}
              </div>

              {pharmacy.address ? (
                <p className="mt-4 flex items-start gap-1.5 text-[13px] text-white/65">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-[#7DD3C7]" weight="fill" />
                  {pharmacy.address}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="mb-7 rounded-b-[28px] border border-t-0 border-[#102A43]/08 bg-white px-6 shadow-[0_8px_28px_rgba(16,42,67,0.06)] md:rounded-b-[32px] md:px-8">
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 py-4 text-[14px] font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "border-[#16A9E0] text-[#0B6E99]"
                    : "border-transparent text-[#627D98] hover:text-[#102A43]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {showCatalog ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 lg:items-start">
            {/* Left sidebar — filter pinned visible in first view */}
            <aside className="lg:col-span-2 lg:sticky lg:top-[88px] lg:self-start">
              <div className="bg-white rounded-[12px] border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)] flex flex-col lg:max-h-[calc(100vh-108px)] overflow-hidden">
                <div className="p-4 pb-3 shrink-0">
                  <h3 className="text-[14px] font-bold text-[var(--color-ink-headline)] mb-3">Categories</h3>
                  <ul className="space-y-1 lg:max-h-[220px] lg:overflow-y-auto lg:pr-1">
                    {STORE_CATEGORIES.map((cat) => (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => setActiveCategory(cat.id)}
                          className={`w-full text-left px-3 py-2 rounded-[6px] text-[13px] font-medium transition-colors ${
                            activeCategory === cat.id
                              ? "bg-[var(--color-brand-mist)] text-[var(--color-brand-primary)]"
                              : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]"
                          }`}
                        >
                          {cat.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[var(--color-neutral-100)] p-4 pt-3 shrink-0 bg-white">
                  <h3 className="text-[14px] font-bold text-[var(--color-ink-headline)] mb-3">Filter By</h3>
                  <PriceRangeFilter maxPrice={maxPrice} onChange={setMaxPrice} />
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <main className="lg:col-span-7 flex flex-col lg:max-h-[calc(100vh-180px)] lg:min-h-0">
              <div className="bg-white rounded-[12px] border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)] flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[var(--color-neutral-100)] shrink-0 flex-wrap">
                  <h2 className="text-[15px] font-bold text-[var(--color-ink-headline)]">
                    {activeCategoryLabel} ({activeCategory === "all" ? storeProducts.length : products.length})
                  </h2>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-[36px] px-3 rounded-[8px] border border-[var(--color-neutral-200)] bg-white text-[13px] text-[var(--color-neutral-700)]"
                  >
                    <option value="popularity">Sort by: Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Best Discount</option>
                  </select>
                </div>

                <div className="overflow-y-auto flex-1 min-h-0 p-5 lg:max-h-[calc(100vh-260px)]">
                  {productsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 animate-pulse bg-[var(--color-neutral-100)] rounded-[12px]" />
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <p className="text-[15px] font-semibold text-[var(--color-ink-headline)] mb-1">No products found</p>
                      <p className="text-[13px] text-[var(--color-neutral-500)]">
                        {storeProducts.length === 0
                          ? "This pharmacy hasn't listed any products yet."
                          : "Try adjusting your filters to see more products."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                      {products.map((product) => (
                        <StoreProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </main>

            {/* Right sidebar */}
            <aside className="lg:col-span-3 space-y-5 lg:sticky lg:top-[88px] lg:self-start">
              <SidebarCard title="Store Info">
                <dl className="space-y-3 text-[13px]">
                  {[
                    ["Store Since", pharmacy.storeSince ?? "2012"],
                    ["Total Orders", `${(pharmacy.orders ?? 2300).toLocaleString()}+`],
                    ["Response Time", pharmacy.responseTime ?? "2 mins"],
                    ["Rating", `${pharmacy.rating} ★`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-[var(--color-neutral-500)]">{label}</dt>
                      <dd className="font-bold text-[var(--color-ink-headline)]">{value}</dd>
                    </div>
                  ))}
                </dl>
                <Button variant="secondary" className="w-full h-[38px] mt-5 text-[13px] font-bold rounded-[8px]">
                  <MapTrifold size={16} className="mr-1.5" />
                  View on Map
                </Button>
              </SidebarCard>

              <SidebarCard title="Why Choose Us?">
                <ul className="space-y-3">
                  {WHY_CHOOSE.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-[var(--color-neutral-600)]">
                      <CheckCircle size={16} className="text-[var(--color-status-success)] shrink-0 mt-0.5" weight="fill" />
                      {item}
                    </li>
                  ))}
                </ul>
              </SidebarCard>

              <SidebarCard title="Need Help?">
                <p className="text-[12px] text-[var(--color-neutral-500)] mb-4">Chat with our pharmacist for medicine advice.</p>
                <Button variant="primary" className="w-full h-[40px] text-[13px] font-bold rounded-[8px]">
                  <ChatCircle size={16} className="mr-1.5" weight="fill" />
                  Chat with Pharmacist
                </Button>
              </SidebarCard>
            </aside>
          </div>
        ) : activeTab === "reviews" ? (
          <div className="bg-white rounded-[14px] border border-[var(--color-neutral-200)] p-6 shadow-[var(--shadow-card)] max-w-4xl">
            <div className="flex items-center gap-6 p-5 bg-[var(--color-brand-mist)]/40 rounded-[12px] mb-6">
              <div className="text-center">
                <p className="text-[40px] font-bold">{pharmacy.rating}</p>
                <p className="text-[13px] text-[var(--color-neutral-500)]">{pharmacy.reviews} reviews</p>
              </div>
            </div>
            <div className="space-y-4">
              {MOCK_VENDOR_REVIEWS.map((review) => (
                <div key={review.author} className="p-4 border border-[var(--color-neutral-200)] rounded-[12px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-brand-mist)] flex items-center justify-center">
                        <User size={16} className="text-[var(--color-brand-primary)]" />
                      </div>
                      <span className="text-[14px] font-bold">{review.author}</span>
                    </div>
                    <span className="text-[12px] text-[var(--color-neutral-400)]">{review.date}</span>
                  </div>
                  <p className="text-[14px] text-[var(--color-neutral-600)] leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[14px] border border-[var(--color-neutral-200)] p-6 md:p-8 shadow-[var(--shadow-card)] max-w-4xl space-y-4">
            <h2 className="text-[20px] font-bold">About {pharmacy.name}</h2>
            <p className="text-[15px] text-[var(--color-neutral-600)] leading-relaxed">{pharmacy.about}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-[var(--color-neutral-50)] rounded-[12px]">
                <MapPin size={20} className="text-[var(--color-brand-primary)]" weight="fill" />
                <span className="text-[14px] font-medium">{pharmacy.address}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[var(--color-neutral-50)] rounded-[12px]">
                <Phone size={20} className="text-[var(--color-brand-primary)]" weight="fill" />
                <span className="text-[14px] font-medium">{pharmacy.phone}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
