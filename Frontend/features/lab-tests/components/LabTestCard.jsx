"use client";

import Link from "next/link";
import {
  Clock,
  FileText,
  House,
  ArrowRight,
  Buildings,
} from "@phosphor-icons/react";
import { toast } from "sonner";

function getLabName(test) {
  return (
    test?.labPartner?.name ||
    test?.labPartner?.business_name ||
    test?.lab ||
    null
  );
}

function getLabHref(test) {
  const id = test?.labPartnerId || test?.labPartner?.id;
  return id ? `/lab-tests/labs/${id}` : "/lab-tests";
}

export function LabTestCard({ test, showLabProvider = true }) {
  const price =
    typeof test.price === "number" && !Number.isNaN(test.price) ? test.price : null;
  const href = `/lab-tests/${test.id}`;
  const category = test.category
    ? String(test.category).replace(/_/g, " ")
    : "Lab test";
  const labName = getLabName(test);
  const labHref = getLabHref(test);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-[#062F3D] text-white transition-transform duration-300 hover:-translate-y-1">
      <div className="flex flex-1 flex-col p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-[#16A9E0]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7DD3C7]">
            {category}
          </span>
          {test.homeCollection ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/80">
              <House size={11} weight="fill" />
              Home
            </span>
          ) : null}
        </div>

        <Link href={href} className="mt-4 block focus-visible:outline-none">
          <h3 className="line-clamp-2 min-h-[3.25rem] text-[18px] font-bold leading-snug tracking-tight text-white transition-colors group-hover:text-[#7DD3C7]">
            {test.name}
          </h3>
        </Link>

        {showLabProvider ? (
          <Link
            href={labHref}
            className="mt-3 flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/10 px-3 py-2.5 transition-colors hover:bg-white/15"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#16A9E0]/25 text-[#7DD3C7]">
              <Buildings size={18} weight="duotone" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                Offered by
              </span>
              <span className="mt-0.5 block truncate text-[14px] font-bold text-white">
                {labName || "Participating laboratory"}
              </span>
            </span>
            <ArrowRight size={14} className="shrink-0 text-white/50" weight="bold" />
          </Link>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80">
            <Clock size={12} weight="bold" />
            {test.collectionTime || "As scheduled"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80">
            <FileText size={12} weight="bold" />
            {test.reportTime || "After processing"}
          </span>
        </div>

        {test.testsIncluded ? (
          <p className="mt-4 text-[12px] font-medium text-white/45">
            {test.testsIncluded} tests included
          </p>
        ) : (
          <p className="mt-4 text-[12px] font-medium text-white/45">Diagnostic test</p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 bg-black/20 px-5 py-3.5">
        <div className="min-w-0 flex-1">
          {price != null ? (
            <p className="truncate text-[18px] font-bold tracking-tight text-white">
              PKR {price.toLocaleString()}
            </p>
          ) : (
            <p className="text-[13px] font-semibold text-white/60">View details</p>
          )}
        </div>

        <Link
          href={href}
          className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[#16A9E0] px-5 text-[13px] font-bold text-white transition-colors hover:bg-[#1290c4] shadow-sm"
        >
          Book Now
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
    </article>
  );
}
