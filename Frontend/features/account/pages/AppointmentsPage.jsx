"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  VideoCamera,
  Star,
  XCircle,
  DownloadSimple,
  ChatCircleText,
  Stethoscope,
  Buildings,
  UploadSimple,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Badge } from "@/shared/components/Badge";
import {
  useDoctorAppointments,
  useCancelDoctorAppointment,
  useJoinDoctorConsultation,
  useSelectConsultationMode,
  useSubmitDoctorReview,
} from "@/lib/hooks/useApi";
import { formatDoctorDisplayName } from "@/lib/hooks/useTelehealth";
import { toast } from "sonner";

const STATUS_VARIANT = {
  pending: "warning",
  confirmed: "info",
  in_progress: "info",
  completed: "success",
  cancelled: "danger",
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

function AppointmentCard({ appointment, onCancel, onJoin, onReview, onChat, onSelectMode, isSelectingMode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-[16px] p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[16px] font-bold text-ink-headline">{appointment.doctorName}</h3>
            <Badge variant={STATUS_VARIANT[appointment.status] || "neutral"}>{appointment.status}</Badge>
            {appointment.consultationMode === "online" && (
              <Badge variant="info">Online</Badge>
            )}
            {appointment.isInPerson && (
              <Badge variant="neutral">In-Clinic</Badge>
            )}
            {!appointment.consultationMode && appointment.preferredMode === "online" && (
              <Badge variant="info">Online (booked)</Badge>
            )}
            {!appointment.consultationMode && appointment.preferredMode === "in_person" && (
              <Badge variant="neutral">In-Clinic (booked)</Badge>
            )}
          </div>
          <p className="text-[13px] text-neutral-500 mb-1">{appointment.specialty} · {appointment.hospital}</p>
          <p className="text-[13px] text-neutral-600">{appointment.date} · {appointment.slot}</p>
          <p className="text-[13px] text-neutral-600">Fee: PKR {Number(appointment.fee || 0).toLocaleString()} · Payment: {appointment.paymentStatus}</p>
          {appointment.reason && <p className="text-[13px] text-neutral-500 mt-2">Reason: {appointment.reason}</p>}
          {appointment.needsModeSelection && (
            <ConsultationModePicker
              appointment={appointment}
              onSelect={onSelectMode}
              isPending={isSelectingMode}
            />
          )}
          {appointment.isInPerson && ["confirmed", "in_progress"].includes(appointment.status) && (
            <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200 rounded-[10px]">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-headline mb-1">
                <Stethoscope size={16} className="text-brand-primary" />
                In-person visit scheduled
              </div>
              <p className="text-[12px] text-neutral-600">
                Please arrive at <span className="font-medium">{appointment.hospital}</span> on {appointment.date} at {appointment.slot}.
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
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
          {appointment.status === "pending" && (
            <Button variant="secondary" onClick={() => onCancel(appointment.id)}>
              <XCircle size={16} className="mr-2" />
              Cancel
            </Button>
          )}
          {appointment.prescription && (
            <Button variant="secondary">
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

export function AppointmentsPage() {
  const router = useRouter();
  const { data: appointments = [], isLoading } = useDoctorAppointments();
  const cancelAppointment = useCancelDoctorAppointment();
  const joinConsultation = useJoinDoctorConsultation();
  const selectConsultationMode = useSelectConsultationMode();
  const submitReview = useSubmitDoctorReview();
  const [filter, setFilter] = useState("all");
  const [reviewTarget, setReviewTarget] = useState(null);

  const filtered = useMemo(() => {
    if (filter === "all") return appointments;
    if (filter === "upcoming") {
      return appointments.filter((item) => ["pending", "confirmed", "in_progress"].includes(item.status));
    }
    return appointments.filter((item) => item.status === filter);
  }, [appointments, filter]);

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
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
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
            </button>
          ))}
        </div>

        {isLoading ? (
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
                onCancel={handleCancel}
                onJoin={handleJoin}
                onReview={setReviewTarget}
                onChat={handleChat}
                onSelectMode={handleSelectMode}
                isSelectingMode={selectConsultationMode.isPending}
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
      </div>
    </div>
  );
}
