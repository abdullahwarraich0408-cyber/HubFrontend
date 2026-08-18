"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Tag,
  Sparkle,
  MagnifyingGlass,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Pill,
  Flask,
  Stethoscope,
  Truck,
  Bell,
  CheckCircle,
  FileArrowUp,
} from "@phosphor-icons/react";
import { usePublicOffers } from "@/lib/hooks/useOffers";
import { OfferDetailsDrawer } from "../components/OfferDetailsDrawer";
import { OfferAlertModal } from "../components/OfferAlertModal";
import { cn } from "@/utils/cn";

const CATEGORIES = [
  { id: "all", label: "All Offers" },
  { id: "medicines", label: "Medicines", icon: Pill },
  { id: "labs", label: "Lab Tests", icon: Flask },
  { id: "consultations", label: "Consultations", icon: Stethoscope },
  { id: "bank-wallet", label: "Bank & Wallet", icon: CreditCard },
  { id: "free-delivery", label: "Free Delivery", icon: Truck },
];

export function OffersPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const { data: offers = [], isLoading, isError, refetch } = usePublicOffers({
    category: activeCategory,
    search: searchQuery,
    city: selectedCity,
  });

  // Filtered grouping logic
  const bankOffers = useMemo(() => {
    return offers.filter((o) => o.type === "BANK_OFFER" || o.type === "WALLET_OFFER" || o.payment_method_ids?.length > 0);
  }, [offers]);

  const medicineOffers = useMemo(() => {
    return offers.filter(
      (o) => o.type === "PRODUCT_DISCOUNT" || o.type === "PERCENTAGE_DISCOUNT" || o.type === "CATEGORY_DISCOUNT" || o.product
    );
  }, [offers]);

  const labOffers = useMemo(() => {
    return offers.filter((o) => o.type === "LAB_OFFER" || o.type === "HEALTH_PACKAGE");
  }, [offers]);

  const consultationOffers = useMemo(() => {
    return offers.filter((o) => o.type === "CONSULTATION_OFFER" || o.type === "DOCTOR_DISCOUNT");
  }, [offers]);

  const endingSoonOffers = useMemo(() => {
    const now = new Date().getTime();
    return offers.filter((o) => {
      if (!o.end_at) return false;
      const diffHours = (new Date(o.end_at).getTime() - now) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 72;
    });
  }, [offers]);

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pb-16">
      {/* 1. Page Hero Banner matching MedZoos standard container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <section className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[32px] bg-[#0B6E99] text-white p-6 sm:p-8 md:p-10 shadow-sm">
          {/* Subtle background glow blobs */}
          <div className="pointer-events-none absolute -left-16 top-8 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/15 blur-3xl" aria-hidden />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#7DD3C7] backdrop-blur-sm mb-3">
              <Sparkle size={13} weight="fill" />
              Medzoos Offers
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-[1.15] tracking-tight text-white">
              Save on the healthcare services you use
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
              Explore current offers from participating pharmacies, laboratories, healthcare professionals and payment partners.
            </p>
          </div>
        </section>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* 2. Category Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide rounded-2xl bg-white p-2 shadow-md border border-slate-100">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-[#0B6E99] text-white shadow-xs"
                    : "text-[#334E68] hover:bg-slate-50 hover:text-[#0B6E99]"
                )}
              >
                {Icon && <Icon size={16} weight={isActive ? "fill" : "regular"} />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Toolbar: Search & City Filter */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search offers by title, code or provider..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-[#0B6E99] focus:ring-2 focus:ring-[#0B6E99]/15 shadow-2xs"
            />
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#102A43] outline-none focus:border-[#0B6E99] shadow-2xs cursor-pointer"
            >
              <option value="">All Cities</option>
              <option value="Karachi">Karachi</option>
              <option value="Lahore">Lahore</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
            </select>

            <button
              type="button"
              onClick={() => setShowAlertModal(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[#0B6E99]/30 bg-[#EAF7F5] px-3 py-2.5 text-xs font-extrabold text-[#0B6E99] hover:bg-[#0B6E99] hover:text-white transition-colors"
            >
              <Bell size={16} weight="bold" />
              <span>Get Alerts</span>
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="mt-8 space-y-4">
            <div className="h-44 w-full animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-44 w-full animate-pulse rounded-2xl bg-slate-200" />
          </div>
        ) : isError ? (
          <div className="mt-8 rounded-2xl bg-white p-6 text-center border border-slate-200 shadow-2xs max-w-md mx-auto">
            <p className="text-sm font-bold text-[#102A43]">We couldn't load offers right now.</p>
            <p className="text-xs text-slate-500 mt-1">Please check your connection and try again.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-xl bg-[#0B6E99] px-4 py-2 text-xs font-bold text-white hover:bg-[#073B4C] transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/browse"
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-[#102A43] hover:bg-slate-50 transition-colors"
              >
                Browse Medicines
              </Link>
            </div>
          </div>
        ) : offers.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-8 text-center border border-slate-200 shadow-2xs max-w-lg mx-auto">
            <h3 className="text-base font-bold text-[#102A43]">No active offers right now</h3>
            <p className="text-xs text-slate-500 mt-1">
              New healthcare offers will appear here when they become available.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Link
                href="/browse"
                className="rounded-xl bg-[#0B6E99] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#073B4C] transition-colors"
              >
                Browse Medicines
              </Link>
              <Link
                href="/lab-tests"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#102A43] hover:bg-slate-50 transition-colors"
              >
                Explore Lab Tests
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {/* 4. Featured Offers Promotional Rail */}
            {offers.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-[#102A43] flex items-center gap-2">
                    <Sparkle size={18} className="text-[#0B6E99]" weight="fill" />
                    Featured Promotions
                  </h2>
                </div>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
                  {offers.slice(0, 4).map((offer) => (
                    <div
                      key={offer.id}
                      onClick={() => setSelectedOffer(offer)}
                      className="group flex min-w-[280px] sm:min-w-[340px] max-w-[380px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[#0B6E99]/40 hover:shadow-md cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="rounded-full bg-[#EAF7F5] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0B6E99]">
                            {offer.type?.replace("_", " ")}
                          </span>
                          {offer.end_at && (
                            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                              <Clock size={13} />
                              Ends {new Date(offer.end_at).toLocaleDateString("en-PK", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-[#102A43] group-hover:text-[#0B6E99] transition-colors line-clamp-2">
                          {offer.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-[#627D98] line-clamp-2">
                          {offer.short_description || offer.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-[#073B4C]">
                          {offer.discount_type === "PERCENTAGE"
                            ? `${offer.percentage_value}% OFF`
                            : offer.discount_type === "FREE_DELIVERY"
                            ? "FREE DELIVERY"
                            : `PKR ${offer.fixed_amount} OFF`}
                        </span>
                        <span className="font-bold text-[#0B6E99] group-hover:underline flex items-center gap-1">
                          View Offer
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Bank & Wallet Offers Section */}
            {(activeCategory === "all" || activeCategory === "bank-wallet") && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-[#102A43] flex items-center gap-2">
                    <CreditCard size={20} className="text-[#0B6E99]" />
                    Bank & Wallet Offers
                  </h2>
                </div>

                {bankOffers.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <p className="text-sm font-bold text-[#102A43]">No payment offers right now</p>
                    <p className="text-xs text-slate-500 mt-1">New bank and wallet promotions will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {bankOffers.map((offer) => (
                      <div
                        key={offer.id}
                        onClick={() => setSelectedOffer(offer)}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-[#0B6E99]/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1F7FA] font-black text-[#0B6E99] text-xs uppercase">
                            {offer.partner_logo || "BANK"}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-[#102A43]">{offer.title}</h4>
                            <p className="text-xs text-slate-500">
                              {offer.minimum_order_amount > 0 ? `Min spend PKR ${offer.minimum_order_amount.toLocaleString()}` : "No min spend"}
                              {offer.maximum_discount_amount ? ` • Max saving PKR ${offer.maximum_discount_amount.toLocaleString()}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                          <span className="text-xs font-bold text-[#0B6E99] bg-[#EAF7F5] px-3 py-1 rounded-full">
                            {offer.discount_type === "PERCENTAGE" ? `${offer.percentage_value}% OFF` : `PKR ${offer.fixed_amount} OFF`}
                          </span>
                          <button
                            type="button"
                            className="text-xs font-bold text-[#0B6E99] hover:underline flex items-center gap-1"
                          >
                            View Details
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 6. Medicine & Pharmacy Offers Section */}
            {(activeCategory === "all" || activeCategory === "medicines") && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-[#102A43] flex items-center gap-2">
                    <Pill size={20} className="text-[#0B6E99]" />
                    Medicine & Pharmacy Offers
                  </h2>
                  <Link href="/browse" className="text-xs font-bold text-[#0B6E99] hover:underline">
                    Browse All Medicines
                  </Link>
                </div>

                {medicineOffers.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <p className="text-sm font-bold text-[#102A43]">No medicine offers in this category</p>
                    <p className="text-xs text-slate-500 mt-1">Try another category or browse medicine catalog.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {medicineOffers.map((offer) => (
                      <div
                        key={offer.id}
                        onClick={() => setSelectedOffer(offer)}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">
                              Active Deal
                            </span>
                            <span className="text-[11px] font-semibold text-rose-500">
                              Prescription Required
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#102A43] line-clamp-1">{offer.title}</h4>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{offer.short_description || offer.description}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-400 font-semibold block">Eligible Discount</span>
                            <span className="text-sm font-extrabold text-[#0B6E99]">
                              {offer.discount_type === "PERCENTAGE" ? `${offer.percentage_value}% OFF` : `PKR ${offer.fixed_amount} OFF`}
                            </span>
                          </div>
                          <button type="button" className="rounded-lg bg-[#0B6E99] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#073B4C]">
                            Use Offer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 7. Lab Test Offers Section */}
            {(activeCategory === "all" || activeCategory === "labs") && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-[#102A43] flex items-center gap-2">
                    <Flask size={20} className="text-[#0B6E99]" />
                    Lab Test Offers
                  </h2>
                </div>

                {labOffers.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <p className="text-sm font-bold text-[#102A43]">No lab offers right now</p>
                    <p className="text-xs text-slate-500 mt-1">Check back soon for laboratory deals.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {labOffers.map((offer) => (
                      <div
                        key={offer.id}
                        onClick={() => setSelectedOffer(offer)}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-[#0B6E99]/40 transition-all cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="rounded-full bg-[#EAF7F5] px-2 py-0.5 text-[10px] font-bold text-[#0B6E99]">
                              Home Sampling Included
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#102A43]">{offer.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{offer.short_description}</p>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                          <span className="text-sm font-extrabold text-[#0B6E99]">
                            {offer.percentage_value ? `${offer.percentage_value}% OFF` : `PKR ${offer.fixed_amount} OFF`}
                          </span>
                          <button
                            type="button"
                            className="rounded-xl bg-[#0B6E99] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#073B4C]"
                          >
                            View Offer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 8. Doctor Consultation Offers Section */}
            {(activeCategory === "all" || activeCategory === "consultations") && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-[#102A43] flex items-center gap-2">
                    <Stethoscope size={20} className="text-[#0B6E99]" />
                    Doctor Consultation Offers
                  </h2>
                </div>

                {consultationOffers.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <p className="text-sm font-bold text-[#102A43]">No doctor consultation offers right now</p>
                    <p className="text-xs text-slate-500 mt-1">Check back later for telehealth promotions.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {consultationOffers.map((offer) => (
                      <div
                        key={offer.id}
                        onClick={() => setSelectedOffer(offer)}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <span className="rounded-full bg-sky-50 text-sky-700 px-2 py-0.5 text-[10px] font-bold">
                            Online Video Consult
                          </span>
                          <h4 className="text-sm font-bold text-[#102A43] mt-1">{offer.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{offer.short_description}</p>
                        </div>
                        <button
                          type="button"
                          className="shrink-0 rounded-xl bg-[#0B6E99] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#073B4C]"
                        >
                          View Offer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>

      {/* Slide-over Offer Details Drawer */}
      {selectedOffer && (
        <OfferDetailsDrawer
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}

      {/* Offer Alerts Preference Modal */}
      {showAlertModal && (
        <OfferAlertModal onClose={() => setShowAlertModal(false)} />
      )}
    </div>
  );
}
