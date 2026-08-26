"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/shared/branding/BrandLogo";
import { cn } from "@/utils/cn";

export function Navbar() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const heroSection = document.querySelector("section");
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setPastHero(heroBottom <= 72);
      } else {
        setPastHero(window.scrollY > 300);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-200",
        pastHero
          ? "border-b border-[#102A43]/08 bg-white/95 shadow-[0_4px_20px_rgba(16,42,67,0.06)] backdrop-blur-xl"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="landing-container flex h-[68px] items-center justify-between gap-4 md:h-[76px]">
        <BrandLogo href="#top" onDark={!pastHero} />

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className={cn(
              "inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2",
              pastHero
                ? "text-[#102A43] hover:bg-[#EAF8F7] hover:text-[#17618E] focus-visible:ring-[#17618E]/40"
                : "text-white/90 hover:text-white hover:bg-white/10 focus-visible:ring-white/40"
            )}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-xl px-4 text-[14px] font-bold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:h-11 sm:px-5",
              pastHero
                ? "bg-[#17618E] text-white hover:bg-[#124362] focus-visible:ring-[#17618E]/40"
                : "bg-[#0FA7E3] text-white hover:bg-[#0284C7] focus-visible:ring-[#0FA7E3]/50 shadow-md shadow-[#0FA7E3]/20"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}


