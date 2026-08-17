"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";

export function AuthBrandMark({ href = "/", light = false, className }) {
  return (
    <Link href={href} className={cn("inline-flex items-center", className)} aria-label="Medzoos home">
      <span
        className={cn(
          "inline-flex items-center rounded-xl",
          light && "bg-white px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        )}
      >
        <img
          src="/images/medzoos-wordmark.png"
          alt="Medzoos"
          className="h-8 w-auto sm:h-9"
        />
      </span>
    </Link>
  );
}

export function AuthPageHeader({ kicker, title, description, className }) {
  return (
    <header className={cn("mb-5", className)}>
      {kicker ? (
        <p className="mb-1.5 text-[13px] font-semibold text-[#087F8C]">{kicker}</p>
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
      className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[#5B6B7A] transition-colors hover:text-[#087F8C]"
    >
      {children}
    </Link>
  );
}
