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
        "z-40 w-full bg-[#073B4C] border-b border-white/10",
        sticky && "sticky top-[var(--patient-header-offset,72px)]",
        className
      )}
    >
      <div className="home-container mx-auto">
        <div className="flex h-[56px] items-stretch gap-0.5 overflow-x-auto scrollbar-hide md:h-[64px] md:gap-1">
          {HEALTHCARE_TABS.map((tab) => {
            const isActive = tab.match(pathname);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors md:px-5 md:text-[14px]",
                  isActive
                    ? "text-[#16A9E0]"
                    : "text-white/75 hover:text-white"
                )}
              >
                <Icon size={18} weight={isActive ? "fill" : "regular"} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {isActive ? (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#16A9E0] md:left-4 md:right-4" />
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
