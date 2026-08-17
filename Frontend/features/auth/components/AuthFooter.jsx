"use client";

import Link from "next/link";

export function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-5 pb-6 pt-2 text-center">
      <nav className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-[#627D98]">
        <Link href="/privacy" className="hover:text-[#17618E]">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-[#17618E]">
          Terms & Conditions
        </Link>
        <Link href="/help" className="hover:text-[#17618E]">
          Help
        </Link>
      </nav>
      <p className="text-[12px] text-[#8AA0B2]">© {year} Medzoos</p>
    </footer>
  );
}
