"use client";

import Link from "next/link";
import { BrandLogo } from "@/shared/branding/BrandLogo";

const YEAR = new Date().getFullYear();

const COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Medicines", href: "/browse" },
      { label: "Doctors", href: "/doctors" },
      { label: "Lab Tests", href: "/lab-tests" },
      { label: "Diabetes Care", href: "#diabetes-care" },
      { label: "Mental Health", href: "#mental-health" },
    ],
  },
  {
    title: "For Providers",
    links: [
      { label: "Doctors", href: "/partner-with-us" },
      { label: "Pharmacies", href: "/partner-with-us" },
      { label: "Laboratories", href: "/partner-with-us" },
      { label: "Hospitals & Clinics", href: "/hospitals" },
      { label: "Join Medzoos", href: "/partner-with-us" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Return & Refund Policy", href: "/refund-policy" },
      { label: "Shipping & Service Policy", href: "/shipping-policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#102A43]/08 bg-[#102A43] text-white">
      <div className="landing-container py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          <div className="lg:col-span-2">
            <BrandLogo href="#top" onDark />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/65">
              Connecting patients with healthcare services across Pakistan.
            </p>
            <p className="mt-5 text-[13px] font-medium text-[#7DD3C7]">
              Made for healthcare in Pakistan
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-[14px] font-semibold text-white">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} Medzoos. All rights reserved.</p>
          <p>Made for healthcare in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
