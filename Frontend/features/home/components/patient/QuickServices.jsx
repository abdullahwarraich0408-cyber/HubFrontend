"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { cn } from "@/utils/cn";

const CARDS = [
  {
    title: "Medicine",
    description: "Search and order medicines from partner pharmacies.",
    href: "/browse",
    actionLabel: "Browse medicines",
    image: "/images/card-diabetes-care.png",
    alt: "Medicines and healthcare products available through Medzoos",
    objectPosition: "object-[center_30%]",
  },
  {
    title: "Psychologists",
    description: "Mental health professionals for online or clinic sessions.",
    href: "/doctors?specialty=psychologist",
    actionLabel: "Find a Psychologist",
    image: "/images/card-psychologists.png",
    alt: "Psychologist consultation for mental health support",
    objectPosition: "object-[center_20%]",
  },
  {
    title: "Lab Tests",
    description: "Diagnostic tests with home sampling where available.",
    href: "/lab-tests",
    actionLabel: "Book a Test",
    image: "/images/card-lab-tests.png",
    alt: "Laboratory professional preparing a diagnostic test",
    objectPosition: "object-center",
  },
  {
    title: "Pharmacies",
    description: "Find medicines and pharmacies through Medzoos.",
    href: "/vendors",
    actionLabel: "Find Medicines",
    image: "/images/card-pharmacies.png",
    alt: "Pharmacist with medicines in a modern pharmacy",
    objectPosition: "object-[center_25%]",
  },
];

function CardImage({ src, alt, objectPosition }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#EAF7F5] to-[#DEEEF9]"
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
      className={cn(
        "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
        objectPosition || "object-center"
      )}
      onError={() => setFailed(true)}
    />
  );
}

export function ServiceCard({
  title,
  description,
  href,
  actionLabel,
  image,
  alt,
  objectPosition,
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#102A43]/08 bg-white shadow-[0_4px_16px_rgba(16,42,67,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#0B6E99]/25 hover:shadow-[0_12px_28px_rgba(16,42,67,0.1)]"
    >
      {/* Identical image frame on every card */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#E8EEF2]">
        <CardImage src={image} alt={alt} objectPosition={objectPosition} />
      </div>

      <div className="flex min-h-[148px] flex-1 flex-col px-4 pb-4 pt-3.5 md:min-h-[156px] md:px-5 md:pb-5 md:pt-4">
        <h3 className="text-center text-[16px] font-bold leading-snug tracking-tight text-[#102A43] md:text-[17px]">
          {title}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-center text-[13px] leading-relaxed text-[#627D98]">
          {description}
        </p>
        <span className="mt-3 inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#0B6E99]">
          {actionLabel}
          <ArrowRight
            size={14}
            weight="bold"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

export function QuickServices() {
  return (
    <section aria-labelledby="quick-services-heading">
      <div className="mb-5">
        <h2
          id="quick-services-heading"
          className="text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold text-[#102A43]"
        >
          What do you need today?
        </h2>
        <p className="mt-1 text-[14px] text-[#627D98]">
          Choose a healthcare service to get started.
        </p>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {CARDS.map((card) => (
          <ServiceCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
