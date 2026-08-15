"use client";

import { Stethoscope } from "@phosphor-icons/react";
import { PageHero } from "@/shared/components/PageHero";

export function DoctorsHero({ search, onSearchChange }) {
  return (
    <PageHero
      eyebrow="Doctors"
      eyebrowIcon={Stethoscope}
      title="Find your doctor."
      accent="Book on your time."
      description="Diabetes specialists, psychologists and more — online or in clinic."
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search name, specialty, hospital..."
      searchAriaLabel="Search doctors"
      image="/images/hero-consult-doctor.png"
      imageAlt="Doctor consultation available through Medzoos"
      priority
    />
  );
}
