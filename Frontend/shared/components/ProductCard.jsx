"use client";

import Image from "next/image";
import { Heart, Star } from "@phosphor-icons/react";
import { Button } from "./Button";

export function ProductCard({
  imageSrc = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=60&w=500",
  category = "Medicine",
  vendorName = "MEDCO PHARMA",
  productName = "Paracetamol 500mg Tablets",
  formula = "Paracetamol",
  price = "1,850",
  stock = 48,
  outOfStock = false,
}) {
  return (
    <div className="group flex flex-col w-full bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-200 overflow-hidden border border-[var(--color-neutral-200)]">
      
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] sm:aspect-square bg-[var(--color-neutral-100)] overflow-hidden">
        <Image
          src={imageSrc}
          alt={productName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 bg-white/95 text-[var(--color-neutral-600)] text-[11px] font-semibold rounded-[var(--radius-sm)] shadow-[var(--shadow-card)] border border-[var(--color-neutral-200)]">
            {category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-9 h-9 bg-white/95 rounded-[var(--radius-sm)] flex items-center justify-center shadow-[var(--shadow-card)] text-[var(--color-neutral-500)] hover:text-[var(--color-status-danger)] hover:bg-[var(--color-status-danger-bg)] transition-all">
          <Heart size={18} weight="regular" />
        </button>

        {/* Out of Stock Overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold text-[13px] px-4 py-2 bg-black/40 rounded-[var(--radius-sm)] uppercase tracking-wider">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <span className="text-[9px] sm:text-[11px] uppercase text-[var(--color-neutral-500)] tracking-wider font-semibold mb-1 sm:mb-1.5 line-clamp-1">
          {vendorName}
        </span>
        
        <h3 className="text-[12px] sm:text-[14px] font-semibold text-[var(--color-neutral-900)] line-clamp-2 leading-snug mb-1 sm:mb-1.5 min-h-[34px] sm:min-h-[42px]">
          {productName}
        </h3>
        
        <p className="hidden sm:block text-[12px] text-[var(--color-neutral-500)] mb-3 line-clamp-1">
          {formula}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-3">
          {[1,2,3,4,5].map(star => (
            <Star key={star} size={10} className="text-[var(--color-rating)] sm:w-3 sm:h-3" weight="fill" />
          ))}
          <span className="text-[10px] sm:text-[12px] text-[var(--color-neutral-500)] ml-1">(128)</span>
        </div>
        
        <div className="flex items-center gap-1.5 mb-2 sm:mb-4 line-clamp-1">
          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${outOfStock ? 'bg-[var(--color-status-danger)]' : 'bg-[var(--color-status-success)]'}`}></span>
          <span className="text-[10px] sm:text-[12px] text-[var(--color-neutral-600)] font-medium truncate">
            {outOfStock ? 'Out of Stock' : `In Stock · ${stock} units`}
          </span>
        </div>
        
        <div className="mt-auto flex flex-col">
          <div className="text-[14px] sm:text-[20px] font-bold text-[var(--color-neutral-900)] mb-2 sm:mb-4">
            PKR {price}
          </div>
          
          {/* Add to Cart Button */}
          <Button 
            variant={outOfStock ? "ghost" : "primary"} 
            className="w-full h-[32px] sm:h-[42px] text-[11px] sm:text-[14px] font-semibold px-2" 
            disabled={outOfStock}
          >
            {outOfStock ? "Notify Me" : "Add to Cart"}
          </Button>
        </div>
      </div>
      
    </div>
  );
}
