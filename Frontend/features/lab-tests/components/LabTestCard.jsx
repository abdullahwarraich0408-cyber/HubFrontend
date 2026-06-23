"use client";

import Link from "next/link";
import { Flask, Clock, FileText, House, ArrowRight, ShoppingCart } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { addToLabCart } from "@/lib/labCart";
import { toast } from "sonner";

export function LabTestCard({ test, compact = false }) {
  return (
    <div className={`bg-white rounded-[16px] border border-[var(--color-neutral-200)] overflow-hidden hover:border-[var(--color-brand-primary)]/30 hover:shadow-[0_8px_24px_-8px_rgba(11,110,114,0.15)] transition-all ${compact ? "" : "h-full flex flex-col"}`}>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {test.discount && (
              <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-dark)] text-white rounded-full">
                {test.discount}
              </span>
            )}
            <Link href={`/lab-tests/${test.id}`}>
              <h3 className="text-[15px] font-bold text-[var(--color-ink-headline)] leading-snug hover:text-[var(--color-brand-primary)] transition-colors line-clamp-2">
                {test.name}
              </h3>
            </Link>
          </div>
          <div className="w-10 h-10 rounded-[10px] bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0">
            <Flask size={20} className="text-[var(--color-brand-primary)]" weight="duotone" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-neutral-500)] mb-4">
          <span className="font-semibold text-[var(--color-ink-headline)]">{test.lab}</span>
          {test.homeCollection && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[var(--color-brand-mist)] text-[var(--color-brand-primary)] text-[10px] font-bold rounded">
              <House size={10} weight="fill" />
              Home
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[10px]">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-neutral-400)] uppercase mb-0.5">
              <Clock size={11} />
              Collection
            </div>
            <p className="text-[12px] font-bold text-[var(--color-neutral-700)]">{test.collectionTime}</p>
          </div>
          <div className="p-2.5 bg-[var(--color-surface-subtle)] rounded-[10px]">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-neutral-400)] uppercase mb-0.5">
              <FileText size={11} />
              Report
            </div>
            <p className="text-[12px] font-bold text-[var(--color-neutral-700)]">{test.reportTime}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--color-neutral-100)]">
          <div>
            <p className="text-[11px] text-[var(--color-neutral-400)]">{test.testsIncluded} tests</p>
            <p className="text-[20px] font-bold text-[var(--color-ink-headline)]">PKR {test.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { addToLabCart(test); toast.success("Added to cart"); }}
              className="h-[38px] px-3 rounded-[10px] border border-neutral-200 hover:bg-brand-mist text-brand-primary"
              title="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
            <Link href={`/lab-tests/${test.id}`}>
              <Button className="h-[38px] text-[12px] px-4 bg-brand-primary hover:bg-brand-dark border-none">
                Book
                <ArrowRight size={14} className="ml-1" weight="bold" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
