"use client";

import Link from "next/link";

export function AuthFooter() {
  return (
    <footer className="border-t border-[#EEF3F2] px-5 py-3 text-center lg:px-10">
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12px] text-[#8A9E9C]">
        <Link href="/privacy" className="transition-colors hover:text-[#087F8C]">
          Privacy Policy
        </Link>
        <Link href="/terms" className="transition-colors hover:text-[#087F8C]">
          Terms & Conditions
        </Link>
        <Link href="/help" className="transition-colors hover:text-[#087F8C]">
          Help
        </Link>
      </nav>
    </footer>
  );
}
