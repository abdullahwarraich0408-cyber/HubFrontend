"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";

export function BrandLogo({
  href = "/",
  onDark = false,
  className,
  imgClassName,
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]/40 focus-visible:ring-offset-2",
        className
      )}
      aria-label="Medzoos home"
    >
      <span
        className={cn(
          "inline-flex items-center",
          onDark && "rounded-xl bg-white px-2.5 py-1.5 shadow-sm"
        )}
      >
        <img
          src="/images/medzoos-wordmark.png"
          alt="Medzoos"
          className={cn("h-7 sm:h-8 md:h-9 w-auto object-contain", imgClassName)}
        />
      </span>
    </Link>
  );
}
