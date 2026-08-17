"use client";

import { AuthBrandMark } from "./AuthChrome";

const COPY = {
  default: {
    title: "Care that stays with you.",
    body: "Medicines, doctors and lab tests — in one trusted place.",
  },
  recover: {
    title: "Getting back to your care should feel simple.",
    body: "Reset access securely and continue with Medzoos.",
  },
};

export function AuthVisualPanel({ variant = "default" }) {
  const copy = COPY[variant] || COPY.default;

  return (
    <aside className="relative hidden h-full w-[42%] shrink-0 overflow-hidden bg-[#087F8C] lg:flex xl:w-[44%]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0AA3B0] via-[#087F8C] to-[#065A63]" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 400 720"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M-40 180C40 120 120 240 200 210C280 180 320 80 440 120V0H-40V180Z"
          fill="white"
          fillOpacity="0.08"
        />
        <path
          d="M-40 420C60 360 140 500 230 470C320 440 360 300 460 360V720H-40V420Z"
          fill="white"
          fillOpacity="0.1"
        />
        <circle cx="340" cy="120" r="90" fill="white" fillOpacity="0.08" />
        <circle cx="40" cy="560" r="120" fill="white" fillOpacity="0.07" />
      </svg>

      <picture>
        <source srcSet="/images/auth-medzoos-healthcare.webp" type="image/webp" />
        <img
          src="/images/auth-medzoos-healthcare.png"
          alt=""
          className="absolute inset-x-0 bottom-0 h-[62%] w-full object-cover object-[center_18%]"
        />
      </picture>
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#065A63]/25 via-transparent to-[#087F8C]" />

      <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 xl:p-10">
        <AuthBrandMark light />
        <div className="max-w-[280px] pb-2">
          <p className="text-[22px] font-semibold leading-snug text-white xl:text-[24px]">{copy.title}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-white/80">{copy.body}</p>
        </div>
      </div>
    </aside>
  );
}
