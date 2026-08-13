"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Sparkle
} from "@phosphor-icons/react";

export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  type = "privacy", // 'privacy' | 'terms' | 'cookies'
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
      default:
        return <ShieldCheck size={32} className="text-brand-primary" weight="duotone" />;
    }
  };

  const theme = (() => {
    switch (type) {
      case "terms":
        return {
          glowGradient: "from-indigo-950/90 via-slate-900/95 to-neutral-950",
          accentBorder: "border-indigo-500/30",
          accentBadgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
          iconColor: "text-indigo-400",
          iconBg: "bg-indigo-500/15 border border-indigo-400/30 shadow-[0_0_35px_rgba(99,102,241,0.25)]",
          complianceLabel: "Legally Binding User & Partner Agreement",
          docRef: "DOC-MEDZOOS-TOS-2026",
          IconComponent: FileText,
        };
      case "cookies":
        return {
          glowGradient: "from-amber-950/90 via-slate-900/95 to-neutral-950",
          accentBorder: "border-amber-500/30",
          accentBadgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          iconColor: "text-amber-400",
          iconBg: "bg-amber-500/15 border border-amber-400/30 shadow-[0_0_35px_rgba(245,158,11,0.25)]",
          complianceLabel: "ePrivacy & Transparent Tracking Standard",
          docRef: "DOC-MEDZOOS-COOKIES-2026",
          IconComponent: Cookie,
        };
      default: // privacy
        return {
          glowGradient: "from-teal-950/90 via-slate-900/95 to-neutral-950",
          accentBorder: "border-teal-500/30",
          accentBadgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          iconColor: "text-emerald-400",
          iconBg: "bg-emerald-500/15 border border-emerald-400/30 shadow-[0_0_35px_rgba(16,185,129,0.25)]",
          complianceLabel: "HIPAA & PK Medical Privacy Standards",
          docRef: "DOC-MEDZOOS-PRIVACY-2026",
          IconComponent: ShieldCheck,
        };
    }
  })();

  const PolicyIcon = theme.IconComponent;

  const legalNavTabs = [
    { key: "privacy", label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
    { key: "terms", label: "Terms of Service", href: "/terms", icon: FileText },
    { key: "cookies", label: "Cookie Policy", href: "/cookie-policy", icon: Cookie },
  ];

  return (
    <div className="min-h-screen bg-surface-base text-neutral-900 pb-20">
      {/* Premium Hero Header */}
      <header className={`relative bg-gradient-to-b ${theme.glowGradient} text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden`}>
        {/* Background Ambient Glow Circles */}
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-brand-highlight/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05)_0%,_transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          {/* Top Row: Breadcrumbs & Policy Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-medium text-neutral-300">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <CaretRight size={12} className="text-white/40" />
              <span className="text-white/60">Legal Center</span>
              <CaretRight size={12} className="text-white/40" />
              <span className="text-white font-semibold">{title}</span>
            </nav>

            {/* Policy Switcher Navigation Tabs (Privacy · Terms · Cookies) */}
            <div className="flex items-center gap-1.5 p-1 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 print:hidden self-start sm:self-auto">
              {legalNavTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = type === tab.key;
                return (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-md border border-white/30"
                        : "text-neutral-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <TabIcon size={16} weight={isActive ? "fill" : "regular"} className={isActive ? theme.iconColor : ""} />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Governance Badge, Heading, Subtitle, Badges */}
            <div className="lg:col-span-8 space-y-5">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${theme.accentBadgeBg}`}>
                <Sparkle size={14} weight="fill" className="animate-pulse shrink-0" />
                <span>{theme.badgeText}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {title}
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-3xl font-normal">
                {subtitle}
              </p>

              {/* Metadata Badges Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-neutral-300 font-medium">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
                  <Clock size={16} className="text-brand-highlight shrink-0" />
                  <span>Last Updated: <strong className="text-white">{lastUpdated}</strong></span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>{theme.complianceLabel}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
                  <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
                  <span>256-Bit SSL Encrypted Engine</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Glassmorphic Policy Badge Card */}
            <div className="lg:col-span-4 print:hidden">
              <div className="relative group bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden hover:border-white/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between mb-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${theme.iconBg}`}>
                    <PolicyIcon size={34} className={theme.iconColor} weight="duotone" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      Active Policy
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono mt-1.5">{theme.docRef}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
                  Medzoos Compliance Deck
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                  Official regulatory terms binding all Medzoos platform interactions, prescription processing, and telehealth consultations.
                </p>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handlePrint}
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all active:scale-95 shadow-sm"
                  >
                    <Printer size={16} />
                    <span>Print / Save</span>
                  </button>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-brand-primary hover:bg-brand-dark text-white text-xs font-bold transition-all active:scale-95 shadow-md"
                  >
                    <Envelope size={16} />
                    <span>Legal Desk</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

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
                      href="/privacy"
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
                      href="/terms"
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-brand-primary hover:bg-brand-mist transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText size={14} className="text-brand-primary" />
                        Terms of Service
                      </span>
                      <CaretRight size={12} />
                    </Link>
                  )}
                  {type !== "cookies" && (
                    <Link
                      href="/cookie-policy"
                      className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-brand-primary hover:bg-brand-mist transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Cookie size={14} className="text-brand-primary" />
                        Cookie Policy
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
                    href="mailto:privacy@medzoos.pk"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-ink-900 hover:bg-neutral-100 text-xs font-bold transition-all shadow-md"
                  >
                    <Envelope size={16} className="text-brand-primary" />
                    <span>privacy@medzoos.pk</span>
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
