"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Pill, Stethoscope, Flask, Storefront, Buildings } from "@phosphor-icons/react";

const TABS = [
  { label: "Home", href: "/", icon: House, match: (path) => path === "/" },
  { label: "Medicines", href: "/browse", icon: Pill, match: (path) => path.startsWith("/browse") || path.startsWith("/product") },
  { label: "Doctors", href: "/doctors", icon: Stethoscope, match: (path) => path.startsWith("/doctors") },
  { label: "Hospitals", href: "/hospitals", icon: Buildings, match: (path) => path.startsWith("/hospitals") },
  { label: "Lab Tests", href: "/lab-tests", icon: Flask, match: (path) => path.startsWith("/lab-tests") },
  { label: "Pharmacies", href: "/vendors", icon: Storefront, match: (path) => path.startsWith("/vendors") || path.startsWith("/pharmacies") },
];

export function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-[64px] z-40 w-full bg-[var(--color-ink-900)] border-b border-white/10 shadow-[var(--shadow-navbar)]"
    >
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
        <div className="flex items-center gap-1 h-[48px] overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = tab.match(pathname);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex items-center gap-2 px-4 h-full text-[14px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? "text-[var(--color-brand-highlight)]"
                    : "text-white/80 hover:text-[var(--color-brand-highlight)]"
                }`}
              >
                <Icon size={18} weight={isActive ? "fill" : "regular"} />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[var(--color-brand-primary)] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
