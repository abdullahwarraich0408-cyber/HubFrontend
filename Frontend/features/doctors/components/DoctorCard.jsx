"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Star,
  VideoCamera,
  Buildings,
  CalendarBlank,
} from "@phosphor-icons/react";
import { BookConsultModal } from "./BookConsultModal";
import { buildDoctorConsultOptions, filterConsultOptions } from "../utils/consultOptions";
import { buildBookQuery } from "./AppointmentFlow";
import {
  DEFAULT_DOCTOR_PHOTO,
  FALLBACK_DOCTOR_PHOTO,
  resolveDoctorPhotoUrl,
} from "@/lib/mappers/doctor";

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
    doctor?.photo || doctor?.image || doctor?.avatar
  );
  const list = [];
  for (const url of [primary, DEFAULT_DOCTOR_PHOTO, FALLBACK_DOCTOR_PHOTO]) {
    if (url && !list.includes(url)) list.push(url);
  }
  return list;
}

function DoctorCover({ doctor }) {
  const candidates = useMemo(
    () => photoCandidates(doctor),
    [doctor?.photo, doctor?.image, doctor?.avatar]
  );
  const [index, setIndex] = useState(0);
  const src = candidates[index] || null;

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#1A4A55]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={() => setIndex((i) => i + 1)}
        />
      ) : (
        <div className="absolute inset-0 flex items-end bg-gradient-to-br from-[#0B6E99] via-[#17618E] to-[#073B4C] p-5">
          <span className="text-[40px] font-bold text-white/90">
            {initialsFromName(doctor?.name)}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#041E28]/90 via-[#041E28]/20 to-transparent" />
    </div>
  );
}

export function DoctorCard({ doctor, consultType = null, hospitalContext = null, variant = "vertical" }) {
  const router = useRouter();
  const [showBookModal, setShowBookModal] = useState(false);
  const isOnlineTab = consultType === "online";
  const candidates = useMemo(
    () => photoCandidates(doctor),
    [doctor?.photo, doctor?.image, doctor?.avatar]
  );
  const [index, setIndex] = useState(0);

  const allOptions = useMemo(
    () => buildDoctorConsultOptions(doctor, { hospitalContext }),
    [doctor, hospitalContext]
  );
  const options = useMemo(
    () => filterConsultOptions(allOptions, consultType),
    [allOptions, consultType]
  );
  const onlineOption = options.find((o) => o.type === "online");
  const inPersonOptions = options.filter((o) => o.type === "in_person");
  const bookableOptions = isOnlineTab
    ? onlineOption
      ? [onlineOption]
      : []
    : consultType === "in_person"
      ? inPersonOptions
      : options.length
        ? options
        : onlineOption
          ? [onlineOption]
          : inPersonOptions;

  const profileHref = `/doctors/${doctor.id}${
    consultType ? `?consult=${consultType}` : ""
  }${
    hospitalContext
      ? `${consultType ? "&" : "?"}hospital=${hospitalContext}`
      : ""
  }`;

  const startBooking = (option) => {
    router.push(buildBookQuery(doctor.id, option, hospitalContext));
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookableOptions.length > 1) {
      setShowBookModal(true);
      return;
    }
    if (bookableOptions[0]) {
      startBooking(bookableOptions[0]);
    }
  };

  if (variant === "horizontal") {
    const photoSrc = candidates[index] || null;
    const feeDisplay = bookableOptions[0]?.fee || doctor.fee || 2500;

    return (
      <>
        <article className="group bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-4 sm:p-6 text-[var(--color-ink-headline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start gap-4 sm:gap-5 min-w-0 flex-1">
            <Link href={profileHref} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[16px] overflow-hidden shrink-0 border border-[var(--color-neutral-200)] bg-[var(--color-surface-subtle)] block">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={() => setIndex((i) => i + 1)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B6E99] to-[#073B4C] text-white font-bold text-xl">
                  {initialsFromName(doctor?.name)}
                </div>
              )}
              {doctor.online && (
                <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-[var(--color-status-success)] text-white text-[9px] font-bold rounded-full shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Online
                </span>
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <Link href={profileHref} className="hover:text-[var(--color-brand-primary)] transition-colors">
                <h3 className="text-[17px] sm:text-[19px] font-bold text-[var(--color-ink-headline)] leading-tight">
                  {doctor.name}
                </h3>
              </Link>
              <p className="text-[13px] font-semibold text-[var(--color-brand-primary)] mt-0.5">
                {doctor.specialty || "General Physician"}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-[12px] text-[var(--color-neutral-500)]">
                {doctor.experience && (
                  <span className="px-2.5 py-0.5 bg-[var(--color-surface-subtle)] border border-[var(--color-neutral-200)] rounded-md font-medium">
                    {doctor.experience}
                  </span>
                )}
                {doctor.qualifications?.[0] && (
                  <span className="truncate max-w-[200px]">
                    {doctor.qualifications[0]}
                  </span>
                )}
                {typeof doctor.rating === "number" && doctor.rating > 0 && (
                  <span className="inline-flex items-center gap-1 text-[var(--color-ink-headline)] font-semibold">
                    <Star size={13} weight="fill" className="text-[#F2B84B]" />
                    {doctor.rating.toFixed(1)}
                  </span>
                )}
              </div>

              {doctor.hospital && (
                <p className="text-[12px] text-[var(--color-neutral-500)] flex items-center gap-1 mt-2">
                  <Buildings size={13} className="text-[var(--color-brand-primary)] shrink-0" />
                  <span className="truncate">{doctor.hospital}</span>
                </p>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-[var(--color-neutral-200)] pt-3 sm:pt-0 shrink-0 gap-3">
            <div className="text-left sm:text-right">
              <p className="text-[11px] text-[var(--color-neutral-400)] uppercase font-semibold tracking-wider">Fee</p>
              <p className="text-[16px] sm:text-[18px] font-bold text-[var(--color-ink-headline)]">
                PKR {feeDisplay.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBookClick}
                disabled={bookableOptions.length === 0}
                className="inline-flex h-10 px-5 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-primary)] text-[13px] font-bold text-white transition-all hover:bg-[var(--color-brand-dark)] shadow-sm hover:shadow disabled:opacity-40"
              >
                <CalendarBlank size={15} weight="bold" />
                Book Appointment
              </button>
            </div>
          </div>
        </article>

        <BookConsultModal
          doctor={doctor}
          options={bookableOptions}
          open={showBookModal}
          onClose={() => setShowBookModal(false)}
          onSelect={startBooking}
        />
      </>
    );
  }

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-[#062F3D] text-white transition-transform duration-300 hover:-translate-y-1">
        <Link href={profileHref} className="block shrink-0 focus-visible:outline-none">
          <div className="relative">
            <DoctorCover doctor={doctor} />
            <div className="absolute left-3 top-3 z-10">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md ${
                  doctor.online
                    ? "bg-[#16A9E0] text-white"
                    : "bg-white/95 text-[#073B4C]"
                }`}
              >
                {doctor.online ? (
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
            <div className="absolute inset-x-0 bottom-0 z-10 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7DD3C7]">
                {doctor.specialty || "Doctor"}
              </p>
              <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-[18px] font-bold leading-tight tracking-tight text-white sm:text-[19px]">
                {doctor.name}
              </h3>
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          <p className="line-clamp-1 min-h-[1.125rem] text-[12px] text-white/55">
            {doctor.qualifications?.[0] || doctor.hospital || "Available through Medzoos"}
          </p>

          <div className="mt-3 flex min-h-[28px] flex-wrap items-center gap-2 text-[12px] text-white/70">
            {doctor.experience ? (
              <span className="rounded-full bg-white/10 px-2.5 py-1 font-medium">
                {doctor.experience}
              </span>
            ) : null}
            {typeof doctor.rating === "number" && doctor.rating > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
                <Star size={12} weight="fill" className="text-[#F2B84B]" />
                <span className="font-semibold text-white">{doctor.rating.toFixed(1)}</span>
              </span>
            ) : null}
            {doctor.online ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
                <VideoCamera size={12} weight="bold" />
                Video ready
              </span>
            ) : null}
          </div>

          <div className="mt-auto flex gap-2 pt-4">
            <button
              type="button"
              onClick={handleBookClick}
              disabled={bookableOptions.length === 0}
              className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#16A9E0] text-[13px] font-bold text-white transition-colors hover:bg-[#1290c4] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CalendarBlank size={15} weight="bold" />
              Book
            </button>
            <Link
              href={profileHref}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
              aria-label={`View ${doctor.name}`}
            >
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </article>

      <BookConsultModal
        doctor={doctor}
        options={bookableOptions}
        open={showBookModal}
        onClose={() => setShowBookModal(false)}
        onSelect={startBooking}
      />
    </>
  );
}
