"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAddToCart } from "@/lib/hooks/useApi";

export function StoreProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!product.inStock) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      addToCart.mutate(
        { productId: product.id, quantity: qty },
        {
          onSuccess: () => {
            toast.success("Added to cart");
            window.dispatchEvent(new Event("cart-updated"));
          },
          onError: (error) => toast.error(error.message || "Could not add to cart"),
        }
      );
      return;
    }

    const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
    const existingIdx = guestCart.findIndex((item) => item.id === product.id);

    if (existingIdx > -1) {
      guestCart[existingIdx].quantity += qty;
    } else {
      guestCart.push({
        id: product.id,
        name: product.name,
        vendor: product.vendor || "Pharmacy",
        price: product.price,
        quantity: qty,
        image: product.image,
        inStock: product.inStock,
      });
    }

    localStorage.setItem("guest_cart", JSON.stringify(guestCart));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success("Added to cart");
  };

  return (
    <div className="flex flex-col bg-white rounded-[12px] border border-[var(--color-neutral-200)] overflow-hidden hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-brand-primary)]/20 transition-all group h-full">
      <Link href={`/product/${product.id}`} className="relative block p-3 pb-0">
        <div className="relative aspect-[4/3] rounded-[10px] bg-[#F7F9FA] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="220px"
          />
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--color-brand-primary)] text-white text-[10px] font-bold rounded-[4px]">
              {product.discount}% OFF
            </span>
          )}
          <button
            type="button"
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-[var(--color-neutral-200)] flex items-center justify-center text-[var(--color-neutral-400)] hover:text-[var(--color-status-danger)] transition-colors shadow-sm"
            onClick={(e) => e.preventDefault()}
            aria-label="Save to wishlist"
          >
            <Heart size={14} />
          </button>
        </div>
      </Link>

      <div className="p-3 pt-2 flex flex-col flex-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-[13px] font-bold text-[var(--color-ink-headline)] leading-snug line-clamp-2 min-h-[34px] group-hover:text-[var(--color-brand-primary)] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] text-[var(--color-neutral-500)] mt-1 mb-1.5">{product.pack}</p>

        <p className="text-[14px] font-bold text-[var(--color-ink-headline)] mb-2">
          PKR {product.price.toLocaleString()}
        </p>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-center border border-[var(--color-neutral-200)] rounded-[8px] overflow-hidden h-[28px] bg-white">
            <button
              type="button"
              className="w-8 h-full flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-50)]"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={12} weight="bold" />
            </button>
            <span className="flex-1 text-center text-[13px] font-semibold text-[var(--color-ink-headline)]">{qty}</span>
            <button
              type="button"
              className="w-8 h-full flex items-center justify-center text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-50)]"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={12} weight="bold" />
            </button>
          </div>
          <button
            type="button"
            disabled={!product.inStock || addToCart.isPending}
            onClick={handleAddToCart}
            className="w-full h-[30px] rounded-[8px] bg-[var(--color-brand-primary)] text-white text-[12px] font-bold hover:bg-[var(--color-brand-dark)] transition-colors disabled:opacity-50"
          >
            {!product.inStock ? "Out of Stock" : addToCart.isPending ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
