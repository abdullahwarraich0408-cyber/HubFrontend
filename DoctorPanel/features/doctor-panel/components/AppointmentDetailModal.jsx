"use client";

import Link from "next/link";
import { X, CalendarCheck, Clock, User, Phone, VideoCamera, ChatCircleText } from "@phosphor-icons/react";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";

export function AppointmentDetailModal({ appointment, onClose, onStatusChange }) {
  if (!appointment) return null;

  const meetingPath = appointment.meetingId
    ? `/consultation/${appointment.meetingId}?appointment=${appointment.id}`
    : null;
  const chatPath = `${partnerRoutes.doctor.appointments}/${appointment.id}/chat`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-[20px] border border-neutral-200 shadow-xl w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-primary">
              <CalendarCheck size={20} weight="fill" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-ink-headline">Appointment Details</h3>
              <p className="text-[13px] text-neutral-500">{appointment.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-neutral-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold">
              {appointment.patient.charAt(0)}
            </div>
            <div>
              <p className="text-[16px] font-bold text-ink-headline">{appointment.patient}</p>
              <Badge status={appointment.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={Clock} label="Time" value={appointment.time} />
            <InfoItem icon={CalendarCheck} label="Date" value={appointment.date || "Today"} />
            <InfoItem icon={VideoCamera} label="Type" value={appointment.type} />
            {appointment.phone && <InfoItem icon={Phone} label="Phone" value={appointment.phone} />}
          </div>

          {appointment.paymentStatus && (
            <div className="p-4 bg-neutral-50 rounded-[12px] border border-neutral-200">
              <p className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Payment</p>
              <p className="text-[14px] text-neutral-700">{appointment.paymentStatus} · {appointment.paymentMethod || "N/A"}</p>
            </div>
          )}

          {appointment.reason && (
            <div className="p-4 bg-neutral-50 rounded-[12px] border border-neutral-200">
              <p className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Reason for Visit</p>
              <p className="text-[14px] text-neutral-700">{appointment.reason}</p>
            </div>
          )}

          {meetingPath && appointment.isOnline && ["confirmed", "in_progress"].includes(appointment.status) && (
            <Link href={meetingPath}>
              <Button className="w-full">
                <VideoCamera size={18} className="mr-2" />
                {appointment.status === "confirmed" ? "Start Consultation" : "Join Consultation"}
              </Button>
            </Link>
          )}

          {appointment.needsModeSelection && (
            <div className="p-4 bg-amber-50 rounded-[12px] border border-amber-200">
              <p className="text-[13px] font-semibold text-amber-800 mb-1">Waiting for patient</p>
              <p className="text-[12px] text-amber-700">
                The patient needs to choose online checkup or in-person visit before video and chat are enabled.
              </p>
            </div>
          )}

          {appointment.isInPerson && ["confirmed", "in_progress"].includes(appointment.status) && (
            <div className="p-4 bg-neutral-50 rounded-[12px] border border-neutral-200">
              <p className="text-[13px] font-semibold text-ink-headline mb-1">In-person visit</p>
              <p className="text-[12px] text-neutral-600">Patient will visit the clinic at the scheduled time.</p>
            </div>
          )}

          {appointment.isOnline && ["confirmed", "in_progress", "completed"].includes(appointment.status) && (
            <Link href={chatPath}>
              <Button variant="secondary" className="w-full">
                <ChatCircleText size={18} className="mr-2" />
                Chat with {appointment.patient}
              </Button>
            </Link>
          )}
        </div>

        <div className="p-6 border-t border-neutral-200 flex flex-wrap gap-3">
          {appointment.status === "pending" && (
            <>
              <Button onClick={() => onStatusChange?.(appointment.id, "confirmed")} className="flex-1">
                Confirm
              </Button>
              <Button variant="secondary" onClick={() => onStatusChange?.(appointment.id, "cancelled")} className="flex-1">
                Cancel
              </Button>
            </>
          )}
          {appointment.status === "confirmed" && meetingPath && appointment.isOnline && (
            <Link href={meetingPath} className="w-full">
              <Button className="w-full">Open Consultation Room</Button>
            </Link>
          )}
          {appointment.status === "confirmed" && appointment.needsModeSelection && (
            <Button variant="secondary" disabled className="w-full">
              Awaiting patient consultation choice
            </Button>
          )}
          {appointment.status === "in_progress" && (
            <Button onClick={() => onStatusChange?.(appointment.id, "completed")} className="w-full">
              Mark as Completed
            </Button>
          )}
          {(appointment.status === "cancelled" || appointment.status === "completed") && (
            <Button variant="secondary" onClick={onClose} className="w-full">
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={16} className="text-brand-primary mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{label}</p>
        <p className="text-[14px] font-medium text-neutral-700">{value}</p>
      </div>
    </div>
  );
}
