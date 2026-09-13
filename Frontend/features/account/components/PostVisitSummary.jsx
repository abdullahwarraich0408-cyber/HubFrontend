"use client";

import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import { VisitDocumentsSection } from "@/features/account/components/VisitDocumentsSection";
import {
  formatFollowUpStatusLabel,
  formatPaymentLabel,
  normalizeMode,
} from "@/lib/appointmentJourney";
import { shortPatientSummary } from "@/lib/patientVisibleSummary";

export function PostVisitSummary({
  appointment,
  followUp,
  onViewPrescription,
  onBookFollowUp,
  onViewFollowUpAppointment,
}) {
  if (!appointment || appointment.status !== "completed") return null;

  const mode = normalizeMode(appointment);
  const diagnosis =
    appointment.raw?.consultation?.diagnosis ||
    appointment.prescription?.diagnosis ||
    null;
  const summary = shortPatientSummary(
    appointment.raw?.consultation?.clinical_notes ||
      appointment.consultationNotes ||
      appointment.raw?.consultation_notes,
  );
  const hasRx = Boolean(appointment.prescription);

  return (
    <div className="mt-4 p-4 rounded-[12px] border border-teal-200 bg-teal-50/40 space-y-4">
      <div>
        <h4 className="text-[14px] font-bold text-ink-headline">Visit Summary</h4>
        <p className="text-[13px] text-neutral-600 mt-1">
          {appointment.doctorName} · {appointment.specialty || "Doctor"} · {appointment.date} ·{" "}
          {mode === "in_person" ? "In-clinic" : "Online"}
        </p>
        <p className="text-[12px] text-neutral-500 mt-1">Payment: {formatPaymentLabel(appointment)}</p>
      </div>

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wide text-neutral-500 mb-1">
          Clinical Summary
        </p>
        {diagnosis || summary ? (
          <div className="text-[13px] text-neutral-700 space-y-1">
            {diagnosis ? (
              <p>
                <span className="font-semibold">Diagnosis:</span> {diagnosis}
              </p>
            ) : null}
            {summary ? <p>{summary}</p> : null}
          </div>
        ) : (
          <p className="text-[13px] text-neutral-500">
            Your visit summary will appear here after the consultation is completed.
          </p>
        )}
      </div>

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wide text-neutral-500 mb-2">
          Prescription
        </p>
        {hasRx ? (
          <Button variant="secondary" size="sm" onClick={() => onViewPrescription?.(appointment)}>
            Prescription Ready — View Prescription
          </Button>
        ) : (
          <p className="text-[13px] text-neutral-500">No prescription issued for this visit yet.</p>
        )}
      </div>

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wide text-neutral-500 mb-2">
          Visit Documents
        </p>
        <VisitDocumentsSection appointmentId={appointment.id} compact />
      </div>

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wide text-neutral-500 mb-2">
          Follow-up
        </p>
        {!followUp ? (
          <p className="text-[13px] text-neutral-500">No follow-up has been recommended.</p>
        ) : (
          <div className="space-y-2">
            <Badge
              variant={
                followUp.status === "needs_rebooking" || followUp.status === "overdue"
                  ? "danger"
                  : followUp.status === "booked"
                    ? "success"
                    : "info"
              }
            >
              {formatFollowUpStatusLabel(followUp.status)}
            </Badge>
            <p className="text-[13px] text-neutral-700">
              Recommended {followUp.recommended_date || followUp.recommendedDate || "—"}
              {followUp.reason ? ` · ${followUp.reason}` : ""}
            </p>
            {followUp.status === "booked" && followUp.booked_appointment_id ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onViewFollowUpAppointment?.(followUp)}
              >
                View Appointment
              </Button>
            ) : null}
            {["planned", "notified", "overdue"].includes(followUp.status) ? (
              <Button size="sm" onClick={() => onBookFollowUp?.(followUp)}>
                Book Follow-up
              </Button>
            ) : null}
            {followUp.status === "needs_rebooking" ? (
              <Button size="sm" onClick={() => onBookFollowUp?.(followUp)}>
                Choose New Time
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
