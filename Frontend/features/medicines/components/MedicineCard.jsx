"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Storefront } from "@phosphor-icons/react";
import { useAddToCart } from "@/lib/hooks/useApi";
import { hasAuthSession } from "@/lib/auth/tokenStore";
import { slugifyVendorName } from "@/lib/mappers/vendor";

export function MedicineCard({ medicine }) {
  const addToCart = useAddToCart();
  const [imgSrc, setImgSrc] = useState(
    medicine.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop"
  );
  const outOfStock = medicine.stock === 0;
  const price =
    typeof medicine.price === "number" && !Number.isNaN(medicine.price)
      ? medicine.price
      : null;
  const pharmacyHref = medicine.vendorSlug
    ? `/vendors/${medicine.vendorSlug}`
    : medicine.vendor
      ? `/vendors/${slugifyVendorName(medicine.vendor)}`
      : "/vendors";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) return;

    if (typeof window !== "undefined" && hasAuthSession()) {
      addToCart.mutate(
        { productId: medicine.id, quantity: 1 },
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
    const existingIdx = guestCart.findIndex((item) => item.id === medicine.id);

    if (existingIdx > -1) {
      guestCart[existingIdx].quantity += 1;
    } else {
      guestCart.push({
        id: medicine.id,
        name: medicine.name,
        vendor: medicine.vendor,
        price: medicine.price,
        quantity: 1,
        image: medicine.image,
        inStock: true,
      });
    }

    localStorage.setItem("guest_cart", JSON.stringify(guestCart));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success("Added to cart");
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[14px] border border-[#0B6E99]/10 bg-white transition-all duration-200 hover:border-[#0B6E99]/30 hover:shadow-[0_8px_24px_rgba(11,110,153,0.1)]">
      <Link href={`/product/${medicine.id}`} className="relative block aspect-square overflow-hidden bg-[#F3F8FB]">
        <Image
          src={imgSrc}
          alt={medicine.name}
          fill
          className="object-cover object-center transition-transform duration-400 group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          onError={() => setImgSrc("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop")}
        />

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <span
            className={`w-fit rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white ${
              medicine.prescriptionRequired ? "bg-[#062F3D]" : "bg-[#0B6E99]"
            }`}
          >
            {medicine.prescriptionRequired ? "Rx" : "OTC"}
          </span>
          {medicine.discount != null && medicine.discount > 0 ? (
            <span className="w-fit rounded bg-[#7DD3C7] px-1.5 py-0.5 text-[9px] font-bold text-[#062F3D]">
              -{Math.round(medicine.discount)}%
            </span>
          ) : null}
        </div>

        {outOfStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F3F8FB]/80">
            <span className="rounded bg-[#062F3D] px-2 py-1 text-[9px] font-bold uppercase text-white">
              Out of stock
            </span>
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col border-t border-[#E8F0F5] p-2.5">
        <Link href={`/product/${medicine.id}`} className="block focus-visible:outline-none">
          <h3 className="line-clamp-2 min-h-[2.25rem] text-[12px] font-bold leading-snug text-[#102A43] group-hover:text-[#0B6E99]">
            {medicine.name}
          </h3>
        </Link>

        {medicine.vendor ? (
          <Link
            href={pharmacyHref}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 flex max-w-full items-center gap-1 text-[10px] font-semibold text-[#627D98] hover:text-[#0B6E99]"
          >
            <Storefront size={10} weight="fill" className="shrink-0 text-[#0B6E99]" />
            <span className="truncate">{medicine.vendor}</span>
          </Link>
        ) : (
          <span className="mt-1 h-[15px]" />
        )}

        <div className="mt-auto flex items-center justify-between gap-1.5 pt-2">
          {price != null ? (
            <p className="truncate text-[13px] font-bold text-[#062F3D]">
              <span className="text-[10px] font-semibold text-[#627D98]">PKR </span>
              {price.toLocaleString()}
            </p>
          ) : (
            <p className="text-[11px] font-semibold text-[#627D98]">—</p>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock || addToCart.isPending}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#0B6E99] text-white transition-colors hover:bg-[#073B4C] disabled:cursor-not-allowed disabled:bg-[#9BB8C9]"
            aria-label="Add to cart"
          >
            <Plus size={14} weight="bold" />
          </button>
        </div>
      </div>
    </article>
  );
}
