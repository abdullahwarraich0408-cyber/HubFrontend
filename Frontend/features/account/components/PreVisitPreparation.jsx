"use client";

import { MapPin, VideoCamera, ChatCircleText, Clock } from "@phosphor-icons/react";
import { VisitDocumentsSection } from "@/features/account/components/VisitDocumentsSection";
import { formatPaymentLabel, normalizeMode } from "@/lib/appointmentJourney";

export function PreVisitPreparation({ appointment }) {
  if (!appointment) return null;
  const status = String(appointment.status || "").toLowerCase();
  if (!["confirmed", "checked_in"].includes(status)) return null;

  const mode = normalizeMode(appointment);
  const hospital =
    appointment.hospital ||
    appointment.raw?.hospital?.name ||
    appointment.raw?.doctor?.hospital ||
    null;
  const address =
    appointment.clinicAddress ||
    appointment.raw?.hospital?.address ||
    appointment.raw?.doctor?.practice_locations?.[0]?.address ||
    null;

  if (mode === "in_person") {
    return (
      <div className="mt-4 p-4 rounded-[12px] border border-amber-200 bg-amber-50/60 space-y-3">
        <h4 className="text-[14px] font-bold text-ink-headline">Prepare for Your Clinic Visit</h4>
        <ul className="text-[13px] text-neutral-700 space-y-1.5">
          <li className="flex gap-2">
            <Clock size={16} className="mt-0.5 shrink-0 text-amber-700" />
            <span>
              {appointment.date} · {appointment.slot}. Arrive 10–15 minutes early.
            </span>
          </li>
          {(hospital || address) && (
            <li className="flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-amber-700" />
              <span>
                {hospital ? <strong>{hospital}</strong> : null}
                {hospital && address ? " · " : null}
                {address || "Ask reception for directions on arrival."}
              </span>
            </li>
          )}
          <li>
            Upload any lab reports, scans, or previous prescriptions you want your doctor to review
            before your visit.
          </li>
          <li>
            Payment: <strong>{formatPaymentLabel(appointment)}</strong>
          </li>
        </ul>
        <VisitDocumentsSection appointmentId={appointment.id} compact />
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 rounded-[12px] border border-sky-200 bg-sky-50/60 space-y-3">
      <h4 className="text-[14px] font-bold text-ink-headline">Prepare for Your Consultation</h4>
      <ul className="text-[13px] text-neutral-700 space-y-1.5">
        <li className="flex gap-2">
          <Clock size={16} className="mt-0.5 shrink-0 text-sky-700" />
          <span>
            {appointment.date} · {appointment.slot}
          </span>
        </li>
        <li className="flex gap-2">
          <ChatCircleText size={16} className="mt-0.5 shrink-0 text-sky-700" />
          <span>
            Chat:{" "}
            {appointment.canChat || appointment.canViewChat
              ? "Available for this visit"
              : "Opens closer to your appointment time"}
          </span>
        </li>
        <li className="flex gap-2">
          <VideoCamera size={16} className="mt-0.5 shrink-0 text-sky-700" />
          <span>
            Join video:{" "}
            {appointment.canJoin
              ? "You can join now"
              : "Join becomes available in the allowed time window"}
          </span>
        </li>
        <li>
          Device tip: use a quiet space, allow camera and microphone permissions, and check your
          internet connection before joining.
        </li>
      </ul>
      <VisitDocumentsSection appointmentId={appointment.id} compact />
    </div>
  );
}
