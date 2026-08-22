"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";

const WORDMARK = "h-9 sm:h-10 md:h-11 w-auto object-contain";

export function AuthBrandMark({ href = "/", light = false, className }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center", className)}
      aria-label="Medzoos home"
    >
      <img
        src={light ? "/images/medzoos-wordmark-on-dark.png" : "/images/medzoos-wordmark.png"}
        alt="Medzoos"
        className={WORDMARK}
      />
    </Link>
  );
}

export function AuthPageHeader({ kicker, title, description, className }) {
  return (
    <header className={cn("mb-5", className)}>
      {kicker ? (
        <p className="mb-1.5 text-[13px] font-semibold text-[#17618E]">{kicker}</p>
      ) : null}
      <h1 className="text-[24px] font-bold leading-[1.2] tracking-tight text-[#1A2B2A] sm:text-[28px]">
        {title}
      </h1>
      {description ? (
        <p className="mt-1.5 max-w-[42ch] text-[13px] leading-relaxed text-[#6B7C7B] sm:text-[14px]">
          {description}
        </p>
      ) : null}
    </header>
  );
}

export function AuthDivider({ label = "or continue with" }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <span className="h-px flex-1 bg-[#D9E5EC]" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8AA0B2]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#D9E5EC]" />
    </div>
  );
}

export function AuthBackLink({ href = "/login", children = "Back to Sign In" }) {
  return (
    <Link
      href={href}
      className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[#5B6B7A] transition-colors hover:text-[#17618E]"
    >
      {children}
    </Link>
  );
}
