"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

export function PlaceholderPage({ title, description }) {
  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12 px-4 bg-[var(--color-surface-subtle)]">
      <div className="text-center max-w-md">
        <div className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] border border-[var(--color-neutral-200)] p-8">
          <h1 className="text-[24px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] mb-3">
            {title || "Coming Soon"}
          </h1>
          <p className="text-[14px] text-[var(--color-neutral-600)] mb-6">
            {description || "This page is under construction. Check back soon!"}
          </p>
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-brand-primary)] text-white rounded-[var(--radius-md)] font-semibold hover:bg-[var(--color-brand-dark)] transition-colors">
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
