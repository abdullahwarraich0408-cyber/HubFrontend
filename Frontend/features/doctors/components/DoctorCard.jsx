"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, VideoCamera, Calendar } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { ConsultOptionRow } from "./ConsultOptionRow";
import { BookConsultModal } from "./BookConsultModal";
import { buildDoctorConsultOptions, filterConsultOptions } from "../utils/consultOptions";
import { buildBookQuery } from "./AppointmentFlow";

export function DoctorCard({ doctor, consultType = null, hospitalContext = null }) {
  const router = useRouter();
  const [showBookModal, setShowBookModal] = useState(false);
  const isOnlineTab = consultType === "online";

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
  const displayOptions = isOnlineTab ? (onlineOption ? [onlineOption] : []) : inPersonOptions;
  const bookableOptions = isOnlineTab ? (onlineOption ? [onlineOption] : []) : inPersonOptions;

  const profileHref = `/doctors/${doctor.id}${consultType ? `?consult=${consultType}` : ""}${hospitalContext ? `${consultType ? "&" : "?"}hospital=${hospitalContext}` : ""}`;

  const startBooking = (option) => {
    router.push(buildBookQuery(doctor.id, option, hospitalContext));
  };

  const handleBookClick = () => {
    if (bookableOptions.length > 1) {
      setShowBookModal(true);
      return;
    }
    if (bookableOptions[0]) {
      startBooking(bookableOptions[0]);
    }
  };

  return (
    <>
      <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] overflow-hidden hover:border-[var(--color-brand-primary)]/30 hover:shadow-[0_8px_24px_-8px_rgba(11,110,114,0.12)] transition-all">
        <div className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-4 flex-1 min-w-0">
              <Link
                href={profileHref}
                className="relative w-[88px] h-[88px] md:w-24 md:h-24 rounded-[14px] overflow-hidden shrink-0 border-2 border-[var(--color-neutral-100)]"
              >
                <Image src={doctor.photo} alt={doctor.name} fill className="object-cover" />
                {doctor.online && (
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-[var(--color-status-success)] rounded-full border-2 border-white" />
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={profileHref}>
                  <h3 className="text-[16px] md:text-[17px] font-bold text-[var(--color-ink-headline)] hover:text-[var(--color-brand-primary)] transition-colors">
                    {doctor.name}
                  </h3>
                </Link>
                <p className="text-[13px] text-[var(--color-brand-primary)] font-semibold mt-0.5">
                  {doctor.specialty}
                </p>
                <p className="text-[12px] text-[var(--color-neutral-500)] mt-1 line-clamp-2">
                  {doctor.qualifications?.[0] || doctor.hospital}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-[12px]">
                  <span className="font-semibold text-[var(--color-ink-headline)]">{doctor.experience}</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} weight="fill" className="text-[var(--color-rating)]" />
                    <span className="font-bold">{doctor.rating}</span>
                    <span className="text-[var(--color-neutral-400)]">({doctor.reviews} Reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col gap-2 md:w-[180px] shrink-0 md:items-stretch">
              {isOnlineTab && onlineOption && (
                <Button
                  variant="secondary"
                  className="h-[40px] text-[12px] flex-1 md:flex-none border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                  onClick={() => startBooking(onlineOption)}
                >
                  <VideoCamera size={16} className="mr-1.5" weight="fill" />
                  Video Consultation
                </Button>
              )}
              <Button
                className="h-[44px] text-[13px] flex-1 md:flex-none"
                onClick={handleBookClick}
                disabled={bookableOptions.length === 0}
              >
                <Calendar size={16} className="mr-1.5" />
                Book Appointment
              </Button>
            </div>
          </div>

          {displayOptions.length > 0 && (
            <div className="mt-4 space-y-2">
              {displayOptions.map((option) => (
                <ConsultOptionRow
                  key={option.id}
                  option={option}
                  compact
                  onClick={startBooking}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
