"use client";

import { FirstAidKit, Pill, Stethoscope, TestTube } from "@phosphor-icons/react";

const COPY = {
  default: {
    kicker: "Healthcare, connected",
    title: "Your health services, all in one place.",
    body: "Access medicines, doctors, psychologists and lab services through your Medzoos account.",
  },
  recover: {
    kicker: "Healthcare, connected",
    title: "Getting back to your healthcare should be simple.",
    body: "Reset access securely and continue managing medicines, doctors and lab services in one place.",
  },
};

const SERVICES = [
  { icon: Pill, label: "Medicines", detail: "Find medicines through participating pharmacies." },
  { icon: Stethoscope, label: "Healthcare Professionals", detail: "Find doctors and mental health professionals." },
  { icon: TestTube, label: "Lab Tests", detail: "Explore diagnostic services and home sampling where available." },
];

export function AuthVisualPanel({ variant = "default" }) {
  const copy = COPY[variant] || COPY.default;

  return (
    <aside className="relative hidden min-h-dvh w-[45%] overflow-hidden bg-[#073B4C] lg:flex lg:flex-col xl:w-[48%]">
      <div className="pointer-events-none absolute -left-24 top-[-80px] h-72 w-72 rounded-full bg-[#16A9E0]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-[-60px] h-80 w-80 rounded-full bg-[#0B6E99]/30 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between px-10 py-10 xl:px-14">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <FirstAidKit size={22} weight="fill" />
          </div>
          <span className="font-[var(--font-heading)] text-[26px] tracking-tight">Medzoos</span>
        </div>

        <div className="max-w-[440px]">
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#9ED7F0]">
            {copy.kicker}
          </p>
          <h2 className="font-[var(--font-heading)] text-[36px] leading-[1.15] text-white xl:text-[42px]">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-[380px] text-[15px] leading-relaxed text-white/75">
            {copy.body}
          </p>

          <div className="relative mt-8 overflow-hidden rounded-[28px] ring-1 ring-white/15">
            <picture>
              <source srcSet="/images/auth-medzoos-healthcare.webp" type="image/webp" />
              <img
                src="/images/auth-medzoos-healthcare.png"
                alt="A Medzoos doctor speaking with a patient in a bright clinic"
                className="h-[280px] w-full object-cover xl:h-[320px]"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-[#073B4C]/45 via-transparent to-[#0B6E99]/10" />
          </div>
        </div>

        <ul className="grid grid-cols-3 gap-4 pt-8">
          {SERVICES.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="min-w-0">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                <Icon size={16} weight="fill" />
              </div>
              <p className="text-[13px] font-semibold text-white">{label}</p>
              <p className="mt-1 text-[11px] leading-4 text-white/65">{detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
