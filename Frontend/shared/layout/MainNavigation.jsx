"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Pill, Stethoscope, Flask, Storefront } from "@phosphor-icons/react";
import { cn } from "@/utils/cn";

export const HEALTHCARE_TABS = [
  {
    label: "Home",
    shortLabel: "Home",
    href: "/",
    icon: House,
    match: (path) => path === "/" || path === "/home",
  },
  {
    label: "Medicine",
    shortLabel: "Medicine",
    href: "/browse",
    icon: Pill,
    match: (path) =>
      path.startsWith("/browse") ||
      path.startsWith("/product") ||
      path.startsWith("/diabetes-care"),
  },
  {
    label: "Doctors",
    shortLabel: "Doctors",
    href: "/doctors",
    icon: Stethoscope,
    match: (path) => path.startsWith("/doctors") || path.startsWith("/psychologists"),
  },
  {
    label: "Lab Tests",
    shortLabel: "Lab Tests",
    href: "/lab-tests",
    icon: Flask,
    match: (path) => path.startsWith("/lab-tests"),
  },
  {
    label: "Pharmacies",
    shortLabel: "Pharmacies",
    href: "/vendors",
    icon: Storefront,
    match: (path) =>
      path.startsWith("/vendors") || path.startsWith("/pharmacies"),
  },
];

export function HealthcareNav({ sticky = true, className }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Healthcare services"
      className={cn(
        "z-40 w-full bg-[#073B4C] border-b border-white/10 shadow-sm",
        sticky && "sticky top-[var(--patient-header-offset,64px)] md:top-[var(--patient-header-offset,72px)]",
        className
      )}
    >
      <div className="home-container mx-auto px-2 sm:px-6">
        <div className="flex h-12 sm:h-14 md:h-[60px] items-stretch justify-around sm:justify-start gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
          {HEALTHCARE_TABS.map((tab) => {
            const isActive = tab.match(pathname);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex flex-1 sm:flex-initial shrink-0 items-center justify-center gap-1.5 px-2.5 sm:px-4 text-[12px] sm:text-[13px] md:text-[14px] font-bold whitespace-nowrap transition-all",
                  isActive
                    ? "text-[#2DD4BF]"
                    : "text-slate-300 hover:text-white"
                )}
              >
                <Icon size={18} weight={isActive ? "fill" : "regular"} className={isActive ? "text-[#2DD4BF]" : "text-slate-300"} />
                <span>{tab.label}</span>
                {isActive ? (
                  <span className="absolute bottom-0 left-2 right-2 h-[3px] rounded-full bg-[#2DD4BF] shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function MainNavigation(props) {
  return <HealthcareNav {...props} />;
}
