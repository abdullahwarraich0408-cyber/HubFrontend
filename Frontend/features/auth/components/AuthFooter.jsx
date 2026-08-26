"use client";

import Link from "next/link";

export function AuthFooter() {
  return (
    <footer className="border-t border-[#EEF3F2] px-5 py-3 text-center lg:px-10">
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12px] text-[#8A9E9C]">
        <Link href="/privacy" className="transition-colors hover:text-[#17618E]">
          Privacy Policy
        </Link>
        <Link href="/terms" className="transition-colors hover:text-[#17618E]">
          Terms & Conditions
        </Link>
        <Link href="/refund-policy" className="transition-colors hover:text-[#17618E]">
          Return & Refund
        </Link>
        <Link href="/shipping-policy" className="transition-colors hover:text-[#17618E]">
          Shipping Policy
        </Link>
        <Link href="/help" className="transition-colors hover:text-[#17618E]">
          Help
        </Link>
      </nav>
    </footer>
  );
}
