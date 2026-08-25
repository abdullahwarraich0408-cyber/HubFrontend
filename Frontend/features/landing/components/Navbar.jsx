"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/shared/branding/BrandLogo";
import { cn } from "@/utils/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-[#102A43]/08 bg-white/85 shadow-[0_1px_0_rgba(16,42,67,0.06)] backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="landing-container flex h-[68px] items-center justify-between gap-4 md:h-[76px]">
        <BrandLogo href="#top" />

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-[14px] font-semibold text-[#102A43] transition-colors hover:bg-[#EAF8F7] hover:text-[#17618E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17618E]/40"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#17618E] px-4 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#124362] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17618E]/40 focus-visible:ring-offset-2 sm:h-11 sm:px-5"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

