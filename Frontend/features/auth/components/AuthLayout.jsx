"use client";

import Link from "next/link";
import { FirstAidKit } from "@phosphor-icons/react";
import { AuthVisualPanel } from "./AuthVisualPanel";
import { AuthFooter } from "./AuthFooter";

export function AuthLayout({ children, variant = "default", compact = false }) {
  return (
    <div className="flex min-h-dvh bg-[#F8FBFC]">
      <AuthVisualPanel variant={variant} />

      <section className="flex min-h-dvh w-full flex-col bg-white lg:w-[55%] xl:w-[52%]">
        <div className="px-5 pt-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF7F5] text-[#17618E]">
              <FirstAidKit size={20} weight="fill" />
            </span>
            <span className="font-[var(--font-heading)] text-[24px] text-[#102A43]">Medzoos</span>
          </Link>
          {!compact ? (
          <div className="mt-5 overflow-hidden rounded-[20px] max-[380px]:hidden">
            <picture>
              <source srcSet="/images/auth-medzoos-healthcare.webp" type="image/webp" />
              <img
                src="/images/auth-medzoos-healthcare.png"
                alt=""
                className="h-[140px] w-full object-cover object-center"
              />
            </picture>
          </div>
          ) : null}
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[440px] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
            <div className="mb-8 hidden items-center gap-2.5 lg:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF7F5] text-[#17618E]">
                <FirstAidKit size={20} weight="fill" />
              </span>
              <span className="font-[var(--font-heading)] text-[24px] text-[#102A43]">Medzoos</span>
            </div>
            {children}
          </div>
        </div>

        <AuthFooter />
      </section>

      <div
        id="recaptcha-container"
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        aria-hidden="true"
      />
    </div>
  );
}
