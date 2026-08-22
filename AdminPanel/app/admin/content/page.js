"use client";

import Link from "next/link";
import {
  Images,
  FirstAidKit,
  Stethoscope,
  Flag,
  Globe,
  ArrowRight,
} from "@phosphor-icons/react";

const CARDS = [
  {
    href: "/admin/home-posters",
    icon: Images,
    title: "Home posters",
    where: "User app + website hero",
    body: "First-visit intro cards and returning-user offer cards. Change title, button, picture, color, and destination.",
  },
  {
    href: "/admin/content/care-actions",
    icon: FirstAidKit,
    title: "Care shortcuts",
    where: "User app home",
    body: "The Your care tiles: find doctor, clinic, medicines, lab. Add, edit, or remove shortcuts.",
  },
  {
    href: "/admin/content/specialties",
    icon: Stethoscope,
    title: "Specialities",
    where: "User app + website",
    body: "Doctor speciality chips on home. Add a new speciality anytime.",
  },
  {
    href: "/admin/content/banners",
    icon: Flag,
    title: "Banners",
    where: "App and website",
    body: "Extra campaign cards you can add later — title, picture, button, and link.",
  },
  {
    href: "/admin/content/site",
    icon: Globe,
    title: "Site details",
    where: "Website + app",
    body: "Phone, email, address, tagline, landing headline, and app store links.",
  },
];

export default function ContentHubPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 max-w-[1100px]">
      <div className="mb-8">
        <h1 className="text-[28px] font-heading font-extrabold text-ink-headline tracking-tight">
          App & Website
        </h1>
        <p className="text-[14px] text-neutral-500 mt-1 max-w-[640px]">
          Update copy, pictures, and sections that appear on the user app and public website.
          Changes here go live without a new app or website release.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-white rounded-[16px] border border-neutral-200 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#17618E]/30 hover:shadow-[0_8px_24px_rgba(11,110,114,0.08)] transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-[#DEEEF9] text-[#17618E] flex items-center justify-center mb-4">
              <card.icon size={22} weight="duotone" />
            </div>
            <h2 className="text-[18px] font-bold text-ink-headline">{card.title}</h2>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#17618E] mt-1">
              {card.where}
            </p>
            <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">{card.body}</p>
            <span className="inline-flex items-center gap-1 mt-4 text-[13px] font-semibold text-[#17618E]">
              Open
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
