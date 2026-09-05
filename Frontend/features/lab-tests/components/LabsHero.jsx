"use client";

import Link from "next/link";
import { Flask } from "@phosphor-icons/react";
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
    />
  );
}
