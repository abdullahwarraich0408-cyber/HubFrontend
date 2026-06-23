"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Buildings, MapPin, Phone, Envelope, ArrowLeft } from "@phosphor-icons/react";
import { DoctorCard } from "@/features/doctors/components/DoctorCard";
import { ConsultTypeTabs } from "@/features/doctors/components/ConsultTypeTabs";
import { useHospitalDoctors } from "@/lib/hooks/useApi";

function parseConsultType(value) {
  if (value === "online" || value === "in_person") return value;
  return "in_person";
}

function HospitalHeader({ hospital }) {
  return (
    <div className="bg-white rounded-[24px] border border-[var(--color-neutral-200)] overflow-hidden mb-6">
      <div className="relative h-[180px] md:h-[220px]">
        <Image src={hospital.coverImage} alt={hospital.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        <div className="absolute bottom-6 left-6 right-6 flex items-end gap-4">
          <div className="w-20 h-20 rounded-[16px] overflow-hidden border-2 border-white bg-white shrink-0">
            <Image src={hospital.logo} alt={hospital.name} width={80} height={80} className="object-cover w-full h-full" />
          </div>
          <div className="text-white min-w-0">
            <h1 className="text-[24px] md:text-[32px] font-bold truncate">{hospital.name}</h1>
            {hospital.city && (
              <p className="text-[13px] text-white/85 flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {hospital.address ? `${hospital.address}, ${hospital.city}` : hospital.city}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {hospital.description && (
          <p className="text-[14px] text-[var(--color-neutral-600)] leading-relaxed mb-4">
            {hospital.description}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-[13px] text-[var(--color-neutral-600)]">
          {hospital.phone && (
            <span className="inline-flex items-center gap-2">
              <Phone size={16} className="text-[var(--color-brand-primary)]" />
              {hospital.phone}
            </span>
          )}
          {hospital.email && (
            <span className="inline-flex items-center gap-2">
              <Envelope size={16} className="text-[var(--color-brand-primary)]" />
              {hospital.email}
            </span>
          )}
          <span className="inline-flex items-center gap-2">
            <Buildings size={16} className="text-[var(--color-brand-primary)]" />
            {hospital.doctorCount} doctors
          </span>
        </div>
      </div>
    </div>
  );
}

export function HospitalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSpecialty, setActiveSpecialty] = useState("all");

  const consultType = parseConsultType(searchParams.get("consult"));
  const hospitalId = params.id;

  const { data, isLoading, isError } = useHospitalDoctors(hospitalId);
  const hospital = data?.hospital;
  const allDoctors = data?.doctors || [];
  const specialties = data?.specialties || [];

  const onlineCount = useMemo(() => allDoctors.filter((doctor) => doctor.online).length, [allDoctors]);

  const filteredDoctors = useMemo(() => {
    let result = allDoctors;
    if (consultType === "online") {
      result = result.filter((doctor) => doctor.online);
    }
    if (activeSpecialty !== "all") {
      result = result.filter((doctor) => doctor.specialty === activeSpecialty);
    }
    return result;
  }, [allDoctors, activeSpecialty, consultType]);

  const consultLabel = consultType === "online" ? "online consult" : "in-clinic visit";

  const handleConsultChange = (nextConsultType) => {
    router.replace(`/hospitals/${hospitalId}?consult=${nextConsultType}`);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-20 text-center">
        <p className="text-[var(--color-neutral-500)]">Loading hospital...</p>
      </div>
    );
  }

  if (isError || !hospital) {
    return (
      <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-20 text-center">
        <p className="text-[var(--color-neutral-500)] mb-4">Hospital not found</p>
        <Link href="/hospitals" className="text-[var(--color-brand-primary)] font-semibold">
          Back to Hospitals
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-6 md:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
        <Link
          href="/hospitals"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-brand-primary)] mb-4"
        >
          <ArrowLeft size={16} />
          All Hospitals
        </Link>

        <HospitalHeader hospital={hospital} />

        <ConsultTypeTabs
          value={consultType}
          onChange={handleConsultChange}
          onlineCount={onlineCount}
          disableOnline={onlineCount === 0}
          className="mb-6"
        />

        <div className="mb-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
            <h2 className="text-[20px] font-bold text-[var(--color-ink-headline)]">Select specialty</h2>
            <p className="text-[13px] text-[var(--color-neutral-500)]">
              <span className="font-semibold text-[var(--color-ink-headline)]">{filteredDoctors.length}</span>{" "}
              doctors for {consultLabel}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveSpecialty("all")}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold border ${
                activeSpecialty === "all"
                  ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]"
                  : "bg-white text-[var(--color-neutral-600)] border-[var(--color-neutral-200)]"
              }`}
            >
              All
            </button>
            {specialties.map((specialty) => (
              <button
                key={specialty}
                type="button"
                onClick={() => setActiveSpecialty(specialty)}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold border ${
                  activeSpecialty === specialty
                    ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]"
                    : "bg-white text-[var(--color-neutral-600)] border-[var(--color-neutral-200)]"
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                consultType={consultType}
                hospitalContext={hospital.id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[16px] border border-[var(--color-neutral-200)] p-10 text-center">
            <p className="text-[16px] font-bold mb-2">
              {consultType === "online"
                ? "No doctors available for online consult"
                : "No doctors in this category yet"}
            </p>
            <p className="text-[14px] text-[var(--color-neutral-500)]">
              {consultType === "online"
                ? "Switch to the In-Person tab or choose another specialty."
                : "Try another specialty or check back later."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
