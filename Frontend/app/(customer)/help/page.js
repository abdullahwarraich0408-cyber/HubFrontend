"use client";

import Link from "next/link";
import {
  Question,
  ChatCircle,
  ArrowRight,
} from "@phosphor-icons/react";

const TOPICS = [
  {
    title: "Orders & delivery",
    body: "Track medicine orders, update your address, or check delivery status from My Orders.",
    href: "/orders",
    cta: "View orders",
  },
  {
    title: "Doctor appointments",
    body: "Manage upcoming and past consultations, including online and in-clinic visits.",
    href: "/account/appointments",
    cta: "My appointments",
  },
  {
    title: "Lab tests & reports",
    body: "Browse labs, book tests, and follow lab bookings from your account.",
    href: "/orders?type=lab",
    cta: "Lab bookings",
  },
  {
    title: "Prescriptions",
    body: "Upload a prescription and follow pharmacy assignment until your order is ready.",
    href: "/prescription",
    cta: "Prescriptions",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen w-full bg-[#F0F4F8] py-8 md:py-10">
      <div className="home-container mx-auto max-w-3xl">
        <div className="mb-8 overflow-hidden rounded-[28px] bg-[#0B6E99] px-6 py-9 text-white md:px-10 md:py-11">
          <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#B8E8F5]">
            <Question size={14} weight="fill" />
            Help Center
          </p>
          <h1 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight">
            How can we <span className="text-[#7DD3C7]">help you?</span>
          </h1>
          <p className="mt-3 max-w-lg text-[15px] text-white/75">
            Find quick links for orders, appointments, labs, and prescriptions — or contact
            support.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {TOPICS.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="group rounded-[18px] border border-[#0B6E99]/12 bg-white p-5 shadow-[0_6px_20px_rgba(11,110,153,0.06)] transition-transform hover:-translate-y-0.5"
            >
              <h2 className="text-[16px] font-bold text-[#102A43] group-hover:text-[#0B6E99]">
                {topic.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#627D98]">{topic.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-[#0B6E99]">
                {topic.cta}
                <ArrowRight
                  size={14}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-[20px] border border-[#0B6E99]/12 bg-white p-6">
          <h2 className="text-[18px] font-bold text-[#102A43]">Still need help?</h2>
          <p className="mt-1 text-[14px] text-[#627D98]">
            Reach the Medzoos support team from the contact page.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#0B6E99] px-5 text-[13px] font-bold text-white"
          >
            <ChatCircle size={16} weight="bold" />
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
