"use client";

import Link from "next/link";
import { CalendarCheck, Stethoscope } from "@phosphor-icons/react";
import { usePatientFollowUps } from "@/lib/hooks/useApi";
import { Button } from "@/shared/components/Button";
import { formatFollowUpStatusLabel } from "@/lib/appointmentJourney";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function FollowUpRecommendedCard() {
  const { data: followUps = [], isLoading } = usePatientFollowUps({
    status: "planned",
  });

  const active = (followUps || []).filter(
    (f) =>
      !f.booked_appointment_id &&
      ["planned", "notified", "needs_rebooking", "overdue"].includes(f.status),
  );

  if (isLoading || active.length === 0) return null;

  // Prefer needs_rebooking so rebooking urgency is visible on home
  const item =
    active.find((f) => f.status === "needs_rebooking") ||
    active.find((f) => f.status === "overdue") ||
    active[0];
  const doctorName = item.doctor?.name
    ? `Dr. ${item.doctor.name.replace(/^Dr\.?\s*/i, "")}`
    : "Your doctor";
  const needsRebooking = item.status === "needs_rebooking";

  return (
    <section className="home-container mx-auto mb-8 md:mb-10">
      <div
        className={`rounded-[20px] border p-5 md:p-6 shadow-sm ${
          needsRebooking
            ? "border-amber-300 bg-gradient-to-br from-amber-50 to-white"
            : "border-teal-200 bg-gradient-to-br from-teal-50 to-white"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              needsRebooking ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-700"
            }`}
          >
            <CalendarCheck size={24} weight="fill" />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-[12px] font-bold uppercase tracking-wide mb-1 ${
                needsRebooking ? "text-amber-800" : "text-teal-700"
              }`}
            >
              {formatFollowUpStatusLabel(item.status)}
            </p>
            <h3 className="text-[18px] md:text-[20px] font-bold text-ink-headline">
              {needsRebooking ? "Follow-up Needs Rebooking" : doctorName}
              {!needsRebooking && item.doctor?.specialty ? (
                <span className="text-neutral-500 font-medium text-[14px] ml-2">
                  {item.doctor.specialty}
                </span>
              ) : null}
            </h3>
            {needsRebooking ? (
              <p className="text-[14px] text-neutral-600 mt-1">
                {doctorName}
                {item.doctor?.specialty ? ` · ${item.doctor.specialty}` : ""}. Your previous
                follow-up was cancelled or missed — the recommendation is still active.
              </p>
            ) : (
              <p className="text-[14px] text-neutral-600 mt-1">
                Recommended around <strong>{formatDate(item.recommended_date)}</strong>
                {item.booking_window?.from && item.booking_window?.to ? (
                  <span className="text-neutral-500">
                    {" "}
                    · Book between {formatDate(item.booking_window.from)} –{" "}
                    {formatDate(item.booking_window.to)}
                  </span>
                ) : null}
              </p>
            )}
            {(item.reason || item.notes) && (
              <p className="text-[13px] text-neutral-500 mt-2 line-clamp-2 flex items-start gap-1.5">
                <Stethoscope size={16} className="mt-0.5 shrink-0" />
                <span>{item.reason || item.notes}</span>
              </p>
            )}
            {active.length > 1 && (
              <p className={`text-[12px] mt-2 font-medium ${needsRebooking ? "text-amber-800" : "text-teal-700"}`}>
                +{active.length - 1} more follow-up{active.length > 2 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/account/appointments?tab=follow-ups&book=${item.id}`}>
              <Button>{needsRebooking ? "Choose New Time" : "Book Follow-up"}</Button>
            </Link>
            <Link href="/account/appointments?tab=follow-ups">
              <Button variant="secondary">View all</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
