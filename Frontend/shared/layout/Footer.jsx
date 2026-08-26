"use client";

import Link from "next/link";
import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  LinkedinLogo,
  Envelope,
  Phone,
  MapPin,
  ArrowUp,
} from "@phosphor-icons/react";
import { BrandLogo } from "@/shared/branding/BrandLogo";
import { useQuery } from "@tanstack/react-query";
import { publicContentApi } from "@/lib/api/index";

export function Footer() {
  const { data } = useQuery({
    queryKey: ["content", "settings", "website"],
    queryFn: () => publicContentApi.get(undefined, "website"),
    staleTime: 5 * 60 * 1000,
  });
  const settings = data?.settings || {};

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#073B4C] text-white pt-14 pb-8 mt-auto border-t border-white/10 relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col gap-5">
            <BrandLogo href="/" onDark />
            <p className="text-slate-300 text-[14px] leading-relaxed max-w-[280px]">
              {settings.tagline ||
                "Diabetes care and psychologist support — medicines, consults, and labs focused on what matters first."}
            </p>
            <div className="flex items-center gap-2.5">
              <Link
                href={settings.social_facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-sm hover:brightness-110 hover:scale-105 transition-all"
                aria-label="Facebook"
              >
                <FacebookLogo size={18} weight="fill" />
              </Link>
              <Link
                href={settings.social_instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm hover:brightness-110 hover:scale-105 transition-all"
                style={{
                  background:
                    "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                }}
                aria-label="Instagram"
              >
                <InstagramLogo size={18} weight="fill" />
              </Link>
              <Link
                href={settings.social_twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#000000] flex items-center justify-center text-white shadow-sm hover:brightness-125 hover:scale-105 transition-all"
                aria-label="X (Twitter)"
              >
                <TwitterLogo size={18} weight="fill" />
              </Link>
              <Link
                href={settings.social_linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center text-white shadow-sm hover:brightness-110 hover:scale-105 transition-all"
                aria-label="LinkedIn"
              >
                <LinkedinLogo size={18} weight="fill" />
              </Link>
            </div>
          </div>

          {/* Column 2: Care */}
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="text-white font-bold text-[15px] mb-1">Care</h4>
            <Link href="/browse" className="text-slate-300 hover:text-white transition-colors">
              Medicine
            </Link>
            <Link
              href="/doctors?specialty=psychologist"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Psychologists
            </Link>
            <Link href="/lab-tests" className="text-slate-300 hover:text-white transition-colors">
              Diabetes Lab Panels
            </Link>
            <Link href="/pharmacies" className="text-slate-300 hover:text-white transition-colors">
              Pharmacies Directory
            </Link>
            <Link href="/hospitals" className="text-slate-300 hover:text-white transition-colors">
              Hospitals
            </Link>
            <Link href="/family-health" className="text-slate-300 hover:text-white transition-colors">
              Family Health
            </Link>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="text-white font-bold text-[15px] mb-1">Company</h4>
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/help" className="text-slate-300 hover:text-white transition-colors">
              Help Center
            </Link>
            <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="/partner-with-us" className="text-slate-300 hover:text-white transition-colors">
              Become a Partner
            </Link>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="text-white font-bold text-[15px] mb-1">Get in Touch</h4>
            <div className="flex items-start gap-3 text-slate-300">
              <Phone size={18} className="text-[#2DD4BF] mt-0.5 shrink-0" />
              <span>{settings.contact_phone || "+92 300 123 4567"}</span>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <Envelope size={18} className="text-[#2DD4BF] mt-0.5 shrink-0" />
              <span>{settings.contact_email || "support@medzoos.pk"}</span>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <MapPin size={18} className="text-[#2DD4BF] mt-0.5 shrink-0" />
              <span>{settings.contact_address || "DHA Phase 6, Karachi, Pakistan"}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-slate-300">
            © {new Date().getFullYear()} Medzoos. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Return & Refund Policy
            </Link>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping & Service Policy
            </Link>
          </div>

          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-[#0B6E99] hover:bg-[#0D9488] text-white flex items-center justify-center shadow-lg transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} weight="bold" />
          </button>
        </div>
      </div>
    </footer>
  );
}
