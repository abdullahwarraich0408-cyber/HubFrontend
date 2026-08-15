"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, VideoCamera, Buildings } from "@phosphor-icons/react";

export function PsychologistCard({ doctor }) {
  const href = doctor.id ? `/doctors/${doctor.id}` : "/doctors?specialty=psychologist";
  const bookHref = doctor.id
    ? `/doctors/${doctor.id}?tab=book`
    : "/doctors?specialty=psychologist";

  return (
    <article className="flex h-full flex-col rounded-[20px] border border-[#102A43]/08 bg-white p-4 shadow-[0_4px_16px_rgba(16,42,67,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,42,67,0.08)] md:p-5">
      <div className="flex gap-3">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-[#F1F7FA]">
          <Image
            src={doctor.photo || doctor.image}
            alt={doctor.name}
            fill
            className="object-cover object-top"
            sizes="72px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-[#102A43]">
            {doctor.name}
          </h3>
          <p className="mt-0.5 truncate text-[13px] text-[#627D98]">
            {doctor.specialty || "Psychologist"}
          </p>
          {typeof doctor.rating === "number" && doctor.rating > 0 ? (
            <div className="mt-1.5 flex items-center gap-1">
              <Star size={13} weight="fill" className="text-[#F2B84B]" />
              <span className="text-[12px] font-semibold text-[#102A43]">
                {doctor.rating.toFixed(1)}
              </span>
              {doctor.reviews ? (
                <span className="text-[12px] text-[#627D98]">({doctor.reviews})</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {doctor.online ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF7F5] px-2.5 py-1 text-[11px] font-medium text-[#0B6E99]">
            <VideoCamera size={12} /> Online
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F7FA] px-2.5 py-1 text-[11px] font-medium text-[#627D98]">
          <Buildings size={12} /> In clinic
        </span>
        {doctor.experienceYears ? (
          <span className="rounded-full bg-[#F1F7FA] px-2.5 py-1 text-[11px] font-medium text-[#627D98]">
            {doctor.experienceYears}+ yrs
          </span>
        ) : null}
      </div>

      {typeof doctor.fee === "number" ? (
        <p className="mt-3 text-[14px] font-semibold text-[#102A43]">
          From PKR {doctor.fee.toLocaleString()}
        </p>
      ) : null}

      <div className="mt-auto flex gap-2 pt-4">
        <Link
          href={href}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[#102A43]/12 text-[13px] font-semibold text-[#102A43] transition-colors hover:bg-[#F1F7FA]"
        >
          View Profile
        </Link>
        <Link
          href={bookHref}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-[#0B6E99] text-[13px] font-semibold text-white transition-colors hover:bg-[#073B4C]"
        >
          Book
        </Link>
      </div>
    </article>
  );
}

export function PsychologistsSection({ doctors = [], isLoading, isError, onRetry }) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold text-[#102A43]">
            Talk to a psychologist who understands
          </h2>
          <p className="mt-1.5 max-w-xl text-[15px] text-[#627D98]">
            Explore mental health professionals for anxiety, stress, depression and
            emotional wellbeing.
          </p>
        </div>
        <Link
          href="/doctors?specialty=psychologist"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0B6E99] hover:underline"
        >
          View All Psychologists <ArrowRight size={14} weight="bold" />
        </Link>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {["Online", "In Clinic", "Anxiety", "Depression", "Stress"].map((filter) => (
          <Link
            key={filter}
            href={`/doctors?specialty=psychologist&q=${encodeURIComponent(filter)}`}
            className="shrink-0 rounded-full border border-[#102A43]/10 bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#334E68] transition-colors hover:border-[#0B6E99]/30 hover:text-[#0B6E99]"
          >
            {filter}
          </Link>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[220px] animate-pulse rounded-[20px] bg-[#E8EEF2]" />
          ))}
        </div>
      ) : isError ? (
        <SectionError message="We couldn't load psychologists right now." onRetry={onRetry} />
      ) : doctors.length === 0 ? (
        <EmptyPanel
          title="Psychologists will appear here"
          description="Browse available mental health professionals when they're listed on Medzoos."
          actionHref="/doctors?specialty=psychologist"
          actionLabel="Browse Psychologists"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.slice(0, 3).map((doctor) => (
            <PsychologistCard key={doctor.id || doctor.name} doctor={doctor} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyPanel({ title, description, actionHref, actionLabel }) {
  return (
    <div className="rounded-[20px] border border-dashed border-[#102A43]/12 bg-white px-5 py-8 text-center">
      <p className="text-[15px] font-semibold text-[#102A43]">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-[14px] text-[#627D98]">{description}</p>
      <Link
        href={actionHref}
        className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#0B6E99] px-4 text-[13px] font-semibold text-white hover:bg-[#073B4C]"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function SectionError({ message, onRetry }) {
  return (
    <div className="rounded-[20px] border border-[#102A43]/08 bg-white px-5 py-8 text-center">
      <p className="text-[14px] text-[#627D98]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex h-10 items-center rounded-xl border border-[#102A43]/12 px-4 text-[13px] font-semibold text-[#102A43] hover:bg-[#F1F7FA]"
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}
