"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";

/** Exact navbar logo sizing */
const WORDMARK = "h-9 sm:h-10 md:h-11 w-auto";
const MARK = "h-10 w-10 sm:h-11 sm:w-11";

/**
 * Medzoos brand logo
 * - default / navbar: blue-teal wordmark (white backgrounds)
 * - onDark / footer: white + subtle mint wordmark (dark teal backgrounds)
 */
export function BrandLogo({
  href = "/",
  onDark = false,
  className,
  imgClassName,
  mark = false,
}) {
  const src = mark
    ? onDark
      ? "/images/medzoos-mark-on-dark.png"
      : "/images/medzoos-mark.png"
    : onDark
      ? "/images/medzoos-wordmark-on-dark.png"
      : "/images/medzoos-wordmark.png";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17618E]/40 focus-visible:ring-offset-2 rounded-lg",
        className
      )}
      aria-label="Medzoos home"
    >
      <img
        src={src}
        alt="Medzoos"
        className={cn(
          "object-contain object-center",
          mark ? MARK : WORDMARK,
          imgClassName
        )}
      />
    </Link>
  );
}
