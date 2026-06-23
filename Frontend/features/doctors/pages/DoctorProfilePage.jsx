"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  CaretRight,
  Star,
  VideoCamera,
  Translate,
  Buildings,
  User,
} from "@phosphor-icons/react";
import { AppointmentFlow, buildBookQuery } from "../components/AppointmentFlow";
import { DoctorBookingSidebar } from "../components/DoctorBookingSidebar";
import { DoctorSlotPicker } from "../components/DoctorSlotPicker";
import { buildDoctorConsultOptions } from "../utils/consultOptions";
import { getDoctorById, MOCK_DOCTOR_REVIEWS } from "../data/mockDoctors";
import { useDoctor, useDoctorReviews } from "@/lib/hooks/useApi";

const TABS = [
  { id: "about", label: "About" },
  { id: "reviews", label: "Reviews" },
  { id: "availability", label: "Availability" },
];

export function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: apiDoctor, isLoading } = useDoctor(params.id);
  const { data: apiReviews = [] } = useDoctorReviews(params.id);
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [bookingSlot, setBookingSlot] = useState(null);
  const mockDoctor = getDoctorById(params.id);
  const doctor = apiDoctor || mockDoctor;
  const reviews = apiReviews.length > 0 ? apiReviews : MOCK_DOCTOR_REVIEWS;

  const [activeTab, setActiveTab] = useState("about");
  const consultParam = searchParams.get("consult");
  const hospitalParam = searchParams.get("hospital");
  const isBooking = searchParams.get("tab") === "book";
  const initialConsultType =
    consultParam === "in_person" ? "in_person" : consultParam === "online" ? "online" : null;
  const hospitalBackHref = hospitalParam
    ? `/hospitals/${hospitalParam}${initialConsultType ? `?consult=${initialConsultType}` : ""}`
    : null;
  const consultLabel =
    initialConsultType === "online"
      ? "Online Consult"
      : initialConsultType === "in_person"
        ? "In-Clinic"
        : null;

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "book") return;
    if (tab && TABS.some((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleBookOption = (option) => {
    router.push(buildBookQuery(params.id, option, hospitalParam));
  };

  if (isLoading && !doctor) {
    return (
      <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-20 text-center">
        <p className="text-[var(--color-neutral-500)]">Loading doctor profile...</p>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case "reviews":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-6 p-5 bg-[var(--color-surface-subtle)] rounded-[12px]">
              <div className="text-center">
                <p className="text-[36px] font-bold text-[var(--color-ink-headline)]">{doctor.rating}</p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} weight="fill" className="text-[var(--color-rating)]" />
                  ))}
                </div>
                <p className="text-[12px] text-[var(--color-neutral-500)] mt-1">{doctor.reviews} reviews</p>
              </div>
            </div>
            {reviews.map((review) => (
              <div key={review.id || review.author} className="p-4 border border-[var(--color-neutral-200)] rounded-[12px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-light)] flex items-center justify-center">
                      <User size={16} className="text-[var(--color-brand-primary)]" />
                    </div>
                    <span className="text-[13px] font-bold">{review.author}</span>
                  </div>
                  <span className="text-[11px] text-[var(--color-neutral-400)]">{review.date}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={12} weight="fill" className="text-[var(--color-rating)]" />
                  ))}
                </div>
                <p className="text-[13px] text-[var(--color-neutral-600)] leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        );

      case "availability":
        return (
          <DoctorSlotPicker
            doctorId={params.id}
            selectedDate={bookingDate}
            selectedSlot={bookingSlot}
            onDateChange={setBookingDate}
            onSlotChange={(slot) => {
              setBookingSlot(slot);
              if (slot) {
                const options = buildDoctorConsultOptions(doctor, { hospitalContext: hospitalParam });
                const option =
                  options.find((o) => o.type === (initialConsultType || "in_person")) || options[0];
                if (option) handleBookOption(option);
              }
            }}
            variant="oladoc"
          />
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-[15px] font-bold text-[var(--color-ink-headline)] mb-2">About</h3>
              <p className="text-[14px] text-[var(--color-neutral-600)] leading-relaxed">{doctor.about}</p>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[var(--color-ink-headline)] mb-2">Qualifications</h3>
              <ul className="space-y-2">
                {doctor.qualifications.map((q) => (
                  <li key={q} className="flex items-center gap-2 text-[14px] text-[var(--color-neutral-600)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[var(--color-neutral-600)]">
              <Buildings size={18} className="text-[var(--color-brand-primary)]" />
              {doctor.hospitalData?.id ? (
                <Link href={`/hospitals/${doctor.hospitalData.id}`} className="text-[var(--color-brand-primary)] font-medium hover:underline">
                  {doctor.hospital}
                </Link>
              ) : (
                <span>{doctor.hospital}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {doctor.languages.map((lang) => (
                <span key={lang} className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-brand-mist)] text-[var(--color-brand-primary)] text-[12px] font-semibold rounded-full">
                  <Translate size={12} />
                  {lang}
                </span>
              ))}
            </div>
          </div>
        );
    }
  };

  if (isBooking) {
    return (
      <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-6 md:py-8">
        <div className="w-full max-w-[900px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 text-[12px] text-[var(--color-neutral-500)] mb-6 flex-wrap">
            <Link href="/" className="hover:text-[var(--color-brand-primary)]">Home</Link>
            <CaretRight size={12} weight="bold" />
            <Link href={`/doctors/${params.id}`} className="hover:text-[var(--color-brand-primary)]">
              {doctor.name}
            </Link>
            <CaretRight size={12} weight="bold" />
            <span className="text-[var(--color-ink-headline)]">Book Appointment</span>
          </div>

          <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-6 md:p-8">
            <AppointmentFlow
              doctor={doctor}
              initialDate={bookingDate}
              initialSlot={bookingSlot}
              initialConsultType={initialConsultType}
              hospitalContext={hospitalParam}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-6 md:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
        <div className="flex items-center gap-2 text-[12px] text-[var(--color-neutral-500)] mb-6 flex-wrap">
          <Link href="/" className="hover:text-[var(--color-brand-primary)]">Home</Link>
          <CaretRight size={12} weight="bold" />
          {hospitalBackHref ? (
            <>
              <Link href="/hospitals" className="hover:text-[var(--color-brand-primary)]">Hospitals</Link>
              <CaretRight size={12} weight="bold" />
              <Link href={hospitalBackHref} className="hover:text-[var(--color-brand-primary)]">
                {doctor.hospitalData?.name || doctor.hospital}
              </Link>
            </>
          ) : (
            <Link href="/doctors" className="hover:text-[var(--color-brand-primary)]">Doctors</Link>
          )}
          {consultLabel && (
            <>
              <CaretRight size={12} weight="bold" />
              <span className="text-[var(--color-neutral-400)]">{consultLabel}</span>
            </>
          )}
          <CaretRight size={12} weight="bold" />
          <span className="text-[var(--color-ink-headline)]">{doctor.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div>
            <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-[20px] overflow-hidden shrink-0 border-2 border-[var(--color-neutral-100)] mx-auto md:mx-0">
                  <Image src={doctor.photo} alt={doctor.name} fill className="object-cover" />
                  {doctor.online && (
                    <span className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-[var(--color-status-success)] text-white text-[10px] font-bold rounded-full">
                      <VideoCamera size={10} weight="fill" />
                      Online
                    </span>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-[24px] md:text-[28px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] mb-1">
                    {doctor.name}
                  </h1>
                  <p className="text-[15px] text-[var(--color-brand-primary)] font-semibold mb-2">{doctor.specialty}</p>
                  <p className="text-[13px] text-[var(--color-neutral-500)] mb-4">
                    {doctor.experience}
                    {" · "}
                    {doctor.hospitalData?.id ? (
                      <Link href={`/hospitals/${doctor.hospitalData.id}`} className="text-[var(--color-brand-primary)] font-medium hover:underline">
                        {doctor.hospital}
                      </Link>
                    ) : (
                      doctor.hospital
                    )}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} weight="fill" className="text-[var(--color-rating)]" />
                      <span className="text-[15px] font-bold">{doctor.rating}</span>
                      <span className="text-[13px] text-[var(--color-neutral-400)]">({doctor.reviews} reviews)</span>
                    </div>
                    <span className="text-[12px] font-semibold text-[var(--color-status-success)]">
                      {Math.round(doctor.rating * 20)}% Satisfied
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] overflow-hidden">
              <div className="flex overflow-x-auto border-b border-[var(--color-neutral-200)] scrollbar-hide">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-4 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                        : "border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-ink-headline)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-6 md:p-8">{renderTab()}</div>
            </div>
          </div>

          <DoctorBookingSidebar
            doctor={doctor}
            hospitalContext={hospitalParam}
            onBookOption={handleBookOption}
          />
        </div>
      </div>
    </div>
  );
}
