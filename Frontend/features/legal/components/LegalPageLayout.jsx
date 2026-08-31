"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  FileText, 
  Cookie, 
  Printer, 
  MagnifyingGlass, 
  CaretRight, 
  Envelope, 
  PhoneCall, 
  ArrowUp,
  CheckCircle,
  Clock,
  Sparkle,
  ArrowsCounterClockwise,
  Truck
} from "@phosphor-icons/react";

export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  type = "privacy", // 'privacy' | 'terms' | 'cookies' | 'refund' | 'shipping'
  sections = [],
  children
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Section scrollspy detection
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handlePrint = () => {
    window.print();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredSections = searchQuery.trim()
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;

  const renderIcon = () => {
    switch (type) {
      case "terms":
        return <FileText size={32} className="text-brand-primary" weight="duotone" />;
      case "cookies":
        return <Cookie size={32} className="text-brand-primary" weight="duotone" />;
      case "refund":
        return <ArrowsCounterClockwise size={32} className="text-brand-primary" weight="duotone" />;
      case "shipping":
        return <Truck size={32} className="text-brand-primary" weight="duotone" />;
      default:
        return <ShieldCheck size={32} className="text-brand-primary" weight="duotone" />;
    }
  };

  const theme = (() => {
    switch (type) {
      case "terms":
        return {
          badgeText: "User & Partner Terms",
          complianceLabel: "Legally Binding Telehealth Standard",
          docRef: "DOC-MEDZOOS-TOS-2026",
          heroImage: "/images/auth-medzoos-healthcare.png",
          IconComponent: FileText,
        };
      case "refund":
        return {
          badgeText: "Returns, Refunds & Cancellations",
          complianceLabel: "DRAP & Consumer Protection Standard",
          docRef: "DOC-MEDZOOS-REFUND-2026",
          heroImage: "/images/auth-medzoos-healthcare.png",
          IconComponent: ArrowsCounterClockwise,
        };
      case "shipping":
        return {
          badgeText: "Cold-Chain & Delivery SLA",
          complianceLabel: "Temperature Regulated Healthcare Logistics",
          docRef: "DOC-MEDZOOS-SHIPPING-2026",
          heroImage: "/images/hero-upload-prescription.png",
          IconComponent: Truck,
        };
      case "cookies":
        return {
          badgeText: "Cookie & Tracking Policy",
          complianceLabel: "ePrivacy Protection Standard",
          docRef: "DOC-MEDZOOS-COOKIES-2026",
          heroImage: "/images/medzoos-hero.png",
          IconComponent: Cookie,
        };
      default: // privacy
        return {
          badgeText: "Patient Data Protection",
          complianceLabel: "HIPAA & PK Medical Privacy",
          docRef: "DOC-MEDZOOS-PRIVACY-2026",
          heroImage: "/images/hero-upload-prescription.png",
          IconComponent: ShieldCheck,
        };
    }
  })();

  const PolicyIcon = theme.IconComponent;

  const legalNavTabs = [
    { key: "privacy", label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck },
    { key: "terms", label: "Terms of Service", href: "/terms-of-service", icon: FileText },
    { key: "refund", label: "Return & Refund", href: "/refund-policy", icon: ArrowsCounterClockwise },
    { key: "shipping", label: "Shipping & Service Delivery", href: "/shipping-policy", icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-surface-base text-neutral-900 pb-20">
      {/* Page Hero Container — Exact PageHero structure across Medzoos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="relative grid overflow-hidden rounded-[28px] bg-[#0B6E99] md:grid-cols-[1.1fr_0.9fr] md:rounded-[32px] text-white shadow-xl">
          {/* Left Column: Text & Navigation Controls */}
          <div className="relative z-10 flex flex-col justify-center px-6 py-9 md:px-10 md:py-12 lg:px-12">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#B8E8F5] mb-3">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <CaretRight size={12} className="text-white/40" />
              <span className="text-white/70">Legal Center</span>
              <CaretRight size={12} className="text-white/40" />
              <span className="text-white font-bold">{title}</span>
            </nav>

            <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#B8E8F5] mb-3">
              <Sparkle size={14} weight="fill" className="text-[#7DD3C7] shrink-0" />
              {theme.badgeText}
            </p>

            <h1 className="text-[clamp(1.9rem,4.2vw,3.1rem)] font-bold leading-[1.08] tracking-tight text-white mb-3">
              {title}{" "}
              <span className="text-[#7DD3C7]">Policy</span>
            </h1>

            <p className="max-w-md text-[15px] leading-relaxed text-white/80 mb-6">
              {subtitle}
            </p>

            {/* Policy Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2 print:hidden mb-6">
              {legalNavTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = type === tab.key;
                return (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-[14px] text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white text-[#0B6E99] shadow-md font-extrabold"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <TabIcon size={16} weight={isActive ? "fill" : "regular"} />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Actions / Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 font-medium">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-[12px] border border-white/20">
                <Clock size={15} className="text-[#7DD3C7] shrink-0" />
                <span>Last Updated: <strong className="text-white">{lastUpdated}</strong></span>
              </div>
              <button
                onClick={handlePrint}
                type="button"
                className="flex items-center gap-2 px-3.5 py-2 rounded-[12px] bg-white/15 hover:bg-white/25 text-white font-bold border border-white/20 transition-all active:scale-95 shadow-sm"
              >
                <Printer size={15} />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Image (Exact PageHero right side image & gradient overlay) */}
          <div className="relative hidden min-h-[300px] md:block">
            <Image
              src={theme.heroImage}
              alt={`${title} Illustration`}
              fill
              className="object-cover object-center"
              sizes="45vw"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0B6E99]/25 to-[#0B6E99]"
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation (Desktop) */}
          <aside className="lg:col-span-4 print:hidden">
            <div className="sticky top-24 space-y-6">
              
              {/* Quick Search */}
              <div className="bg-surface-subtle p-3 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="relative">
                  <MagnifyingGlass
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in this policy..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-neutral-200 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                  />
                </div>
              </div>

              {/* Table of Contents Card */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden p-5">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-neutral-100">
                  {renderIcon()}
                  <h2 className="font-bold text-sm text-ink-headline">
                    Table of Contents
                  </h2>
                </div>

                <nav className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide pr-1">
                  {filteredSections.map((section, idx) => {
                    const isActive = activeSection === section.id;
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection(section.id);
                          const el = document.getElementById(section.id);
                          if (el) {
                            const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
                            window.scrollTo({ top: y, behavior: "smooth" });
                          }
                        }}
                        className={`group flex items-start gap-2.5 p-2.5 rounded-xl text-xs transition-all ${
                          isActive
                            ? "bg-brand-light text-brand-primary font-bold border-l-4 border-brand-primary pl-3"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-medium"
                        }`}
                      >
                        <span
                          className={`text-[11px] font-mono shrink-0 px-1.5 py-0.5 rounded ${
                            isActive
                              ? "bg-brand-primary text-white"
                              : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="leading-tight">{section.title}</span>
                      </a>
                    );
                  })}
                </nav>

                {/* Switch Document Links */}
                <div className="mt-6 pt-4 border-t border-neutral-100 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Other Legal Documents
                  </p>
                  {type !== "privacy" && (
                    <Link
                      href="/privacy-policy"
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-brand-primary hover:bg-brand-mist transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-brand-primary" />
                        Privacy Policy
                      </span>
                      <CaretRight size={12} />
                    </Link>
                  )}
                  {type !== "terms" && (
                    <Link
                      href="/terms-of-service"
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-brand-primary hover:bg-brand-mist transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText size={14} className="text-brand-primary" />
                        Terms of Service
                      </span>
                      <CaretRight size={12} />
                    </Link>
                  )}
                  {type !== "refund" && (
                    <Link
                      href="/refund-policy"
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-brand-primary hover:bg-brand-mist transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ArrowsCounterClockwise size={14} className="text-brand-primary" />
                        Return & Refund Policy
                      </span>
                      <CaretRight size={12} />
                    </Link>
                  )}
                  {type !== "shipping" && (
                    <Link
                      href="/shipping-policy"
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-brand-primary hover:bg-brand-mist transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Truck size={14} className="text-brand-primary" />
                        Shipping & Service Policy
                      </span>
                      <CaretRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Legal Content */}
          <article className="lg:col-span-8 space-y-8 min-w-0">
            {children}

            {/* Bottom Support Banner */}
            <div className="mt-12 bg-gradient-to-r from-ink-900 to-brand-dark rounded-2xl p-6 sm:p-8 text-white shadow-lg print:hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-highlight text-xs font-semibold">
                    <ShieldCheck size={14} />
                    <span>Data Governance & Compliance</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Questions or Concerns Regarding Privacy & Terms?
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Our dedicated legal and data protection team is available to assist you with any questions, data deletion requests, or compliance inquiries.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                  <a
                    href="mailto:security@medzoos.pk"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-ink-900 hover:bg-neutral-100 text-xs font-bold transition-all shadow-md"
                  >
                    <Envelope size={16} className="text-brand-primary" />
                    <span>security@medzoos.pk</span>
                  </a>
                  <a
                    href="tel:+923001234567"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
                  >
                    <PhoneCall size={16} />
                    <span>Contact Support</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Floating Back-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 p-3 rounded-full bg-brand-primary text-white shadow-xl hover:bg-brand-dark transition-all transform hover:scale-105 z-50 print:hidden"
        >
          <ArrowUp size={20} weight="bold" />
        </button>
      )}
    </div>
  );
}
