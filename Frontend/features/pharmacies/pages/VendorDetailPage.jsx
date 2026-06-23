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
  SealCheck,
  Lock,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { useVendorBySlug, useVendorProducts } from "@/lib/hooks/useApi";
import { MOCK_VENDOR_REVIEWS } from "../data/mockPharmacies";
import { STORE_CATEGORIES, filterStoreProducts } from "../data/mockStoreProducts";
import { StoreProductCard } from "../components/StoreProductCard";

const WHY_CHOOSE = [
  "100% Genuine Medicines",
  "Licensed Pharmacist on Duty",
  "Secure & Hygienic Packaging",
  "Same-day Delivery Available",
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
      <div className="w-full bg-[#F5F6F8] min-h-screen py-8 md:py-10">
        <div className="w-full store-container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-48 bg-[var(--color-neutral-200)] rounded" />
            <div className="h-48 bg-white rounded-[14px] border border-[var(--color-neutral-200)]" />
            <div className="h-12 bg-white rounded-[14px] border border-[var(--color-neutral-200)]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-white rounded-[12px] border border-[var(--color-neutral-200)]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (vendorError || !pharmacy) {
    return (
      <div className="w-full bg-[#F5F6F8] min-h-screen py-16">
        <div className="w-full store-container mx-auto px-4 text-center">
          <h1 className="text-[22px] font-bold text-[var(--color-ink-headline)] mb-2">Pharmacy not found</h1>
          <p className="text-[14px] text-[var(--color-neutral-500)] mb-6">
            This pharmacy may no longer be available or the link is incorrect.
          </p>
          <Link href="/pharmacies">
            <Button variant="primary">Browse Pharmacies</Button>
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
    { id: "reviews", label: `Reviews (${pharmacy.reviews})` },
    { id: "about", label: "About" },
  ];

  return (
    <div className="w-full bg-[#F5F6F8] min-h-screen py-8 md:py-10">
      <div className="w-full store-container mx-auto">
        <nav className="flex items-center gap-1.5 text-[13px] text-[var(--color-neutral-500)] mb-5">
          <Link href="/pharmacies" className="hover:text-[var(--color-brand-primary)]">Pharmacies</Link>
          <CaretRight size={12} />
          <span className="font-semibold text-[var(--color-ink-headline)]">{pharmacy.name}</span>
        </nav>

        {/* Store profile header */}
        <div className="relative bg-white rounded-[14px] border border-[var(--color-neutral-200)] shadow-[var(--shadow-card)] p-6 md:p-7 mb-0">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button type="button" className="h-[34px] px-3 rounded-[8px] border border-[var(--color-neutral-200)] bg-white text-[12px] font-semibold text-[var(--color-neutral-600)] hover:border-[var(--color-brand-primary)]/30 flex items-center gap-1.5">
              <ShareNetwork size={15} />
              Share
            </button>
            <button
              type="button"
              onClick={() => setSaved((s) => !s)}
              className={`h-[34px] px-3 rounded-[8px] border text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${
                saved
                  ? "border-[var(--color-status-danger)]/30 bg-red-50 text-[var(--color-status-danger)]"
                  : "border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-600)] hover:border-[var(--color-brand-primary)]/30"
              }`}
            >
              <Heart size={15} weight={saved ? "fill" : "regular"} />
              Save
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 pr-0 lg:pr-[180px]">
            <div className="relative w-full lg:w-[200px] h-[140px] lg:h-[120px] shrink-0 rounded-[12px] overflow-hidden">
              <Image src={pharmacy.bgImage} alt={pharmacy.name} fill className="object-cover" sizes="200px" priority />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h1 className="text-[22px] md:text-[26px] font-bold text-[var(--color-ink-headline)]">{pharmacy.name}</h1>
                {pharmacy.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[var(--color-brand-mist)] text-[11px] font-bold text-[var(--color-brand-primary)]">
                    <ShieldCheck size={12} weight="fill" />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-[13px] text-[var(--color-neutral-600)] mb-4">
                <span className="inline-flex items-center gap-1">
                  <Star size={14} weight="fill" className="text-[var(--color-rating)]" />
                  <strong className="text-[var(--color-ink-headline)]">{pharmacy.rating}</strong>
                  <span className="text-[var(--color-neutral-500)]">({pharmacy.reviews})</span>
                </span>
                <span className="text-[var(--color-neutral-400)]">|</span>
                <span><strong className="text-[var(--color-ink-headline)]">{pharmacy.orders ?? 2300}+</strong> Orders</span>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 text-[12px] text-[var(--color-neutral-600)]">
                <span className="inline-flex items-center gap-1"><SealCheck size={15} className="text-[var(--color-brand-primary)]" weight="fill" /> Licensed Pharmacy</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck size={15} className="text-[var(--color-brand-primary)]" weight="fill" /> 100% Authentic</span>
                <span className="inline-flex items-center gap-1"><Lock size={15} className="text-[var(--color-brand-primary)]" weight="fill" /> Secure Packaging</span>
              </div>

              <p className="flex items-start gap-1.5 text-[13px] text-[var(--color-neutral-500)]">
                <MapPin size={15} className="text-[var(--color-brand-primary)] shrink-0 mt-0.5" weight="fill" />
                {pharmacy.address}
              </p>
            </div>

            <div className="lg:w-[200px] shrink-0 lg:border-l lg:border-[var(--color-neutral-200)] lg:pl-8">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-[var(--color-status-success)]" : "bg-[var(--color-neutral-400)]"}`} />
                <p className={`text-[14px] font-bold ${isOpen ? "text-[var(--color-status-success)]" : "text-[var(--color-neutral-500)]"}`}>
                  {isOpen ? "Open Now" : "Closed"}
                </p>
              </div>
              {isOpen && <p className="text-[12px] text-[var(--color-neutral-500)] mb-3">Closes at 11:00 PM</p>}
              <div className="space-y-2 text-[13px] text-[var(--color-neutral-600)]">
                <p className="flex items-center gap-1.5">
                  <Clock size={15} className="text-[var(--color-brand-primary)]" weight="fill" />
                  Delivery in {pharmacy.deliveryTime}
                </p>
                <p>
                  <span className="text-[var(--color-neutral-500)]">Minimum Order </span>
                  <strong className="text-[var(--color-ink-headline)]">PKR {(pharmacy.minOrder ?? 500).toLocaleString()}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="bg-white border-x border-b border-[var(--color-neutral-200)] rounded-b-[14px] shadow-[var(--shadow-card)] mb-7 px-6 md:px-7">
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-[14px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                    : "border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-ink-headline)]"
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
