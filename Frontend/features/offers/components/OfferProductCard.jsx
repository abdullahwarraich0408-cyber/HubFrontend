"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";

export function OfferProductCard({ product }) {
  const price = Number(product.price) || 0;
  const oldPrice = Number(product.oldPrice ?? product.originalPrice) || price;
  const savings = Math.max(oldPrice - price, 0);
  const savingsPercent = oldPrice > 0 ? Math.round((savings / oldPrice) * 100) : 0;
  const isFlash = product.offerType === "flash";

  return (
    <div className="group flex flex-col bg-white rounded-[16px] border border-[var(--color-neutral-200)] overflow-hidden hover:border-[var(--color-brand-primary)]/25 hover:shadow-[0_12px_32px_-8px_rgba(220,38,38,0.12)] transition-all duration-300 h-full">
      <Link href={`/product/${product.id}`} className="relative aspect-square bg-[var(--color-neutral-50)] overflow-hidden block">
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md shadow-sm ${
            isFlash
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse"
              : "bg-[var(--color-status-danger)] text-white"
          }`}
        >
          {product.badge || "OFFER"}
        </span>
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/95 rounded-full flex items-center justify-center shadow-sm text-[var(--color-neutral-400)] hover:text-[var(--color-status-danger)] transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={16} />
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="inline-flex w-fit max-w-full truncate rounded-full bg-[#EEF5FC] px-2.5 py-1 text-[11px] font-bold text-[#0B6E99]">
          {product.vendor || product.company || product.pharmacy || "Partner pharmacy"}
        </span>
        <span className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-neutral-400)]">
          {product.category}
        </span>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-[14px] font-bold text-[var(--color-ink-headline)] leading-snug line-clamp-2 mb-2 mt-1 group-hover:text-[var(--color-brand-primary)] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[18px] font-bold text-[var(--color-status-danger)]">PKR {price.toLocaleString()}</span>
          {oldPrice > price ? (
            <span className="text-[13px] text-[var(--color-neutral-400)] line-through">PKR {oldPrice.toLocaleString()}</span>
          ) : null}
        </div>
        {savings > 0 ? (
          <p className="text-[11px] font-semibold text-[var(--color-status-success)] mb-3">
            Save PKR {savings.toLocaleString()} ({savingsPercent}%)
          </p>
        ) : (
          <p className="mb-3 text-[11px] text-[var(--color-neutral-500)]">Offer from this pharmacy</p>
        )}

        <Button variant="primary" className="w-full h-[38px] text-[12px] mt-auto">
          <ShoppingCart size={14} weight="bold" className="mr-1.5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
