"use client";

import { useState, useMemo } from "react";
import {
  Tag,
  Lightning,
  Gift,
  Truck,
  Percent,
  CreditCard,
  Clock,
  Sparkle,
} from "@phosphor-icons/react";
import { CouponCard } from "../components/CouponCard";
import { OfferProductCard } from "../components/OfferProductCard";
import { COUPON_CODES, CATEGORIES, OFFER_PRODUCTS, BANK_DEALS } from "../data/mockOffers";
import { useCoupons, useProducts } from "@/lib/hooks/useApi";

export function OffersPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: apiCoupons = [] } = useCoupons();
  const { data: apiProducts = [] } = useProducts();

  const coupons =
    apiCoupons.length > 0
      ? apiCoupons.map((coupon, index) => ({
          id: coupon.id || coupon.code || String(index),
          code: coupon.code,
          title: coupon.description || `${coupon.discount_value}${coupon.discount_type === "percentage" ? "%" : " PKR"} Off`,
          desc: coupon.description || "Valid on eligible orders",
          discount: coupon.discount_type === "percentage" ? `${coupon.discount_value}% OFF` : `PKR ${coupon.discount_value} OFF`,
          expires: coupon.expires_at
            ? new Date(coupon.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : "Limited time",
        }))
      : COUPON_CODES;

  const offerProducts =
    apiProducts.length > 0
      ? apiProducts
          .slice(0, 8)
          .map((product) => {
            const price = Number(product.price);
            if (!Number.isFinite(price) || price <= 0) return null;

            const oldPrice = Math.round(price * 1.15);
            return {
              id: product.id,
              name: product.name,
              price,
              oldPrice,
              category: product.category || "OTC",
              image: product.image,
              vendor: product.vendor,
              offerType: "percent",
              badge: "15% OFF",
            };
          })
          .filter(Boolean)
      : OFFER_PRODUCTS;

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return offerProducts;
    return offerProducts.filter((p) => p.offerType === activeCategory);
  }, [activeCategory, offerProducts]);

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-[80px] py-12 md:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-bold uppercase tracking-wide mb-5">
                <Sparkle size={14} weight="fill" />
                Limited Time Deals
              </div>
              <h1 className="text-[32px] md:text-[44px] font-[var(--font-heading)] font-bold text-white leading-tight mb-4">
                Offers &amp; Savings
              </h1>
              <p className="text-[15px] md:text-[16px] text-white/75 leading-relaxed mb-6">
                Exclusive discounts on medicines, lab tests, and doctor consultations — save more on every health order.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Percent, label: "Up to 50% off" },
                  { icon: Truck, label: "Free delivery" },
                  { icon: Gift, label: "Coupon codes" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-[13px] text-white/80 font-medium">
                    <item.icon size={18} className="text-white" weight="fill" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Flash sale card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-6 lg:min-w-[300px]">
              <div className="flex items-center gap-2 mb-3">
                <Lightning size={22} className="text-[var(--color-accent-gold)]" weight="fill" />
                <span className="text-[14px] font-bold text-white uppercase tracking-wide">Flash Sale</span>
              </div>
              <p className="text-[13px] text-white/70 mb-4">Ends tonight — extra 10% on flash items</p>
              <div className="flex gap-2">
                {[
                  { val: "08", label: "Hrs" },
                  { val: "42", label: "Min" },
                  { val: "15", label: "Sec" },
                ].map((unit) => (
                  <div key={unit.label} className="flex-1 bg-white/15 rounded-[12px] py-3 text-center">
                    <p className="text-[24px] font-bold text-white leading-none">{unit.val}</p>
                    <p className="text-[10px] text-white/60 uppercase mt-1">{unit.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px] py-8 md:py-12">
        {/* Coupon codes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[22px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)]">Coupon Codes</h2>
              <p className="text-[14px] text-[var(--color-neutral-500)] mt-1">Copy and apply at checkout</p>
            </div>
            <Tag size={28} className="text-[var(--color-brand-primary)] hidden sm:block" weight="duotone" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        </section>

        {/* Bank deals */}
        <section className="mb-12">
          <h2 className="text-[18px] font-bold text-[var(--color-ink-headline)] mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-[var(--color-brand-primary)]" />
            Bank &amp; Wallet Offers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BANK_DEALS.map((deal) => (
              <div
                key={deal.bank}
                className="flex items-center gap-4 p-5 bg-white rounded-[16px] border border-[var(--color-neutral-200)] hover:border-[var(--color-brand-primary)]/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-[12px] bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0">
                  <span className="text-[13px] font-bold text-[var(--color-brand-primary)]">{deal.bank}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-[var(--color-ink-headline)]">{deal.discount}</p>
                  <p className="text-[12px] text-[var(--color-neutral-500)]">{deal.desc}</p>
                  <p className="font-mono text-[11px] font-bold text-[var(--color-brand-primary)] mt-1">{deal.code}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category filter */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[22px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)]">Deal Products</h2>
              <p className="text-[14px] text-[var(--color-neutral-500)] mt-1">{filteredProducts.length} offers available</p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-[var(--color-status-danger)] text-white shadow-md"
                      : "bg-white border border-[var(--color-neutral-200)] text-[var(--color-neutral-600)] hover:border-[var(--color-status-danger)]/50 hover:text-[var(--color-status-danger)]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {filteredProducts.map((product) => (
                <OfferProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-12 text-center">
              <Gift size={48} className="text-[var(--color-neutral-300)] mx-auto mb-4" weight="duotone" />
              <p className="text-[16px] font-bold text-[var(--color-ink-headline)]">No offers in this category</p>
              <p className="text-[14px] text-[var(--color-neutral-500)] mt-1">Try another filter or check back soon.</p>
            </div>
          )}
        </section>

        {/* Bottom trust strip */}
        <div className="mt-12 p-6 md:p-8 bg-gradient-to-r from-[var(--color-brand-mist)] to-white rounded-[20px] border border-[var(--color-brand-light)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full icon-box-light flex items-center justify-center">
              <Clock size={24} className="text-[var(--color-brand-primary)]" weight="fill" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-[var(--color-ink-headline)]">New deals every week</p>
              <p className="text-[13px] text-[var(--color-neutral-500)]">Subscribe to notifications for the latest offers</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-[var(--color-brand-primary)] text-white text-[14px] font-semibold rounded-full hover:bg-[var(--color-brand-dark)] transition-colors shrink-0">
            Get Offer Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
