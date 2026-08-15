"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  VideoCamera,
  Buildings,
  ChatCircleDots,
} from "@phosphor-icons/react";
import {
  DEFAULT_DOCTOR_PHOTO,
  FALLBACK_DOCTOR_PHOTO,
  resolveDoctorPhotoUrl,
} from "@/lib/mappers/doctor";

const FILTERS = [
  { label: "Anxiety", href: "/doctors?specialty=psychologist&q=anxiety" },
  { label: "Stress", href: "/doctors?specialty=psychologist&q=stress" },
  { label: "Depression", href: "/doctors?specialty=psychologist&q=depression" },
  { label: "Online", href: "/doctors?specialty=psychologist&q=online" },
  { label: "In Clinic", href: "/doctors?specialty=psychologist&q=clinic" },
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

function Avatar({ doctor }) {
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
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#C9DED8] sm:h-16 sm:w-16">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className="h-full w-full object-cover object-top"
          loading="lazy"
          decoding="async"
          onError={() => setIndex((current) => current + 1)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#B9D8D1] to-[#7FAEA5] text-[15px] font-semibold text-white">
          {initialsFromName(name)}
        </div>
      )}
    </div>
  );
}

function PsychologistRow({ doctor }) {
  const href = doctor.id
    ? `/doctors/${doctor.id}`
    : "/doctors?specialty=psychologist";
  const isOnline = Boolean(doctor.online);

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border-b border-[#102A43]/08 py-4 transition-colors last:border-b-0 hover:bg-white/50 sm:gap-5 sm:px-2"
    >
      <Avatar doctor={doctor} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-[#102A43] transition-colors group-hover:text-[#0B6E99] sm:text-[16px]">
          {doctor.name}
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-[#627D98]">
          {doctor.specialty || "Psychologist"}
          {doctor.hospital ? ` · ${doctor.hospital}` : ""}
        </span>
        <span
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            isOnline ? "bg-[#E3F4F0] text-[#0B6E99]" : "bg-white text-[#627D98]"
          }`}
        >
          {isOnline ? (
            <>
              <VideoCamera size={11} weight="bold" /> Online
            </>
          ) : (
            <>
              <Buildings size={11} weight="bold" /> In clinic
            </>
          )}
        </span>
      </span>
      <span className="hidden items-center gap-1 text-[13px] font-semibold text-[#0B6E99] sm:inline-flex">
        View profile
        <ArrowRight
          size={13}
          weight="bold"
          className="transition-transform group-hover:translate-x-[3px]"
        />
      </span>
      <ArrowRight
        size={16}
        weight="bold"
        className="shrink-0 text-[#627D98] transition-transform group-hover:translate-x-1 group-hover:text-[#0B6E99] sm:hidden"
      />
    </Link>
  );
}

export function MentalHealthRail({ doctors = [], isLoading, isError, onRetry }) {
  const list = doctors.slice(0, 5);

  return (
    <section className="relative overflow-hidden bg-[#EFF8F6] py-16 md:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[70%] -translate-x-1/2 rounded-[100%] bg-[#087F8C]/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="home-container mx-auto">
        {/* Unique: calm centered intro — not poster grid, not editorial split */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0B6E99]">
            <ChatCircleDots size={15} weight="duotone" />
            Mental Health
          </p>
          <h2 className="mt-3 text-[clamp(1.85rem,3.2vw,2.85rem)] font-semibold leading-[1.15] tracking-tight text-[#102A43]">
            Find someone you can talk to
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-[#627D98]">
            Explore psychologists for anxiety, stress, depression, emotional wellbeing
            and ongoing mental health support.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {FILTERS.map((filter) => (
              <Link
                key={filter.label}
                href={filter.href}
                className="rounded-full border border-[#102A43]/10 bg-white/80 px-3.5 py-1.5 text-[12px] font-medium text-[#334E68] transition-colors hover:border-[#0B6E99]/30 hover:bg-white hover:text-[#0B6E99]"
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Unique: quiet directory list with circular avatars */}
        <div className="mx-auto mt-10 max-w-3xl rounded-[24px] border border-[#102A43]/06 bg-white/55 px-4 sm:px-6">
          {isLoading ? (
            <div className="space-y-4 py-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2">
                  <div className="h-14 w-14 animate-pulse rounded-full bg-[#D7E8E4]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-[#D7E8E4]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#D7E8E4]" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="px-2 py-10 text-center">
              <p className="text-[14px] text-[#627D98]">
                We couldn&apos;t load psychologists right now.
              </p>
              {onRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-3 text-[13px] font-semibold text-[#0B6E99]"
                >
                  Try Again
                </button>
              ) : null}
            </div>
          ) : list.length === 0 ? (
            <div className="px-2 py-12 text-center">
              <p className="text-[15px] font-semibold text-[#102A43]">
                Psychologists will appear here
              </p>
              <p className="mt-1 text-[14px] text-[#627D98]">
                Browse available mental health professionals when they&apos;re listed.
              </p>
            </div>
          ) : (
            <div>
              {list.map((doctor) => (
                <PsychologistRow key={doctor.id || doctor.name} doctor={doctor} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/doctors?specialty=psychologist"
            className="group inline-flex h-12 items-center gap-2 rounded-[12px] bg-[#0B6E99] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#073B4C]"
          >
            View all psychologists
            <ArrowRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-[3px]"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
