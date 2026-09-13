"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  VideoCamera,
  Star,
  XCircle,
  DownloadSimple,
  ChatCircleText,
  Buildings,
  UploadSimple,
  CreditCard,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import {
  useDoctorAppointments,
  useCancelDoctorAppointment,
  useJoinDoctorConsultation,
  useSelectConsultationMode,
  useSubmitDoctorReview,
  usePatientFollowUps,
} from "@/lib/hooks/useApi";
import { paymentsApi } from "@/lib/api/index";
import { formatDoctorDisplayName } from "@/lib/hooks/useTelehealth";
import { toast } from "sonner";
import { ViewPrescriptionModal } from "@/features/account/components/ViewPrescriptionModal";
import { RescheduleAppointmentModal } from "@/features/account/components/RescheduleAppointmentModal";
import { BookFollowUpModal } from "@/features/account/components/BookFollowUpModal";
import { VisitDocumentsSection } from "@/features/account/components/VisitDocumentsSection";
import { AppointmentTimeline } from "@/features/account/components/AppointmentTimeline";
import { PreVisitPreparation } from "@/features/account/components/PreVisitPreparation";
import { PostVisitSummary } from "@/features/account/components/PostVisitSummary";
import { SharedHistoryManageSection } from "@/features/account/components/SharedHistoryManageSection";
import {
  buildPatientTimeline,
  formatAppointmentStatusLabel,
  formatFollowUpStatusLabel,
  formatPaymentLabel,
} from "@/lib/appointmentJourney";

const STATUS_VARIANT = {
  pending: "warning",
  confirmed: "info",
  checked_in: "info",
  in_progress: "info",
  completed: "success",
  cancelled: "danger",
  no_show: "danger",
};

function ReviewModal({ appointment, onClose, onSubmit, isPending }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] max-w-md w-full p-6">
        <h3 className="text-[18px] font-bold mb-2">Review {appointment.doctorName}</h3>
        <p className="text-[13px] text-neutral-500 mb-4">Share your experience after the completed consultation.</p>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`p-2 rounded-md ${rating >= value ? "text-yellow-500" : "text-neutral-300"}`}
            >
              <Star size={24} weight={rating >= value ? "fill" : "regular"} />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full min-h-[100px] border border-neutral-200 rounded-[12px] p-3 text-[14px] mb-4"
        />
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1"
            disabled={isPending}
            onClick={() => onSubmit({ doctorId: appointment.doctorId, appointment_id: appointment.id, rating, comment })}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConsultationModePicker({ appointment, onSelect, isPending }) {
  return (
    <div className="mt-4 p-4 bg-brand-light/40 border border-brand-primary/20 rounded-[12px]">
      <p className="text-[14px] font-semibold text-ink-headline mb-1">Doctor confirmed your appointment</p>
      <p className="text-[13px] text-neutral-600 mb-4">
        Choose how you would like to attend this visit.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onSelect(appointment.id, "online")}
          className="text-left p-4 bg-white border-2 border-neutral-200 hover:border-brand-primary rounded-[12px] transition-colors disabled:opacity-60"
        >
          <div className="flex items-center gap-2 mb-2 text-brand-primary">
            <VideoCamera size={20} weight="fill" />
            <span className="text-[14px] font-bold text-ink-headline">Online Checkup</span>
          </div>
          <p className="text-[12px] text-neutral-600 leading-relaxed">
            Video consultation with your doctor, live chat, and upload prescriptions or lab reports.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-50 px-2 py-1 rounded-full">
              <VideoCamera size={12} /> Video
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-50 px-2 py-1 rounded-full">
              <ChatCircleText size={12} /> Chat
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-50 px-2 py-1 rounded-full">
              <UploadSimple size={12} /> Upload files
            </span>
          </div>
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onSelect(appointment.id, "in_person")}
          className="text-left p-4 bg-white border-2 border-neutral-200 hover:border-brand-primary rounded-[12px] transition-colors disabled:opacity-60"
        >
          <div className="flex items-center gap-2 mb-2 text-brand-primary">
            <Buildings size={20} weight="fill" />
            <span className="text-[14px] font-bold text-ink-headline">In-Person Visit</span>
          </div>
          <p className="text-[12px] text-neutral-600 leading-relaxed">
            Visit the clinic at your scheduled date and time. No video or chat needed.
          </p>
          <div className="mt-3 p-2 bg-neutral-50 rounded-[8px]">
            <p className="text-[11px] text-neutral-500">Clinic</p>
            <p className="text-[12px] font-medium text-neutral-700">{appointment.hospital}</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function canRescheduleAppointment(appointment) {
  return ["pending", "confirmed"].includes(appointment.status);
}

function AppointmentCard({
  appointment,
  followUp,
  onCancel,
  onJoin,
  onReview,
  onChat,
  onSelectMode,
  isSelectingMode,
  onViewPrescription,
  onPay,
  payingId,
  onReschedule,
  onBookFollowUp,
  onViewFollowUpAppointment,
}) {
  const needsPay =
    appointment.paymentStatus !== "paid" &&
    ["stripe", "card", "online"].includes(String(appointment.paymentMethod || "").toLowerCase());
  const timeline = buildPatientTimeline(appointment, { followUp });

  return (
    <div className="bg-white border border-neutral-200 rounded-[16px] p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-[16px] font-bold text-ink-headline">{appointment.doctorName}</h3>
            <Badge variant={STATUS_VARIANT[appointment.status] || "neutral"}>
              {formatAppointmentStatusLabel(appointment.status)}
            </Badge>
            {appointment.consultationMode === "online" && (
              <Badge variant="info">Online</Badge>
            )}
            {appointment.isInPerson && (
              <Badge variant="neutral">In-clinic</Badge>
            )}
            {!appointment.consultationMode && appointment.preferredMode === "online" && (
              <Badge variant="info">Online (booked)</Badge>
            )}
            {!appointment.consultationMode && appointment.preferredMode === "in_person" && (
              <Badge variant="neutral">In-clinic (booked)</Badge>
            )}
            {needsPay && <Badge variant="warning">Payment due</Badge>}
          </div>
          <p className="text-[13px] text-neutral-500 mb-1">{appointment.specialty} · {appointment.hospital}</p>
          <p className="text-[13px] text-neutral-600">{appointment.date} · {appointment.slot}</p>
          <p className="text-[13px] text-neutral-600">
            Fee: PKR {Number(appointment.fee || 0).toLocaleString()} · {formatPaymentLabel(appointment)}
          </p>
          {appointment.reason && <p className="text-[13px] text-neutral-500 mt-2">Reason: {appointment.reason}</p>}
          {appointment.status === "no_show" && (
            <p className="text-[13px] font-semibold text-rose-700 mt-2">
              Missed Appointment — this visit was marked as no-show.
            </p>
          )}
          {appointment.needsModeSelection && (
            <ConsultationModePicker
              appointment={appointment}
              onSelect={onSelectMode}
              isPending={isSelectingMode}
            />
          )}
          <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-[12px]">
            <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500 mb-2">
              Visit timeline
            </p>
            <AppointmentTimeline steps={timeline} status={appointment.status} compact />
          </div>
          <PreVisitPreparation appointment={appointment} />
          <PostVisitSummary
            appointment={appointment}
            followUp={followUp}
            onViewPrescription={onViewPrescription}
            onBookFollowUp={onBookFollowUp}
            onViewFollowUpAppointment={onViewFollowUpAppointment}
          />
          {["pending", "confirmed", "checked_in", "in_progress"].includes(appointment.status) &&
            appointment.status !== "completed" && (
              <div className="mt-3">
                <VisitDocumentsSection appointmentId={appointment.id} compact />
              </div>
            )}
        </div>
        <div className="flex flex-wrap gap-2">
          {needsPay && (
            <Button onClick={() => onPay(appointment)} disabled={payingId === appointment.id}>
              <CreditCard size={16} className="mr-2" />
              {payingId === appointment.id ? "Opening Stripe…" : "Pay with Stripe"}
            </Button>
          )}
          {appointment.canViewChat && (
            <Button variant="secondary" onClick={() => onChat(appointment)}>
              <ChatCircleText size={16} className="mr-2" />
              {appointment.chatReadOnly
                ? "View Chat History"
                : `Chat with ${formatDoctorDisplayName(appointment.doctorName)}`}
            </Button>
          )}
          {appointment.canJoin && (
            <Button onClick={() => onJoin(appointment)}>
              <VideoCamera size={16} className="mr-2" />
              Join Consultation
            </Button>
          )}
          {canRescheduleAppointment(appointment) && (
            <Button variant="secondary" onClick={() => onReschedule(appointment)}>
              <ArrowsClockwise size={16} className="mr-2" />
              Reschedule
            </Button>
          )}
          {appointment.status === "pending" && (
            <Button variant="secondary" onClick={() => onCancel(appointment.id)}>
              <XCircle size={16} className="mr-2" />
              Cancel
            </Button>
          )}
          {appointment.prescription && appointment.status !== "completed" && (
            <Button variant="secondary" onClick={() => onViewPrescription(appointment)}>
              <DownloadSimple size={16} className="mr-2" />
              Prescription Ready
            </Button>
          )}
          {appointment.canReview && (
            <Button variant="secondary" onClick={() => onReview(appointment)}>
              <Star size={16} className="mr-2" />
              Review Doctor
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatFollowUpDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function FollowUpCard({ followUp, onBook, onViewAppointment }) {
  const doctorName = followUp.doctor?.name
    ? `Dr. ${String(followUp.doctor.name).replace(/^Dr\.?\s*/i, "")}`
    : "Your doctor";
  const booked = Boolean(followUp.booked_appointment_id);
  const needsRebooking = followUp.status === "needs_rebooking";
  const canBook =
    !booked &&
    ["planned", "notified", "needs_rebooking", "overdue"].includes(followUp.status);

  return (
    <div
      className={`bg-white border rounded-[16px] p-5 ${
        needsRebooking ? "border-amber-300 bg-amber-50/40" : "border-neutral-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-[16px] font-bold text-ink-headline">
              {needsRebooking ? "Follow-up Needs Rebooking" : doctorName}
            </h3>
            <Badge
              variant={
                booked
                  ? "success"
                  : needsRebooking || followUp.status === "overdue"
                    ? "danger"
                    : "info"
              }
            >
              {booked ? "Follow-up Booked" : formatFollowUpStatusLabel(followUp.status)}
            </Badge>
          </div>
          {needsRebooking ? (
            <>
              <p className="text-[14px] font-semibold text-ink-headline mb-1">{doctorName}</p>
              <p className="text-[13px] text-neutral-600 mb-2">
                Your previous follow-up appointment was cancelled or missed. The doctor&apos;s
                follow-up recommendation is still active.
              </p>
            </>
          ) : null}
          <p className="text-[13px] text-neutral-500 mb-1">
            {followUp.doctor?.specialty || "Follow-up"} · Recommended{" "}
            {formatFollowUpDate(followUp.recommended_date)}
          </p>
          {followUp.booking_window?.from && followUp.booking_window?.to && (
            <p className="text-[13px] text-neutral-600">
              Book between {formatFollowUpDate(followUp.booking_window.from)} –{" "}
              {formatFollowUpDate(followUp.booking_window.to)}
            </p>
          )}
          {(followUp.reason || followUp.notes) && (
            <p className="text-[13px] text-neutral-500 mt-2">{followUp.reason || followUp.notes}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {canBook && (
            <Button onClick={() => onBook(followUp)}>
              {needsRebooking ? "Choose New Time" : "Book Follow-up"}
            </Button>
          )}
          {booked && (
            <Button variant="secondary" onClick={() => onViewAppointment(followUp)}>
              View Appointment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: appointments = [], isLoading, refetch } = useDoctorAppointments();
  const followUpsQuery = usePatientFollowUps();
  const cancelAppointment = useCancelDoctorAppointment();
  const joinConsultation = useJoinDoctorConsultation();
  const selectConsultationMode = useSelectConsultationMode();
  const submitReview = useSubmitDoctorReview();
  const [filter, setFilter] = useState(() => searchParams.get("tab") === "follow-ups" ? "follow-ups" : "all");
  const [reviewTarget, setReviewTarget] = useState(null);
  const [prescriptionTarget, setPrescriptionTarget] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [bookFollowUpTarget, setBookFollowUpTarget] = useState(null);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "follow-ups") setFilter("follow-ups");
  }, [searchParams]);

  useEffect(() => {
    const bookId = searchParams.get("book");
    const list = followUpsQuery.data || [];
    if (!bookId || !list.length) return;
    const match = list.find((f) => f.id === bookId);
    if (match && !match.booked_appointment_id) {
      setFilter("follow-ups");
      setBookFollowUpTarget(match);
    }
  }, [searchParams, followUpsQuery.data]);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");
    if (payment === "cancelled") {
      toast.error("Payment was cancelled");
      return;
    }
    if (payment === "success" && sessionId) {
      paymentsApi
        .verifyStripeSession(sessionId)
        .then((result) => {
          if (result.paid) {
            toast.success("Appointment payment successful");
            refetch?.();
          } else {
            toast.error("Payment not completed yet");
          }
        })
        .catch((error) => {
          toast.error(error.message || "Could not verify payment");
        });
    }
  }, [searchParams, refetch]);

  const plannedFollowUps = useMemo(() => {
    return (followUpsQuery.data || []).filter(
      (f) => !["cancelled", "declined"].includes(f.status),
    );
  }, [followUpsQuery.data]);

  const filtered = useMemo(() => {
    if (filter === "follow-ups" || filter === "sharing") return [];
    if (filter === "all") return appointments;
    if (filter === "upcoming") {
      return appointments.filter((item) =>
        ["pending", "confirmed", "checked_in", "in_progress"].includes(item.status),
      );
    }
    if (filter === "cancelled") {
      return appointments.filter((item) =>
        ["cancelled", "no_show"].includes(item.status),
      );
    }
    return appointments.filter((item) => item.status === filter);
  }, [appointments, filter]);

  const followUpByParent = useMemo(() => {
    const map = new Map();
    for (const fu of followUpsQuery.data || []) {
      if (fu.parent_appointment_id) map.set(fu.parent_appointment_id, fu);
      if (fu.consultation_id) map.set(`c:${fu.consultation_id}`, fu);
    }
    return map;
  }, [followUpsQuery.data]);

  const resolveFollowUpForAppointment = (appointment) => {
    if (!appointment) return null;
    return (
      followUpByParent.get(appointment.id) ||
      (followUpsQuery.data || []).find(
        (fu) =>
          fu.parent_appointment_id === appointment.id ||
          fu.booked_appointment_id === appointment.id ||
          (appointment.raw?.consultation?.id &&
            fu.consultation_id === appointment.raw.consultation.id),
      ) ||
      null
    );
  };

  const handlePay = async (appointment) => {
    setPayingId(appointment.id);
    try {
      const payment = await paymentsApi.checkout({
        purpose: "appointment",
        appointment_id: appointment.id,
        payment_method: "stripe",
        frontend_url: typeof window !== "undefined" ? window.location.origin : undefined,
      });
      if (payment.checkoutUrl) {
        window.location.href = payment.checkoutUrl;
        return;
      }
      throw new Error("Stripe checkout URL was not returned");
    } catch (error) {
      toast.error(error.message || "Could not start payment");
      setPayingId(null);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment.mutateAsync(id);
      toast.success("Appointment cancelled");
    } catch (error) {
      toast.error(error.message || "Could not cancel appointment");
    }
  };

  const handleJoin = async (appointment) => {
    try {
      const result = await joinConsultation.mutateAsync(appointment.id);
      const meetingId = result?.appointment?.meeting_id || appointment.meetingId;
      if (meetingId) {
        router.push(`/consultation/${meetingId}?appointment=${appointment.id}`);
        return;
      }
      toast.error("Meeting room is not ready yet. Please wait for doctor confirmation.");
    } catch (error) {
      toast.error(error.message || "Could not join consultation");
    }
  };

  const handleReview = async (payload) => {
    try {
      await submitReview.mutateAsync(payload);
      toast.success("Review submitted");
      setReviewTarget(null);
    } catch (error) {
      toast.error(error.message || "Could not submit review");
    }
  };

  const handleChat = (appointment) => {
    router.push(`/account/appointments/${appointment.id}/chat`);
  };

  const handleSelectMode = async (id, mode) => {
    try {
      await selectConsultationMode.mutateAsync({ id, mode });
      toast.success(
        mode === "online"
          ? "Online checkup selected. Video and chat are now available."
          : "In-person visit confirmed. See you at the clinic."
      );
      if (mode === "online") {
        router.push(`/account/appointments/${id}/chat`);
      }
    } catch (error) {
      toast.error(error.message || "Could not save your choice");
    }
  };

  return (
    <div className="w-full bg-surface-subtle min-h-screen py-8">
      <div className="max-w-[960px] mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-[28px] font-heading font-extrabold text-ink-headline">My Appointments</h1>
          <p className="text-[14px] text-neutral-500 mt-1">Track upcoming consultations, prescriptions, and reviews.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "all", label: "All" },
            { id: "upcoming", label: "Upcoming" },
            { id: "follow-ups", label: "Planned Follow-ups" },
            { id: "sharing", label: "Record Sharing" },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled / Missed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold border ${
                filter === tab.id
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-neutral-600 border-neutral-200"
              }`}
            >
              {tab.label}
              {tab.id === "follow-ups" && plannedFollowUps.length > 0
                ? ` (${plannedFollowUps.length})`
                : ""}
            </button>
          ))}
        </div>

        {filter === "sharing" ? (
          <SharedHistoryManageSection />
        ) : filter === "follow-ups" ? (
          followUpsQuery.isLoading ? (
            <div className="text-[14px] text-neutral-500">Loading follow-ups...</div>
          ) : plannedFollowUps.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-[16px] p-10 text-center">
              <CalendarCheck size={40} className="mx-auto text-brand-primary mb-4" />
              <h2 className="text-[18px] font-bold mb-2">No planned follow-ups</h2>
              <p className="text-[14px] text-neutral-500 mb-4">
                When your doctor recommends a follow-up, it will appear here for booking.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {plannedFollowUps.map((followUp) => (
                <FollowUpCard
                  key={followUp.id}
                  followUp={followUp}
                  onBook={setBookFollowUpTarget}
                  onViewAppointment={(fu) => {
                    setFilter("upcoming");
                    toast.message("Look for your booked follow-up in Upcoming appointments");
                    if (fu.booked_appointment_id) {
                      // keep filter useful; appointments list shows all upcoming
                    }
                  }}
                />
              ))}
            </div>
          )
        ) : isLoading ? (
          <div className="text-[14px] text-neutral-500">Loading appointments...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-[16px] p-10 text-center">
            <CalendarCheck size={40} className="mx-auto text-brand-primary mb-4" />
            <h2 className="text-[18px] font-bold mb-2">No appointments yet</h2>
            <p className="text-[14px] text-neutral-500 mb-4">Book a doctor consultation to see it here.</p>
            <Link href="/doctors">
              <Button>Browse Doctors</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                followUp={resolveFollowUpForAppointment(appointment)}
                onCancel={handleCancel}
                onJoin={handleJoin}
                onReview={setReviewTarget}
                onChat={handleChat}
                onSelectMode={handleSelectMode}
                isSelectingMode={selectConsultationMode.isPending}
                onViewPrescription={setPrescriptionTarget}
                onPay={handlePay}
                payingId={payingId}
                onReschedule={setRescheduleTarget}
                onBookFollowUp={setBookFollowUpTarget}
                onViewFollowUpAppointment={() => setFilter("upcoming")}
              />
            ))}
          </div>
        )}

        {reviewTarget && (
          <ReviewModal
            appointment={reviewTarget}
            onClose={() => setReviewTarget(null)}
            onSubmit={handleReview}
            isPending={submitReview.isPending}
          />
        )}

        {prescriptionTarget && (
          <ViewPrescriptionModal
            appointment={prescriptionTarget}
            onClose={() => setPrescriptionTarget(null)}
          />
        )}

        {rescheduleTarget && (
          <RescheduleAppointmentModal
            appointment={rescheduleTarget}
            onClose={() => setRescheduleTarget(null)}
          />
        )}

        {bookFollowUpTarget && (
          <BookFollowUpModal
            followUp={bookFollowUpTarget}
            onClose={() => {
              setBookFollowUpTarget(null);
              followUpsQuery.refetch?.();
              refetch?.();
            }}
          />
        )}
      </div>
    </div>
  );
}
