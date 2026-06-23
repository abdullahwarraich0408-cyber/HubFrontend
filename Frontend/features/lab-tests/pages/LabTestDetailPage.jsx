"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CaretRight, Flask, Clock, FileText, House, Check } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { LabBookingFlow } from "../components/LabBookingFlow";
import { getLabTestById } from "../data/mockLabTests";
import { useLabTest } from "@/lib/hooks/useApi";

export function LabTestDetailPage() {
  const params = useParams();
  const { data: apiTest, isLoading } = useLabTest(params.id);
  const mockTest = getLabTestById(params.id);
  const test = apiTest || mockTest;

  if (isLoading && !test) {
    return (
      <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-20 text-center">
        <p className="text-[var(--color-neutral-500)]">Loading lab test...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-20 text-center">
        <p className="text-[var(--color-neutral-500)] mb-4">Lab test not found</p>
        <Link href="/lab-tests">
          <Button>Browse Lab Tests</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-surface-subtle)] min-h-screen py-6 md:py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[80px]">
        <div className="flex items-center gap-2 text-[12px] text-[var(--color-neutral-500)] mb-6">
          <Link href="/" className="hover:text-[var(--color-brand-primary)]">Home</Link>
          <CaretRight size={12} weight="bold" />
          <Link href="/lab-tests" className="hover:text-[var(--color-brand-primary)]">Lab Tests</Link>
          <CaretRight size={12} weight="bold" />
          <span className="text-[var(--color-ink-headline)] truncate max-w-[200px]">{test.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Test info */}
          <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-[14px] bg-[var(--color-brand-mist)] flex items-center justify-center shrink-0">
                <Flask size={28} className="text-[var(--color-brand-primary)]" weight="duotone" />
              </div>
              <div>
                {test.discount && (
                  <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-dark)] text-white rounded-full">
                    {test.discount}
                  </span>
                )}
                <h1 className="text-[22px] md:text-[26px] font-[var(--font-heading)] font-bold text-[var(--color-ink-headline)] leading-tight">
                  {test.name}
                </h1>
                <p className="text-[14px] text-[var(--color-neutral-500)] mt-1">{test.lab}</p>
              </div>
            </div>

            <p className="text-[14px] text-[var(--color-neutral-600)] leading-relaxed mb-6">{test.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-neutral-400)] uppercase mb-1">
                  <Clock size={14} />
                  Collection time
                </div>
                <p className="text-[15px] font-bold text-[var(--color-ink-headline)]">{test.collectionTime}</p>
              </div>
              <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[12px]">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-neutral-400)] uppercase mb-1">
                  <FileText size={14} />
                  Report time
                </div>
                <p className="text-[15px] font-bold text-[var(--color-ink-headline)]">{test.reportTime}</p>
              </div>
            </div>

            <div className="text-[32px] font-bold text-[var(--color-brand-primary)] mb-4">
              PKR {test.price.toLocaleString()}
            </div>

            <p className="text-[13px] text-[var(--color-neutral-500)] mb-4">{test.testsIncluded} parameters included</p>

            {test.homeCollection && (
              <div className="flex items-center gap-3 p-4 bg-[var(--color-brand-mist)] rounded-[12px] border border-[var(--color-brand-light)]">
                <House size={20} className="text-[var(--color-brand-primary)]" weight="fill" />
                <div>
                  <p className="text-[13px] font-bold text-[var(--color-ink-headline)]">Home sample collection included</p>
                  <p className="text-[12px] text-[var(--color-neutral-500)]">Free phlebotomist visit at your address</p>
                </div>
              </div>
            )}

            <ul className="mt-6 space-y-2">
              {["NABL certified lab", "Digital report via email & app", "Free home collection"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[13px] text-[var(--color-neutral-600)]">
                  <Check size={16} className="text-[var(--color-status-success)]" weight="bold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Booking flow */}
          <div className="bg-white rounded-[20px] border border-[var(--color-neutral-200)] p-6 md:p-8">
            <h2 className="text-[18px] font-bold text-[var(--color-ink-headline)] mb-6">Book This Test</h2>
            <LabBookingFlow test={test} />
          </div>
        </div>
      </div>
    </div>
  );
}
