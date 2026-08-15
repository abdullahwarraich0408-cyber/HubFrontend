"use client";

import { Flask } from "@phosphor-icons/react";
import { PageHero } from "@/shared/components/PageHero";

export function LabTestsHero({ search, onSearchChange }) {
  return (
    <PageHero
      eyebrow="Lab tests"
      eyebrowIcon={Flask}
      title="Need a lab test?"
      accent="Book with ease."
      description="Search across all diagnostic tests — or go back to lab offers and pick a partner first. Home sampling where available."
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search HbA1c, CBC, thyroid, blood sugar..."
      searchAriaLabel="Search lab tests"
      image="/images/laboratory-testing.png"
      imageAlt="Diagnostic laboratory testing"
      priority
    />
  );
}
