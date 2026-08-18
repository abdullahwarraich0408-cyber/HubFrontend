"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Copy,
  Check,
  Tag,
  ShieldCheck,
  Clock,
  MapPin,
  CreditCard,
  BuildingStore,
  Flask,
  Stethoscope,
  Pill,
} from "@phosphor-icons/react";
import { cn } from "@/utils/cn";

export function OfferDetailsDrawer({ offer, onClose }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  if (!offer) return null;

  const isPromo = offer.promo_code || offer.type === "PROMO_CODE";

  const handleCopyCode = () => {
    if (offer.promo_code) {
      navigator.clipboard.writeText(offer.promo_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleUseOffer = () => {
    onClose();

    if (offer.type === "LAB_OFFER" || offer.type === "HEALTH_PACKAGE") {
      router.push("/lab-tests");
    } else if (offer.type === "CONSULTATION_OFFER" || offer.type === "DOCTOR_DISCOUNT") {
      router.push("/doctors");
    } else if (offer.type === "BANK_OFFER" || offer.type === "WALLET_OFFER") {
      router.push("/cart");
    } else {
      router.push("/browse");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 md:pl-16">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF7F5] text-[#0B6E99]">
                <Tag size={18} weight="bold" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B6E99]">
                Offer Details
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Badge */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-[#0B6E99] px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wide">
                  {offer.type?.replace("_", " ")}
                </span>
                {offer.funding_source && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    Sponsored by {offer.funding_source}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-[#102A43] leading-snug">
                {offer.title}
              </h2>
              {offer.short_description && (
                <p className="mt-2 text-sm text-[#627D98] leading-relaxed">
                  {offer.short_description}
                </p>
              )}
            </div>

            {/* Promo Code Box */}
            {isPromo && (
              <div className="rounded-2xl border-2 border-dashed border-[#0B6E99]/30 bg-[#F1F7FA] p-4 text-center">
                <p className="text-xs font-bold text-[#627D98] uppercase tracking-wider mb-2">
                  Use Promo Code At Checkout
                </p>
                <div className="flex items-center justify-between rounded-xl bg-white border border-[#0B6E99]/20 px-4 py-2.5 shadow-xs">
                  <span className="font-mono text-lg font-black tracking-widest text-[#073B4C]">
                    {offer.promo_code || "MEDZOOS"}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 rounded-lg bg-[#0B6E99] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#073B4C] transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={14} weight="bold" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Benefit Overview Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block">Discount Value</span>
                <span className="text-base font-extrabold text-[#0B6E99]">
                  {offer.discount_type === "PERCENTAGE"
                    ? `${offer.percentage_value}% OFF`
                    : offer.discount_type === "FREE_DELIVERY"
                    ? "FREE DELIVERY"
                    : `PKR ${offer.fixed_amount?.toLocaleString()} OFF`}
                </span>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block">Min. Order Spend</span>
                <span className="text-base font-extrabold text-[#102A43]">
                  {offer.minimum_order_amount > 0
                    ? `PKR ${offer.minimum_order_amount.toLocaleString()}`
                    : "No Min. Spend"}
                </span>
              </div>
            </div>

            {/* Terms & Conditions Rules */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Eligibility & Conditions
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {offer.end_at && (
                  <li className="flex items-center gap-2.5">
                    <Clock size={16} className="text-[#0B6E99] shrink-0" />
                    <span>Valid until <strong>{new Date(offer.end_at).toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" })}</strong></span>
                  </li>
                )}
                {offer.maximum_discount_amount && (
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck size={16} className="text-[#0B6E99] shrink-0" />
                    <span>Maximum discount cap: <strong>PKR {offer.maximum_discount_amount.toLocaleString()}</strong></span>
                  </li>
                )}
                {offer.payment_method_ids?.length > 0 && (
                  <li className="flex items-center gap-2.5">
                    <CreditCard size={16} className="text-[#0B6E99] shrink-0" />
                    <span>Eligible payment methods: <strong>{offer.payment_method_ids.join(", ").toUpperCase()}</strong></span>
                  </li>
                )}
                {offer.new_users_only && (
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck size={16} className="text-amber-500 shrink-0" />
                    <span>Valid for <strong>first-time Medzoos customers</strong> only.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Terms Description */}
            {offer.terms_and_conditions && (
              <div className="rounded-xl border border-slate-200/60 bg-slate-50/80 p-3 text-[11px] text-slate-500 leading-relaxed">
                <strong>Terms & Conditions:</strong> {offer.terms_and_conditions}
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="border-t border-slate-100 p-4 bg-slate-50/50">
            <button
              type="button"
              onClick={handleUseOffer}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B6E99] py-3 px-4 text-sm font-bold text-white hover:bg-[#073B4C] transition-colors shadow-md"
            >
              Use This Offer Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
