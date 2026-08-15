"use client";

import Link from "next/link";
import {
  ArrowLeft,
  House,
  MapPin,
  Clock,
  ShoppingCart,
} from "@phosphor-icons/react";
import { useLab } from "@/lib/hooks/useApi";
import { mapLabToFrontend, mapLabTestsToFrontend } from "@/lib/mappers/labTest";
import { LabTestCard } from "../components/LabTestCard";

export function LabDetailPage({ labId }) {
  const { data: rawLab, isLoading } = useLab(labId);
  const lab = mapLabToFrontend(rawLab);
  const tests = mapLabTestsToFrontend(rawLab?.lab_tests || []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F0F4F8]">
        <div className="home-container mx-auto py-8 md:py-10">
          <div className="h-48 animate-pulse rounded-[28px] bg-[#D7E2EA]" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[280px] animate-pulse rounded-[24px] bg-[#D7E2EA]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="min-h-screen w-full bg-[#F0F4F8]">
        <div className="home-container mx-auto py-16 text-center">
          <p className="text-[18px] font-bold text-[#102A43]">Lab not found</p>
          <Link
            href="/lab-tests"
            className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-[#0B6E99]"
          >
            <ArrowLeft size={16} /> Back to labs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8]">
      <div className="home-container mx-auto py-8 md:py-10 lg:py-12">
        <Link
          href="/lab-tests"
          className="mb-6 inline-flex items-center gap-2 text-[14px] font-semibold text-[#627D98] transition-colors hover:text-[#0B6E99]"
        >
          <ArrowLeft size={16} weight="bold" />
          Back to lab offers
        </Link>

        <div className="relative mb-8 overflow-hidden rounded-[28px] bg-[#0B6E99] px-6 py-8 text-white md:rounded-[32px] md:px-10 md:py-10">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#7DD3C7]/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />

          <p className="relative inline-flex max-w-full truncate rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
            {lab.name}
          </p>
          <h1 className="relative mt-4 max-w-3xl text-[clamp(1.85rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-white">
            Tests from {lab.name}
          </h1>
          {lab.bio ? (
            <p className="relative mt-3 max-w-2xl text-[15px] leading-relaxed text-white/65">
              {lab.bio}
            </p>
          ) : null}

          <div className="relative mt-6 flex flex-wrap gap-2">
            {(lab.city || lab.address) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/85">
                <MapPin size={13} weight="fill" />
                {lab.city || lab.address}
              </span>
            )}
            {lab.homeCollection ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/85">
                <House size={13} weight="fill" />
                Home collection
              </span>
            ) : null}
            {lab.operatingHours ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/85">
                <Clock size={13} weight="bold" />
                {lab.operatingHours}
              </span>
            ) : null}
            <span className="rounded-full bg-[#16A9E0]/25 px-3 py-1.5 text-[12px] font-bold text-[#7DD3C7]">
              {tests.length} {tests.length === 1 ? "test" : "tests"}
            </span>
          </div>

          <div className="relative mt-6">
            <Link
              href="/lab-tests/cart"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-white/15"
            >
              <ShoppingCart size={15} weight="bold" />
              View cart
            </Link>
          </div>
        </div>

        <section>
          <div className="mb-5">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#0B6E99]">
              Available from {lab.name}
            </p>
            <h2 className="mt-1 text-[20px] font-bold tracking-tight text-[#102A43]">
              All tests
            </h2>
          </div>

          {tests.length > 0 ? (
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tests.map((test) => (
                <LabTestCard
                  key={test.id}
                  test={{
                    ...test,
                    lab: lab.name,
                    labPartner: { id: lab.id, name: lab.name },
                    labPartnerId: lab.id,
                  }}
                  showLabProvider={false}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#102A43]/15 bg-white px-5 py-14 text-center">
              <p className="text-[18px] font-bold text-[#102A43]">No tests listed yet</p>
              <p className="mt-1 text-[14px] text-[#627D98]">
                Check back soon or browse other labs.
              </p>
              <Link
                href="/lab-tests"
                className="mt-4 inline-flex rounded-full bg-[#062F3D] px-5 py-2.5 text-[13px] font-bold text-white"
              >
                Back to labs
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
