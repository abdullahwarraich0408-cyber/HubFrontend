"use client";

import Link from "next/link";
import { Flask, ShoppingCart } from "@phosphor-icons/react";
import { PageHero } from "@/shared/components/PageHero";

export function LabsHero({ search, onSearchChange }) {
  return (
    <PageHero
      eyebrow="Lab partners"
      eyebrowIcon={Flask}
      title="Pick a lab."
      accent="See their tests."
      description="Start with a laboratory offer — then browse every test available from that partner."
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search lab name..."
      searchAriaLabel="Search labs"
      image="/images/hero-lab-test.png"
      imageAlt="Laboratory testing and diagnostics"
      priority
      actions={
        <Link
          href="/lab-tests/cart"
          className="inline-flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-[14px] border border-white/25 bg-white/10 px-5 text-[13px] font-bold text-white transition-colors hover:bg-white/15"
        >
          <ShoppingCart size={16} weight="bold" />
          View cart
        </Link>
      }
    />
  );
}
