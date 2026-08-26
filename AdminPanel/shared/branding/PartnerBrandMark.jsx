"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";

/** Dark sidebars use the footer on-dark (white + mint) wordmark */
const WORDMARK = "h-7 sm:h-8 w-auto max-w-[180px] object-contain object-left";
const MARK = "h-8 w-8 sm:h-9 sm:w-9 object-contain";

export function PartnerBrandMark({
  href = "/",
  collapsed = false,
  subtitle,
  className,
  onDark = true,
}) {
  const markSrc = onDark ? "/images/medzoos-mark-on-dark.png" : "/images/medzoos-mark.png";
  const wordSrc = onDark ? "/images/medzoos-wordmark-on-dark.png" : "/images/medzoos-wordmark.png";

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 overflow-hidden min-w-0", className)}
      aria-label="Medzoos"
    >
      {collapsed ? (
        <img src={markSrc} alt="Medzoos" className={cn(MARK, "shrink-0")} />
      ) : (
        <>
          <img src={wordSrc} alt="Medzoos" className={cn(WORDMARK, "shrink-0")} />
          {subtitle ? <span className="sr-only">{subtitle}</span> : null}
        </>
      )}
    </Link>
  );
}

export function PartnerBrandLockup({
  href = "/",
  collapsed = false,
  title,
  className,
  onDark = true,
}) {
  const markSrc = onDark ? "/images/medzoos-mark-on-dark.png" : "/images/medzoos-mark.png";
  const wordSrc = onDark ? "/images/medzoos-wordmark-on-dark.png" : "/images/medzoos-wordmark.png";

  if (collapsed) {
    return (
      <Link
        href={href}
        className={cn("mx-auto", className)}
        title={title || "Medzoos"}
        aria-label={title || "Medzoos"}
      >
        <img src={markSrc} alt="Medzoos" className={MARK} />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn("flex flex-col gap-1 min-w-0 overflow-hidden", className)}
      aria-label={title || "Medzoos"}
    >
      <img src={wordSrc} alt="Medzoos" className={WORDMARK} />
      {title ? (
        <span className="text-[10px] text-white/55 tracking-[0.14em] font-semibold uppercase truncate">
          {title}
        </span>
      ) : null}
    </Link>
  );
}
