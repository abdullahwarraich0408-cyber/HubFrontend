"use client";

import Link from "next/link";
import { FirstAidKit, FacebookLogo, InstagramLogo, TwitterLogo, LinkedinLogo, Envelope, Phone, MapPin } from "@phosphor-icons/react";

export function Footer() {
  return (
      <footer className="bg-ink-900 pt-16 pb-8 mt-auto">
      <div className="w-full home-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center">
                <FirstAidKit size={24} className="text-brand-primary" weight="fill" />
              </div>
              <span className="font-bold text-[20px] text-white tracking-tight">
                PharmaHub
              </span>
            </Link>
            <p className="text-neutral-500 text-[14px] leading-relaxed max-w-[280px]">
              Pakistan's most trusted online pharmacy. Authentic medicines from verified vendors, delivered across 1800+ cities.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#" className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-500 hover:bg-brand-primary hover:text-white transition-all" aria-label="Facebook">
                <FacebookLogo size={20} weight="fill" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-500 hover:bg-brand-primary hover:text-white transition-all" aria-label="Instagram">
                <InstagramLogo size={20} weight="fill" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-500 hover:bg-brand-primary hover:text-white transition-all" aria-label="Twitter">
                <TwitterLogo size={20} weight="fill" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-500 hover:bg-brand-primary hover:text-white transition-all" aria-label="LinkedIn">
                <LinkedinLogo size={20} weight="fill" />
              </Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-[15px] mb-2">Shop</h4>
            <Link href="/browse" className="text-neutral-500 hover:text-white text-[14px] transition-colors">All Medicines</Link>
            <Link href="/vendors" className="text-neutral-500 hover:text-white text-[14px] transition-colors">Pharmacies Directory</Link>
            <Link href="/browse" className="text-neutral-500 hover:text-white text-[14px] transition-colors">Health Devices</Link>
            <Link href="/browse" className="text-neutral-500 hover:text-white text-[14px] transition-colors">Vitamins & Supplements</Link>
            <Link href="/offers" className="text-neutral-500 hover:text-white text-[14px] transition-colors">Offers & Deals</Link>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-[15px] mb-2">Company</h4>
            <Link href="#" className="text-neutral-500 hover:text-white text-[14px] transition-colors">About Us</Link>
            <Link href="/contact" className="text-neutral-500 hover:text-white text-[14px] transition-colors">Become a Vendor</Link>
            <Link href="#" className="text-neutral-500 hover:text-white text-[14px] transition-colors">Careers</Link>
            <Link href="#" className="text-neutral-500 hover:text-white text-[14px] transition-colors">Blog</Link>
            <Link href="#" className="text-neutral-500 hover:text-white text-[14px] transition-colors">Press</Link>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-[15px] mb-2">Get in Touch</h4>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-brand-primary mt-0.5 shrink-0" />
              <span className="text-neutral-500 text-[14px]">+92 300 123 4567</span>
            </div>
            <div className="flex items-start gap-3">
              <Envelope size={18} className="text-brand-primary mt-0.5 shrink-0" />
              <span className="text-neutral-500 text-[14px]">support@pharmahub.pk</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-primary mt-0.5 shrink-0" />
              <span className="text-neutral-500 text-[14px]">DHA Phase 6, Karachi, Pakistan</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-neutral-500">
            © 2025 PharmaHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[13px] text-neutral-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[13px] text-neutral-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-[13px] text-neutral-500 hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
