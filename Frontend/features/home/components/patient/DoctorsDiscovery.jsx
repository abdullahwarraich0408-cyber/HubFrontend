"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, VideoCamera, Buildings, Stethoscope } from "@phosphor-icons/react";
import {
  DEFAULT_DOCTOR_PHOTO,
  FALLBACK_DOCTOR_PHOTO,
  resolveDoctorPhotoUrl,
} from "@/lib/mappers/doctor";

const FOCUS_CHIPS = [
  { id: "all", label: "All" },
  { id: "diabetes", label: "Diabetes" },
  { id: "mental", label: "Mental health" },
  { id: "online", label: "Online" },
  { id: "clinic", label: "In clinic" },
];

const TITLE_PREFIX =
  /^(dr|doctor|mr|mrs|ms|miss|prof|professor|sir|madam)\.?$/i;

function initialsFromName(name = "") {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter((part) => part && !TITLE_PREFIX.test(part));
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

function isMentalHealth(specialty = "") {
  return /psycholog|psychiatr|therap|mental/i.test(String(specialty));
}

function isDiabetesCare(specialty = "") {
  return /endocrin|diabet|diabetes/i.test(String(specialty));
}

function filterDoctors(doctors, focus) {
  let result = [...doctors];

  if (focus === "diabetes") {
    result = result.filter((d) => isDiabetesCare(d.specialty));
  } else if (focus === "mental") {
    result = result.filter((d) => isMentalHealth(d.specialty));
  } else if (focus === "online") {
    result = result.filter((d) => d.online);
  } else if (focus === "clinic") {
    result = result.filter((d) => d.isInPerson || d.inPerson || !d.online);
  }

  return result;
}

function photoCandidates(doctor) {
  const primary = resolveDoctorPhotoUrl(
    doctor?.photo || doctor?.image || doctor?.avatar || doctor?.photo_url
  );
  const list = [];
  for (const url of [primary, DEFAULT_DOCTOR_PHOTO, FALLBACK_DOCTOR_PHOTO]) {
    if (url && !list.includes(url)) list.push(url);
  }
  return list;
}

function DoctorPortrait({ doctor, className = "" }) {
  const candidates = useMemo(
    () => photoCandidates(doctor),
    [doctor?.photo, doctor?.image, doctor?.avatar, doctor?.photo_url]
  );
  const [index, setIndex] = useState(0);
  const src = candidates[index] || null;
  const name = doctor?.name || "";

  const resetKey = `${doctor?.id || name}|${candidates.join("|")}`;
  const [prevKey, setPrevKey] = useState(resetKey);
  if (prevKey !== resetKey) {
    setPrevKey(resetKey);
    setIndex(0);
  }

  return (
    <div className={`relative overflow-hidden bg-[#0A5A7A] ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={name || "Doctor"}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={() => setIndex((current) => current + 1)}
        />
      ) : (
        <div className="absolute inset-0 flex items-end bg-gradient-to-br from-[#0B6E99] to-[#17618E] p-4">
          <span className="text-[32px] font-bold tracking-tight text-white/90">
            {initialsFromName(name)}
          </span>
        </div>
      )}
    </div>
  );
}

function DoctorCard({ doctor }) {
  const href = doctor.id ? `/doctors/${doctor.id}` : "/doctors";
  const isOnline = Boolean(doctor.online);

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_10px_28px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="relative">
        <DoctorPortrait doctor={doctor} className="aspect-[5/4]" />
        <span
          className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
            isOnline ? "bg-[#16A9E0] text-white" : "bg-white text-[#0B6E99]"
          }`}
        >
          {isOnline ? (
            <>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Online
            </>
          ) : (
            <>
              <Buildings size={11} weight="bold" />
              Clinic
            </>
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[#0B6E99]">
          {doctor.specialty || "Doctor"}
        </p>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-[#102A43]">
          {doctor.name}
        </h3>
        {doctor.hospital ? (
          <p className="mt-1 line-clamp-1 text-[12px] text-[#627D98]">{doctor.hospital}</p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[12px] font-bold text-[#0B6E99]">
          View profile
          <ArrowRight
            size={13}
            weight="bold"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

function RosterCard() {
  return (
    <Link
      href="/doctors"
      className="group flex h-full min-h-[220px] flex-col justify-between rounded-[18px] border border-dashed border-white/35 bg-white/10 p-5 transition-colors hover:border-white/55 hover:bg-white/15"
    >
      <div>
        <VideoCamera size={26} className="text-[#7DD3C7]" weight="duotone" />
        <p className="mt-5 text-[18px] font-bold leading-snug text-white">
          See the full roster
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/65">
          Every specialty available through Medzoos — book online or in clinic.
        </p>
      </div>
      <span className="mt-6 inline-flex items-center gap-1 text-[13px] font-bold text-[#7DD3C7]">
        Browse all
        <ArrowRight
          size={14}
          weight="bold"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

export function DoctorsDiscovery({ doctors = [], isLoading, isError, onRetry }) {
  const [focus, setFocus] = useState("all");

  const filtered = useMemo(
    () => filterDoctors(doctors, focus).slice(0, 8),
    [doctors, focus]
  );

  return (
    <section className="relative overflow-hidden bg-[#0B6E99] py-14 text-white md:py-16 lg:py-20">
      <div
        className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-[#7DD3C7]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />

      <div className="home-container mx-auto">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.35fr] lg:items-start lg:gap-10">
          <div>
            <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#B8E8F5]">
              <Stethoscope size={14} weight="fill" />
              Doctors
            </p>
            <h2 className="mt-3 text-[clamp(1.9rem,3.8vw,2.75rem)] font-bold leading-[1.08] tracking-tight">
              Care at <span className="text-[#7DD3C7]">your pace.</span>
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/75">
              Diabetes specialists and mental health pros — filter here, or browse the full
              roster on Doctors.
            </p>

            <div className="mt-5 inline-flex max-w-full overflow-x-auto rounded-[14px] bg-white/15 p-1 scrollbar-hide">
              {FOCUS_CHIPS.map((chip) => {
                const active = focus === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setFocus(chip.id)}
                    className={`shrink-0 rounded-[10px] px-3.5 py-2.5 text-[13px] font-bold transition-colors ${
                      active
                        ? "bg-white text-[#0B6E99]"
                        : "text-white hover:bg-white/15"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <Link
              href="/doctors"
              className="group mt-7 inline-flex h-11 items-center gap-2 rounded-[12px] bg-white px-5 text-[13px] font-bold text-[#0B6E99] transition-transform hover:-translate-y-0.5"
            >
              Browse all doctors
              <ArrowRight
                size={15}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div>
            <p className="mb-3 text-[13px] font-medium text-white/60">
              {isLoading
                ? "Loading doctors…"
                : `${filtered.length} ${filtered.length === 1 ? "doctor" : "doctors"} shown`}
            </p>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] animate-pulse rounded-[18px] bg-white/15"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-[18px] border border-white/15 bg-white/10 px-5 py-12 text-center">
                <p className="text-[14px] text-white/75">Couldn&apos;t load doctors right now.</p>
                {onRetry ? (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-3 text-[13px] font-bold text-[#7DD3C7]"
                  >
                    Try again
                  </button>
                ) : null}
              </div>
            ) : filtered.length === 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-dashed border-white/25 bg-white/10 px-5 py-10 text-center sm:col-span-2">
                  <p className="text-[16px] font-bold">No doctors in this filter</p>
                  <p className="mt-1 text-[14px] text-white/65">
                    Try another tab, or browse the full roster.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFocus("all")}
                    className="mt-4 rounded-[10px] bg-white px-4 py-2 text-[13px] font-bold text-[#0B6E99]"
                  >
                    Show all
                  </button>
                </div>
                <RosterCard />
              </div>
            ) : (
              <div
                className={`grid gap-3 ${
                  filtered.length === 1
                    ? "sm:grid-cols-2"
                    : "grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {filtered.map((doctor) => (
                  <DoctorCard key={doctor.id || doctor.name} doctor={doctor} />
                ))}
                <RosterCard />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
