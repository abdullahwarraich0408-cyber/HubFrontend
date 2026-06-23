"use client";

import { useState } from "react";
import { Tag, Copy, Check } from "@phosphor-icons/react";

export function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-white rounded-[18px] border border-[var(--color-neutral-200)] overflow-hidden hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] transition-all group">
      <div className={`h-1.5 bg-gradient-to-r ${coupon.color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-[12px] icon-box-light flex items-center justify-center shrink-0">
            <Tag size={20} className="text-[var(--color-brand-primary)]" weight="fill" />
          </div>
          <span className="text-[10px] font-semibold text-[var(--color-neutral-400)] uppercase tracking-wide">
            Min {coupon.minOrder}
          </span>
        </div>
        <h3 className="text-[16px] font-bold text-[var(--color-ink-headline)] mb-1">{coupon.title}</h3>
        <p className="text-[13px] text-[var(--color-neutral-500)] mb-4">{coupon.desc}</p>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-dashed border-[var(--color-neutral-200)]">
          <div className="px-3 py-2 bg-[var(--color-surface-subtle)] border border-dashed border-[var(--color-neutral-300)] rounded-[10px]">
            <span className="font-mono text-[14px] font-bold text-[var(--color-ink-headline)] tracking-wider">{coupon.code}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-mist)] rounded-[10px] transition-colors"
          >
            {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-[11px] text-[var(--color-neutral-400)] mt-3">Expires {coupon.expires}</p>
      </div>
    </div>
  );
}
