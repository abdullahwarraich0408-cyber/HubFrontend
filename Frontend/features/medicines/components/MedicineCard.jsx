"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Clock, Scales, ShoppingCart, Storefront } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { useAddToCart } from "@/lib/hooks/useApi";

export function MedicineCard({ medicine }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const addToCart = useAddToCart();
  const outOfStock = medicine.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to product detail
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      addToCart.mutate(
        { productId: medicine.id, quantity: 1 },
        {
          onSuccess: () => {
            toast.success("Added to cart");
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('cart-updated'));
            }
          },
          onError: (error) => toast.error(error.message || "Could not add to cart"),
        }
      );
    } else {
      // Guest cart logic
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const existingIdx = guestCart.findIndex(item => item.id === medicine.id);
      
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
      
      localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cart-updated'));
      }
      toast.success("Added to cart");
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-[16px] border border-[var(--color-neutral-200)] overflow-hidden hover:border-[var(--color-brand-primary)]/30 hover:shadow-[0_8px_24px_-8px_rgba(11,110,114,0.12)] transition-all duration-200">
      <Link href={`/product/${medicine.id}`} className="relative aspect-[4/3] bg-[var(--color-neutral-100)] overflow-hidden block">
        <Image
          src={medicine.image}
          alt={medicine.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {medicine.prescriptionRequired && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-[var(--color-ink-900)] text-white text-[10px] font-bold uppercase rounded-md">
            Rx
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-[12px] font-bold uppercase tracking-wide">Out of Stock</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/product/${medicine.id}`}>
          <h3 className="text-[14px] font-bold text-[var(--color-ink-headline)] leading-snug line-clamp-2 mb-1 group-hover:text-[var(--color-brand-primary)] transition-colors">
            {medicine.name}
          </h3>
        </Link>

        <p className="text-[12px] text-[var(--color-neutral-500)] mb-2 line-clamp-1">
          {medicine.generic}
        </p>

        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-neutral-500)] mb-3">
          <Storefront size={13} className="text-[var(--color-brand-primary)] shrink-0" />
          <span className="truncate font-medium">{medicine.vendor}</span>
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${outOfStock ? "bg-[var(--color-status-danger)]" : "bg-[var(--color-status-success)]"}`} />
            <span className="text-[12px] font-medium text-[var(--color-neutral-600)]">
              {outOfStock ? "Out of stock" : `${medicine.stock} in stock`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-brand-primary)]">
            <Clock size={12} weight="fill" />
            {medicine.deliveryEta}
          </div>
        </div>

        <div className="text-[18px] font-bold text-[var(--color-ink-headline)] mb-3">
          PKR {medicine.price.toLocaleString()}
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Button
            variant={outOfStock ? "ghost" : "primary"}
            className="w-full h-[40px] text-[13px]"
            disabled={outOfStock || addToCart.isPending}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} weight="bold" className="mr-1.5" />
            {outOfStock ? "Notify Me" : addToCart.isPending ? "Adding..." : "Add to Cart"}
          </Button>
          <button className="w-full h-[36px] flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[var(--color-brand-primary)] border border-[var(--color-brand-light)] rounded-[var(--radius-md)] hover:bg-[var(--color-brand-mist)] transition-colors">
            <Scales size={14} weight="bold" />
            Compare Prices
          </button>
        </div>
      </div>
    </div>
  );
}
