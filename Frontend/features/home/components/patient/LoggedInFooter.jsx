"use client";

import Link from "next/link";
import { FirstAidKit } from "@phosphor-icons/react";

const YEAR = new Date().getFullYear();

export function LoggedInFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#062F3D] text-white">
      <div className="home-container mx-auto py-12 md:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#7DD3C7]">
                <FirstAidKit size={18} weight="fill" />
              </span>
              <span className="text-[18px] font-bold tracking-tight">
                Med<span className="text-[#7DD3C7]">zoos</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-white/55">
              Healthcare services, connected.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-[13px] font-semibold text-white">Services</h3>
            <ul className="space-y-2 text-[13px] text-white/55">
              <li>
                <Link href="/browse" className="hover:text-white">
                  Medicine
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white">
                  Doctors
                </Link>
              </li>
              <li>
                <Link href="/lab-tests" className="hover:text-white">
                  Lab Tests
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-white">
                  Pharmacies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[13px] font-semibold text-white">Account</h3>
            <ul className="space-y-2 text-[13px] text-white/55">
              <li>
                <Link href="/account/appointments" className="hover:text-white">
                  Appointments
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/account/reports" className="hover:text-white">
                  Lab Bookings
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[13px] font-semibold text-white">Support</h3>
            <ul className="space-y-2 text-[13px] text-white/55">
              <li>
                <Link href="/help" className="hover:text-white">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-[12px] leading-relaxed text-white/45">
          <p>
            Medzoos is a healthcare connection platform. Medical services are provided by
            independent healthcare providers available through the platform.
          </p>
          <p className="mt-3">© {YEAR} Medzoos. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
