"use client";

import Link from "next/link";
import { ArrowLeft, VideoCamera } from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { AppointmentChatPanel } from "@/features/telehealth/components/AppointmentChatPanel";
import { useAppointmentChat, getChatParticipantLabels } from "@/lib/hooks/useTelehealth";

export function AppointmentChatPage({
  appointmentId,
  backHref,
  currentUserId,
  authMode,
}) {
  const { data } = useAppointmentChat(appointmentId, { auth: authMode });
  const appointment = data?.appointment;
  const labels = getChatParticipantLabels(appointment, authMode);
  const meetingPath =
    appointment?.meeting_id && ["confirmed", "in_progress"].includes(appointment?.status)
      ? `/consultation/${appointment.meeting_id}?appointment=${appointment.id}`
      : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href={backHref} className="p-2 rounded-md hover:bg-neutral-100">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-[24px] font-bold text-ink-headline">{labels.pageTitle}</h1>
            {appointment && (
              <p className="text-[13px] text-neutral-500">
                {labels.subtitleName} · {appointment.slot} · {appointment.status}
              </p>
            )}
          </div>
        </div>
        {meetingPath && (
          <Link href={meetingPath}>
            <Button>
              <VideoCamera size={18} className="mr-2" />
              Join Video
            </Button>
          </Link>
        )}
      </div>

      <AppointmentChatPanel
        appointmentId={appointmentId}
        currentUserId={currentUserId}
        authMode={authMode}
      />
    </div>
  );
}
