"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { List, X, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/utils/cn";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Diabetes Care", href: "#diabetes-care" },
  { label: "Mental Health", href: "#mental-health" },
];

const SERVICE_LINKS = [
  { label: "Medicines", href: "/browse", description: "Search & order medicines" },
  { label: "Doctors", href: "/doctors", description: "Consultations & appointments" },
  { label: "Lab Tests", href: "/lab-tests", description: "Diagnostics & home sampling" },
];

export function Navbar() {
  const { openSignIn } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogin = (e) => {
    e.preventDefault();
    openSignIn({ redirect: "/" });
  };

  const mobileLinks = [
    { label: "Home", href: "#top" },
    ...SERVICE_LINKS.map(({ label, href }) => ({ label, href })),
    { label: "Diabetes Care", href: "#diabetes-care" },
    { label: "Mental Health", href: "#mental-health" },
  ];

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
        <Link
          href="#top"
          className="group flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]/40 focus-visible:ring-offset-2 rounded-lg"
          aria-label="Medzoos home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#087F8C] text-[15px] font-bold text-white shadow-sm transition-transform group-hover:scale-[1.03]">
            M
          </span>
          <span className="font-sans text-[1.25rem] font-semibold tracking-tight text-[#102A43]">
            Medzoos
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 xl:flex"
          aria-label="Primary"
        >
          <NavItem href="#top" label="Home" />

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] font-medium text-[#52606D] transition-colors hover:bg-[#EAF8F7] hover:text-[#087F8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]/40"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <CaretDown size={14} weight="bold" className={cn("transition-transform", servicesOpen && "rotate-180")} />
            </button>
            {servicesOpen ? (
              <div className="absolute left-1/2 top-full z-50 w-[280px] -translate-x-1/2 pt-2">
                <div className="rounded-2xl border border-[#102A43]/08 bg-white p-2 shadow-[0_12px_40px_rgba(16,42,67,0.12)]">
                  {SERVICE_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-3.5 py-3 transition-colors hover:bg-[#EAF8F7]"
                    >
                      <span className="block text-[14px] font-semibold text-[#102A43]">{item.label}</span>
                      <span className="mt-0.5 block text-[12px] text-[#52606D]">{item.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <NavItem href="/browse" label="Medicines" />
          <NavItem href="/doctors" label="Doctors" />
          <NavItem href="/lab-tests" label="Lab Tests" />
          {NAV_LINKS.slice(1).map((link) => (
            <NavItem key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/login"
            onClick={handleLogin}
            className="hidden rounded-xl px-3 py-2 text-[14px] font-semibold text-[#102A43] transition-colors hover:bg-[#EAF8F7] hover:text-[#087F8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]/40 sm:inline-flex"
          >
            Log In
          </a>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#087F8C] px-4 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#075E68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]/40 focus-visible:ring-offset-2 sm:h-11 sm:px-5"
          >
            Get Started
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#102A43]/10 text-[#102A43] transition-colors hover:bg-[#EAF8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]/40 xl:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#102A43]/08 bg-white/95 backdrop-blur-xl xl:hidden">
          <nav className="landing-container flex max-h-[calc(100dvh-68px)] flex-col gap-1 overflow-y-auto py-4" aria-label="Mobile">
            {mobileLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-[15px] font-medium text-[#102A43] transition-colors hover:bg-[#EAF8F7]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 grid gap-2 border-t border-[#102A43]/08 pt-4 sm:hidden">
              <a
                href="/login"
                onClick={(e) => {
                  setMobileOpen(false);
                  handleLogin(e);
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#102A43]/12 text-[14px] font-semibold text-[#102A43]"
              >
                Log In
              </a>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#087F8C] text-[14px] font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function NavItem({ href, label }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-[14px] font-medium text-[#52606D] transition-colors hover:bg-[#EAF8F7] hover:text-[#087F8C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087F8C]/40"
    >
      {label}
    </Link>
  );
}
