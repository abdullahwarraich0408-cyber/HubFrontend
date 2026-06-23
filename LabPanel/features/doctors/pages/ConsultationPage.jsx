"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  VideoCamera,
  CheckCircle,
  ArrowLeft,
  FileText,
} from "@phosphor-icons/react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { AppointmentChatPanel } from "@/features/telehealth/components/AppointmentChatPanel";
import { useDoctorConsultation } from "@/lib/hooks/useApi";
import { useAppointmentVideoAccess } from "@/lib/hooks/useTelehealth";
import {
  useCreateDoctorPrescription,
  useUpdateDoctorAppointmentStatus,
} from "@/lib/hooks/usePartnerPortal";
import { getPartnerData } from "@/lib/partnerAuth";
import { partnerRoutes } from "@/lib/constants/partnerRoutes";
import { toast } from "sonner";

const EMPTY_PRESCRIPTION_ITEM = { medicine: "", dosage: "", duration: "", instructions: "" };

export function ConsultationPage({ meetingId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment");
  const partner = typeof window !== "undefined" ? getPartnerData() : null;
  const currentUserId = partner?.id;
  const authMode = "partner";

  const { data: appointment, isLoading, refetch } = useDoctorConsultation(meetingId);
  const { data: videoData } = useAppointmentVideoAccess(appointmentId, {
    enabled: Boolean(appointmentId),
    auth: authMode,
  });
  const updateStatus = useUpdateDoctorAppointmentStatus();
  const createPrescription = useCreateDoctorPrescription();
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([EMPTY_PRESCRIPTION_ITEM]);

  useEffect(() => {
    if (appointment?.consultationNotes) setNotes(appointment.consultationNotes);
  }, [appointment?.consultationNotes]);

  const canComplete = appointment?.status === "in_progress";
  const prescriptionItems = appointment?.prescription?.items || [];
  const videoRoom = videoData?.videoRoom;
  const videoAccess = videoData?.videoAccess;

  const jitsiSrc = useMemo(() => {
    if (!videoRoom?.jitsi_room) return null;
    const displayName = encodeURIComponent(appointment?.doctorName || partner?.name || "Doctor");
    return `https://meet.jit.si/${videoRoom.jitsi_room}#config.prejoinPageEnabled=false&userInfo.displayName="${displayName}"`;
  }, [videoRoom?.jitsi_room, appointment?.doctorName, partner?.name]);

  const handleStartConsultation = async () => {
    if (!appointmentId) return;
    try {
      await updateStatus.mutateAsync({ id: appointmentId, status: "in_progress" });
      await refetch();
      toast.success("Consultation started");
    } catch (error) {
      toast.error(error.message || "Could not start consultation");
    }
  };

  const handleSavePrescription = async () => {
    if (!appointmentId) return;
    try {
      await createPrescription.mutateAsync({
        appointment_id: appointmentId,
        items: items.filter((item) => item.medicine.trim()),
        notes,
      });
      toast.success("Prescription saved");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Could not save prescription");
    }
  };

  const handleComplete = async () => {
    if (!appointmentId) return;
    try {
      await updateStatus.mutateAsync({ id: appointmentId, status: "completed", notes });
      toast.success("Consultation completed");
      router.push(partnerRoutes.doctor.appointments);
    } catch (error) {
      toast.error(error.message || "Could not complete consultation");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-500">Loading consultation...</div>;
  }

  if (!appointment) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-500">Consultation not found.</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/80 hover:text-white">
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="text-center">
          <p className="text-[14px] font-bold">{appointment.doctorName || "Consultation Room"}</p>
          <p className="text-[12px] text-white/60">{appointment.date} · {appointment.slot} · {appointment.status}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-[12px] bg-white/10 capitalize">
          {appointment.status?.replace("_", " ") || "unknown"}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-4 p-4">
        <div className="space-y-4">
          <div className="relative aspect-video rounded-[16px] overflow-hidden bg-black border border-white/10">
            {jitsiSrc && videoAccess?.allowed !== false ? (
              <iframe
                title="Video consultation"
                src={jitsiSrc}
                allow="camera; microphone; fullscreen; display-capture"
                className="w-full h-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 px-6 text-center">
                <VideoCamera size={48} className="text-white/40 mb-4" />
                <p className="text-[15px] font-semibold mb-2">Video room unavailable</p>
                <p className="text-[13px] text-white/60">
                  {videoAccess?.reason || "Start the consultation to open the video room."}
                </p>
              </div>
            )}
          </div>

          {appointment.status === "confirmed" && (
            <Button className="w-full" onClick={handleStartConsultation}>
              Start Consultation & Admit Patient
            </Button>
          )}

          <div className="bg-white/5 border border-white/10 rounded-[16px] p-4">
            <label className="text-[13px] font-semibold mb-2 block">Consultation Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[120px] rounded-[12px] bg-neutral-900 border border-white/10 p-3 text-[14px] text-white"
              placeholder="Symptoms, diagnosis, treatment plan, follow-up advice..."
            />
          </div>
        </div>

        <div className="space-y-4">
          {appointmentId && currentUserId && (
            <AppointmentChatPanel
              appointmentId={appointmentId}
              currentUserId={currentUserId}
              authMode={authMode}
              compact
              dark
            />
          )}

          <div className="bg-white/5 border border-white/10 rounded-[16px] p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} />
              <h3 className="font-bold">Prescription</h3>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 gap-2">
                  <Input
                    value={item.medicine}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...next[index], medicine: e.target.value };
                      setItems(next);
                    }}
                    placeholder="Medicine"
                    className="bg-neutral-900 border-white/10 text-white"
                  />
                  <Input
                    value={item.dosage}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...next[index], dosage: e.target.value };
                      setItems(next);
                    }}
                    placeholder="Dosage"
                    className="bg-neutral-900 border-white/10 text-white"
                  />
                  <Input
                    value={item.duration}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...next[index], duration: e.target.value };
                      setItems(next);
                    }}
                    placeholder="Duration"
                    className="bg-neutral-900 border-white/10 text-white"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" onClick={() => setItems((prev) => [...prev, EMPTY_PRESCRIPTION_ITEM])}>
                Add Medicine
              </Button>
              <Button onClick={handleSavePrescription}>Save Prescription</Button>
            </div>
          </div>

          {prescriptionItems.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-[16px] p-4">
              <p className="text-[13px] font-semibold mb-2">Saved prescription</p>
              {prescriptionItems.map((item, index) => (
                <div key={index} className="border-b border-white/10 pb-2 mb-2 last:border-0">
                  <p className="font-semibold">{item.medicine}</p>
                  <p className="text-[13px] text-white/60">{item.dosage} · {item.duration}</p>
                </div>
              ))}
            </div>
          )}

          {canComplete && (
            <Button className="w-full" onClick={handleComplete}>
              <CheckCircle size={18} className="mr-2" />
              End Consultation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
